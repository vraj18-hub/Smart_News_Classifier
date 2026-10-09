import { Link, useLocation } from "@tanstack/react-router";
import { BarChart3, BookOpenText, Bot, GitCompareArrows, Menu, Newspaper, Search, ScanText, X, Activity } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav=[
  {to:"/",label:"Overview",icon:BarChart3},
  {to:"/analyze",label:"Analyze",icon:ScanText},
  {to:"/articles",label:"Articles",icon:BookOpenText},
  {to:"/search",label:"Semantic search",icon:Search},
  {to:"/compare",label:"Compare",icon:GitCompareArrows},
  {to:"/qa",label:"Ask the news",icon:Bot},
] as const;

export function AppShell({children,title,eyebrow,action}:{children:ReactNode;title:string;eyebrow:string;action?:ReactNode}) {
  const [open,setOpen]=useState(false);
  const loc=useLocation();
  return <div className="min-h-screen bg-background/70">
    <aside className={cn("fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground shadow-2xl transition-transform duration-300 lg:translate-x-0",open?"translate-x-0":"-translate-x-full")}>
      <div className="flex h-16 items-center justify-between px-2">
        <Link to="/" className="flex items-center gap-3 font-semibold">
          <span className="grid size-10 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"><Newspaper className="size-5"/></span>
          <span><span className="block text-[15px]">Signal Desk</span><small className="mt-0.5 block text-[10px] font-medium uppercase text-sidebar-foreground/45">Intelligence OS</small></span>
        </Link>
        <Button variant="ghost" size="icon" className="text-sidebar-foreground lg:hidden" onClick={()=>setOpen(false)} aria-label="Close menu"><X/></Button>
      </div>
      <div className="mx-2 mt-5 rounded-lg border border-sidebar-border bg-sidebar-accent/55 p-3">
        <div className="flex items-center gap-2 text-xs font-semibold"><Activity className="size-3.5 text-sidebar-primary"/>Live workspace</div>
        <p className="mt-1 text-[11px] text-sidebar-foreground/50">6 sources connected</p>
      </div>
      <nav className="mt-6 space-y-1.5">{nav.map(item=>{const active=loc.pathname===item.to;return <Link key={item.to} to={item.to} onClick={()=>setOpen(false)} className={cn("group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",active?"bg-sidebar-primary text-sidebar-primary-foreground shadow-lg":"text-sidebar-foreground/60 hover:translate-x-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground")}><item.icon className={cn("size-4 transition-transform group-hover:scale-110",active&&"stroke-[2.5]")}/>{item.label}{active&&<span className="ml-auto size-1.5 rounded-full bg-sidebar-primary-foreground"/>}</Link>})}</nav>
      <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-sidebar-border bg-sidebar-accent/45 p-3 text-xs">
        <div className="flex items-center gap-2 font-medium"><span className="size-2 rounded-full bg-sidebar-primary" style={{animation:"soft-pulse 2s ease-in-out infinite"}}/>All systems operational</div>
        <p className="mt-1.5 text-[10px] text-sidebar-foreground/45">AI analysis ready</p>
      </div>
    </aside>
    {open&&<div className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden" onClick={()=>setOpen(false)}/>} 
    <main className="lg:pl-64">
      <header className="sticky top-0 z-30 flex min-h-24 items-center justify-between border-b border-border/70 bg-background/75 px-5 py-5 backdrop-blur-xl md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="outline" size="icon" className="shrink-0 bg-card/70 lg:hidden" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu/></Button>
          <div className="min-w-0"><p className="eyebrow">{eyebrow}</p><h1 className="mt-1 truncate text-2xl font-semibold text-foreground md:text-3xl">{title}</h1></div>
        </div>
        <div className="ml-4 shrink-0">{action}</div>
      </header>
      <div className="mx-auto max-w-7xl p-5 md:p-8"><div className="reveal">{children}</div></div>
    </main>
  </div>
}
