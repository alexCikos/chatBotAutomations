import Fuse from "fuse.js";
import type { Tool } from "$lib/types";

export interface ParsedCommand {
  action: string | null;
  toolName: string | null;
  matchedTool: Tool | null;
  subject: string | null;
  confidence: number;
  rawInput: string;
}

export interface CommandParserOptions {
  tools: Tool[];
  actionThreshold?: number;
  toolThreshold?: number;
}

/**
 * Command parsing engine that extracts intent, tool references, and context
 * from natural language input to enable contextual chat actions.
 */
export class CommandParser {
  private tools: Tool[];
  private toolFuse!: Fuse<Tool>; // Will be initialized in constructor
  private actionThreshold: number;
  private toolThreshold: number;
  private toolKeywords: Map<string, Tool[]>;

  // Common action keywords for intent detection
  private readonly actionPatterns = [
    { pattern: /\b(create|make|generate|build|new)\b/i, action: "create" },
    { pattern: /\b(start|begin|initiate|launch)\b/i, action: "start" },
    { pattern: /\b(send|email|mail|message)\b/i, action: "send" },
    { pattern: /\b(schedule|plan|book|arrange)\b/i, action: "schedule" },
    { pattern: /\b(analyze|check|review|examine|look)\b/i, action: "analyze" },
    { pattern: /\b(find|search|lookup|get|fetch)\b/i, action: "find" },
    { pattern: /\b(update|modify|change|edit)\b/i, action: "update" },
    { pattern: /\b(delete|remove|cancel)\b/i, action: "delete" },
  ];

  // Subject extraction patterns
  private readonly subjectPatterns = [
    /\bfor\s+(.+?)(?:\s+(?:using|with|via)|$)/i,
    /\babout\s+(.+?)(?:\s+(?:using|with|via)|$)/i,
    /\bcalled\s+(.+?)(?:\s+(?:using|with|via)|$)/i,
    /\bnamed\s+(.+?)(?:\s+(?:using|with|via)|$)/i,
    /\bregarding\s+(.+?)(?:\s+(?:using|with|via)|$)/i,
    /\bto\s+(.+?)(?:\s+(?:using|with|via)|$)/i,
  ];

  constructor(options: CommandParserOptions) {
    this.tools = options.tools;
    this.actionThreshold = options.actionThreshold || 0.3;
    this.toolThreshold = options.toolThreshold || 0.5; // Slightly more permissive
    this.toolKeywords = new Map();

    this.initializeToolMatching();
  }

  /**
   * Initialize enhanced tool matching with Fuse.js and keyword mapping
   */
  private initializeToolMatching(): void {
    // Enhanced Fuse configuration for better tool matching
    this.toolFuse = new Fuse(this.tools, {
      keys: [
        { name: "toolName", weight: 0.7 },
        { name: "toolDescription", weight: 0.3 }
      ],
      threshold: this.toolThreshold,
      includeScore: true,
      ignoreLocation: true,
      findAllMatches: true,
      minMatchCharLength: 2,
    });

    // Build keyword mapping for common tool aliases
    this.buildToolKeywordMap();
  }

  /**
   * Build keyword mapping for better tool recognition
   */
  private buildToolKeywordMap(): void {
    this.toolKeywords.clear();
    
    for (const tool of this.tools) {
      const keywords = this.extractToolKeywords(tool);
      for (const keyword of keywords) {
        if (!this.toolKeywords.has(keyword)) {
          this.toolKeywords.set(keyword, []);
        }
        this.toolKeywords.get(keyword)!.push(tool);
      }
    }
  }

  /**
   * Extract keywords and aliases for a tool
   */
  private extractToolKeywords(tool: Tool): string[] {
    const keywords = new Set<string>();
    
    // Add tool name words
    const nameWords = tool.toolName.toLowerCase().split(/\s+/);
    nameWords.forEach(word => keywords.add(word));
    
    // Add common aliases based on tool type
    const aliasMap: Record<string, string[]> = {
      'weather': ['weather', 'forecast', 'temperature', 'climate'],
      'email': ['email', 'mail', 'message', 'send', 'compose'],
      'calendar': ['calendar', 'schedule', 'meeting', 'appointment', 'book'],
      'data': ['data', 'analysis', 'analyze', 'report', 'insights'],
      'information': ['info', 'information', 'details', 'lookup'],
      'assistant': ['assistant', 'helper', 'support'],
      'manager': ['manager', 'manage', 'handle']
    };
    
    // Check tool name and description for alias keywords
    const toolText = `${tool.toolName} ${tool.toolDescription}`.toLowerCase();
    for (const [key, aliases] of Object.entries(aliasMap)) {
      if (toolText.includes(key)) {
        aliases.forEach(alias => keywords.add(alias));
      }
    }
    
    return Array.from(keywords);
  }

