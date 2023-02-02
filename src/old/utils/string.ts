function pluralize(count: number, word: string): string
function pluralize(count: number, singular: string, plural: string): string
function pluralize(count: number, wordOrSingular: string, plural?: string): string {
  if (!plural) {
    return wordOrSingular + (count === 1 ? '' : 's')
  }

  return count === 1 ? wordOrSingular : plural
}

export { pluralize }
