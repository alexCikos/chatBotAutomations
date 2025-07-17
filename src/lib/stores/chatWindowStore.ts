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

    // If a tool is selected, call the actual tool endpoint
    if (selectedTool) {
      await callToolEndpoint(chatId, contentValue, selectedTool, userID);
    }

    content.set("");
  }

  /**
   * Calls the server-side tool execution endpoint and processes the response
   */
  async function callToolEndpoint(
    chatId: string,
    userMessage: string,
    tool: Tool,
    userID: string
  ) {
    try {
      console.log(`Calling server-side tool execution for: ${tool.toolName}`);
      console.log('Tool object received:', tool);
      console.log('Request data:', {
        message: userMessage,
        toolId: tool.toolId,
        userId: userID,
      });

      // Call the server-side tool execution endpoint
      const response = await fetch("/api/tools/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userID,
          toolId: tool.toolId,
          input: userMessage,
        }),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(
          responseData.error || `Server returned ${response.status}: ${response.statusText}`
        );
      }

      // Extract the tool response from the server response
      let toolResponse: string;
      
      if (typeof responseData.result === "string") {
        toolResponse = responseData.result;
      } else if (typeof responseData.result === "object") {
        // Handle different response formats from the tool
        if (responseData.result.message) {
          toolResponse = responseData.result.message;
        } else if (responseData.result.result) {
          toolResponse = responseData.result.result;
        } else if (responseData.result.response) {
          toolResponse = responseData.result.response;
        } else {
          toolResponse = JSON.stringify(responseData.result, null, 2);
        }
      } else {
        toolResponse = String(responseData.result);
      }

      // Ensure we have a valid response
      if (!toolResponse || toolResponse.trim() === "") {
        throw new Error("Tool returned empty response");
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        chatId,
        userId: "assistant",
        role: "assistant",
        content: `🔧 **${responseData.toolName || tool.toolName}** responded:\n\n${toolResponse}`,
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
      console.error("Error calling tool endpoint:", error);

      let errorMessage: string;

      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          errorMessage = `❌ Unable to connect to server for ${tool.toolName}. Please check your connection and try again.`;
        } else if (error.message.includes("empty response")) {
          errorMessage = `❌ ${tool.toolName} returned an empty response. Please check the tool configuration.`;
        } else if (error.message.includes("Tool not found")) {
          errorMessage = `❌ ${tool.toolName} is not available or access was denied.`;
        } else if (error.message.includes("Tool execution failed")) {
          errorMessage = `❌ ${tool.toolName} encountered an error during execution: ${error.message}`;
        } else {
          errorMessage = `❌ Error processing request with ${tool.toolName}: ${error.message}`;
        }
      } else {
        errorMessage = `❌ Unknown error occurred while calling ${tool.toolName}. Please try again.`;
      }

      const errorResponseMessage: Message = {
        id: crypto.randomUUID(),
        chatId,
        userId: "assistant",
        role: "assistant",
        content: errorMessage,
        createdAt: new Date().toISOString(),
      };

      messages.update((msgs) => [...msgs, errorResponseMessage]);

      // Save error message to backend
      try {
        await fetch(`/api/messages/${chatId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(errorResponseMessage),
        });
      } catch (saveError) {
        console.error("Failed to save error message:", saveError);
      }
    }
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