  /**
   * Parse natural language input and extract command components
   */
  parse(input: string): ParsedCommand {
    const normalizedInput = input.trim().toLowerCase();
    
    if (!normalizedInput) {
      return this.createEmptyResult(input);
    }

    const action = this.detectAction(normalizedInput);
    const { toolName, matchedTool } = this.extractTool(input);
    const subject = this.extractSubject(input, toolName);
    const confidence = this.calculateConfidence(action, matchedTool, subject);

    return {
      action,
      toolName,
      matchedTool,
      subject,
      confidence,
      rawInput: input,
    };
  }

  /**
   * Detect action intent from input using keyword patterns
   */
  private detectAction(input: string): string | null {
    for (const { pattern, action } of this.actionPatterns) {
      if (pattern.test(input)) {
        return action;
      }
    }
    return null;
  }

  /**
   * Extract and match tool names using enhanced fuzzy search and keyword matching
   */
  private extractTool(input: string): { toolName: string | null; matchedTool: Tool | null } {
    const normalizedInput = input.toLowerCase();
    
    // First try keyword-based exact matching for better accuracy
    const keywordMatch = this.findByKeywords(normalizedInput);
    if (keywordMatch) {
      return keywordMatch;
    }
    
    // Fall back to fuzzy search
    const fuseResults = this.toolFuse.search(input);
    if (fuseResults.length > 0 && fuseResults[0].score! <= this.toolThreshold) {
      const match = fuseResults[0].item;
      return {
        toolName: match.toolName,
        matchedTool: match,
      };
    }

    // Try partial name matching as final fallback
    const partialMatch = this.findByPartialName(normalizedInput);
    if (partialMatch) {
      return partialMatch;
    }

    return { toolName: null, matchedTool: null };
  }

  /**
   * Find tools by exact keyword matching
   */
  private findByKeywords(input: string): { toolName: string; matchedTool: Tool } | null {
    const inputWords = input.split(/\s+/);
    
    for (const word of inputWords) {
      if (this.toolKeywords.has(word)) {
        const matchingTools = this.toolKeywords.get(word)!;
        // Return the first matching tool (could be enhanced with scoring)
        const tool = matchingTools[0];
        return {
          toolName: tool.toolName,
          matchedTool: tool,
        };
      }
    }
    
    return null;
  }

  /**
   * Find tools by partial name matching (fallback)
   */
  private findByPartialName(input: string): { toolName: string; matchedTool: Tool } | null {
    for (const tool of this.tools) {
      const toolNameLower = tool.toolName.toLowerCase();
      const toolWords = toolNameLower.split(/\s+/);
      
      // Check if any tool name word is contained in the input
      for (const word of toolWords) {
        if (word.length > 3 && input.includes(word)) {
          return {
            toolName: tool.toolName,
            matchedTool: tool,
          };
        }
      }
    }
    
    return null;
  }

