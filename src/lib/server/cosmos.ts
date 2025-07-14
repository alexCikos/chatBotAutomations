import { CosmosClient } from "@azure/cosmos";
import type { Container, Database } from "@azure/cosmos";
import type { Message, Chat, User, Tool } from "$lib/types";
import { env } from "$env/dynamic/private";

// Environment variables for Cosmos DB connection
const endpoint = env.COSMOS_ENDPOINT || "";
const key = env.COSMOS_KEY || "";
const databaseId = env.COSMOS_DATABASE_ID || "chatbot";

// Only check for environment variables in runtime, not at module load time
function validateEnvironment() {
  if (!endpoint || !key) {
    // In build mode, return early instead of throwing error
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
      console.warn("⚠️ Missing Cosmos DB environment variables: COSMOS_ENDPOINT and COSMOS_KEY");
      return false;
    }
    throw new Error("Missing required Cosmos DB environment variables: COSMOS_ENDPOINT and COSMOS_KEY");
  }
  return true;
}

let client: CosmosClient | null = null;

// Initialize Cosmos client lazily
function getClient(): CosmosClient {
  if (!client) {
    if (!validateEnvironment()) {
      throw new Error("Cannot initialize Cosmos client without environment variables");
    }
    client = new CosmosClient({ endpoint, key });
  }
  return client;
}

let database: Database;
let containers: Map<string, Container> = new Map();

// Container configurations with their partition keys
const CONTAINER_CONFIGS = {
  messages: { partitionKey: "/chatId" },
  chats: { partitionKey: "/userId" },
  users: { partitionKey: "/id" },
  tools: { partitionKey: "/userId" },
} as const;

type ContainerName = keyof typeof CONTAINER_CONFIGS;

/**
 * Initialize Cosmos DB connection and ensure database exists
 */
export async function initializeCosmosDB() {
  try {
    const cosmosClient = getClient();
    
    // Create or get database
    const { database: db } = await cosmosClient.databases.createIfNotExists({
      id: databaseId,
    });
    database = db;

    console.log(`✅ Connected to Cosmos DB - Database: ${databaseId}`);
    return { database };
  } catch (error) {
    console.error("❌ Failed to initialize Cosmos DB:", error);
    throw error;
  }
}

/**
 * Get or create a specific container
 */
async function getContainer(containerName: ContainerName): Promise<Container> {
  // Check if container is already cached
  if (containers.has(containerName)) {
    return containers.get(containerName)!;
  }

  // Ensure database is initialized
  if (!database) {
    await initializeCosmosDB();
  }

  try {
    const config = CONTAINER_CONFIGS[containerName];
    const { container } = await database.containers.createIfNotExists({
      id: containerName,
      partitionKey: {
        paths: [config.partitionKey],
      },
    });

    // Cache the container
    containers.set(containerName, container);
    console.log(
      `✅ Container ready: ${containerName} (partition: ${config.partitionKey})`
    );

    return container;
  } catch (error) {
    console.error(`❌ Failed to get container ${containerName}:`, error);
    throw error;
  }
}

// =================================
// MESSAGE OPERATIONS
// =================================

/**
 * Get messages for a specific chat ID
 */
