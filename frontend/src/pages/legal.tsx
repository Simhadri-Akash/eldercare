import { Link } from "wouter";

export default function LegalPage({ title }: { title: string }) {
  return <main className="min-h-screen bg-background"><div className="mx-auto max-w-3xl px-6 py-16"><Link href="/" className="text-primary hover:underline">← Back to Befine</Link><h1 className="mt-8 text-4xl font-bold">{title}</h1><p className="mt-6 leading-7 text-muted-foreground">This page describes Befine’s {title.toLowerCase()}. Before public launch, have your legal adviser replace this project placeholder with the approved policy for your organization and jurisdiction.</p><p className="mt-4 leading-7 text-muted-foreground">For questions, contact the Befine care team through the consultation form on the home page.</p></div></main>;
}
