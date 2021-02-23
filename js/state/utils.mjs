
/**
 * Get a unique ID for each regex pair
 *
 * ID is the last nine digits of JS timestamp prefixed with the
 * letter "R"
 *
 * NOTE: The number just short of 1 billion milliseconds
 *       or rougly equivalent to 11.5 days
 *
 * @returns {string}
 */
export const getID = () => {
  let basicID = 0
  // slowPoke()
  basicID = Date.now()
  basicID = basicID.toString()
  return 'R' + basicID.substr(-9)
}

export const ucFirst = (input) => {
  const first = input.substr(0, 1)
  return first.toUpperCase() + input.substr(1)
}

export const idSafe = (input) => {
  return input.replace(/[^a-z0-9_-]/ig, '')
}

const escapeChars = [
  { find: /\\n/g, replace: '\n' },
  { find: /\\r/g, replace: '\r' },
  { find: /\\t/g, replace: '\t' }
]

/**
 * Convert escaped white space characters to their normal characters
 *
 * @param {string} input Input with escape sequences
 *
 * @returns {string} Output with escape sequences converted to their normal characters
 */
export const convertEscaped = (input) => {
  let output = input
  for (let a = 0; a < escapeChars.length; a += 1) {
    output = output.replace(escapeChars[a].find, escapeChars.replace)
  }
  return output
}
