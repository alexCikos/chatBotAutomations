import { CommandParser, type ParsedCommand, type ChatMetadata } from "./commandParser";
import type { Tool } from "$lib/types";

/**
 * Test utility for validating command parser tool matching
 */

// Sample tools for testing (matching the actual tools.json structure)
const testTools: Tool[] = [
  {
    userId: "alex-123",
    toolId: "weather-tool-001",
    toolName: "Weather Information",
    toolDescription: "Get current weather conditions and forecasts for any location",
    azureLogicAppEndpoint: "https://example.com/weather"
  },
  {
    userId: "alex-123", 
    toolId: "email-tool-001",
    toolName: "Email Assistant",
    toolDescription: "Send emails and manage email communications",
    azureLogicAppEndpoint: "https://example.com/email"
  },
  {
    userId: "alex-123",
    toolId: "calendar-tool-001", 
    toolName: "Calendar Manager",
    toolDescription: "Schedule meetings and manage calendar events",
    azureLogicAppEndpoint: "https://example.com/calendar"
  },
  {
    userId: "alex-123",
    toolId: "data-analysis-tool-001",
    toolName: "Data Analysis",
    toolDescription: "Analyze datasets and generate insights",
    azureLogicAppEndpoint: "https://example.com/data"
  }
];

// Test cases for tool matching
const testCases = [
  // Direct tool name matches
  {
    input: "send email to customer about meeting",
    expectedTool: "Email Assistant",
    description: "Direct email keyword match"
  },
  {
    input: "check the weather for tomorrow",
    expectedTool: "Weather Information", 
    description: "Direct weather keyword match"
  },
  {
    input: "schedule a meeting with the team",
    expectedTool: "Calendar Manager",
    description: "Schedule keyword match"
  },
  {
    input: "analyze the sales data from last month",
    expectedTool: "Data Analysis",
    description: "Analyze keyword match"
  },

  // Alias and fuzzy matches
  {
    input: "compose a message to the client",
    expectedTool: "Email Assistant",
    description: "Email alias (compose/message) match"
  },
  {
    input: "book an appointment for next week", 
    expectedTool: "Calendar Manager",
    description: "Calendar alias (book/appointment) match"
  },
  {
    input: "get temperature forecast",
    expectedTool: "Weather Information",
    description: "Weather alias (temperature/forecast) match"
  },
  {
    input: "generate report from dataset",
    expectedTool: "Data Analysis", 
    description: "Data analysis alias (report/dataset) match"
  },

  // Partial name matches
  {
    input: "use the email tool to contact support",
    expectedTool: "Email Assistant",
    description: "Partial name match (email)"
  },
  {
    input: "calendar event for project review",
    expectedTool: "Calendar Manager",
    description: "Partial name match (calendar)"
  },

  // Complex natural language
  {
    input: "I want to create a quote for customer called Ajax using email",
    expectedTool: "Email Assistant",
    description: "Complex sentence with email tool"
  },
  {
    input: "help me schedule a call with the vendor about the contract",
    expectedTool: "Calendar Manager", 
    description: "Complex sentence with scheduling"
  },

  // Edge cases
  {
    input: "just send a quick note",
    expectedTool: "Email Assistant",
    description: "Implicit email action"
  },
  {
    input: "what's the weather like outside",
    expectedTool: "Weather Information",
    description: "Natural weather question"
  }
];

/**
 * Run tool matching tests
 */
export function testToolMatching(): void {
  console.log("🧪 Testing Enhanced Tool Matching Logic\n");
  
  const parser = new CommandParser({ tools: testTools });
  let passed = 0;
  let total = testCases.length;

  for (const testCase of testCases) {
    const result = parser.parse(testCase.input);
    const success = result.matchedTool?.toolName === testCase.expectedTool;
    
    console.log(`${success ? "✅" : "❌"} ${testCase.description}`);
    console.log(`   Input: "${testCase.input}"`);
    console.log(`   Expected: ${testCase.expectedTool}`);
    console.log(`   Got: ${result.matchedTool?.toolName || "No match"}`);
    console.log(`   Confidence: ${result.confidence.toFixed(2)}`);
    console.log("");
    
    if (success) passed++;
  }

  console.log(`📊 Results: ${passed}/${total} tests passed (${((passed/total) * 100).toFixed(1)}%)`);
  
  if (passed === total) {
    console.log("🎉 All tool matching tests passed!");
  } else {
    console.log("⚠️  Some tests failed - consider tuning the matching logic.");
  }
}

/**
 * Test specific input and show detailed parsing results
 */
export function debugParse(input: string): ParsedCommand {
  const parser = new CommandParser({ tools: testTools });
  const result = parser.parse(input);
  
  console.log(`🔍 Debugging: "${input}"`);
  console.log("Parsed result:", {
    action: result.action,
    toolName: result.toolName,
    matchedTool: result.matchedTool?.toolName,
    subject: result.subject,
    confidence: result.confidence,
    suggestedTitle: parser.generateChatTitle(result),
    suggestedDescription: parser.generateChatDescription(result)
  });
  
  return result;
}

