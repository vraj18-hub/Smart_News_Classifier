import { createFileRoute } from "@tanstack/react-router";
import { Articles } from "@/components/news/Articles";
export const Route = createFileRoute("/articles")({ head:()=>({meta:[{title:"News Article Library | Signal Desk"},{name:"description",content:"Browse saved articles and their AI-powered analysis."},{property:"og:title",content:"News Article Library | Signal Desk"},{property:"og:description",content:"Browse saved articles and their AI-powered analysis."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]}), component:Articles });
