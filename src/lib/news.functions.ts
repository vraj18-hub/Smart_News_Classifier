import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const categories = ["Technology","Business","Sports","Politics","Entertainment","Science","Health","World","Education"];
const analysisSchema = z.object({ title: z.string().max(240), text: z.string().min(80).max(30000), keywordCount: z.number().int().min(5).max(20) });
const qaSchema = z.object({ articleTitle: z.string(), context: z.string().min(20).max(30000), question: z.string().min(2).max(500) });

async function callAI(system: string, prompt: string) {
  const { createOpenAI } = await import("@ai-sdk/openai");
  const { streamText } = await import("ai");
  const { createLovableAiGatewayRunIdFetch } = await import("./run-id.server");
  const apiKey = process.env['LOVABLE_API_KEY'];
  if (!apiKey) throw new Error("AI analysis is not configured.");
  const request = getRequest();
  const gateway = createLovableAiGatewayRunIdFetch(request.headers.get("X-Lovable-AIG-Run-ID") ?? undefined);
  const provider = createOpenAI({ baseURL: "https://ai.gateway.lovable.dev/v1", apiKey, headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" }, fetch: gateway.fetch });
  const result = streamText({ model: provider.responses("openai/gpt-6-astra"), system, prompt, abortSignal: request.signal, providerOptions: { openai: { store: false, forceReasoning: true, reasoningEffort: "low", reasoningSummary: "auto", include: ["reasoning.encrypted_content"] } } });
  return await result.text;
}

function parseJson(text: string) { const match = text.match(/\{[\s\S]*\}/); if (!match) throw new Error("The analysis response was incomplete."); return JSON.parse(match[0]); }

export const analyzeArticle = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => analysisSchema.parse(input)).handler(async ({ data, context }) => {
  const raw = await callAI("You are a precise news intelligence analyst. Return only valid JSON, no markdown.", `Analyze this news article. Category must be one of: ${categories.join(", ")}. Return JSON with category, confidence (0-1), topPredictions (three {label,score}), sentiment (Positive|Neutral|Negative), sentimentScore (0-1), keywords (${data.keywordCount} strings), entities ({text,type} where type is PERSON, ORGANIZATION, LOCATION, COUNTRY, COMPANY, DATE, MONEY, PRODUCT, or EVENT), topics (3 strings), ngrams ({unigrams,bigrams,trigrams}, 5 each), summaries ({short,standard,bullets with 3 strings}), and cleanedText.\nTITLE: ${data.title}\nARTICLE: ${data.text}`);
  const a = parseJson(raw) as Record<string, unknown>;
  const category = categories.includes(String(a['category'])) ? String(a['category']) : "World";
  const title = data.title.trim() || data.text.trim().split(/[.!?]/)[0]?.slice(0, 120) || "Untitled article";
  const { data: article, error } = await context.supabase.from("articles").insert({ owner_id: context.userId, title, content: data.text, source: "Manual entry", category, sentiment: String(a['sentiment'] ?? "Neutral") }).select("id").single();
  if (error || !article) throw new Error("The article could not be saved.");
  const result = { category, confidence: Number(a['confidence'] ?? 0.8), topPredictions: (a['topPredictions'] ?? []) as Array<{label:string;score:number}>, sentiment: String(a['sentiment'] ?? "Neutral"), sentimentScore: Number(a['sentimentScore'] ?? 0.5), keywords: (a['keywords'] ?? []) as string[], entities: (a['entities'] ?? []) as Array<{text:string;type:string}>, topics: (a['topics'] ?? []) as string[], ngrams: (a['ngrams'] ?? {unigrams:[],bigrams:[],trigrams:[]}) as {unigrams:string[];bigrams:string[];trigrams:string[]}, summaries: (a['summaries'] ?? {short:"",standard:"",bullets:[]}) as {short:string;standard:string;bullets:string[]}, cleanedText: String(a['cleanedText'] ?? "") };
  await context.supabase.from("analyses").insert({ article_id: article.id, owner_id: context.userId, category: result.category, confidence: result.confidence, sentiment: result.sentiment, sentiment_score: result.sentimentScore, keywords: result.keywords, entities: result.entities, topics: result.topics, ngrams: result.ngrams, summaries: result.summaries, cleaned_text: result.cleanedText });
  return { ...result, articleId: article.id };
});

export const askArticle = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => qaSchema.parse(input)).handler(async ({ data }) => {
  const answer = await callAI("Answer only from the supplied article. If the article does not contain the answer, say so plainly. Be concise and include one exact supporting excerpt.", `ARTICLE TITLE: ${data.articleTitle}\nCONTEXT: ${data.context}\nQUESTION: ${data.question}`);
  return { answer };
});
