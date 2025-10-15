export type TextStats = {
  paragraphs: number
  sentences: number
  words: number
  characters: number
  spaces: number
  wordDensity: WordDensityItem[]
}

export type WordDensityItem = {
  token: string
  count: number
  percentage: number
}

function countParagraphs(text: string): number {
  const normalized = text.replace(/\r\n/g, "\n")
  const blocks = normalized
    .split(/\n\s*\n/) // paragraf dipisah oleh 1+ baris kosong
    .map((b) => b.trim())
  const filtered = blocks.filter((b) => b.length > 0)
  if (filtered.length > 0) return filtered.length
  return normalized.trim().length > 0 ? 1 : 0
}

function countSentences(text: string): number {
  // pendekatan sederhana: pisah pada ., !, ?
  const parts = text
    .replace(/\n+/g, " ")
    .split(/[.!?]+/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
  return parts.length
}

function countWords(text: string): number {
  // dukungan unicode (huruf, angka, aksen, tanda hubung/apostrof)
  const matches = text.match(/[\p{L}\p{M}\p{N}]+(?:[-'’][\p{L}\p{M}\p{N}]+)*/gu)
  return matches ? matches.length : 0
}

function countCharacters(text: string): number {
  return text.length
}

function countSpaces(text: string): number {
  // hitung semua whitespace (spasi, tab, newline)
  const matches = text.match(/\s/g)
  return matches ? matches.length : 0
}

export function computeWordDensity(text: string, options?: { minLength?: number }): WordDensityItem[] {
  const minLength = options?.minLength ?? 1
  // use the same tokenization approach as countWords for consistency
  const matches = text.match(/[\p{L}\p{M}\p{N}]+(?:[-'’][\p{L}\p{M}\p{N}]+)*/gu) || []
  const totalWords = matches.length
  if (totalWords === 0) return []

  const freq = new Map<string, number>()
  for (const raw of matches) {
    const token = raw.toLowerCase()
    if (token.length < minLength) continue
    freq.set(token, (freq.get(token) ?? 0) + 1)
  }

  const items: WordDensityItem[] = Array.from(freq.entries()).map(([token, count]) => ({
    token,
    count,
    percentage: (count / totalWords) * 100,
  }))

  // sort by count desc, then token asc for stability
  items.sort((a, b) => b.count - a.count || a.token.localeCompare(b.token))

  return items
}

export function computeTextStats(text: string): TextStats {
  return {
    paragraphs: countParagraphs(text),
    sentences: countSentences(text),
    words: countWords(text),
    characters: countCharacters(text),
    spaces: countSpaces(text),
    wordDensity: computeWordDensity(text),
  }
}
