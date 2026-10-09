import { useEffect,useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight,FileText,Layers,TrendingUp,ArrowUpRight,Radio } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PieChart,Pie,Cell,ResponsiveContainer,Tooltip } from "recharts";
import { AppShell } from "./AppShell";
import { Button } from "@/components/ui/button";
import { getArticles } from "@/lib/news-data";
import type { Article } from "@/lib/news-types";

const COLORS=["var(--chart-1)","var(--chart-2)","var(--chart-3)","var(--chart-4)","var(--chart-5)"];
const tooltipStyle={background:"var(--popover)",border:"1px solid var(--border)",borderRadius:"8px",boxShadow:"var(--shadow-panel)",fontSize:"12px"};

export function Dashboard(){
  const [items,setItems]=useState<Article[]>([]);
  useEffect(()=>{getArticles().then(setItems).catch(()=>setItems([]))},[]);
  const cats=Object.entries(items.reduce<Record<string,number>>((a,x)=>({...a,[x.category]:(a[x.category]||0)+1}),{})).map(([name,value])=>({name,value}));
  const topics=[...new Set(items.flatMap(x=>x.analyses?.[0]?.topics??[]))].slice(0,6);
  return <AppShell eyebrow="Intelligence overview" title="Good morning, Analyst" action={<Button asChild className="shadow-lg"><Link to="/analyze">Analyze article <ArrowRight/></Link></Button>}>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Your briefing is current across all monitored sources.</p><span className="status-pill"><Radio className="size-3"/>Updated just now</span></div>
    <div className="grid gap-4 md:grid-cols-3">
      <Metric icon={FileText} label="Articles in library" value={String(items.length)} note="Ready to search" trend="+12% this week"/>
      <Metric icon={Layers} label="Active categories" value={String(cats.length)} note="Across the collection" trend="Balanced coverage"/>
      <Metric icon={TrendingUp} label="Top signal" value={topics[0]??"AI infrastructure"} note="Leading conversation" trend="Strongest theme"/>
    </div>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
      <Section title="Recent intelligence" subtitle="Latest articles added to your workspace" action={<Link to="/articles" className="text-xs font-semibold text-primary hover:underline">View all</Link>}>
        <div>{items.slice(0,5).map((a,i)=><Link key={a.id} to="/qa" className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg px-2 py-3.5 transition-colors hover:bg-secondary/55"><span className="rank">{i+1}</span><span className="min-w-0"><strong className="block truncate text-sm font-semibold group-hover:text-primary">{a.title}</strong><small className="mt-1 block text-muted-foreground">{a.source} · {new Date(a.published_at).toLocaleDateString()}</small></span><span className="status-pill hidden sm:inline-flex">{a.category}</span></Link>)}</div>
      </Section>
      <Section title="Category mix" subtitle="Coverage across the library">
        <div className="relative h-52"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={cats} dataKey="value" innerRadius={62} outerRadius={86} paddingAngle={4} cornerRadius={5}>{cats.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} stroke="var(--card)" strokeWidth={3}/>)}</Pie><Tooltip contentStyle={tooltipStyle}/></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><span><b className="block text-2xl">{items.length}</b><small className="text-[10px] uppercase text-muted-foreground">Articles</small></span></div></div>
        <Legend data={cats}/>
      </Section>
    </div>
    <div className="mt-6">
      <Section title="Trending topics" subtitle="Signals extracted from recent coverage"><div className="flex flex-wrap gap-2">{topics.map((t,i)=><span key={t} className="topic-tag"><b>0{i+1}</b>{t}</span>)}</div></Section>
    </div>
  </AppShell>
}
function Metric({icon:Icon,label,value,note,trend}:{icon:LucideIcon;label:string;value:string;note:string;trend:string}){return <div className="metric group"><div className="flex items-center justify-between"><span className="text-sm font-medium text-muted-foreground">{label}</span><span className="icon-well transition-transform group-hover:scale-105"><Icon className="size-4"/></span></div><div className="mt-5 truncate text-3xl font-semibold">{value}</div><div className="mt-3 flex items-center justify-between gap-2"><p className="text-xs text-muted-foreground">{note}</p><span className="flex items-center gap-1 text-[10px] font-semibold text-primary">{trend}<ArrowUpRight className="size-3"/></span></div></div>}
function Section({title,subtitle,children,action}:{title:string;subtitle:string;children:ReactNode;action?:ReactNode}){return <section className="panel"><div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{subtitle}</p></div>{action}</div><div className="mt-5">{children}</div></section>}
function Legend({data}:{data:{name:string;value:number}[]}){return <div className="grid grid-cols-2 gap-x-5 gap-y-2">{data.map((d,i)=><div key={d.name} className="flex items-center gap-2 text-xs"><i className="size-2 rounded-full" style={{background:COLORS[i%COLORS.length]}}/><span className="truncate text-muted-foreground">{d.name}</span><b className="ml-auto">{d.value}</b></div>)}</div>}
