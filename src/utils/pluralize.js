import pluralize from 'pluralize'

export const convertToPluralize = (word, count, inclusive = false) => {
  if (pluralize.isPlural(word)) {
    word = pluralize.singular(word)
  }

  return pluralize(word, count, inclusive)
}
