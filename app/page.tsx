import { FiType } from "react-icons/fi"
import CharCounter from "@/src/components/char-counter"

export default function Page() {
  return (
    <main className="min-h-dvh bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-3xl px-4 py-8 flex items-start gap-4">
          <div
            aria-hidden="true"
            className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground"
          >
            <FiType className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-foreground text-balance">TypeTally — Real‑Time Text Stats</h1>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              A clean, modern character counter utility. Instantly measure paragraphs, sentences, words, characters, and
              spaces as you type. Open Word Density to analyze frequency and percentages on demand.
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-8">
        <CharCounter />
      </section>

      <footer className="border-t">
        <div className="mx-auto max-w-3xl px-4 py-6 text-sm text-muted-foreground">
          Built by{" "}
          <a
            href="https://vedabe.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent hover:underline"
          >
            Veda Bezaleel
          </a>
          .
        </div>
      </footer>
    </main>
  )
}
