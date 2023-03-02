
import { regexEngines as engines } from '../regexEngine-init.mjs'

/**
 * Get regexes to use on intput strings
 *
 * Function to pass to Array.Map for current list of regex-pairs
 *
 * @param {object} regex RegexPair object
 * @returns {object}
 */
const getUsableRegexes = (regex) => {
  const output = {
    ok: (regex.regex.error === '' && regex.flags.error === ''),
    regexp: null,
    replace: '',
    error: ''
  }

  if (output.ok === true) {
    output.regexp = new RegExp(regex.regex.pattern, regex.flags.flags);
    output.replace = regex.replace;
  } else {
    let sep = '';
    if (regex.regex.error !== '') {
      output.error = regex.regex.error;
      sep = ' & ';
    }
    if (regex.flags.error !== '') {
      output.error = sep + regex.flags.error;
    }
  }

  return output;
}

const replaceReduce = (output, regex) => {
  return (regex.ok === true)
    ? output.replace(regex.regexp, regex.replace)
    : output;
}


function VanillaJS () {
  this.cleanError = (error) => {
    return error.message.replace(/^SyntaxError: /i, '');
  }

  /**
   * Test if the supplied regex pattern and flags are valid for the
   * this engine
   *
   * @param {array} regex Single regexPair object
   *
   * @return {string} If regex contains an error, error message is
   *               returned. Otherwise empty string is returned.
   */
  this.validate = function (pattern, flags) {
    try {
      const tmp = new RegExp(pattern, flags)
    } catch (error) {
      return this.cleanError(error)
    }
    return ''
  }


  /**
   * Test what the supplied regex is valid for the this engine
   *
   * @param {array} regex Single regexPair object
   *
   * @return {string} If regex contains an error, error message is
   *               returned. Otherwise empty string is returned.
   */
  this.validateRegex = function (regexPair) {
    // const output = {
    //   ok: true,

    //   // error: {
    //   //   message: '',
    //   //   badChar: '',
    //   //   start: '',
    //   //   middle: '',
    //   //   end: ''
    //   // }
    // }
    try {
      tmp = new RegExp(regexPair.regex.pattern, regexPair.flags.flags)
    } catch (error) {
      return this.cleanError(error)
    }
    return ''
  }


  /**
   * Test what the supplied regex is valid for the this engine
   *
   * @param {array} regex Single regexPair object
   *
   * @return {string} If regex contains an error, error message is
   *               returned. Otherwise empty string is returned.
   */
  this.validateFlags = function (regexPair) {
    // const output = {
    //   ok: true,

    //   // error: {
    //   //   message: '',
    //   //   badChar: '',
    //   //   start: '',
    //   //   middle: '',
    //   //   end: ''
    //   // }
    // }
    try {
      tmp = new RegExp(regexPair.regex.pattern, regexPair.flags.flags)
    } catch (error) {
      return this.cleanError(error)
    }
    return ''
  }


  /**
   * Test what the supplied regex is valid for the this engine
   *
   * @param {array} regex Single regexPair object
   *
   * @return {string} If regex contains an error, error message is
   *               returned. Otherwise empty string is returned.
   */
  this.validateDelims = function (regexPair) {
    return ''
  }

  /**
   * Test what the supplied regexes match from the supplied input
   *
   * @param {array} input user supplied content (expects an array of
   *               strings)
   * @param {array} regexes array of regex pairs and their config
   *
   * @returns {array} modified version user input
   */
  this.match = function (input, regexes) {
    console.group('VanillaJS.match()')
    console.log('input:', input);
    console.log('regexes:', regexes)
    console.groupEnd()
    return [];
  }

  /**
   * Run find & replace on supplied input using the supplied regexes
   *
   * @param {string[]} input user supplied content (expects an array of
   *               strings)
   * @param {array} regexes array of regex pairs and their config
   *
   * @returns {string[]} modified version user input
   */
  this.replace = function (input, regexes) {
    // group('VanillaJS().replace()')

    const regExps = regexes.map(getUsableRegexes);
    // console.log('input:', input);
    // console.log('output:', input.map(str => regExps.reduce(replaceReduce, str)))
    // console.groupEnd();
    return input.map(str => regExps.reduce(replaceReduce, str))
  }
}

engines.register({
  id: 'VanillaJS',
  name: 'Vanilla JS RegExp',
  description: 'Built in Browser ECMA Script RegExp functionality',
  engine: new VanillaJS(),
  flags: {
    allow: true,
    default: 'ig'
  },
  delimiters: {
    allow: false,
    open: '',
    close: ''
  },
  chaining: {
    allow: true,
    default: true
  },
  remote: false,
  docsURL: '',
  allowMultiLine: false
})