  /**
   * Extract subject/context information for chat titles and descriptions
   */
  private extractSubject(input: string, excludeTool?: string | null): string | null {
    // Remove tool name from input if found to avoid including it in subject
    let cleanInput = input;
    if (excludeTool) {
      const toolRegex = new RegExp(excludeTool.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      cleanInput = cleanInput.replace(toolRegex, '').trim();
    }

    // Try each subject pattern
    for (const pattern of this.subjectPatterns) {
      const match = cleanInput.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    // Fallback: extract text after common trigger words
    const fallbackMatch = cleanInput.match(/\b(?:create|make|send|for|about)\s+(.+)/i);
    if (fallbackMatch && fallbackMatch[1]) {
      return fallbackMatch[1].trim();
    }

    return null;
  }

  /**
   * Calculate confidence score based on extracted components
   */
  private calculateConfidence(
    action: string | null, 
    matchedTool: Tool | null, 
    subject: string | null
  ): number {
    let confidence = 0;
    
    if (action) confidence += 0.4;
    if (matchedTool) confidence += 0.4;
    if (subject) confidence += 0.2;
    
    return Math.min(confidence, 1.0);
  }

  /**
   * Create empty result structure
   */
  private createEmptyResult(input: string): ParsedCommand {
    return {
      action: null,
      toolName: null,
      matchedTool: null,
      subject: null,
      confidence: 0,
      rawInput: input,
    };
  }

  /**
   * Update available tools for matching
   */
  updateTools(tools: Tool[]): void {
    this.tools = tools;
    this.initializeToolMatching();
  }

  /**
   * Generate a suggested chat title based on parsed command
   */
  generateChatTitle(parsed: ParsedCommand): string {
    const { action, toolName, subject, matchedTool } = parsed;
    
    // Get clean subject without common prepositions
    const cleanSubject = this.cleanSubjectForTitle(subject);
    
    // Use tool-specific title generation if available
    if (matchedTool && cleanSubject) {
      const toolSpecificTitle = this.generateToolSpecificTitle(matchedTool, action, cleanSubject);
      if (toolSpecificTitle) {
        return toolSpecificTitle;
      }
    }
    
    // General title generation logic
    if (action && toolName && cleanSubject) {
      return `${this.capitalizeFirst(action)} ${cleanSubject}`;
    } else if (action && cleanSubject) {
      return `${this.capitalizeFirst(action)} ${cleanSubject}`;
    } else if (toolName && cleanSubject) {
      return `${cleanSubject} - ${toolName}`;
    } else if (action && toolName) {
      return `${this.capitalizeFirst(action)} with ${toolName}`;
    } else if (cleanSubject) {
      return this.capitalizeFirst(cleanSubject);
    } else if (toolName) {
      return `New ${toolName} Task`;
    } else {
      return "New Chat";
    }
  }

  /**
   * Generate tool-specific chat titles
   */
  private generateToolSpecificTitle(tool: Tool, action: string | null, subject: string): string | null {
    const toolType = this.getToolType(tool);
    
    switch (toolType) {
      case 'email':
        if (action === 'send' || action === 'create') {
          return `Email to ${subject}`;
        }
        return `Email: ${subject}`;
        
      case 'calendar':
        if (action === 'schedule' || action === 'book') {
          return `Meeting: ${subject}`;
        }
        return `Calendar: ${subject}`;
        
      case 'weather':
        return `Weather for ${subject}`;
        
      case 'data':
        if (action === 'analyze') {
          return `Analysis: ${subject}`;
        }
        return `Data: ${subject}`;
        
      default:
        return null;
    }
  }

  /**
   * Clean subject for title generation (remove prepositions)
   */
  private cleanSubjectForTitle(subject: string | null): string {
    if (!subject) return "";
    
    // Remove common prepositions and articles that make titles awkward
    return subject
      .replace(/^(for|about|regarding|concerning|with|to|from)\s+/i, '')
      .replace(/^(the|a|an)\s+/i, '')
      .trim();
  }

  /**
   * Determine tool type from tool name and description
   */
  private getToolType(tool: Tool): string {
    const toolText = `${tool.toolName} ${tool.toolDescription}`.toLowerCase();
    
    if (toolText.includes('email') || toolText.includes('mail')) return 'email';
    if (toolText.includes('calendar') || toolText.includes('schedule')) return 'calendar';
    if (toolText.includes('weather') || toolText.includes('forecast')) return 'weather';
    if (toolText.includes('data') || toolText.includes('analysis')) return 'data';
    
    return 'general';
  }

  /**
   * Generate a suggested chat description based on parsed command
   */
  generateChatDescription(parsed: ParsedCommand): string | undefined {
    const { action, toolName, subject, matchedTool } = parsed;
    
    if (parsed.confidence < 0.3) {
      return undefined; // Don't generate description for low confidence parses
    }

    // Use tool-specific description generation if available
    if (matchedTool) {
      const toolSpecificDesc = this.generateToolSpecificDescription(matchedTool, action, subject);
      if (toolSpecificDesc) {
        return toolSpecificDesc;
      }
    }

    // General description generation logic
    if (action && toolName && subject) {
      return `${this.capitalizeFirst(action)} ${subject} using ${toolName}`;
    } else if (toolName && subject) {
      return `Working on ${subject} with ${toolName}`;
    } else if (action && subject) {
      return `${this.capitalizeFirst(action)} ${subject}`;
    } else if (toolName) {
      return `New task using ${toolName}`;
    } else if (subject) {
      return `Discussion about ${subject}`;
    } else {
      return undefined;
    }
  }

  /**
   * Generate tool-specific descriptions with contextual templates
   */
  private generateToolSpecificDescription(tool: Tool, action: string | null, subject: string | null): string | null {
    const toolType = this.getToolType(tool);
    
    if (!subject && !action) return null;
    
    switch (toolType) {
      case 'email':
        if (subject) {
          if (action === 'send' || action === 'create') {
            return `Composing and sending email regarding ${subject}`;
          }
          return `Email communication about ${subject}`;
        }
        return "Email task";
        
      case 'calendar':
        if (subject) {
          if (action === 'schedule' || action === 'book') {
            return `Scheduling meeting or appointment for ${subject}`;
          }
          return `Calendar management for ${subject}`;
        }
        return "Calendar task";
        
      case 'weather':
        if (subject) {
          return `Getting weather information for ${subject}`;
        }
        return "Weather information lookup";
        
      case 'data':
        if (subject) {
          if (action === 'analyze') {
            return `Analyzing data and generating insights for ${subject}`;
          }
          return `Data processing and analysis for ${subject}`;
        }
        return "Data analysis task";
        
      default:
        return null;
    }
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Generate comprehensive chat metadata including title, description, and tags
   */
  generateChatMetadata(parsed: ParsedCommand): ChatMetadata {
    const title = this.generateChatTitle(parsed);
    const description = this.generateChatDescription(parsed);
    const tags = this.generateChatTags(parsed);
    const priority = this.determineChatPriority(parsed);
    
    return {
      title,
      description,
      tags,
      priority,
      confidence: parsed.confidence,
      hasToolContext: !!parsed.matchedTool,
      hasActionContext: !!parsed.action,
      hasSubjectContext: !!parsed.subject
    };
  }

  /**
   * Generate relevant tags for the chat based on parsed content
   */
  private generateChatTags(parsed: ParsedCommand): string[] {
    const tags: string[] = [];
    
    if (parsed.matchedTool) {
      tags.push(parsed.matchedTool.toolName);
      
      const toolType = this.getToolType(parsed.matchedTool);
      if (toolType !== 'general') {
        tags.push(toolType);
      }
    }
    
    if (parsed.action) {
      tags.push(parsed.action);
    }
    
    // Add context tags based on subject
    if (parsed.subject) {
      if (parsed.subject.toLowerCase().includes('customer')) tags.push('customer');
      if (parsed.subject.toLowerCase().includes('meeting')) tags.push('meeting');
      if (parsed.subject.toLowerCase().includes('project')) tags.push('project');
      if (parsed.subject.toLowerCase().includes('urgent')) tags.push('urgent');
    }
    
    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Determine chat priority based on context
   */
  private determineChatPriority(parsed: ParsedCommand): 'low' | 'medium' | 'high' {
    if (parsed.confidence < 0.4) return 'low';
    
    // High priority indicators
    if (parsed.subject?.toLowerCase().includes('urgent') || 
        parsed.subject?.toLowerCase().includes('asap')) {
      return 'high';
    }
    
    // Medium priority for tool-assisted tasks
    if (parsed.matchedTool && parsed.subject) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Generate fallback metadata for low-confidence or incomplete parses
   */
  generateFallbackMetadata(input: string): ChatMetadata {
    // Extract any meaningful words from the input
    const words = input.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const meaningfulWords = words.filter(word => 
      !['the', 'and', 'or', 'but', 'for', 'with', 'about', 'using'].includes(word)
    );
    
    // Generate basic title from input
    let title = "New Chat";
    if (meaningfulWords.length > 0) {
      title = meaningfulWords.slice(0, 3).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    
    // Basic description
    const description = meaningfulWords.length > 3 
      ? `Discussion about ${meaningfulWords.slice(0, 5).join(' ')}`
      : undefined;
    
    // Extract basic tags
    const tags: string[] = [];
    if (input.toLowerCase().includes('email')) tags.push('email');
    if (input.toLowerCase().includes('meeting')) tags.push('meeting');
    if (input.toLowerCase().includes('schedule')) tags.push('schedule');
    if (input.toLowerCase().includes('urgent')) tags.push('urgent');
    
    return {
      title,
      description,
      tags,
      priority: 'low',
      confidence: 0.2, // Low confidence for fallback
      hasToolContext: false,
      hasActionContext: false,
      hasSubjectContext: meaningfulWords.length > 0
    };
  }
}

/**
 * Chat metadata interface
 */
export interface ChatMetadata {
  title: string;
  description?: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  confidence: number;
  hasToolContext: boolean;
  hasActionContext: boolean;
  hasSubjectContext: boolean;
}

/**
 * Convenience function to create a command parser with tools
 */
export function createCommandParser(tools: Tool[], options?: Partial<CommandParserOptions>): CommandParser {
  return new CommandParser({
    tools,
    ...options,
  });
}