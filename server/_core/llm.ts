import { ENV } from "./env";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = {
  type: "text";
  text: string;
};

export type ImageContent = {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
};

export type FileContent = {
  type: "file_url";
  file_url: {
    url: string;
    mime_type?: "audio/mpeg" | "audio/wav" | "application/pdf" | "audio/mp4" | "video/mp4" ;
  };
};

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ToolChoicePrimitive = "none" | "auto" | "required";
export type ToolChoiceByName = { name: string };
export type ToolChoiceExplicit = {
  type: "function";
  function: {
    name: string;
  };
};

export type ToolChoice =
  | ToolChoicePrimitive
  | ToolChoiceByName
  | ToolChoiceExplicit;

export type InvokeParams = {
  messages: Message[];
  tools?: Tool[];
  toolChoice?: ToolChoice;
  tool_choice?: ToolChoice;
  maxTokens?: number;
  max_tokens?: number;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
};

export type ToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string | Array<TextContent | ImageContent | FileContent>;
      tool_calls?: ToolCall[];
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type JsonSchema = {
  name: string;
  schema: Record<string, unknown>;
  strict?: boolean;
};

export type OutputSchema = JsonSchema;

export type ResponseFormat =
  | { type: "text" }
  | { type: "json_object" }
  | { type: "json_schema"; json_schema: JsonSchema };

const ensureArray = (
  value: MessageContent | MessageContent[]
): MessageContent[] => (Array.isArray(value) ? value : [value]);

const normalizeContentPart = (
  part: MessageContent
): TextContent | ImageContent | FileContent => {
  if (typeof part === "string") {
    return { type: "text", text: part };
  }

  if (part.type === "text") {
    return part;
  }

  if (part.type === "image_url") {
    return part;
  }

  if (part.type === "file_url") {
    return part;
  }

  throw new Error("Unsupported message content part");
};

const normalizeMessage = (message: Message) => {
  const { role, name, tool_call_id } = message;

  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content)
      .map(part => (typeof part === "string" ? part : JSON.stringify(part)))
      .join("\n");

    return {
      role,
      name,
      tool_call_id,
      content,
    };
  }

  const contentParts = ensureArray(message.content).map(normalizeContentPart);

  // If there's only text content, collapse to a single string for compatibility
  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return {
      role,
      name,
      content: contentParts[0].text,
    };
  }

  return {
    role,
    name,
    content: contentParts,
  };
};

const normalizeToolChoice = (
  toolChoice: ToolChoice | undefined,
  tools: Tool[] | undefined
): "none" | "auto" | ToolChoiceExplicit | undefined => {
  if (!toolChoice) return undefined;

  if (toolChoice === "none" || toolChoice === "auto") {
    return toolChoice;
  }

  if (toolChoice === "required") {
    if (!tools || tools.length === 0) {
      throw new Error(
        "tool_choice 'required' was provided but no tools were configured"
      );
    }

    if (tools.length > 1) {
      throw new Error(
        "tool_choice 'required' needs a single tool or specify the tool name explicitly"
      );
    }

    return {
      type: "function",
      function: { name: tools[0].function.name },
    };
  }

  if ("name" in toolChoice) {
    return {
      type: "function",
      function: { name: toolChoice.name },
    };
  }

  return toolChoice;
};

const DEFAULT_GOOGLE_GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const resolveApiUrl = () => {
  if (ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0) {
    return ENV.forgeApiUrl.trim();
  }
  return DEFAULT_GOOGLE_GEMINI_URL;
};

const assertApiKey = (apiKey?: string) => {
  if (!apiKey) {
    throw new Error("FORGE (Gemini) API key is not configured");
  }
};

const normalizeResponseFormat = ({
  responseFormat,
  response_format,
  outputSchema,
  output_schema,
}: {
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
}):
  | { type: "json_schema"; json_schema: JsonSchema }
  | { type: "text" }
  | { type: "json_object" }
  | undefined => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (
      explicitFormat.type === "json_schema" &&
      !explicitFormat.json_schema?.schema
    ) {
      throw new Error(
        "responseFormat json_schema requires a defined schema object"
      );
    }
    return explicitFormat;
  }

  const schema = outputSchema || output_schema;
  if (!schema) return undefined;

  if (!schema.name || !schema.schema) {
    throw new Error("outputSchema requires both name and schema");
  }

  return {
    type: "json_schema",
    json_schema: {
      name: schema.name,
      schema: schema.schema,
      ...(typeof schema.strict === "boolean" ? { strict: schema.strict } : {}),
    },
  };
};

type InvokeOptions = {
  apiKey?: string;
};

export async function invokeLLM(
  params: InvokeParams,
  options?: InvokeOptions
): Promise<InvokeResult> {
  const apiKey = options?.apiKey ?? ENV.forgeApiKey;
  assertApiKey(apiKey);

  const apiUrl = resolveApiUrl();
  if (isGoogleGeminiUrl(apiUrl)) {
    return await invokeGoogleGemini(apiUrl, apiKey, params);
  }

  return await invokeOpenAIStyle(apiUrl, apiKey, params);
}

