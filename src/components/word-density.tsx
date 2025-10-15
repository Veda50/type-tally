"use client"

import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Card, CardContent } from "@/components/ui/card"
import { computeWordDensity } from "@/src/lib/text-stats"
import { cn } from "@/lib/utils"

import { useEffect, useMemo, useState } from "react"

type DensityRow = { token: string; count: number; percentage: number }

export function WordDensity({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 5

  // Auto-close whenever text changes; reset view state
  useEffect(() => {
    setOpen(false)
    setShowAll(false)
    setPage(1)
  }, [text]) // auto-collapse to avoid heavy analysis during typing

  // Lazy compute — only analyze when opened
  const rows: DensityRow[] = useMemo(() => {
    if (!open) return []
    return computeWordDensity(text, { minLength: 1 })
  }, [open, text])

  const totalPages = useMemo(() => {
    if (rows.length === 0) return 1
    return Math.max(1, Math.ceil(rows.length / pageSize))
  }, [rows.length])

  const pagedRows = useMemo(() => {
    if (showAll) return rows
    const start = (page - 1) * pageSize
    return rows.slice(start, start + pageSize)
  }, [rows, showAll, page])

  const startRank = useMemo(() => (showAll ? 1 : (page - 1) * pageSize + 1), [showAll, page])
  const endRank = useMemo(
    () => (showAll ? rows.length : Math.min(page * pageSize, rows.length)),
    [showAll, page, rows.length],
  )

  return (
    <Card
      className={`shadow-lg border-0 bg-white/80 backdrop-blur-sm ${className || ""}`}
      aria-labelledby="density-heading"
    >
      <CardContent className="p-6">
        <Collapsible open={open} className="w-full">
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              aria-expanded={open}
              aria-controls="density-content"
              onClick={() => {
                setOpen((prev) => {
                  const next = !prev
                  if (!next) {
                    setShowAll(false)
                    setPage(1)
                  }
                  return next
                })
              }}
              className="w-full justify-between rounded-lg px-4 py-3 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <span id="density-heading" className="font-medium">
                Word Density
              </span>
              <span
                aria-hidden="true"
                className={`i-lucide-chevron-down h-4 w-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
              />
            </Button>

            <CollapsibleContent id="density-content" className="space-y-4">
              {rows.length === 0 ? (
                <p className="text-sm text-muted-foreground">No words to analyze.</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Viewing {startRank}–{endRank} of {rows.length}
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        role="group"
                        aria-label="Pagination"
                        aria-hidden={showAll}
                        className={cn(
                          "inline-flex rounded-md border overflow-hidden transition-opacity",
                          showAll && "opacity-0 pointer-events-none",
                        )}
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page <= 1 || showAll}
                          className={cn(
                            "rounded-none transition-colors hover:bg-blue-50 focus-visible:ring-blue-600",
                            (page <= 1 || showAll) && "opacity-50",
                          )}
                        >
                          Prev
                        </Button>
                        <span className="px-2 py-1.5 text-sm text-muted-foreground bg-background border-l border-r">
                          Page {page} / {totalPages}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page >= totalPages || showAll}
                          className={cn(
                            "rounded-none -ml-px transition-colors hover:bg-blue-50 focus-visible:ring-blue-600",
                            (page >= totalPages || showAll) && "opacity-50",
                          )}
                        >
                          Next
                        </Button>
                      </div>

                      <div
                        role="group"
                        aria-label="View mode"
                        className="inline-flex rounded-md border overflow-hidden"
                      >
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setShowAll(false)
                            setPage(1)
                          }}
                          className={cn(
                            "rounded-none transition-colors",
                            !showAll
                              ? "bg-blue-600 text-white hover:bg-blue-600"
                              : "bg-background text-foreground hover:bg-background",
                          )}
                        >
                          Paginated
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowAll(true)}
                          className={cn(
                            "rounded-none -ml-px transition-colors",
                            showAll
                              ? "bg-blue-600 text-white hover:bg-blue-600"
                              : "bg-background text-foreground hover:bg-background",
                          )}
                        >
                          Show all
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {pagedRows.map((r, idx) => {
                      const rank = startRank + idx
                      return (
                        <div
                          key={`${r.token}-${rank}`}
                          className="flex items-center justify-between rounded-md border p-3"
                          role="group"
                          aria-label={`Rank ${rank}, ${r.token}, ${r.count} times, ${r.percentage.toFixed(2)} percent`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-medium">
                              {rank}
                            </span>
                            <span className="font-medium">{r.token}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="tabular-nums">{r.count}×</span>
                            <span className="tabular-nums">{r.percentage.toFixed(2)}%</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CollapsibleContent>
          </div>
        </Collapsible>
      </CardContent>
    </Card>
  )
}

export default WordDensity
