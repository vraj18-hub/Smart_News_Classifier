export type Entity = { text: string; type: string };
export type Analysis = {
  category: string; confidence: number; topPredictions: { label: string; score: number }[];
  sentiment: string; sentimentScore: number; keywords: string[]; entities: Entity[]; topics: string[];
  ngrams: { unigrams: string[]; bigrams: string[]; trigrams: string[] };
  summaries: { short: string; standard: string; bullets: string[] }; cleanedText: string;
};
export type Article = { id: string; title: string; content: string; source: string; category: string; sentiment: string; published_at: string; is_demo: boolean; analyses?: Array<{ keywords: string[]; entities: Entity[]; topics: string[]; summaries: Analysis["summaries"] }> };
