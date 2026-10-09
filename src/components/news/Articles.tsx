import { useEffect,useState } from "react";
import { AppShell } from "./AppShell";
import { getArticles } from "@/lib/news-data";
import type { Article } from "@/lib/news-types";
import { Search as SearchIcon, BookOpen, ArrowUpRight, SlidersHorizontal } from "lucide-react";

export function Articles(){
  const[items,setItems]=useState<Article[]>([]);const[q,setQ]=useState("");
  useEffect(()=>{getArticles().then(setItems)},[]);
  const shown=items.filter(a=>(a.title+a.source+a.category).toLowerCase().includes(q.toLowerCase()));
  return <AppShell eyebrow="Knowledge base" title="Article library">
    <div className="panel flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1"><SearchIcon className="absolute left-3.5 top-3 size-4 text-muted-foreground"/><input className="field pl-10" placeholder="Filter by title, source, or category" value={q} onChange={e=>setQ(e.target.value)}/></div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><SlidersHorizontal className="size-4"/><b className="text-foreground">{shown.length}</b> of {items.length} articles</div>
    </div>
    <div className="mt-6 grid gap-4 lg:grid-cols-2">{shown.map((a,i)=><article key={a.id} className="panel panel-interactive group relative overflow-hidden" style={{animationDelay:`${i*45}ms`}}><div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-primary/5"/><div className="flex items-start justify-between gap-3"><div className="flex flex-wrap gap-2"><span className="status-pill">{a.category}</span><span className="status-pill">{a.sentiment}</span></div><span className="icon-well size-9 shrink-0"><BookOpen className="size-4"/></span></div><h2 className="mt-5 text-lg font-semibold leading-snug transition-colors group-hover:text-primary">{a.title}</h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{a.analyses?.[0]?.summaries.standard??a.content}</p><div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground"><span><b className="font-semibold text-foreground">{a.source}</b> · {new Date(a.published_at).toLocaleDateString()}</span><ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></div></article>)}</div>
    {shown.length===0&&<div className="panel mt-6 py-16 text-center"><SearchIcon className="mx-auto size-7 text-muted-foreground"/><h2 className="mt-4 font-semibold">No matching articles</h2><p className="mt-1 text-sm text-muted-foreground">Try a broader search term.</p></div>}
  </AppShell>
}
