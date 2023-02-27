
import { regexEngines as engines } from '../regexEngine-init.mjs'


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
    return currentEngine.match(input, regexes)
  }

  /**
   * Run find & replace on supplied input using the supplied regexes
   *
   * @param {array} input user supplied content (expects an array of
   *               strings)
   * @param {array} regexes array of regex pairs and their config
   *
   * @returns {string} modified version user input
   */
  this.replace = function (input, regexes) {
    return currentEngine.replace(input, regexes)
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