/**
 * Test metadata generation with various scenarios
 */
export function testMetadataGeneration(): void {
  console.log("🎯 Testing Chat Metadata Generation\n");
  
  const parser = new CommandParser({ tools: testTools });
  
  const metadataTestCases = [
    {
      input: "I want to create a quote for customer called Ajax",
      expectedTitle: "Quote for Ajax",
      expectedHasDescription: true,
      description: "Email quote generation test"
    },
    {
      input: "send email about meeting schedule",
      expectedTitle: "Email: meeting schedule", 
      expectedHasDescription: true,
      description: "Email with subject test"
    },
    {
      input: "schedule urgent meeting with team",
      expectedTitle: "Meeting: urgent meeting with team",
      expectedHasDescription: true,
      description: "Urgent calendar task test"
    },
    {
      input: "check weather for tomorrow",
      expectedTitle: "Weather for tomorrow",
      expectedHasDescription: true,
      description: "Weather lookup test"
    },
    {
      input: "analyze sales data from Q3",
      expectedTitle: "Analysis: sales data from Q3",
      expectedHasDescription: true,
      description: "Data analysis test"
    }
  ];

  for (const testCase of metadataTestCases) {
    const parsed = parser.parse(testCase.input);
    const metadata = parser.generateChatMetadata(parsed);
    
    console.log(`📋 ${testCase.description}`);
    console.log(`   Input: "${testCase.input}"`);
    console.log(`   Generated Title: "${metadata.title}"`);
    console.log(`   Generated Description: "${metadata.description || 'None'}"`);
    console.log(`   Tags: [${metadata.tags.join(', ')}]`);
    console.log(`   Priority: ${metadata.priority}`);
    console.log(`   Confidence: ${metadata.confidence.toFixed(2)}`);
    console.log(`   Context: Tool=${metadata.hasToolContext}, Action=${metadata.hasActionContext}, Subject=${metadata.hasSubjectContext}`);
    console.log("");
  }
  
  console.log("🧪 Testing Fallback Metadata Generation\n");
  
  const fallbackTestCases = [
    "this is a random conversation",
    "urgent meeting discussion",
    "project updates and status",
    "customer feedback review"
  ];
  
  for (const input of fallbackTestCases) {
    const fallbackMetadata = parser.generateFallbackMetadata(input);
    
    console.log(`🔄 Fallback for: "${input}"`);
    console.log(`   Title: "${fallbackMetadata.title}"`);
    console.log(`   Description: "${fallbackMetadata.description || 'None'}"`);
    console.log(`   Tags: [${fallbackMetadata.tags.join(', ')}]`);
    console.log("");
  }
}

/**
 * Compare metadata generation between different approaches
 */
export function compareMetadataApproaches(input: string): void {
  const parser = new CommandParser({ tools: testTools });
  
  const parsed = parser.parse(input);
  const standardMetadata = parser.generateChatMetadata(parsed);
  const fallbackMetadata = parser.generateFallbackMetadata(input);
  
  console.log(`🔍 Comparing Metadata Approaches for: "${input}"\n`);
  
  console.log("📊 Standard Parse Result:");
  console.log(`   Confidence: ${parsed.confidence.toFixed(2)}`);
  console.log(`   Action: ${parsed.action || 'None'}`);
  console.log(`   Tool: ${parsed.matchedTool?.toolName || 'None'}`);
  console.log(`   Subject: ${parsed.subject || 'None'}`);
  console.log("");
  
  console.log("🎯 Standard Metadata:");
  console.log(`   Title: "${standardMetadata.title}"`);
  console.log(`   Description: "${standardMetadata.description || 'None'}"`);
  console.log(`   Tags: [${standardMetadata.tags.join(', ')}]`);
  console.log(`   Priority: ${standardMetadata.priority}`);
  console.log("");
  
  console.log("🔄 Fallback Metadata:");
  console.log(`   Title: "${fallbackMetadata.title}"`);
  console.log(`   Description: "${fallbackMetadata.description || 'None'}"`);
  console.log(`   Tags: [${fallbackMetadata.tags.join(', ')}]`);
  console.log(`   Priority: ${fallbackMetadata.priority}`);
  console.log("");
  
  console.log("💡 Recommendation:");
  if (standardMetadata.confidence > 0.5) {
    console.log("   Use standard metadata (high confidence)");
  } else if (standardMetadata.confidence > 0.3) {
    console.log("   Use standard metadata with fallback description");
  } else {
    console.log("   Use fallback metadata (low confidence)");
  }
}

// Export for use in browser console during development
if (typeof window !== "undefined") {
  (window as any).testToolMatching = testToolMatching;
  (window as any).debugParse = debugParse;
  (window as any).testMetadataGeneration = testMetadataGeneration;
  (window as any).compareMetadataApproaches = compareMetadataApproaches;
}