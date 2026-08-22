import type { GenerationResult, Provider } from '../types';

export interface GenerateArgs {
  provider: Provider;
  apiKey: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
}

function validateResult(raw: unknown): GenerationResult {
  const obj = raw as Record<string, unknown> | null;
  if (
    !obj ||
    typeof obj.title !== 'string' ||
    typeof obj.description !== 'string' ||
    typeof obj.sketchCode !== 'string' ||
    obj.sketchCode.trim().length === 0
  ) {
    throw new Error('The model returned a malformed response (missing title/description/sketchCode).');
  }
  return { title: obj.title, description: obj.description, sketchCode: obj.sketchCode };
}

/** A page of the required density runs long; leave room for it. */
const MAX_OUTPUT_TOKENS = 32000;

const TRUNCATED =
  'The model stopped before finishing the sketch (output token limit). Generate again — if it keeps happening, ask for a simpler subject.';

async function extractError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    const message = body?.error?.message ?? body?.message ?? JSON.stringify(body);
    return `${res.status} ${res.statusText}: ${message}`;
  } catch {
    return `${res.status} ${res.statusText}`;
  }
}

async function callOpenAI({ apiKey, model, systemPrompt, userPrompt }: GenerateArgs): Promise<GenerationResult> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_completion_tokens: MAX_OUTPUT_TOKENS,
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) throw new Error(await extractError(res));
  const data = await res.json();
  if (data.choices?.[0]?.finish_reason === 'length') throw new Error(TRUNCATED);
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('GPT returned an empty response.');
  return validateResult(JSON.parse(content));
}

async function callAnthropic({ apiKey, model, systemPrompt, userPrompt }: GenerateArgs): Promise<GenerationResult> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_OUTPUT_TOKENS,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
      tools: [
        {
          name: 'emit_sketch',
          description: 'Emit the generated artwork metadata and the complete p5.js instance-mode sketch source.',
          input_schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              sketchCode: { type: 'string' },
            },
            required: ['title', 'description', 'sketchCode'],
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'emit_sketch' },
    }),
  });
  if (!res.ok) throw new Error(await extractError(res));
  const data = await res.json();
  if (data.stop_reason === 'max_tokens') throw new Error(TRUNCATED);
  const toolUse = (data.content as Array<{ type: string; input?: unknown }> | undefined)?.find(
    (c) => c.type === 'tool_use',
  );
  if (!toolUse) throw new Error('Claude did not return a structured response.');
  return validateResult(toolUse.input);
}

async function callGemini({ apiKey, model, systemPrompt, userPrompt }: GenerateArgs): Promise<GenerationResult> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              title: { type: 'STRING' },
              description: { type: 'STRING' },
              sketchCode: { type: 'STRING' },
            },
            required: ['title', 'description', 'sketchCode'],
          },
        },
      }),
    },
  );
  if (!res.ok) throw new Error(await extractError(res));
  const data = await res.json();
  if (data.candidates?.[0]?.finishReason === 'MAX_TOKENS') throw new Error(TRUNCATED);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned an empty response.');
  return validateResult(JSON.parse(text));
}

/**
 * Asks the model to fix source that would not parse. Cheaper and far less
 * annoying than making the user press Generate again.
 */
export function buildRepairPrompt(result: GenerationResult, error: string): string {
  return `The sketch below does not parse. The browser reports:

${error}

Return the SAME piece, corrected so it parses — keep the title, the composition and every mark identical, and change only what is needed to make it valid JavaScript. Respond with the JSON object described in the system prompt, with the corrected source in "sketchCode".

TITLE
${result.title}

SOURCE
${result.sketchCode}`;
}

export async function generateSketch(args: GenerateArgs): Promise<GenerationResult> {
  switch (args.provider) {
    case 'openai':
      return callOpenAI(args);
    case 'anthropic':
      return callAnthropic(args);
    case 'gemini':
      return callGemini(args);
  }
}
