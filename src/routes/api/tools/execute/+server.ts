import { json, type RequestHandler } from "@sveltejs/kit";
import { getToolsByUserId } from "$lib/server/cosmos";
import { ToolExecuteRequestSchema, LogicAppResponseSchema, type ToolExecuteResponse, type LogicAppRequest } from "$lib/types";

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
      // Create the properly typed request body for the Logic App
      // This matches the expected JSON schema: { "input": { "type": "string" } }
      const logicAppRequest: LogicAppRequest = { input };
      
      const toolResponse = await fetch(tool.azureLogicAppEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logicAppRequest),
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
      let toolResult: string;
      const contentType = toolResponse.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        const responseData = await toolResponse.json();
        
        // Try to parse using the Logic App response schema
        // Expected format: { "Result": "@{outputs('Compose_-_add_10_to_input')}" }
        const logicAppResult = LogicAppResponseSchema.safeParse(responseData);
        
        if (logicAppResult.success) {
          // Extract the Result field from Logic App response
          toolResult = logicAppResult.data.Result;
        } else {
          // Fallback to generic parsing for other response formats
          if (typeof responseData === "string") {
            toolResult = responseData;
          } else if (responseData.message) {
            toolResult = responseData.message;
          } else if (responseData.result) {
            toolResult = responseData.result;
          } else if (responseData.response) {
            toolResult = responseData.response;
          } else {
            toolResult = JSON.stringify(responseData, null, 2);
          }
        }
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