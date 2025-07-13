import { writable } from "svelte/store";
import { browser } from "$app/environment";
import type { Message, Tool } from "$lib/types";

/**
 * Store for managing the state of the chat window, including messages and input content.
 */
function createChatWindowStore() {
  // Reactive store for chat messages
  const messages = writable<Message[]>([]);

  // Reactive store for the message input content
  const content = writable("");

  /**
   * Loads messages from the backend for the given chat ID.
   * Skips execution during SSR (server-side rendering).
   */
  async function loadMessages(chatId: string) {
    if (!browser) return;

    const res = await fetch(`/api/messages/${chatId}`);
    const data = await res.json();
    messages.set(data.messages);
  }

  /**
   * Sends a new message to the backend and updates the store.
   * Optionally sends to a tool endpoint and simulates a response.
   */
  async function sendMessage(
    chatId: string,
    contentValue: string,
    userID: string,
    selectedTool?: Tool | null
  ) {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      chatId,
      userId: userID,
      role: "user",
      content: contentValue.trim(),
      createdAt: new Date().toISOString(),
    };

    messages.update((msgs) => [...msgs, newMessage]);

    // Save user message to backend
    const res = await fetch(`/api/messages/${chatId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage),
    });

    if (!res.ok) {
      console.error("Failed to send message");
      await loadMessages(chatId);
      return;
    }

    // If a tool is selected, simulate tool response
    if (selectedTool) {
      await simulateToolResponse(chatId, contentValue, selectedTool, userID);
    }

    content.set("");
  }

  /**
   * Simulates sending a POST request to a tool endpoint and generates a mock response
   */
  async function simulateToolResponse(
    chatId: string,
    userMessage: string,
    tool: Tool,
    userID: string
  ) {
    try {
      // Simulate the POST request to the tool endpoint
      console.log(`Simulating POST to ${tool.azureLogicAppEndpoint}`, {
        message: userMessage,
        toolId: tool.toolId,
        userId: userID
      });

      // Add a slight delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Generate mock response based on tool type
      const mockResponse = generateMockToolResponse(tool, userMessage);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        chatId,
        userId: "assistant",
        role: "assistant",
        content: mockResponse,
        createdAt: new Date().toISOString(),
      };

      // Add assistant response to messages
      messages.update((msgs) => [...msgs, assistantMessage]);

      // Save assistant message to backend
      await fetch(`/api/messages/${chatId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assistantMessage),
      });

    } catch (error) {
      console.error("Error simulating tool response:", error);
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        chatId,
        userId: "assistant",
        role: "assistant",
        content: `Sorry, there was an error processing your request with ${tool.toolName}. Please try again.`,
        createdAt: new Date().toISOString(),
      };

      messages.update((msgs) => [...msgs, errorMessage]);
    }
  }

  /**
   * Generates mock responses based on the tool type and user message
   */
  function generateMockToolResponse(tool: Tool, userMessage: string): string {
    const toolName = tool.toolName.toLowerCase();

    // Generate contextual responses based on tool name and message content
    if (toolName.includes('weather')) {
      return `🌤️ Based on your query "${userMessage}", here's the current weather information:\n\nLocation: Detected from context\nTemperature: 72°F (22°C)\nConditions: Partly cloudy\nHumidity: 65%\nWind: 8 mph NW\n\nThis is a simulated response from ${tool.toolName}.`;
    }
    
    if (toolName.includes('email') || toolName.includes('mail')) {
      return `📧 Email processed successfully using ${tool.toolName}!\n\nYour message "${userMessage}" has been queued for sending.\n\nStatus: Queued\nEstimated delivery: Within 2 minutes\nMessage ID: MSG-${Date.now()}\n\nThis is a simulated response.`;
    }
    
    if (toolName.includes('calendar') || toolName.includes('schedule')) {
      return `📅 Calendar operation completed using ${tool.toolName}!\n\nProcessed request: "${userMessage}"\n\nUpcoming events:\n• Team meeting - Tomorrow 2:00 PM\n• Project review - Friday 10:00 AM\n• Client call - Next Monday 3:00 PM\n\nThis is a simulated response.`;
    }
    
    if (toolName.includes('data') || toolName.includes('analytics')) {
      return `📊 Data analysis completed using ${tool.toolName}!\n\nQuery: "${userMessage}"\n\nResults:\n• Records processed: 1,247\n• Success rate: 98.5%\n• Average response time: 0.3s\n• Top category: Business Intelligence\n\nThis is a simulated response.`;
    }

    // Default response for any other tool
    return `✅ Your request has been processed successfully using ${tool.toolName}!\n\nOriginal message: "${userMessage}"\n\nResponse details:\n• Status: Completed\n• Processing time: ${(Math.random() * 3 + 0.5).toFixed(1)}s\n• Reference ID: REF-${Date.now()}\n\nThis is a simulated response. In production, this would connect to the actual endpoint: ${tool.azureLogicAppEndpoint}`;
  }

  function clear() {
    messages.set([]);
    content.set("");
  }

  return {
    messages,
    content,
    loadMessages,
    sendMessage,
    clear,
  };
}

// Export the singleton store instance
export const chatWindowStore = createChatWindowStore();
