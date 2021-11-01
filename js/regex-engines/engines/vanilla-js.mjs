
import { regexEngines as engines } from '../regexEngine-init.mjs'


function VanillaJS () {


  /**
   * Test what the supplied regex is valid for the this engine
   *
   * @param {array} regex Single regexPair object
   *
   * @return {string} If regex contains an error, error message is
   *               returned. Otherwise empty string is returned.
   */
  this.validate = function (regexPair) {
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
      return error.message
    }
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

engines.register()
