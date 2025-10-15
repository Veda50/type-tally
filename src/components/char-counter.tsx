"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { computeTextStats } from "@/src/lib/text-stats"
import { WordDensity } from "@/src/components/word-density"

type StatItemProps = {
  label: string
  value: number
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-xs uppercase text-muted-foreground tracking-wide">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-primary tabular-nums">{value}</div>
    </div>
  )
}

export default function CharCounter() {
  const [text, setText] = useState("")

  const stats = useMemo(() => computeTextStats(text), [text])

  return (
    <section aria-labelledby="char-counter-heading">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle id="char-counter-heading" className="text-xl">
            Enter Text
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <label htmlFor="text-input" className="sr-only">
            Text to analyze
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="min-h-48 w-full resize-y rounded-md border bg-background p-4 leading-relaxed outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary"
            aria-describedby="stats-live"
          />

          <div id="stats-live" aria-live="polite" className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
            <StatItem label="Paragraphs" value={stats.paragraphs} />
            <StatItem label="Sentences" value={stats.sentences} />
            <StatItem label="Words" value={stats.words} />
            <StatItem label="Characters" value={stats.characters - stats.spaces} />
            <StatItem label="Spaces" value={stats.spaces} />
          </div>
        </CardContent>
      </Card>

      <WordDensity text={text} className="mt-6" />
    </section>
  )
}
