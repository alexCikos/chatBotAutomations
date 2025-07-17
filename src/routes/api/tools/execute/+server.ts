import { json, type RequestHandler } from "@sveltejs/kit";
import { getToolsByUserId } from "$lib/server/cosmos";
import { ToolExecuteRequestSchema, type ToolExecuteResponse } from "$lib/types";

export const POST: RequestHandler = async ({ request }) => {
  try {
    const requestData = await request.json();

    // Validate request data using Zod schema
    const validationResult = ToolExecuteRequestSchema.safeParse(requestData);
    
    if (!validationResult.success) {
      return json(
        { 
          success: false, 
          error: `Invalid request data: ${validationResult.error.issues.map(i => i.message).join(', ')}` 
        },
        { status: 400 }
      );
    }

    const { userId, toolId, input } = validationResult.data;

    // Get user's tools to verify access and get endpoint
    const userTools = await getToolsByUserId(userId);
    const tool = userTools.find(t => t.toolId === toolId);

    if (!tool) {
      return json(
        { 
          success: false, 
          error: "Tool not found or access denied" 
        },
        { status: 404 }
      );
    }

    // Call the external Azure Logic App endpoint server-side
    try {
      const toolResponse = await fetch(tool.azureLogicAppEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      if (!toolResponse.ok) {
        return json(
          {
            success: false,
            error: `Tool execution failed: ${toolResponse.status} ${toolResponse.statusText}`,
          },
          { status: 500 }
        );
      }

      // Try to parse as JSON, fall back to text
      let toolResult;
      const contentType = toolResponse.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        toolResult = await toolResponse.json();
      } else {
        toolResult = await toolResponse.text();
      }

      return json({
        success: true,
        result: toolResult,
        toolName: tool.toolName,
      });

    } catch (toolError) {
      console.error("Tool execution error:", toolError);
      return json(
        {
          success: false,
          error: `Failed to execute tool: ${toolError instanceof Error ? toolError.message : "Unknown error"}`,
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("API Error:", error);
    return json(
      { 
        success: false, 
        error: "Internal server error" 
      },
      { status: 500 }
    );
  }
};