function isGoogleGeminiUrl(url: string): boolean {
  return /generativelanguage\.googleapis\.com/i.test(url);
}

async function invokeOpenAIStyle(
  apiUrl: string,
  apiKey: string,
  params: InvokeParams
): Promise<InvokeResult> {
  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format,
  } = params;

  const payload: Record<string, unknown> = {
    model: "gemini-2.5-flash",
    messages: messages.map(normalizeMessage),
  };

  if (tools && tools.length > 0) {
    payload.tools = tools;
  }

  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }

  if (typeof params.maxTokens === "number") {
    payload.max_tokens = params.maxTokens;
  } else if (typeof params.max_tokens === "number") {
    payload.max_tokens = params.max_tokens;
  } else {
    payload.max_tokens = 32768;
  }
  payload.thinking = {
    "budget_tokens": 128
  }

  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema,
  });

  if (normalizedResponseFormat) {
    payload.response_format = normalizedResponseFormat;
  }

  const response = await fetch(`${apiUrl.replace(/\/$/, "")}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} – ${errorText}`
    );
  }

  return (await response.json()) as InvokeResult;
}

type GoogleContentPart = { text?: string };

type GoogleGenerateContentRequest = {
  contents: Array<{
    role: "user" | "model";
    parts: GoogleContentPart[];
  }>;
  systemInstruction?: {
    role: "system";
    parts: GoogleContentPart[];
  };
  tools?: unknown[];
  safetySettings?: unknown[];
  generationConfig?: {
    maxOutputTokens?: number;
  };
};

type GoogleGenerateContentResponse = {
  responseId?: string;
  candidates?: Array<{
    finishReason?: string;
    index?: number;
    content?: {
      role?: string;
      parts?: Array<GoogleContentPart>;
    };
  }>;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
  modelVersion?: string;
};

async function invokeGoogleGemini(
  apiUrl: string,
  apiKey: string,
  params: InvokeParams
): Promise<InvokeResult> {
  const { systemInstruction, contents } = convertMessagesToGoogleFormat(
    params.messages
  );

  const payload: GoogleGenerateContentRequest = {
    contents,
    ...(systemInstruction ? { systemInstruction } : {}),
  };

  const maxTokens =
    typeof params.maxTokens === "number"
      ? params.maxTokens
      : typeof params.max_tokens === "number"
        ? params.max_tokens
        : undefined;

  if (typeof maxTokens === "number") {
    payload.generationConfig = {
      maxOutputTokens: maxTokens,
    };
  }

  const url = new URL(apiUrl);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LLM invoke failed: ${response.status} ${response.statusText} – ${errorText}`
    );
  }

  const json = (await response.json()) as GoogleGenerateContentResponse;

  if (!json.candidates || json.candidates.length === 0 || !json.candidates[0]) {
    throw new Error("LLM invoke failed: no candidates returned");
  }

  const candidate = json.candidates[0]!;
  const parts = candidate.content?.parts ?? [];
  const assistantContent = parts
    .map(part => part.text ?? "")
    .filter(Boolean)
    .join("\n")
    .trim();

  return {
    id: json.responseId ?? `response_${Date.now()}`,
    created: Math.floor(Date.now() / 1000),
    model: "gemini-2.5-flash",
    choices: [
      {
        index: 0,
        message: {
          role: "assistant",
          content: assistantContent,
        },
        finish_reason: candidate.finishReason ?? null,
      },
    ],
    usage: json.usageMetadata
      ? {
          prompt_tokens: json.usageMetadata.promptTokenCount ?? 0,
          completion_tokens: json.usageMetadata.candidatesTokenCount ?? 0,
          total_tokens: json.usageMetadata.totalTokenCount ?? 0,
        }
      : undefined,
  };
}

function convertMessagesToGoogleFormat(messages: Message[]): {
  systemInstruction?: { role: "system"; parts: GoogleContentPart[] };
  contents: Array<{ role: "user" | "model"; parts: GoogleContentPart[] }>;
} {
  let systemInstruction: { role: "system"; parts: GoogleContentPart[] } | undefined;
  const contents: Array<{ role: "user" | "model"; parts: GoogleContentPart[] }> = [];

  for (const message of messages) {
    const parts = ensureArray(message.content).map(normalizeContentPart);
    const textParts = parts
      .map(part => {
        if (part.type === "text") {
          return part.text;
        }

        // Fall back to JSON string for unsupported content types
        return JSON.stringify(part);
      })
      .filter(text => text.trim().length > 0)
      .map(text => ({ text }));

    if (textParts.length === 0) {
      continue;
    }

    if (message.role === "system") {
      systemInstruction = {
        role: "system",
        parts: textParts,
      };
      continue;
    }

    if (message.role === "user" || message.role === "assistant") {
      contents.push({
        role: message.role === "assistant" ? "model" : "user",
        parts: textParts,
      });
    }
    // Other roles (tool/function) are ignored for Google Gemini
  }

  return { systemInstruction, contents };
}