export async function getMessagesByChatId(chatId: string): Promise<Message[]> {
  const container = await getContainer("messages");

  try {
    const querySpec = {
      query:
        "SELECT * FROM c WHERE c.chatId = @chatId ORDER BY c.createdAt ASC",
      parameters: [
        {
          name: "@chatId",
          value: chatId,
        },
      ],
    };

    const { resources } = await container.items
      .query<Message>(querySpec)
      .fetchAll();
    return resources;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
}

/**
 * Create a new message in Cosmos DB
 */
export async function createMessage(message: Message): Promise<Message> {
  const container = await getContainer("messages");
  if (!container) {
    await initializeCosmosDB();
  }

  try {
    const { resource } = await container.items.create(message);
    if (!resource) {
      throw new Error("Failed to create message");
    }
    return resource;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
}

/**
 * Update an existing message
 */
export async function updateMessage(message: Message): Promise<Message> {
  const container = await getContainer("messages");
  if (!container) {
    await initializeCosmosDB();
  }

  try {
    const { resource } = await container
      .item(message.id, message.chatId)
      .replace(message);
    if (!resource) {
      throw new Error("Failed to update message");
    }
    return resource;
  } catch (error) {
    console.error("Error updating message:", error);
    throw error;
  }
}

/**
 * Delete a message
 */
export async function deleteMessage(
  messageId: string,
  chatId: string
): Promise<void> {
  const container = await getContainer("messages");
  if (!container) {
    await initializeCosmosDB();
  }

  try {
    await container.item(messageId, chatId).delete();
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
}

/**
 * Get all messages for a user across all chats
 */
export async function getMessagesByUserId(userId: string): Promise<Message[]> {
  const container = await getContainer("messages");
  if (!container) {
    await initializeCosmosDB();
  }

  try {
    const querySpec = {
      query:
        "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.createdAt DESC",
      parameters: [
        {
          name: "@userId",
          value: userId,
        },
      ],
    };

    const { resources } = await container.items
      .query<Message>(querySpec)
      .fetchAll();
    return resources;
  } catch (error) {
    console.error("Error fetching user messages:", error);
    throw error;
  }
}

// =================================
// CHAT OPERATIONS
// =================================

/**
 * Get all chats for a specific user
 */
export async function getChatsByUserId(userId: string): Promise<Chat[]> {
  const container = await getContainer("chats");
  
  try {
    const querySpec = {
      query: "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.createdAt DESC",
      parameters: [
        {
          name: "@userId",
          value: userId,
        },
      ],
    };

    const { resources } = await container.items.query<Chat>(querySpec).fetchAll();
    return resources;
  } catch (error) {
    console.error("Error fetching user chats:", error);
    throw error;
  }
}

/**
 * Create a new chat
 */
export async function createChat(chat: Chat): Promise<Chat> {
  const container = await getContainer("chats");
  
  try {
    const { resource } = await container.items.create(chat);
    if (!resource) {
      throw new Error("Failed to create chat");
    }
    return resource;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
}

/**
 * Get a specific chat by ID
 */
export async function getChatById(chatId: string, userId: string): Promise<Chat | null> {
  const container = await getContainer("chats");
  
  try {
    const { resource } = await container.item(chatId, userId).read<Chat>();
    return resource || null;
  } catch (error: any) {
    if (error.code === 404) {
      return null;
    }
    console.error("Error fetching chat:", error);
    throw error;
  }
}

/**
 * Update an existing chat
 */
export async function updateChat(chat: Chat): Promise<Chat> {
  const container = await getContainer("chats");
  
  try {
    const { resource } = await container.item(chat.id, chat.userId).replace(chat);
    if (!resource) {
      throw new Error("Failed to update chat");
    }
    return resource;
  } catch (error) {
    console.error("Error updating chat:", error);
    throw error;
  }
}

/**
 * Delete a chat
 */
export async function deleteChat(chatId: string, userId: string): Promise<void> {
  const container = await getContainer("chats");
  
  try {
    await container.item(chatId, userId).delete();
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
}

// =================================
// TOOL OPERATIONS
// =================================

/**
 * Get all tools for a specific user
 */
export async function getToolsByUserId(userId: string): Promise<Tool[]> {
  const container = await getContainer("tools");
  
  try {
    const querySpec = {
      query: "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.toolName ASC",
      parameters: [
        {
          name: "@userId",
          value: userId,
        },
      ],
    };

    const { resources } = await container.items.query<Tool>(querySpec).fetchAll();
    return resources;
  } catch (error) {
    console.error("Error fetching user tools:", error);
    throw error;
  }
}

/**
 * Health check for Cosmos DB connection
 */
export async function healthCheck(): Promise<boolean> {
  const container = await getContainer("messages");
  try {
    if (!container) {
      await initializeCosmosDB();
    }

    // Simple query to test connection
    await container.items.query("SELECT VALUE COUNT(1) FROM c").fetchAll();
    return true;
  } catch (error) {
    console.error("Cosmos DB health check failed:", error);
    return false;
  }
}
