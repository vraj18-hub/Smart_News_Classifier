import { supabase } from "@/integrations/supabase/client";
import type { Article } from "./news-types";
export async function getArticles(): Promise<Article[]> { const { data, error } = await supabase.from("articles").select("id,title,content,source,category,sentiment,published_at,is_demo,analyses(keywords,entities,topics,summaries)").order("published_at", { ascending: false }); if (error) throw error; return (data ?? []) as Article[]; }
export function similarity(a: string, b: string) { const words=(s:string)=>new Set(s.toLowerCase().match(/[a-z]{3,}/g)??[]); const x=words(a),y=words(b); const both=[...x].filter(w=>y.has(w)).length; return both/Math.max(1,Math.sqrt(x.size*y.size)); }
