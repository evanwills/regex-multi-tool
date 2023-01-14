/* jslint browser: true */
/* global btoa */

// other global functions available:
//   invalidString, invalidStrNum, invalidNum, invalidArray, makeAttributeSafe, isFunction

import { multiLitRegexReplace } from '../repeatable-utils.mjs'
import { repeatable as doStuff } from '../repeatable-init.mjs'
import {
  isBoolTrue,
  // isInt,
  isNumeric
} from '../../utilities/validation.mjs'
import {
  camel2human,
  // makeHumanReadableAttr,
  makeSingle,
  padStrLeft,
  snakeToCamelCase,
  ucFirst
} from '../../utilities/sanitise.mjs'
import { strPad } from '../../utilities/general.mjs'

/**
 * getVarsToFileName() makes a GET variable string usable as a
 * file name
 *
 * created by: Evan Wills
 * created: 2019-11-29
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function getVarsToFileName (input, extraInputs, GETvars) {
  let output = input.replace(/^.*?\?/g, '')
  output = output.replace(/&/g, '_')
  output = output.replace(/=/g, '-')
  return output
}

doStuff.register({
  id: 'getVarsToFileName',
  func: getVarsToFileName,
  group: 'even',
  ignore: false,
  name: 'Convert GET variable string to file name string'
  // description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
})

function extractURLs (input, extraInputs, GETvars) {
  const regex = /('|"|\()(https?:\/\/.*?((?:[^."'/]+\.)+(js|css|svg|eot|woff2|woff|ttf|png|jpe?g|gif|ico)))(?:'|"|\))/g
  let matches
  // let URLs = []
  let output = ''
  let dir = ''
  let sep = ''

  matches = regex.exec(input)

  while (Array.isArray(matches)) {
    // URLs.push(matches[2])
    switch (matches[4].toLowerCase()) {
      case 'css':
      case 'js':
        dir = matches[4]
        break
      case 'eot':
      case 'woff2':
      case 'woff':
      case 'ttf':
        dir = 'fonts'
        break
      default:
        dir = 'img'
    }
    output += sep + matches[2] + '\n\t..\\' + dir + '\\' + matches[3]
    sep = '\n\n'
    matches = regex.exec(input)
  }

  return output
}

doStuff.register({
  id: 'extractURLs',
  func: extractURLs,
  group: 'evan',
  ignore: false,
  name: 'Extract all the URLs in a string'
  // description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
})

/**
 * fixDS() Fix Data Source keywords
 * file name
 *
 * created by: Evan Wills
 * created: 2019-11-29
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function fixDS (input, extraInputs, GETvars) {
  let output = ''

  const replaceCallback = (match0, match1) => {
    return '%ds__' + match1.toLowerCase() + '^trim^json_encode'
  }
  output = input.replace(/%ds_+([^^%]+)(?:\^[^%]+)*(?=%)/g, replaceCallback)

  return output.replace(/^/g, '  ')
}

doStuff.register({
  id: 'fixDS',
  func: fixDS,
  group: 'evan',
  ignore: false,
  name: 'Fix Data Source keywords'
  // description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
})

/**
 * stringToConstFormat() Make string usable as a constant name (UPPER_CASE)
 *
 * created by: Evan Wills
 * created: 2019-11-29
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function stringToConstFormat (input, extraInputs, GETvars) {
  let output = input.replace(/[^0-9a-z]+/ig, '_')
  output = output.replace(/_(?=[st]_)/ig, '')

  return output.toUpperCase()
}

doStuff.register({
  id: 'stringToConstFormat',
  func: stringToConstFormat,
  group: 'evan',
  ignore: false,
  name: 'Make string usable as a constant identifier'
  // description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
})

/**
 * formAdminLocalURLs() Make string usable as a constant name (UPPER_CASE)
 *
 * created by: Evan Wills
 * created: 2019-11-29
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function formAdminLocalURLs (input, extraInputs, GETvars) {
  const findReplace = [{
    find: /https:\/\/apps\.acu\.edu\.au\/~trevorg\/form_admin/g,
    replace: 'html'
  }, {
    find: /((?:href|src)=")(?=(?:style|js)\/)/g,
    replace: '$1html/'
  }, {
    find: /((?:href|src)=")\.\.\/acustaff(?=\/ckeditor)/g,
    replace: '$1html/js'
  }]

  return multiLitRegexReplace(input, findReplace)
}

doStuff.register({
  id: 'formAdminLocalURLs',
  func: formAdminLocalURLs,
  ignore: false,
  group: 'evan',
  name: 'Make form admin URLs local'
  // description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
})

/**
 * buildAcroSQL() Generate an SQL statement for inserting SA Main
 * acronyms into form_build
 *
 * created by: Evan Wills
 * created: 2020-03-02
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function buildAcroSQL (input, extraInputs, GETvars) {
  const findReplace = [{
    find: /^SA ID\t(?:[^\t]*\t+){6}Sitecore URL[\r\n]+/ig,
    replace: ''
  }, {
    find: /(?:^|[\r\n])[0-9]+\t[0-9]+\t([a-z0-9]+)\t(?:[^\t]*\t+){5}(https:\/\/.*?)(?=[\r\n]|$)/ig,
    replace: '\n(\'$1\', \'$2\'),'
  }, {
    find: /,$/,
    replace: ';'
  }]

  return 'INSERT INTO `form_acro` ( `acro`, `acro_url` ) VALUES' +
          multiLitRegexReplace(input.trim(), findReplace).trim()
}

doStuff.register({
  id: 'buildAcroSQL',
  func: buildAcroSQL,
  group: 'evan',
  ignore: true,
  name: 'SQL for inserting SA Main acros into form_build'
  // description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
})

/**
 * Use to reliably rewrite some PHP code after an API change.
 *
 * created by: Evan Wills
 * created: 2020-03-02
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function fixSet (input, extraInputs, GETvars) {
  const replaceCallback = (whole, func, value, prop, key1a, key1b, key2a, key2b) => {
    key2a = (typeof key2a === 'undefined') ? '' : key2a
    key2b = (typeof key2b === 'undefined') ? '' : key2b

    return '$config->' + func + "('" + prop.toLowerCase() + key1a.toUpperCase() + key1b + key2a.toUpperCase() + key2b + "', " + value
  }

  return input.replace(
    /(?:RegexAPI::|\$config->)(set)Config\(([^,]+)(?:,\s+'([a-z]+)')?(?:,\s+'([a-z])([a-z]+)')?(?:,\s+'([a-z])([a-z]+)')?(?=\);)/ig,
    replaceCallback
  )
}

doStuff.register({
  id: 'fixSet',
  func: fixSet,
  group: 'evan',
  ignore: true,
  name: 'Fix config set order'
  // description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
})

// ====================================================================
// START: Animal Crossing 1

/**
 * animalCrossing1() Rewrite Animal Crossing price list table
 *
 * created by: Evan Wills
 * created: 2020-07-07
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function animalCrossing1 (input, extraInputs, GETvars) {
  const replace = (whole, pos, name, scarcity, size, price, location, northern, southern, time) => {
    location = location.replace(/\s+/g, ' ')

    return name + '\t' + price + '\t' + scarcity + '\t' + location + '\t' + size + '\t' + time + '\t' + southern + '\t' + northern
  }

  return input.replace(
    /No. ([0-9]+)(.*?)\s+\(([^)]+)\)"\t([^\t]+)\t([0-9]+)\t([^\t]+)\t"N: (.*?)\s+S:\s+(.*?)(All (?:Day|night)|[0-9]+[ap]m ~ [0-9]+[ap]m)"\t"[^"]+"/ig,
    replace
  )
}

doStuff.register({
  id: 'animalCrossing1',
  func: animalCrossing1,
  description: 'Rewrite Animal Crossing price list table',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: true,
  name: 'Animal Crossing 1'
})

//  END:  Animal Crossing 1
// ====================================================================
// START: Clean CSS

/**
 *
 *
 * created by: Evan Wills
 * created: 2020-08-04
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
function CSSclean (input, extraInputs, GETvars) {
  return input.replace(
    /(.key-val-2-col--[0-9]+)(>)(dt:nth-of-type\([0-9]+\) {)\s+(order: [0-9]+)\+s(?=\})/igs,
    '$1 $2; '
  )
}

doStuff.register({
  id: 'CSSclean',
  func: CSSclean,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false,
  name: 'CSS Clean'
})

//  END: Clean CSS
// ====================================================================
// START: Calculate Artbot Motor Speeds

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const artBotSpeeds = (input, extraInputs, GETvars) => {
  const ratio = extraInputs.ratio() * 1
  const swap = extraInputs.swap('true')
  const baseSpeed = extraInputs.baseSpeed() * 1
  const maxSpeed = extraInputs.maxSpeed() * 1
  const _backwards = (ratio < 0)
  const _primes = [
    '1', '2', '3', '5', '7', '11',
    '13', '17', '19', '23', '29', '31',
    '37', '41', '43', '47', '53', '59',
    '61', '67', '71', '73', '79', '83',
    '89', '97'
  ]
  const _okNonPrimes = {
    4: ['2'],
    6: ['2', '3'],
    9: ['3'],
    10: ['2', '5'],
    14: ['2', '7'],
    15: ['3', '5'],
    21: ['3', '7'],
    22: ['2', '11'],
    25: ['5'],
    26: ['2', '13'],
    33: ['3', '11'],
    34: ['2', '17'],
    35: ['5', '7'],
    38: ['2', '19'],
    39: ['3', '13'],
    46: ['2', '23'],
    49: ['7'],
    51: ['3', '17'],
    55: ['5', '11'],
    57: ['3', '19'],
    58: ['2', '29'],
    62: ['2', '31'],
    65: ['5', '13'],
    69: ['3', '23'],
    74: ['2', '37'],
    77: ['7', '11'],
    82: ['2', '41'],
    85: ['5', '17'],
    86: ['2', '43'],
    87: ['3', '29'],
    91: ['7', '13'],
    93: ['3', '31'],
    94: ['2', '47'],
    95: ['5', '19']
  }

  /**
   * Get the nearest viable value to the one supplied
   *
   * @param {string} input Number whose closest viable number is to
   *                       be returned
   * @param {number} prox  relative proximity to input
   */
  const getNearest = (input, prox) => {
    const _prox = (typeof prox === 'number') ? prox : 0
    let _tmp = 0

    if (_prox === 0) {
      if (_primes.indexOf(input) > -1) {
        return {
          val: input,
          isPrime: true,
          factors: []
        }
      }
      if (typeof _okNonPrimes[input] !== 'undefined') {
        return {
          val: input,
          isPrime: false,
          factors: _okNonPrimes[input]
        }
      }
    } else {
      // adjacent prime
      _tmp = input + _prox
      _tmp = _tmp.toString()
      if (_primes.indexOf(_tmp) > -1) {
        return {
          val: _tmp,
          isPrime: true,
          factors: []
        }
      }

      // adjacent prime
      _tmp = input - _prox
      _tmp = _tmp.toString()
      if (_primes.indexOf(_tmp) > -1) {
        return {
          val: _tmp,
          isPrime: true,
          factors: []
        }
      }

      // adjacent OK non-prime
      _tmp = input + _prox
      _tmp = _tmp.toString()
      if (typeof _okNonPrimes[_tmp] !== 'undefined') {
        return {
          val: _tmp,
          isPrime: false,
          factors: _okNonPrimes[_tmp]
        }
      }

      // adjacent OK non-prime
      _tmp = input - _prox
      _tmp = _tmp.toString()
      if (typeof _okNonPrimes[_tmp] !== 'undefined') {
        return {
          val: _tmp,
          isPrime: false,
          factors: _okNonPrimes[_tmp]
        }
      }
    }

    return getNearest(input, _prox + 1)
  }

  /**
   *
   * @param {string} inputA Initial value for left motor speed
   * @param {string} inputB Initial value for right motor speed
   */
  const noSharedFactors = (inputA, inputB) => {
    const _inputA = getNearest(inputA)

    if (_inputA.isPrime) {
      return {
        left: _inputA.val,
        right: inputB
      }
    }

    const _inputB = getNearest(inputB)
    if (_inputB.isPrime) {
      return {
        left: inputA,
        right: _inputB.val
      }
    }

    if (_inputA.factors.indexOf(_inputB.val) > -1 || _inputB.factors.indexOf(_inputA.val) > -1) {
      // One of the values is a factor of the other
      // Just give up
      return false
    } else {
      const _primary = (_inputA.factors.length > _inputB.factors.length)
        ? _inputA
        : _inputB
      const _secondary = (_inputA.factors.length < _inputB.factors.length)
        ? _inputB
        : _inputA

      for (let a = 0; a < _primary.factors.length; a += 1) {
        if (_secondary.factors.indexOf(_primary.factors[a]) > -1) {
          return false
        }
      }

      return {
        left: _inputA.val,
        right: _inputB.val
      }
    }
  }

  /**
   * Undocumented function
   *
   * @param float   ratio     decimal (up to 5 decimal places) between -1 and 1
   * @param boolean swap      swap the values for the wheels
   * @param integer baseSpeed The base speed of the motors of ratio = 0
   *
   * @return array
   */
  const getMotorSpeeds = (_ratio_, _swap, _baseSpeed, _topSpeed) => {
    const _totalSpeed = _baseSpeed * 2
    const _maxSpeed = (typeof _topSpeed !== 'number' || _topSpeed > 100 || _topSpeed < -100) ? 100 : _topSpeed
    let _output = { left: baseSpeed, right: baseSpeed }

    let _ratio = (_backwards) ? -_ratio_ : _ratio_
    let _left = _baseSpeed
    let _right = _baseSpeed

    _ratio = (_ratio > 1) ? 1 / _ratio : _ratio
    _ratio = 1 - _ratio

    _left = _baseSpeed * _ratio
    _right = _totalSpeed - _left
    _output.left = _left
    _output.right = _right

    if (_right > _maxSpeed) {
      _right = Math.round(_right)
      if (_right > 100) {
        // debug('going into recursion', _left, _right);
        _output = getMotorSpeeds(
          ratio,
          swap,
          (baseSpeed - ((_right - _maxSpeed) / 2))
        )
      }
    }

    return noSharedFactors(
      Math.round(_output.left),
      Math.round(_output.right)
    )
  }

  let output = getMotorSpeeds(ratio, swap, baseSpeed, maxSpeed)
  if (output === false) {
    // OK output is DUD, maybe if we adjust the baseSpeed, we can get something w
    for (let a = 0; a < 20; a += 1) {
      if ((baseSpeed + a) > maxSpeed) {
        break
      }

      output = getMotorSpeeds(ratio, swap, (baseSpeed + a), maxSpeed)
      if (output !== false) {
        break
      } else {
        output = getMotorSpeeds(ratio, swap, (baseSpeed - a), maxSpeed)
        if (output !== false) {
          break
        }
      }
    }
  }

  if (output !== false) {
    let tmp

    if (swap) {
      tmp = output.left
      output.left = output.right
      output.right = tmp
    }

    if (_backwards) {
      output.left = -output.left
    }

    return ' Left: ' + output.left + '\nRight: ' + output.right
  } else {
    return 'Could not get usable motor speeds'
  }
}

doStuff.register({
  id: 'artBotSpeeds',
  func: artBotSpeeds,
  description: '',
  // docsURL: '',
  extraInputs: [{
    id: 'ratio',
    type: 'number',
    label: 'Ratio as decimal',
    default: 0.236498,
    min: -2,
    max: 2,
    step: 0.000001
  }, {
    id: 'swap',
    type: 'checkbox',
    label: 'swap',
    options: [
      {
        value: 'true',
        label: 'Swap values for motors'
      }
    ]
  }, {
    id: 'baseSpeed',
    type: 'number',
    label: 'base speed of the motors at a ratio of 0',
    default: 50,
    min: -100,
    max: 100
  }, {
    id: 'maxSpeed',
    type: 'number',
    label: 'Maximum allowable speed of the motors',
    default: 80,
    min: -100,
    max: 100
  }],
  group: 'evan',
  ignore: true,
  name: 'Calculate Artbot Motor Speeds'
})

// ====================================================================
// START: ACUSIS queries

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const acusysQueries = (input, extraInputs, GETvars) => {
  const _invoices = input.split('\n')
  let _in = ''
  let _sep = ''
  for (let a = 0; a < _invoices.length; a += 1) {
    _in += _sep + '\n      \'' + _invoices[a].trim() + '\''
    _sep = ','
  }

  return `
-- ====================================================
-- RUN BOTH THESE QUERIES IN ORDER EVERY TIME
-- (It saves you having to run them separately each time)

-- ==========================
-- Revert previous (below) change before re-running the update

UPDATE acu_project_invoice
SET    datesenttofinanace = null
WHERE  status = 'Approved'
AND    CAST(datesenttofinanace AS DATE) = CAST(GETDATE() AS DATE)
AND    invoiceno IN (
        -- - - - - - - - - - - - - - - - - - - - -
        -- Below are all the invoice IDs to be checked
        --
        -- These IDs do not need to be changed/commented
${_in}
);


-- ==========================
-- Make change

UPDATE acu_project_invoice
SET    datesenttofinanace = getdate()
WHERE  status = 'Approved'
AND    datesenttofinanace is null
AND    invoiceno IN (
        -- - - - - - - - - - - - - - - - - - - - -
        -- Below here should go all the invoice IDs to be checked
        -- (Use the same list as above)
        --
        -- Comment all of the below out (one by one)
        --
        -- Step 1:  Comment out the first ID
        -- Step 2:  Run the both SQL Queries
        -- Step 3:  Test the batch
        --          https://acusis.acu.edu.au/ACUSIS/ACUdefault/Enhancement/ProjectProcurement/Send_finance_email.aspx
        -- Step 4a: If the batch failed add a commnet after the
        --          failing ID to identify it as bad and uncomment
        --          it.
        -- Step 5b: If the batch succeeded, leave it the ID commented
        --          out
        -- Step 6:  Repeat steps 1 - 5 until all bad IDs have been
        --          identified for each subsequent ID
        --
        -- NOTE: You do not need to comment out any of the IDs in the
        --       last SQL Statement
        --       These are ignored if their datSsenTtoFinanace is NULL
        -- - - - - - - - - - - - - - - - - - - - -
${_in}
);`
}

doStuff.register({
  id: 'acusysQueries',
  func: acusysQueries,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false,
  name: 'ACUSIS queries'
})

//  END: ACUSIS queries
// ====================================================================
// START: ACU Form Build email hash search

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const emailHashSearch = (input, extraInputs, GETvars) => {
  const rows = input.split('\n')
  const IDs = []
  let IDstring = ''
  let sep = ''
  let output = ''

  for (let a = 0; a < rows.length; a += 1) {
    if (rows[a].trim() !== '') {
      const row = rows[a].split('\t')

      if (row[1].trim() !== '') {
        const ref = row[1].split('_')
        // const acro = ref[0].trim()
        const id = ref[1].trim()

        // console.log('acro:', acro)
        // console.log('id:', id)
        IDs.push(id)
        IDstring += sep + id
        sep = ', '
      }
    }
  }

  output = `\n-- Total rows: ${IDs.length}\n\nSELECT COUNT(*)\nFROM \`email_hash\`\nWHERE \`user_id\` IN ( ${IDstring} );`

  return output
}

doStuff.register({
  id: 'emailHashSearch',
  func: emailHashSearch,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false,
  name: 'ACU Form Build email hash search'
})

//  END: ACU Form Build email hash search
// ====================================================================
// START: (GIT) Fix bad ACU.Sitecore merge

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const fixBadSitecoreMerge = (input, extraInputs, GETvars) => {
  const lines = input.split('\n')
  const thisURL = 'file:///C:/Users/evwills/Documents/Evan/code/do-JS-regex-stuff/do-JS-regex-stuff.html?groups=it,evan&action=fixbadsitecoremerge'
  let uncommitted = false
  let untracked = false
  let line = ''
  let output = ''
  let file = ''
  let checkoutFiles = ''
  let rmFiles = ''
  let rmDirs = ''
  let sepCO = ' '
  let sepRMD = ' '
  let sepRMF = ' '

  for (let a = 0; a < lines.length; a += 1) {
    line = lines[a].trim()

    if (line === '' || line.substring(line.length - 3) === '.sh' || line.substring(0, 9) === 'On branch' || line.substring(0, 1) === '(' || line.substring(0, 10) === 'no changes' || line.substring(0, 33) === 'src/Project/ACUPublic/ACU.Static/') {
      console.log('Skipping line:', line)
      continue
    }

    if (line === 'Changes not staged for commit:') {
      uncommitted = true
      untracked = false
      // output += '\n# -----------------------\necho "Undoing merge"\n\n'
      continue
    }
    if (line === 'Untracked files:') {
      uncommitted = false
      untracked = true
      // output += '\n# -----------------------\necho "Removing untracked files"\n\n'
      continue
    }

    if (uncommitted === true) {
      file = line.replace(/^(?:deleted|modified):[\\t ]*/, '')
      // console.log('file:', file)
      // console.log('line:', line)

      if (file !== line) {
        checkoutFiles += sepCO + '"' + file + '"'
        sepCO = '\\\n\t'
      }
    } else if (untracked === true) {
      if (line.substring(line.length - 1) === '/') {
        rmDirs += sepRMD + '"' + line + '"'
        sepRMD = '\\\n\t'
      } else {
        rmFiles += sepRMF + '"' + line + '"'
        sepRMF = '\\\n\t'
      }
    }
  }

  if (checkoutFiles !== '') {
    output += '\n\n\n# -----------------------\n\necho "Files to be reset";\n\ngit checkout' + checkoutFiles + ';\n\ngit reset' + checkoutFiles + ';'
  }
  if (rmFiles !== '') {
    output += '\n\n\n# -----------------------\n\necho "Files to be deleted";\n\nrm' + rmFiles + ';'
  }
  if (rmDirs !== '') {
    output += '\n\n\n# -----------------------\n\necho "Directories to be deleted";\n\nrm -rf' + rmDirs + ';'
  }

  if (output !== '') {
    output = '#!/bin/sh\n\n// ' + thisURL + '\n\n' + output + '\n\n\ngit status;\n\n// ' + thisURL + '\n\n'
  } else {
    output = input
  }

  return output
}

doStuff.register({
  id: 'fixBadSitecoreMerge',
  func: fixBadSitecoreMerge,
  description: 'Copy the entire output of <code>$ git status;</code> and paste it below',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false,
  name: 'GIT: Fix bad ACU.Sitecore merge'
})

//  END: (GIT) Fix bad ACU.Sitecore merge
// ====================================================================
// START: Accept all origin changes

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const acceptChanges = (input, extraInputs, GETvars) => {
  const lines = input.split('\n')
  const doCheckout = extraInputs.add('checkout')
  const thisURL = 'file:///C:/Users/evwills/Documents/Evan/code/do-JS-regex-stuff/do-JS-regex-stuff.html?groups=it,evan&action=acceptChanges'
  let line = ''
  let output = ''
  let oursTheirs = extraInputs.oursTheirs()
  const doAdd = extraInputs.add('add')

  oursTheirs = (typeof oursTheirs === 'string') ? oursTheirs : 'theirs'
  // console.log('lines:', lines)
  // console.log('lines.length:', lines.length)
  // console.log('oursTheirs:', oursTheirs)

  for (let a = 0; a < lines.length; a += 1) {
    // console.log('lines[' + a + ']:', lines[a])
    line = lines[a].trim()
    // console.log('line:', line)
    if (line.substring(0, 14) === 'both modified:') {
      line = line.replace(/^both modified:\s+/, '')
      // console.log('line:', line)

      if (line !== '') {
        if (doCheckout === true) {
          output += '\ngit checkout --' + oursTheirs + ' "' + line + '";\n'
        }
        if (doAdd === true) {
          output += 'git add "' + line + '";\n'
        }
        // console.log('output:', output)
      }
    }

    // if (line !== '') {
    //   console.log('output:', output)
    // }
  }

  if (output !== '') {
    output = '#!/bin/sh\n\n# ' + thisURL + '\n\n' + output + '\n\n\ngit status;\n'
  }

  return output
}

doStuff.register({
  id: 'acceptChanges',
  func: acceptChanges,
  description: '',
  // docsURL: '',
  extraInputs: [{
    id: 'oursTheirs',
    label: 'Mine or theirs?',
    type: 'radio',
    options: [{
      value: 'ours',
      label: 'Mine'
    }, {
      value: 'theirs',
      label: 'Theirs',
      default: true
    }]
  }, {
    id: 'add',
    label: 'Git commands',
    type: 'checkbox',
    options: [{
      value: 'checkout',
      label: 'Do `git checkout`',
      default: true
    }, {
      value: 'add',
      label: 'Do `git add`',
      default: true
    }]
  }],
  group: 'evan',
  ignore: false,
  name: 'GIT: Accept merge changes'
})

//  END: DUMMY action
// ====================================================================
// START: side-accordion IDs

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const sideAccordionIDs = (input, extraInputs, GETvars) => {
  const regex = new RegExp(
    '(@if \\(!string\\.IsNullOrEmpty\\(Model(?:\\.(?:DataItemModel|StudentType))?\\.' +
    '([^)]+)' +
    '\\)\\)\\s+\\{\\s+<div class="side-accordion")(?=>)',
    'gi'
  )

  const replaceFunc = (whole, ifPart, varPart) => {
    // console.log('whole:', whole)
    // console.log('ifPart:', ifPart)
    // console.log('varPart:', varPart)
    let _varPart = varPart.replace(/[^a-zA-Z]+/ig, '-')
    _varPart = _varPart.replace(/([a-z])(?=[A-Z])/g, '$1-')
    return ifPart + ' id="' + _varPart.toLowerCase() + '"'
  }

  // console.log('regex:', regex)

  return input.replace(regex, replaceFunc)
}

doStuff.register({
  id: 'sideAccordionIDs',
  func: sideAccordionIDs,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false,
  name: 'Side Accordion IDs'
})

//  END: side-accordion IDs
// ====================================================================
// START: Bash path to Windows path

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const bash2windows = (input, extraInputs, GETvars) => {
  const prefix = {
    bash: '/c/ACU.Sitecore/Website/',
    win: 'C:\\ACU.Sitecore\\Website\\'
  }
  const whichWay = extraInputs.whichWay()
  let output = ''

  input = input.trim()

  const forwardBack = (_input) => {
    const _output = _input.replace(
      /^\/([a-z])(?=\/)/i,
      (whole, part) => {
        return part.toUpperCase() + ':'
      }
    )
    return _output.replace(/\//g, '\\')
  }
  const backForward = (_input) => {
    const _output = _input.replace(
      /^([a-z]):(?=\\)/i,
      (whole, part) => {
        return '/' + part.toLowerCase()
      }
    )
    return _output.replace(/\\/g, '/')
  }

  if (whichWay === 'win2bash') {
    output = backForward(input)
    // console.log('input:', input)
    // console.log('input.substring(1, 2):', input.substring(1, 2))
    if (input.substring(1, 2) === ':') {
      output = prefix.bash + output
    }
  } else {
    output = forwardBack(input)
    if (input.substring(0, 1) === '/') {
      output = prefix.win + output
    }
  }

  return output
}

doStuff.register({
  id: 'bash2windows',
  func: bash2windows,
  description: '',
  // docsURL: '',
  extraInputs: [
    {
      id: 'whichWay',
      label: 'Which way to convert',
      type: 'radio',
      options: [
        { value: 'bash2win', label: 'Bash path to Windows path', default: true },
        { value: 'win2bash', label: 'Windows to Bash' }
      ]
    }],
  group: 'evan',
  ignore: false,
  name: 'Bash path to Windows path'
})

//  END: Bash path to Windows path
// ====================================================================
// START: Fix time in teams chat history

/**
 * Convert dumb Teams US timestamp to ISO8601 timestamp
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const fixTime = (input, extraInputs, GETvars) => {
  const today = new Date()
  const nowYear = today.getFullYear()

  const zeroPrefix = (val) => {
    if (val.length == 1) { // eslint-disable-line
      return '0' + val
    }
    return val
  }
  const rewriteTime = (whole, month, day, year, hour, minute, half) => {
    const _plus = (half.toUpperCase() === 'PM') ? 12 : 0
    const _year = (typeof year === 'string') ? year : nowYear
    const _hour = (hour * 1)

    return '\n[' + _year + '-' + zeroPrefix(month) + '-' + zeroPrefix(day) + ' ' + zeroPrefix(_hour + _plus) + ':' + minute + ']'
  }

  return input.replace(
    /\[([0-9]{1,2})\/([0-9]{1,2})(?:\/([12][0-9]))? ([0-9]{1,2}):([0-9]{2}) ([AP]M)\]/ig,
    rewriteTime
  )
}

doStuff.register({
  id: 'fixTime',
  func: fixTime,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false,
  name: 'Fix Teams chat history timestamps'
})

//  END:  Fix time in teams chat history
// ====================================================================
// START: Download old matrix assets

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const downloadMatrixAssets = (input, extraInputs, GETvars) => {
  const URLs = input.split('\n')
  const _regex = /^(?:https?:)?\/\/[a-z]+\.acu\.edu\.au\/(.*?)\/([a-z0-9._-]+?\.[a-z]+)$/i

  const parseURL = (whole, path, file) => {
    // console.group('parseURL()')
    // console.log('whole:', whole)
    // console.log('path:', path)
    // console.log('file:', file)
    // console.groupEnd()
    return 'getURL "' + path + '" "' + file + '";' + '\n'
  }

  const _URLs = URLs.filter(url => (url.trim() !== '')).map(url => {
    // console.group('URLs.map()')
    const _url = url.trim()
    const _line = _url.replace(_regex, parseURL)
    // console.log('_url:', _url)
    // console.log('_regex:', _regex)
    // console.log('_line:', _line)
    // console.groupEnd()
    return _line
  })

  let _output = '#!/bin/sh\n\n' +
                'function getURL {\n' +
                '\tdownloadURL="https://forms.acu.edu.au/$1/$2";\n' +
                '\tdownloadPath="/var/www/html/$1";\n' +
                '\tdownloadFile="$downloadPath/$2";\n\n' +
                '\techo;\n' +
                '\techo "===============================";\n' +
                '\techo;\n\n' +
                '\tif [ ! -f "$downloadFile" ]\n' +
                '\tthen\tif [ ! -d "$downloadPath" ]\n' +
                '\t\tthen\tmkdir -p $downloadPath;\n' +
                '\t\t\techo "Created \'$downloadPath\' directory";\n' +
                '\t\telse\techo "Directory "$downloadPath" already exists";\n' +
                '\t\tfi\n\n' +
                '\t\tcd $downloadPath;\n' +
                '\t\twget $downloadURL;\n\n' +
                '\t\tif [ -f $downloadFile ]\n' +
                '\t\tthen\techo "Downloaded "$downloadPath;\n' +
                '\t\telse\techo;\n' +
                '\t\t\techo "-------------------------";\n' +
                '\t\t\techo;\n' +
                '\t\t\techo "Download of \'$downloadFile\' FAILED!!!";\n' +
                '\t\t\techo "\\t$downloadURL";\n' +
                '\t\t\techo;\n' +
                '\t\t\techo "-------------------------";\n' +
                '\t\t\techo;\n' +
                '\t\tfi\n' +
                '\telse\techo "File \'$downloadFile\' already exists";\n' +
                '\tfi\n\n' +
                '\techo;\n\techo;\n\techo;\n' +
                '}\n\n\n'

  for (let a = 0; a < _URLs.length; a += 1) {
    _output += _URLs[a]
  }

  return _output + '\n'
}

doStuff.register({
  id: 'downloadMatrixAssets',
  func: downloadMatrixAssets,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false,
  name: 'Download old matrix assets'
})

//  END:  Download old matrix assets
// ====================================================================
// START: Checkout modified files with only changed line end characters

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const checkoutWSonly = (input, extraInputs, GETvars) => {
  const lines = input.split('\n')
  // console.log('lines:', lines)
  const modified = []
  for (let a = 0; a < lines.length; a += 1) {
    if (lines[a].includes('modified')) {
      // console.log('lines[' + a + ']:', lines[a])
      let line = lines[a].replace(/^\s*modified:\s+/, '')
      line = line.trim()
      // const tmp = line.replace(/\s+)/g, '')
      // if (line !== tmp) {
      //   line = '"' + tmp + '"'
      // }
      // console.log('line:', line)
      modified.push(line)
    }
  }

  return input
}

doStuff.register({
  id: 'checkoutWSonly',
  func: checkoutWSonly,
  description: 'When a file in a git repo only has changed line end characters. Just checkout the file to remove the line end changes',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false,
  name: 'GIT: Undo changed line end chars'
})

//  END: Checkout modified files with only changed line end characters
// ====================================================================
// START: Transform RYI Suburb/Schools JSON

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const transformSchoolsJSONevan = (input, extraInputs, GETvars) => {
  let json
  try {
    json = JSON.parse(input)
  } catch (e) {
    console.error('Schools JSON failed to parse.', e)
  }

  const outputMode = extraInputs.output()
  // console.log(outputMode)

  const output = []
  const output2 = {}
  const output3 = {}
  // let suburbCount = 0
  // let schoolCount = 0
  // const allSuburbs = []
  // const allSchools = []
  let tmp = ''
  let _tmp = []

  const makeJS = (input) => {
    const _through = JSON.stringify(input)
    return _through.replace(/"([^"]+)"(?=:)/ig, (whole, key) => key.toLowerCase())
  }

  for (let a = 0; a < json.Suburbs.length; a += 1) {
    const suburb = json.Suburbs[a]
    // suburbCount += 1
    output2[suburb.Name] = []

    // console.log('suburb:', suburb)
    for (let b = 0; b < suburb.Schools.length; b += 1) {
      // schoolCount += 1
      const better = {
        id: suburb.Schools[b].ID,
        name: suburb.Schools[b].Name,
        // suburb: suburb.Name,
        state: suburb.Schools[b].State
      }
      // console.log('suburb.Schools[' + b + ']:', suburb.Schools[b])
      output.push(better)
      output2[suburb.Name].push(better)
    }
  }

  const sortSchools = (a, b) => {
    if (a.suburb < b.suburb) {
      return -1
    } else if (a.suburb > b.suburb) {
      return 1
    } else {
      if (a.state < b.state) {
        return -1
      } else if (a.state > b.state) {
        return 1
      } else {
        if (a.name < b.name) {
          return -1
        } else if (a.name > b.name) {
          return 1
        } else {
          return 0
        }
      }
    }
  }

  // console.log('Suburb count:', suburbCount)
  // console.log('School count:', schoolCount)

  switch (outputMode) {
    case 'suburb':
      output.sort((a, b) => {
        if (a.suburb < b.suburb) {
          return -1
        }
        if (a.suburb > b.suburb) {
          return 1
        } else {
          return 0
        }
      })
      _tmp = []
      tmp = '<label for="suburb"class=" custom-form__label">Suburb</label>\n<select id="suburb" class="ryi-area-first classic-black form-control__primary select customDropDown">'
      for (let a = 0; a < output.length; a += 1) {
        if (_tmp.indexOf(output[a].suburb) === -1) {
          _tmp.push(output[a].suburb)
          tmp += '\n\t<option value="' + output[a].suburb + '">' + output[a].suburb + '</option>'
        }
      }
      return tmp + '\n</select>'

    case 'school':
      output.sort((a, b) => {
        if (a.name < b.name) {
          return -1
        }
        if (a.name > b.name) {
          return 1
        } else {
          return 0
        }
      })
      tmp = '<label for="school" class=" custom-form__label">School</label>\n<select id="school" class="ryi-area-first classic-black form-control__primary select customDropDown">'
      for (let a = 0; a < output.length; a += 1) {
        if (_tmp.indexOf(output[a].name + output[a].state) === -1) {
          _tmp.push(output[a].name + output[a].state)
          tmp += '\n\t<option value="' + output[a].name + '">' + output[a].name + ' (' + output[a].state + ')</option>'
        }
      }
      return tmp + '\n</select>'

    case 'array':
      output.sort(sortSchools)
      return JSON.stringify(output)

    case 'object2':
      _tmp = Object.keys(output2)
      for (tmp in output2) {
        // console.log('tmp:', tmp)
        let _key = tmp.replace(/[^a-z]+/ig, '')
        // console.log('_key:', _key)
        _key = _key.toLowerCase()
        // console.log('_key:', _key)
        output3[_key] = {
          name: tmp,
          schools: output2[tmp]
        }
      }

      return 'var RYIschoolSuburbs = ' + makeJS(output3)

    case 'object':
      for (const suburb in output2) {
        output2[suburb].sort(sortSchools)
      }
      return JSON.stringify(output2)

    case 'js':
    default:
      return 'var RYIschoolSuburbs = ' + makeJS(json.Suburbs)
  }
}

doStuff.register({
  id: 'transformSchoolsJSONevan',
  func: transformSchoolsJSONevan,
  description: 'Transform RYI Suburb/Schools JSON string to JavaScript variable for use in WWW RYI from</p><p>For creating the JavaScript variable use in the public website RYI form</p><ol><li>Copy the whole JSON (supplied by marketing) into the text box below</li><li>click MODIFY INPUT (green button on the bottom left)</li><li>Copy the (modified) contents of the text box</li><li>Then replace the existing variable in the sitecore <code>ryi-script.js</code> file</li></ol><p>',
  // docsURL: '',
  extraInputs: [{
    id: 'output',
    type: 'radio',
    label: 'Output mode',
    options: [{
      value: 'js',
      label: 'JS version of original JSON',
      default: true
    }, {
      value: 'object2',
      label: 'Create keyed clean object for use in www RYI form'
    }, {
      value: 'object',
      label: 'Use clean object (if not checked make flat array of school objects)'
    }, {
      value: 'array',
      label: 'Single list of all schools as school objects'
    }, {
      value: 'suburb',
      label: 'HTML for suburb select input'
    }, {
      value: 'school',
      label: 'HTML for school select input'
    }]
  }],
  group: 'evan',
  ignore: true,
  name: 'Transform RYI Suburb/Schools JSON'
})

//  END:  Transform RYI Suburb/Schools JSON
// ====================================================================
// START: Fix handbook URLs

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const fixHandbookURLs = (input, extraInputs, GETvars) => {
  // sed -i 's/http:\/\/www\.acu\.edu\.au\/346446/\/handbook\/handbooks\/handbook_2012\/unit_descriptions_for_2012.html/ig' non-award_courses/*.html

  // sed -i 's/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/units-info\//https:\/\/archives\.acu\.edu\.au\/handbook\/units-info\//ig'
  // var output = '#!/bin/sh\n\n' +
  //              'function cleanHTML {\n' +
  //              '\tif [ -d "$1" ]\n' +
  //              '\tthen\t'
  //              '}\n\n'
  return input
}

doStuff.register({
  id: 'fixHandbookURLs',
  func: fixHandbookURLs,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: true,
  // inputLabel: '',
  name: 'Fix (archived) Handbook URLs'
  // remote: false,
  // rawGet: false,
})

//  END:  Fix handbook URLs
// ====================================================================
// START: extract unicode chars

/**
 * Extract Unicode chars and their HTML Character entities from the
 * contents of
 * view-source:https://dev.w3.org/html5/html-author/charref and make
 * a JavaScript array for find/replace
 *
 * created by: Evan Wills
 * created: 2020-04-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const extractInicode = (input, extraInputs, GETvars) => {
  const extractFromRow = (whole, cells) => {
    const matches = cells.match(/^.*?<td class="named"><code>&amp;([^;]+);(?:\s+&amp;[^;]+;)*<\/code><td class="hex"><code>&amp;#x[^;]+;<\/code><td class="dec"><code>&amp;#([^;]+);<\/code><td class="desc">(.*)/i)

    if (matches === null) {
      // console.log('Nothing was matched')
      // console.log('matches === null:', matches === null)
      // console.log('cells:', cells)
      return ''
    } else if ((!extraInputs.bigSmall('ascii') &&
      matches[2] <= 128) ||
      (!extraInputs.bigSmall('high') &&
      matches[2] > 9999)
    ) {
      // console.log('matches === null:', matches === null)
      // console.log('matches[2] (' + matches[2] + ') <= 128:', matches[2] <= 128)
      // console.log('matches[2] (' + matches[2] + ') > 9999:', matches[2] > 9999)
      // console.log('cells:', cells)
      return ''
    }

    const unicode = (matches[2] < 1000) ? '0' + matches[2] : matches[2]

    return '\n    [ /\\u' + unicode + '/g, \'&' + matches[1] + ';\' ], // ' + matches[3]
  }

  const replaceRows = (whole, rows) => {
    return rows.replace(/<tr[^>]+>(.*?)(?=<tr |$)/igs, extractFromRow)
  }

  return input.replace(/^.*?<table[^>]*>(.*?)<\/table>.*$/is, replaceRows)
}

doStuff.register({
  id: 'extractInicode',
  func: extractInicode,
  description: 'Extract Unicode chars and their HTML Character entities from the contents of <a href="https://dev.w3.org/html5/html-author/charref">W3C\'s Character Entity Reference Chart</a> (<a href="view-source:https://dev.w3.org/html5/html-author/charref">source</a>) and make a JavaScript array for find/replace',
  // docsURL: '',
  extraInputs: [{
    type: 'checkbox',
    id: 'bigSmall',
    label: 'Which entities to include',
    options: [{
      value: 'ascii',
      label: 'Include low ascii characters'
    }, {
      value: 'high',
      label: 'Include high ascii characters (above #9999)',
      default: true
    }]
  }],
  group: 'evan',
  ignore: false,
  // inputLabel: '',
  name: 'Z Extract unicode chars'
  // remote: false,
  // rawGet: false,
})

//  END:  extract unicode chars
// ====================================================================
// START: Tab delimited to Markdown table

/**
 * Convert Tab delimited data to Markdown table
 *
 * created by: Evan Wills
 * created: 2021-03-29
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const tab2markdown = (input, extraInputs, GETvars) => {
  let rows = input.split('\n')
  rows = rows.map(row => row.split('\t').map(col => col.trim()))

  const pad = (_input, len, header, char = ' ') => {
    let a = false
    let _output = _input

    if (isBoolTrue(header)) {
      while (_output.length < len) {
        if (a === false) {
          _output = char + _output
        } else {
          _output = _output + char
        }
        a = !a
      }
    } else if (isNumeric(_input)) {
      while (_output.length < len) {
        _output = char + _output
      }
    } else {
      while (_output.length < len) {
        _output += char
      }
    }

    return char + _output + char + '|'
  }

  const cols = []
  for (let a = 0; a < rows.length; a += 1) {
    for (let b = 0; b < rows[a].length; b += 1) {
      const c = rows[a][b].length
      if (typeof cols[b] !== 'number' || cols[b] < c) {
        cols[b] = c
      }
    }
  }

  const headerRow = cols.map(col => '')

  rows = [].concat(rows.slice(0, 1), [headerRow], rows.slice(1))

  let output = ''
  for (let a = 0; a < rows.length; a += 1) {
    output += '|'
    for (let b = 0; b < rows[a].length; b += 1) {
      const char = (a === 1)
        ? '-'
        : ' '
      output += pad(rows[a][b], cols[b], a === 0, char)
    }
    output += '\n'
  }

  return output.trim()
}

doStuff.register({
  id: 'tab2markdown',
  func: tab2markdown,
  description: '',
  extraInputs: [],
  group: 'evan',
  ignore: false,
  name: 'Convert Tab delimited data to Markdown table'
})

//  END:  Tab delimited to Markdown table
// ====================================================================
// START: Rewrite for PHPCS

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2021-05-23
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const rewritePHP = (input, extraInputs, GETvars) => {
  let coun = 0
  let max = 20
  let output = input

  const fixVarNames = (whole, prefix, letter) => {
    coun += 1
    return prefix + letter.toUpperCase()
  }

  while (coun > 0 && max > 0) {
    output = output.replace(/(\$[a-z]+)_([a-z])/ig, fixVarNames)
    output = output.replace(/([a-z])_([a-z])(?=[a-z]+ ?\()/ig, fixVarNames)
    max -= 1
    coun -= 1
  }

  const regex = [
    {
      find: /(if|switch|while|for)\s*(?=\()/ig,
      replace: '$1 '
    }
  ]

  return multiLitRegexReplace(input, regex)
}

doStuff.register({
  id: 'phpcs',
  func: rewritePHP,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false,
  // inputLabel: '',
  name: 'Rewrite for PHPCS'
  // remote: false,
  // rawGet: false,
})

//  END:  Rewrite for PHPCS
// ====================================================================
// START: Loading spinner generator

const getRad = (deg) => (deg * Math.PI / 180)

const rotateArr = (arr, pos, count) => {
  const next = pos + 1
  const arrFirst = arr.slice(0, next)
  const arrNext = arr.slice(next)
  const newArr = [...arrNext, ...arrFirst]
  const tmp = newArr.join(';')
  let output = tmp
  while (count > 1) {
    output += ';' + tmp
    count -= 1
  }
  return output
}

/**
 * Round a input number to a specified number of decimal places
 *
 * @param {number} input  Number to be rounded
 * @param {number} places number of decimal places to round the input
 *
 * @returns {number}
 */
export const round = (input, places) => {
  const p = (typeof input === 'number') ? Math.round(places) : 0
  const x = Math.pow(10, p)

  return Math.round(input * x) / x
}

/**
 * Generate SVG code for loading spinner
 *
 * created by: Evan Wills
 * created: 2021-05-31
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const loadingSpinnerGenerator = (input, extraInputs, GETvars) => {
  const rev = -1
  const dotCount = extraInputs.count()
  const mainRadius = extraInputs.radius()
  const duration = extraInputs.duration()
  const loops = extraInputs.loops()
  const dotCountSub = dotCount - 1
  const step = (360 / dotCount)
  const radius = mainRadius * 0.25
  const side = mainRadius * 2.5
  const offset = mainRadius * 1.25
  const xy = []
  let radii = []
  let opacity = []
  let output = '<?xml version="1.0" encoding="UTF-8"?>\n<svg id="wating-spinner" width="' + side + 'mm" height="' + side + 'mm" version="1.1" viewBox="0 0 ' + side + ' ' + side + '" xmlns="http://www.w3.org/2000/svg" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n\t<g id="spinner" stroke="none" fill="#106">'

  console.group('loadingSpinnerGenerator()')

  for (let a = 0; a < dotCount; a += 1) {
    const dotOpacity = round(((1 * a) / dotCountSub), 3)
    const deg = (a * step * rev) - 90

    xy.push({
      x: round((mainRadius * Math.cos(getRad(deg)) + offset), 3),
      y: round((mainRadius * Math.sin(getRad(deg)) + offset), 3)
    })

    radii = [round((radius * dotOpacity), 3), ...radii]

    opacity = [dotOpacity, ...opacity]
  }

  for (let b = 0; b < dotCount; b += 1) {
    const id = (b < 10) ? '0' + b.toString() : b.toString()
    const c = b - 1

    output += '\n\t\t<circle id="c-' + id + '" cx="' + xy[b].x + '" cy="' + xy[b].y + '" r="' + radius + '" fill-opacity="' + opacity[b] + '">\n'
    output += '\t\t\t<animate begin="0s" dur="' + duration + 's" calcMode="linear" repeatCount="indefinite" values="' + rotateArr(opacity, c, loops) + '" attributeName="fill-opacity" />\n'
    output += '\t\t\t<animate begin="0s" dur="' + duration + 's" calcMode="linear" repeatCount="indefinite" values="' + rotateArr(radii, c, loops) + '" attributeName="r" />\n'
    output += '\t\t</circle>\n'
  }

  return output + '\t</g>\n</svg>'
}

doStuff.register({
  id: 'loadingSpinnerGenerator',
  func: loadingSpinnerGenerator,
  description: '',
  // docsURL: '',
  extraInputs: [
    {
      id: 'count',
      label: 'Count',
      type: 'number',
      value: 12,
      default: 12,
      min: 1,
      max: 36,
      step: 1
    },
    {
      id: 'radius',
      label: 'Radius',
      type: 'number',
      value: 40,
      default: 40,
      min: 1,
      max: 100,
      step: 1
    },
    {
      id: 'duration',
      label: 'Animation duration',
      type: 'number',
      value: 11,
      default: 11,
      min: 1,
      max: 100,
      step: 1
    },
    {
      id: 'loops',
      label: 'Animation loops',
      type: 'number',
      value: 3,
      default: 3,
      min: 1,
      max: 100,
      step: 1
    }
  ],
  group: 'evan',
  ignore: false,
  // inputLabel: '',
  name: 'Loading spinner generator'
  // remote: false,
  // rawGet: false,
})

//  END:  Loading spinner generator
// ====================================================================
// START: Timestamp ID

/**
 * Time stamp as base 64 encoded string (used for creating UIDs)
 *
 * created by: Evan Wills
 * created: 2021-06-01
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const timestampID = (input, extraInputs, GETvars) => btoa(Date.now().toString()).replace(/=+$/, '')

doStuff.register({
  id: 'timestampID',
  func: timestampID,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false,
  // inputLabel: '',
  name: 'Timestamp ID'
  // remote: false,
  // rawGet: false,
})

//  END:  Timestamp ID
// ====================================================================
// START: Linux to Windows file path

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2021-06-04
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const linux2winPath = (input, extraInputs, GETvars) => {
  const prefix = extraInputs.prefix()
  return prefix + input.replace(/\//g, '\\').replace(/[^a-z0-9.-_]+/g, '')
}

doStuff.register({
  id: 'linux2winPath',
  func: linux2winPath,
  description: '',
  // docsURL: '',
  extraInputs: [{
    id: 'prefix',
    label: 'Prefix path',
    type: 'text',
    default: 'C:\\Users\\evwills\\Documents\\ACU\\coldFusion\\'
  }],
  group: 'evan',
  ignore: false,
  // inputLabel: '',
  name: 'Linux to Windows file path'
  // remote: false,
  // rawGet: false,
})

//  END:  Linux to Windows file path
// ====================================================================
// START: Quick Staff Directory SQL generator

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2021-07-19
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const quickSQL = (input, extraInputs, GETvars) => {
  const userStr = extraInputs.usrStr()

  const sql = 'SELECT `first_name` AS `firstName`, `last_name` AS `lastName`, `email` FROM `basic_user` WHERE `first_name` LIKE "%:STR1%" :AND_OR `last_name` LIKE "%:STR2%" ORDER BY `first_name`, `last_name` LIMIT 0, 20;\n'

  const parts = userStr.split(' ')
  console.log('parts:', parts)
  const firstName = parts[0]

  let lastName = ''
  let andOr = 'OR '
  if (parts.length > 1) {
    andOr = 'AND'
    let sep = ''
    for (let a = 1; a < parts.length; a += 1) {
      parts[a] = parts[a].trim()
      if (parts[a] !== '') {
        lastName += sep + parts[a]
        sep = ' '
      }
    }
  } else {
    lastName = firstName
  }

  let output = sql.replace(':STR1', firstName).replace(':STR2', firstName).replace(':AND_OR', 'OR ')

  if (andOr === 'AND') {
    output += sql.replace(':STR1', lastName).replace(':STR2', lastName).replace(':AND_OR', 'OR ')
    output += sql.replace(':STR1', firstName).replace(':STR2', lastName).replace(':AND_OR', 'AND')
  }

  return output
}

doStuff.register({
  id: 'quickSQL',
  func: quickSQL,
  description: '',
  // docsURL: '',
  extraInputs: [{
    id: 'usrStr',
    label: 'Partial string for user',
    type: 'text',
    default: 'robin shi is awesome'
  }],
  group: 'evan',
  ignore: false,
  // inputLabel: '',
  name: 'Quick Staff Directory SQL generator'
  // remote: false,
  // rawGet: false,
})

//  END:  Quick Staff Directory SQL generator
// ====================================================================
// START: Collapse SQL

/**
 * Convert nicely formatted SQL into single line Plus replace query parameter tokens with supplied values
 *
 * created by: Evan Wills
 * created: 2021-07-19
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const collapseSQL = (input, extraInputs, GETvars) => {
  const tokens = extraInputs.tokens().split(';')

  let output = input
  for (let a = 0; a < tokens.length; a += 1) {
    tokens[a] = tokens[a].split(':')
    output = output.replace(':' + tokens[a][0].trim(), tokens[a][1].trim())
  }

  return output.replace(/\s+/g, ' ').trim() + '\n'
}

doStuff.register({
  id: 'collapseSQL',
  func: collapseSQL,
  description: '',
  // docsURL: '',
  extraInputs: [{
    id: 'tokens',
    label: 'Query parameters (e.g. PARAM1: value1; PARAM2: value2)',
    type: 'text',
    default: '',
    description: 'semi-colon separated string (colons separate token/value pairs)'
  }],
  group: 'evan',
  ignore: false,
  // inputLabel: '',
  name: 'Collapse SQL'
  // remote: false,
  // rawGet: false,
})

//  END:  Collapse SQL
// ====================================================================
// START: Count number of uploaded files

/**
 * Count number of uploaded files
 *
 * created by: Evan Wills
 * created: 2021-11-02
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const countLines = (input, extraInputs, GETvars) => {
  // let output = input.replace(/\s+[0-9]+%\s+[0-9.]+/ig, '')
  let output = input.trim()
  output.replace(/\s+[0-9]+%\s+[0-9.]+[A-Z]*\s+[0-9.]+[A-Z]+\/s\s+(?:[0-9]+:)+[0-9]+/ig, '')
  output = output.replace(/\s+Pausing for [0-9]+ seconds? to prevent timeouts\s+/ig, '\n')
  output = output.trim()
  output = output.split('\n')
  return output.length + ''
  // return output
}

doStuff.register({
  id: 'countLines',
  func: countLines,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: true,
  // inputLabel: '',
  name: 'Count number of uploaded files'
  // remote: false,
  // rawGet: false,
})

//  END:  Count number of uploaded files
// ====================================================================
// START: fastest turn

/**
 * Make a number fit within 360
 *
 * @param {number} input Number that may be greater than 360 or less
 *                       than -360
 *
 * @returns {number} Number that is greater than -360 and less than 360
 */
const true360 = (input) => {
  let output = input * 1

  if (output > 0) {
    while (output > 360) {
      output -= 360
    }
  } else {
    while (output < -360) {
      output += 360
    }
  }
  if (output < 0) {
    output += 360
  }
  return output
}

/**
 * Action description goes here
 *
 * created by: Firstname LastName
 * created: YYYY-MM-DD
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const fastestTurn = (input, extraInputs, GETvars) => {
  const dest = true360(extraInputs.destinationDeg() * 1)
  const origin = true360(extraInputs.originDeg() * 1)

  let tmp = dest - origin

  if (tmp > 180 || tmp < -180) {
    tmp *= -1
  }
  let output = (tmp < 0)
    ? 'left'
    : 'right'

  if (tmp > 180) {
    output = (output === 'left')
      ? 'right'
      : 'left'
  }

  return output.toString()
}

doStuff.register({
  id: 'fastestTurn',
  func: fastestTurn,
  description: '',
  // docsURL: '',
  extraInputs: [{
    id: 'originDeg',
    type: 'number',
    label: 'Angle we start at',
    default: '86',
    min: -360,
    max: 360,
    step: 1
  }, {
    id: 'destinationDeg',
    type: 'number',
    label: 'Angle we want to end up at',
    default: '-90',
    min: -360,
    max: 360,
    step: 1
  }],
  group: 'evan',
  ignore: true,
  // inputLabel: '',
  name: 'Fastest turn'
  // remote: false,
  // rawGet: false,
})

//  END:  fastest turn
// ====================================================================
// START: PHP associative array to javascript object

/**
 * Convert PHP associative array to javascript object
 *
 * created by: Evan Wills
 * created: 2021-11-16
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const php2js = (input, extraInputs, GETvars) => {
  const regex = /id: ##/g
  console.group('php2js()')
  console.log('extraInputs.index()', extraInputs.index())
  let index = extraInputs.index()
  const constName = snakeToCamelCase(extraInputs.name(), 1)
  console.log('extraInputs.name():', extraInputs.name())
  console.log('constName:', constName)
  let output = input.trim()
  output = output.replace(/\s*(?:\[|array\()/g, '\n  {')
  output = output.replace(/\s*(?:\]|\))/g, '\n  }')
  output = output.replace(/'(?:.*?_)?([a-z]+)'\s*=>\s*/ig, '$1: ')
  output = output.replace(/((?:name|description):)[\r\n]*\s+'([^']+)'(?:\.[\r\n]+\s+'([^']+)')?(?:\.\s+'([^']+)')?(?:\.[\r\n]+\s+'([^']+)')?(?:\.[\r\n]+\s+'([^']+)')?(?:\.[\r\n]+\s+'([^']+)')?(?:\.[\r\n]+\s+'([^']+)')?(?:\.[\r\n]+\s+'([^']+)')?/ig, '$1 \'$2$3$4$5$6$7$8$9\'')
  output = output.replace(/((\s+)name:)/ig, '$2id: ##,$1')
  output = output.replace(/[\r\n]+\s+([a-z]+: )/ig, '\n    $1')

  output = output.replace(regex, (str) => {
    const _output = 'id: ' + index
    index += 1
    return _output
  })

  output = output.replace(/\s+id: [0-9]+,(\s+id: [0-9]+,)/gs, '$1')

  console.groupEnd()
  return '\nexport const ' + constName + ' = [' + output + '\n]\n\n'
}

doStuff.register({
  id: 'php2js',
  func: php2js,
  description: 'Convert PHP associative array to a javascript object in an array',
  // docsURL: '',
  extraInputs: [{
    id: 'index',
    type: 'number',
    label: 'Starting index',
    default: '1',
    min: 0,
    max: 2,
    step: 1
  }, {
    id: 'name',
    type: 'text',
    label: 'Constant name'
  }],
  group: 'evan',
  ignore: false,
  // inputLabel: '',
  name: 'PHP array to JS object[]'
  // remote: false,
  // rawGet: false,
})

//  END:  PHP associative array to javascript object
// ====================================================================
// START: Convert laravel int fields to unsigned

const int2unsignedInner = (whole, part) => {
  return '->unsigned' + ucFirst(part) + ')'
}

/**
 * Convert laravel migration integer fields to unsigned
 * integer fields
 *
 * created by: Evan Wills
 * created: 2021-11-16
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const int2unsigned = (input, extraInputs, GETvars) => {
  const regex = /->((?:tiny|small|medium|big)?Integer\('[^']+'), false, true\)/ig

  return input.replace(regex, int2unsignedInner)
}

doStuff.register({
  id: 'int2unsigned',
  func: int2unsigned,
  description: 'Convert laravel migration integer fields to unsigned integer fields',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: true,
  // inputLabel: '',
  name: 'Larvel ints to unsigned'
  // remote: false,
  // rawGet: false,
})

//  END:  Convert laravel int fields to unsigned
// ====================================================================
// START: Change variable style

const snakeToArray = (input) => {
  return input.split(/[- _]/)
}

const camelToArray = (input) => {
  return input.split(/(?<=[a-z])(?=[A-Z])/)
}

/**
 * Change variable style
 *
 * created by: Evan Wills
 * created: 2021-12-01
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const changeVarStyle = (input, extraInputs, GETvars) => {
  const start = extraInputs.startStyle()
  const end = extraInputs.endStyle()
  const strip = extraInputs.strip()
  const ucAll = extraInputs.allupper('true')
  let tmp = []
  let output = ''
  let sep = ''

  tmp = (start === 'snake' || start === 'kebab')
    ? snakeToArray(input)
    : camelToArray(input)

  if (strip > 0) {
    tmp = tmp.slice(strip, tmp.length)
  }

  for (let a = 0; a < tmp.length; a += 1) {
    tmp[a] = tmp[a].toLowerCase()
  }

  if (end === 'snake') {
    sep = '_'
  } else if (end === 'kebab') {
    sep = '-'
  }

  if (sep === '') {
    output = (end === 'pascal')
      ? ucFirst(tmp[0])
      : tmp[0]

    for (let a = 1; a < tmp.length; a += 1) {
      output += ucFirst(tmp[a])
    }
  } else {
    output = tmp[0]
    for (let a = 1; a < tmp.length; a += 1) {
      output += sep + tmp[a]
    }
  }

  if (ucAll === true) {
    output = output.toUpperCase()
  }

  return output
}

doStuff.register({
  id: 'changeVarStyle',
  name: 'Change variable style',
  func: changeVarStyle,
  description: '',
  // docsURL: '',
  extraInputs: [
    {
      id: 'startStyle',
      label: 'Starting style',
      type: 'radio',
      options: [{
        value: 'snake',
        label: 'Snake',
        default: true
      }, {
        value: 'camel',
        label: 'Camel'
      }, {
        value: 'kebab',
        label: 'Kebab'
      }, {
        value: 'pascal',
        label: 'Upper Camel'
      }]
    },
    {
      id: 'endStyle',
      label: 'End style',
      type: 'radio',
      options: [{
        value: 'snake',
        label: 'Snake'
      }, {
        value: 'camel',
        label: 'Camel',
        default: true
      }, {
        value: 'kebab',
        label: 'Kebab'
      }, {
        value: 'pascal',
        label: 'Upper Camel'
      }]
    },
    {
      id: 'strip',
      label: 'Strip first x items',
      type: 'number',
      min: 0,
      max: 10,
      step: 1,
      default: 0
    },
    {
      id: 'allupper',
      label: 'Output style',
      type: 'checkbox',
      options: [
        { value: 'true', label: 'UPPER CASE' }
      ]
    }
  ],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Change variable style
// ====================================================================
// START: Routes to Enums

/**
 * Split list of routes into 2D array
 *
 * @param {string} input Copy/Paste from Excel
 *
 * @returns array
 */
const splitRoutes = (input) => {
  let routes = input.trim()
  routes = routes.split('\n')
  const _route = []
  const _description = []
  const _label = []

  for (let a = 0; a < routes.length; a += 1) {
    routes[a] = routes[a].trim()
    if (routes[a] !== '') {
      routes[a] = routes[a].split('\t')
      for (let b = 0; b < routes[a].length; b += 1) {
        routes[a][b] = routes[a][b].trim()
        if (routes[a][b] !== '') {
          if (b < 5) {
            if (typeof _route[a] === 'undefined') {
              _route[a] = []
            }
            _route[a].push(routes[a][b])
          } else if (b === 5) {
            _description[a] = routes[a][b]
          } else {
            _label[a] = routes[a][b]
          }
        }
      }
    }
  }

  return {
    route: _route,
    description: _description,
    label: _label
  }
}

/**
 * Routes to Enums
 *
 * created by: Evan Wills
 * created: 2021-12-10 12:19:00
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const routes2enums = (input, extraInputs, GETvars) => {
  const fieldName = extraInputs.fieldName()
  const routes = splitRoutes(input).route
  const enums = []
  let output = ''
  console.log('routes:', routes)

  for (let a = 0; a < routes.length; a += 1) {
    if (typeof routes[a] === 'undefined') {
      continue
    }
    for (let b = 0; b < routes[a].length; b += 1) {
      if (Array.isArray(enums[b])) {
        if (enums[b].indexOf(routes[a][b]) === -1) {
          enums[b].push(routes[a][b])
        }
      } else {
        enums.push([routes[a][b]])
      }
    }
  }
  console.log('routes:', routes)
  console.log('enums:', enums)

  for (let a = 0; a < enums.length; a += 1) {
    enums[a].sort()
    output += '                $table->enum(\n' +
              '                    \'' + fieldName + (a + 1) + '\',\n' +
              '                    ['
    let line = ''
    const sep = '\n                     '
    for (let b = 0; b < enums[a].length; b += 1) {
      enums[a][b] = enums[a][b].trim()

      if (enums[a][b] !== '') {
        if ((line.length + enums[a][b].length + 4) > 48) {
          output += sep + line
          line = ''
        }
        line += ' \'' + enums[a][b] + '\','
      }
    }
    if (line !== '') {
      output += sep + line
    }

    output += '\n' +
              '                    ]\n' +
              '                )->nullable();\n'
  }
  output = output.replace(/(?<='')(?=\n)/ig, ',')

  return output
}

doStuff.register({
  id: 'routes2enums',
  name: 'Routes to Enums',
  func: routes2enums,
  description: '',
  // docsURL: '',
  extraInputs: [{
    id: 'fieldName',
    label: 'Field Name',
    type: 'text',
    default: 'admin_activity_route_level_'
  }],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Routes to Enums
// ====================================================================
// START: Routes insert statements

const _getRoutAction = (route, level) => {
  let output = ''
  let _level = level

  if (route[_level] !== '') {
    output = route[_level].replace(/-/g, ' ')
  } else {
    _level -= 1
    if (route[_level].substr(-3) === 'ID}') {
      output = 'show'
    } else if (route[_level] !== '') {
      output = route[_level]
    } else {
      return 's -> listing'
    }
  }

  return (output !== '')
    ? ' -> ' + output
    : ''
}

/**
 * Routes insert statements
 *
 * created by: Evan Wills
 * created: 2021-12-10 12:19:00
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const insertRoutes = (input, extraInputs, GETvars) => {
  const fieldName = extraInputs.fieldName()
  const routes = splitRoutes(input).route
  const formSubs = [
    'items', 'packages', 'fields', 'emails', 'email-rules',
    'earlybird-discounts', 'group-discounts',
    'text-blocks', 'payments'
  ]
  const settingSubs = [
    'config', 'text-blocks', 'field-types'
  ]
  // const enums = []
  let output = ''
  let sep1 = ''

  for (let a = 0; a < routes.length; a += 1) {
    if (typeof routes[a] === 'undefined') {
      routes[a] = []
    }

    for (let b = 0; b < 5; b += 1) {
      if (typeof routes[a][b] !== 'string') {
        routes[a][b] = ''
      }
    }

    let sep2 = ''
    let top = makeSingle(routes[a][0])

    if (top === 'form') {
      if (formSubs.indexOf(routes[a][2]) > -1) {
        top += ': ' + makeSingle(routes[a][2]) + _getRoutAction(routes[a], 4)
      } else {
        top += _getRoutAction(routes[a], 2)
      }
    } else if (top === 'setting') {
      top += 's'
      if (settingSubs.indexOf(routes[a][1]) > -1) {
        top += ': ' + makeSingle(routes[a][1]) + _getRoutAction(routes[a], 3)
      }
    } else if (['acronym', 'user'].indexOf(top) > -1) {
      top += _getRoutAction(routes[a], 2)
    }

    output += sep1 + '\n                [ // ' + a + ' (' + top + ')'

    for (let b = 0; b < routes[a].length; b += 1) {
      // routes[a][b] = routes[a][b]

      const value = (routes[a][b] === '')
        ? 'null'
        : "'" + routes[a][b] + "'"

      output += sep2 + '\n                    \'' + fieldName + (b + 1) + '\' => ' + value
      sep2 = ','
    }

    output += '\n                ]'
    sep1 = ','
  }

  output = output.replace(/(?<=\/\/ 1 \()(?=\))/, 'home')

  return output
}

doStuff.register({
  id: 'insertRoutes',
  name: 'Routes Insert',
  func: insertRoutes,
  description: '',
  // docsURL: '',
  extraInputs: [{
    id: 'fieldName',
    label: 'Field Name',
    type: 'text',
    default: 'admin_activity_route_level_'
  }],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Routes insert statements
// ====================================================================
// START: Routes MD format

/**
 * Routes to Markdown format
 *
 * created by: Evan Wills
 * created: 2022-01-06 10:00:00
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const routes2md = (input, extraInputs, GETvars) => {
  const routes = splitRoutes(input)
  const isID = (input) => {
    return /^\{[a-zA-Z]+\}$/.test(input)
  }
  console.log('routes:', routes)
  // return input

  let output = ''

  for (let a = 0; a < routes.route.length; a += 1) {
    if (!Array.isArray(routes.route[a])) {
      continue
    }
    const c = routes.route[a].length - 1
    const key = routes.route[a][c]
    const preSep = padStrLeft('', (c * 2))
    const sep = '\n  ' + preSep

    if (key !== '') {
      if (c === 0) {
        output += '\n\n## ' + ucFirst(key) + '\n'
      }

      output += '\n' + preSep + '* '
      output += isID(key)
        ? key.replace(/\{([^}]+)\}/, (match, token) => '__*`[' + ucFirst(camel2human(token)) + ']`*__')
        : '__`' + key + '`__'
      output += (typeof routes.label[a] === 'string')
        ? ' (' + routes.label[a] + ')'
        : ''
      output += sep + '> __Route:__ '

      // Generate the full route string
      let route = ''
      let subSep = ''
      for (let b = 0; b <= c; b += 1) {
        route += subSep + '`'
        route += isID(routes.route[a][b])
          ? '_`' + routes.route[a][b] + '`_'
          : routes.route[a][b]
        route += '`'
        subSep = '/'
      }
      output += route.replace(/`(\/`_`)|(`_`\/)`|`(\/)`|(?<=_)`$/g, '$1$2$3')
      output += (typeof routes.description[a] === 'string')
        ? '\n' + sep + routes.description[a]
        : ''
    }
  }
  return output
}

doStuff.register({
  id: 'routes2md',
  name: 'Routes to Markdown format',
  func: routes2md,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Routes MD format
// ====================================================================
// START: Laravel insert SQL to JS

/**
 * Routes to Markdown format
 *
 * created by: Evan Wills
 * created: 2022-01-06 10:00:00
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const sql2json = (input, extraInputs, GETvars) => {
  const tableName = extraInputs.table()
  const colName = extraInputs.idProp()
  let id = 0
  const prefix = (extraInputs.stripPrefix() !== '')
    ? extraInputs.stripPrefix() + '_'
    : ''
  const addSaveState = extraInputs.extras('saveState')
  const addMessages = extraInputs.extras('messages')
  const dataType = (extraInputs.dataType() !== '')
    ? ': ' + extraInputs.dataType()
    : ''

  // console.group('sql2json')
  // console.log('prefix:', prefix)
  // console.log('addSaveState:', addSaveState)
  // console.log('addMessages:', addMessages)

  /**
   * Do the actual heavy lifting of wrapping long value strings so
   * the total length of line is less than 70 characters
   *
   * @param {number} base1 Length of white space to prefix wrapped
   *                       lines
   * @param {string} input String to wrap
   *
   * @returns {string} wrapped output
   */
  const wrapLongLineInner = (base1, input) => {
    const maxLen = 70 - (base1 + 4)
    const headReg = /[^ ]+$/s
    const tailReg = /^.+? (?=[^ ]+$)/s
    const sep = "' +\n" + ''.padStart(base1, ' ') + "'"
    let _sep = ''
    let head = ''
    let tail = input

    let a = 0
    while (tail.length > maxLen) {
      head += _sep + tail.substring(0, maxLen)
      tail = tail.substring(maxLen)

      if (head.substring(head.length - 1) !== ' ') {
        tail = head.replace(tailReg, '') + tail
        head = head.replace(headReg, '')
      }

      _sep = sep
      a += 1
      if (a > 100) {
        break
      }
    }

    return head + _sep + tail
  }

  /**
   * Handle makeing long value strings wrap at 70 characters
   *
   * @param {string} match whole pattern match
   * @param {string} field field part of match
   * @param {string} value value part of match
   *
   * @returns {string} wrapped version of whole match
   */
  const wrapLongLine = (match, field, value) => {
    const baseLen = 6 + field.length
    let output = value

    if ((baseLen + 3 + output.length) > 70) {
      output = wrapLongLineInner(baseLen, output)
    }

    return field + ": '" + output + "'"
  }

  /**
   * Convert SQL table name into JS property name
   *
   * @param {string} match
   * @param {string} key
   *
   * @returns {string}
   */
  const camelKey = (_match, _prefix, _key) => {
    const tmp = (_prefix !== prefix)
      ? _prefix + _key
      : _key
    return '    ' + snakeToCamelCase(tmp)
  }

  /**
   * Clean up the Laravel Insert code
   *
   * @param {string} input Do all the things needed to make each
   *                       object clean
   * @returns Text suitable for use as JavaScript objects
   */
  const standardClean = (input) => {
    let output = input.replace(/'\.[\r\n]+\s+'/g, '')
    console.group('standardClean()')
    // output = output.replace(/'/g, '"')

    if (addSaveState) {
      output = output.replace(
        / +\[/g,
        (_match) => {
          id += 1
          return '  {\n    ' + colName + ': ' + id + ',\n' +
                      '    saveState: 1,'
        }
      )
    } else {
      output = output.replace(
        / +\[/g,
        (_match) => {
          id += 1
          return '  {\n    ' + colName + ': ' + id + ','
        }
      )
    }

    // console.log('output:', output)
    if (addMessages) {
      output = output.replace(
        /[\r\n]+ +\]/g,
        ',\n    messages: {\n      error: \'\',\n      warning: \'\',\n      info: \'\'\n    }\n  }'
      )
    } else {
      output = output.replace(/ +\]/g, '  }')
    }
    // console.log('output:', output)
    output = output.replace(/ *=> +/g, ': ')
    // console.log('output:', output)
    output = output.replace(/ +'([a-z]+_)([a-z_]+)'(?=: )/ig, camelKey)
    output = output.replace(/\s*,\s*$/s, '')
    // console.log('output:', output)
    output = output.replace(/^(?:\s*\[)?/, '[')
    // console.log('output:', output)
    output = output.replace(/$/, '\n]')
    // console.log('output:', output)
    console.groupEnd()
    return output.replace(/(?<= {4})([a-z]+): '(.*?)'(?=,|[\r\n])/ig, wrapLongLine)
  }

  // console.log('tableName:', tableName)
  // console.log('tableName:', tableName)
  // console.groupEnd()
  return 'export const ' + snakeToCamelCase(
    tableName.replace('data_', '')
  ) + 'State ' + dataType + ' = ' + standardClean(input)
}

doStuff.register({
  id: 'sql2json',
  name: 'Laravel insert SQL to JS',
  func: sql2json,
  description: 'Convert Laravel insert SQL to Redux state constant',
  // docsURL: '',
  extraInputs: [{
    id: 'table',
    label: 'Table name',
    type: 'text'
  }, {
    id: 'idProp',
    label: 'ID column name',
    type: 'text'
  }, {
    id: 'extras',
    label: 'Add extra properties',
    options: [
      {
        default: true,
        label: 'Save State',
        value: 'saveState'
      },
      {
        default: true,
        label: 'Messages',
        value: 'messages'
      }
    ],
    type: 'checkbox'
  }, {
    id: 'stripPrefix',
    label: 'Prefix to strip from properties',
    type: 'text'
  }, {
    id: 'dataType',
    label: 'Typescript data type',
    type: 'text'
  }],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Laravel insert SQL to JS
// ====================================================================
// START: Laravel to JS post conversion cleanup

/**
 * Routes to Markdown format
 *
 * created by: Evan Wills
 * created: 2022-01-06 10:00:00
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const postConvertClean = (input, extraInputs, GETvars) => {
  const steps = [
    {
      find: /,(?=\s+(\]|\}))/sg,
      replace: ''
    },
    {
      find: /"([^"'\r\n]*)"/g,
      replace: '\'$1\''
    },
    {
      find: /;\s*$/sg,
      replace: ''
    // },
    // {
    //   find: /((?:title|href)=)'([^']+)'/g,
    //   replace: '$1"$2"'
    }
  ]
  let output = input
  // console.log('output:', output)

  for (let a = 0; a < steps.length; a += 1) {
    output = output.replace(steps[a].find, steps[a].replace)
    // console.log('output:', output)
    // console.log('steps[' + a + '].find:', steps[a].find)
    // console.log('steps[' + a + '].replace:', steps[a].replace)
  }

  return output
}

doStuff.register({
  id: 'postConvertClean',
  name: 'Laravel to JS clean-up',
  func: postConvertClean,
  description: 'Laravel to JS post conversion clean-up',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Laravel to JS post conversion clean-up
// ====================================================================
// START: _TMP const to private prop

/**
 * Convert constants to private properties
 *
 * created by: Evan Wills
 * created: 2022-03-09
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const constToProp = (input, extraInputs, GETvars) => {
  const _oldVar = []
  const _newVar = []
  const _replacer = (whole, key, value) => {
    const _tmp = '_' + snakeToCamelCase(key.toLowerCase())

    _oldVar.push(key)
    _newVar.push(_tmp)

    return '    private $' + _tmp + ' = ' + value + ';'
  }

  let output = input.replace(
    /define\('([^']+)', *('[^']+'|[0-9]+(?:\.[0-9]+)?)\);/ig,
    _replacer
  )

  for (let a = 0, c = _oldVar.length; a < c; a += 1) {
    output = output.replaceAll(
      _oldVar[a],
      '$this->' + _newVar[a]
    )
  }

  console.log()
  return output
}

doStuff.register({
  id: 'constToProp',
  name: 'Constants to private properties',
  func: constToProp,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  _TMP Constants to private properties
// ====================================================================
// START: Fixing custom properties

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2022-03-03
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const cssCustomProps = (input, extraInputs, GETvars) => {
  const regex = /(-(?:(?:-[a-z0-9]+)+))\s*:\s*(?:var\(-(?:-[a-z0-9]+)+(?:\s*,\s([^)]+)*)?\)|([^;]+));/ig
  const matches = input.matchAll(regex)

  const tail = '\n\n      background-color: inherit;' +
                 '\n      color: inherit;' +
                 '\n      font-family: inherit;' +
                 '\n      font-size: inherit;'

  let root = '\n    :root {'
  let host = '\n    :host {'
  let oldHost = '\n    :host {'

  for (const match of matches) {
    console.log('match:', match)
    const prop = match[1].replace(/^-(?:-wc)?/, '')
    const val = (typeof match[2] === 'string')
      ? match[2]
      : (typeof match[3] === 'string')
          ? match[3]
          : '[[UNDEFINED]]'
    root += '\n      -' + prop + ': ' + val + ';'
    host += '\n      --wc-' + prop + ': var(-' + prop + ');'
    oldHost += '\n      -wc-' + prop + ': ' + val + ';'
  }

  root += '\n    }\n'
  host += tail + '\n    }\n'
  oldHost += tail + '\n    }\n'

  return root + host + oldHost
}

doStuff.register({
  id: 'cssCustomProps',
  name: 'Fixing custom properties',
  func: cssCustomProps,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: true
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Fixing custom properties
// ====================================================================
// START: PDO::bindParam to PHP associative array

/**
 * PDO::bindParam to PHP associative array
 *
 * created by: Evan Wills
 * created: 2022-04-4
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const bindParam2AssArr = (input, extraInputs, GETvars) => {
  const regex = /\$stmt->bindParam\((':[A-Z0-9_]+'), (\$[a-z0-9_]+), (?:PDO::PARAM_[A-Z]+|\$[_a-z]+)\);.*?(?=[\r\n]|$)/ig
  const tmp = [...input.matchAll(regex)]
  let output = ''
  let sep = ''
  for (let a = 0; a < tmp.length; a += 1) {
    const key = tmp[a][1]
    const value = tmp[a][2]
    output += sep + '\n  ' + key + ' => ' + value
    sep = ','
  }
  if (output !== '') {
    output = '\n\n$tmp = [' + output + '\n];\n\n'
  } else {
    output = input
  }
  return output
}

doStuff.register({
  id: 'bindParam2AssArr',
  name: 'PDO::bindParam to PHP associative array',
  func: bindParam2AssArr,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  PDO::bindParam to PHP associative array
// ====================================================================
// START: MySQLi query to PDO

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2022-04-04
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const mysqli2pdo = (input, extraInputs, GETvars) => {
  if (input.trim() === '') {
    return ''
  }
  const method = extraInputs.queryMethod()
  const pdoVar = extraInputs.pdoVar()
  const tmp = `UPDATE  \`discounts\`
  SET     \`price\` = '$price1',
          \`price_student\` = '$price2',
          \`off_price\` = '$price3',
          \`off_price_student\` = '$price4',
          \`description\` = '".addslashes($description)."',
          \`dis_name\` = '".addslashes($dis_name)."'
  WHERE   \`discount_id\` = " . $dis_id`

  // const sql = input.trim()
  const sql = tmp.trim()

  if (sql.match(/^INSERT /i)) {
    console.log('we have an INSERT')
    const getFields = (_sql) => {
      return [..._sql.trim().matchAll(
        /\s*`?([^`,]+)`?(?:,|$)/ig
      )]
    }

    const fields = getFields(sql.replace(/^.*?\((.*?)\).*$/ims, '$1'))
    let values = ''
    let _vSep = '\n       '
    let bind = ''
    let debug = ''
    let _dSep = '\n    '
    for (let a = 0, c = fields.length; a < c; a += 1) {
      const _tmp = ':' + fields[a][1].toLocaleUpperCase()
      const __tmp = '\'' + _tmp + '\''
      values += _vSep + _tmp
      bind += '\n$stmt->bindParam(' + __tmp + ', $' + fields[a][1] + ', PDO::PARAM_STR);'
      _vSep = ',\n       '
      debug += _dSep + __tmp + ' => $' + fields[a][1]
      _dSep = ',\n    '
      fields[a] = _tmp
    }

    return '\n\n$stmt = ' + pdoVar + '->' + method + '(\n    \'' +
           sql.replace(/(VALUES\s*\().*\)\s*$/ims, '$1' + values) + '\n    )\'\n);' +
           '\n' + bind + '\n$stmt->execute();\n\n\n' +
           '$tmp = [' + debug + '\n];\n\n\nmergeParamsInSql($stmt, $tmp);'

    // console.log('tmp:', _tmp)
  } else if (sql.match(/^UPDATE /i)) {
    console.log('we have an UPDATE')
    // const getFields = (_sql) => {
    //   return [..._sql.trim().matchAll(
    //     /\s*`?([^`=]+)`?\s*=\s?[^,]+(?:,|$)/ig
    //   )]
    // }
    // const fields = getFields(sql.replace(/^UPDATE.*?SET(.*?)WHERE.*$/ims, '$1').trim())
  } else {
    console.log('we have an SELECT')
  }

  return tmp
}

doStuff.register({
  id: 'mysqli2pdo',
  name: 'MySQLi query to PDO',
  func: mysqli2pdo,
  description: 'Convert a MySQLi query string to PDO query and associated bits.',
  // docsURL: '',
  extraInputs: [{
    id: 'queryMethod',
    label: 'Query method',
    type: 'radio',
    options: [{
      value: 'prepare',
      label: 'Multi param',
      default: true
    }, {
      value: 'prepBindExec',
      label: 'Single ID param'
    }, {
      value: 'prepBindExecStr',
      label: 'Single string param'
    }]
  }, {
    id: 'pdoVar',
    label: 'PDO variable name',
    type: 'text',
    default: '$this->_pdo'
  }],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  MySQLi query to PDO
// ====================================================================
// START: Web component attributes to markdown documentation

/**
 * Convert web component attributes to markdown documentation
 *
 * created by: Evan Wills
 * created: 2022-04-04
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const webCompAttr = (input, extraInputs, GETvars) => {
  let output = ''

  const _attrs = [...input.matchAll(/\/\*\*\s*[\r\n]\s*\*\s*(.*?)[\r\n]*\s*\*\/\s*[\r\n]*\s*@property\([^)]*\)\s*[\r\n]*\s*([a-z0-9]+)\s*:\s*([a-z]+)\s*=\s*([^;\r\n]+);?\s*(?=[\r\n]|$)/igms)]

  const tmp = []

  for (let a = 0, c = _attrs.length; a < c; a += 1) {
    tmp.push({
      id: _attrs[a][2],
      content: '\n\n### `' + _attrs[a][2].toLowerCase() + '` - ' + ucFirst(camel2human(_attrs[a][2]).toLowerCase()) + '\n\n' +
               '*{`' + _attrs[a][3] + '`}* &ndash; *[default: `' + _attrs[a][4] + '`]*\n\n' +
               _attrs[a][1].replace(
                 /\s*[\r\n]+\s*\*\s*/, ' '
               ).replace(
                 /(?<=^|[\r\n])(\s*\*)(?:\s+\*)/g, '$1'
               ) + '\n'
    })
  }
  if (extraInputs.sortOrder('alpha') === true) {
    tmp.sort((itemA, itemB) => {
      if (itemA.id < itemB.id) {
        return -1
      } else if (itemA.id > itemB.id) {
        return 1
      } else {
        return 0
      }
    })
  }

  for (let a = 0, c = tmp.length; a < c; a += 1) {
    output += tmp[a].content
  }
  return output
}

doStuff.register({
  id: 'webCompAttr',
  name: 'Web component attributes to markdown documentation',
  func: webCompAttr,
  description: '',
  // docsURL: '',
  extraInputs: [{
    id: 'sortOrder',
    type: 'checkbox',
    label: 'Sort order',
    options: [{
      value: 'alpha',
      label: 'Sort attributes into alphabetical order',
      default: true
    }]
  }],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Web component attributes to markdown documentation

// ====================================================================
// START: DB Enum to TS IDbEnum objects

const wrapDesc = (input) => {
  const _input = input.replace(/(?<=[^\\])'/g, '\\\'')
  const len = 48
  const lenAll = len - 3

  if (_input.length < (lenAll)) {
    return "'" + _input + "'"
  }

  let _tmpFront = _input.substring(0, len)
  let _tmpBack = _input.substring(len)
  let output = "'" + _tmpFront.replace(/^(.*?\s+)[^\s+]+$/, '$1') + "'"

  let _tail = _tmpFront.replace(/.*?\s+([^\s]+)$/, '$1')

  let _next = (_tail !== _tmpFront)
    ? _tail + _tmpBack
    : _tmpBack
  while (_next.length > lenAll) {
    _tmpFront = _next.substring(0, len)
    _tmpBack = _next.substring(len)
    _tail = _tmpFront.replace(/.*?\s+([^\s]+)$/, '$1')
    _next = (_tail !== _tmpFront)
      ? _tail + _tmpBack
      : _tmpBack

    output += " +\n                 '" +
              _tmpFront.replace(/^(.*?\s+)[^\s+]+$/, '$1') +
              "'"
  }

  if (_next.length > 0) {
    output += " +\n                 '" + _next + "'"
  }

  return output
}

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2022-05-23
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const dbEnum2IDbEnum = (input, extraInputs, GETvars) => {
  const _name = snakeToCamelCase(extraInputs.name().replace(/_+$/, '').replace(/^enum_/i, ''))
  let _id = (extraInputs.basezero('1'))
    ? 1
    : 0

  const cleaner = [
    {
      find: /\/\/.*?[\r\n]+/g,
      replace: ''
    },
    {
      find: / *[\r\n]+ +/g,
      replace: ''
    },
    {
      find: /'\.'/ig,
      replace: ''
    },
    {
      find: /\[([^[\]]+)\]/isg,
      replace: '{$1}'
    },
    {
      find: /"/g,
      replace: '\\"'
    },
    {
      find: /\\'/g,
      replace: '\''
    },
    {
      find: /'[a-z0-9]+(?:_[a-z0-9]+)*_(name|description)'\s*=>\s*'(.*?)'(,|\})/ig,
      replace: '"$1": "$2"$3'
    },
    {
      find: /^(?:\s*\[\s*)*/g,
      replace: '['
    },
    {
      find: /(?<=\})(?:(?:,?\s*)?(?:\],?\s*)?)*$/g,
      replace: ']'
    }
  ]

  let _tmp = input

  for (let a = 0; a < cleaner.length; a += 1) {
    _tmp = _tmp.replace(cleaner[a].find, cleaner[a].replace)
  }

  let _data = null
  try {
    _data = JSON.parse(_tmp)
  } catch (error) {
    console.error(
      'Could not parse input Laravel Migration code. ' + error
    )
    return input
  }

  let output = 'export const ' + _name + ' : Array<IDbEnum> = ['
  let _sep = ''
  for (let a = 0; a < _data.length; a += 1) {
    output += _sep + '\n  {\n    id: ' + _id + ',\n' +
              "    name: '" + _data[a].name + "',\n" +
              '    description: ' + wrapDesc(_data[a].description) + '\n' +
              '  }'
    _sep = ','
    _id += 1
  }

  return output + '\n];\n'
}
// '    description: "'
doStuff.register({
  id: 'dbEnum2IDbEnum',
  name: 'DB Enum to TS IDbEnum objects',
  func: dbEnum2IDbEnum,
  description: '',
  // docsURL: '',
  extraInputs: [
    {
      id: 'name',
      label: 'DB Table name',
      type: 'text',
      description: 'Name of enum table in DB (to be converted to camelCase',
      pattern: '^[a-z0-9]+(?:_[a-z0-9]+)*$',
      default: ''
    }, {
      id: 'basezero',
      label: 'Index start',
      options: [
        {
          label: 'Index starts at one',
          value: '1'
        }
      ],
      type: 'checkbox'
    }
  ],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  DB Enum to TS IDbEnum objects
// ====================================================================
// START: Clean up converted Laravel Insert to Redux state

/**
 * Clean up converted Laravel Insert to Redux state
 *
 * created by: Firstname LastName
 * created: YYYY-MM-DD
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const postLaravelClean = (input, extraInputs, GETvars) => {
  let output = input.replace(/"/g, '\'')

  const regex = /(?<=(?:title|href)=)'([^']+)'/ig

  output = output.replace(/(?<=[a-z])(?='[a-z])/ig, '\\')
  output = output.replace(/(?<=[^a-z])(?='\]\+)/ig, '\\')
  output = output.replace(/(?<= )'([a-z]+)'(?= )/ig, '"$1"')
  output = output.replace(regex, '"$1"')

  output = output.replace(
    'const tmp',
    'import { IInputFieldType } from \'../../types/IInputFields\';\n\n' +
    'export const inputFieldTypesState: Array<IInputFieldType>'
  )

  return output
}

doStuff.register({
  id: 'postLaravelClean',
  name: 'Clean up converted Laravel Insert to Redux state',
  func: postLaravelClean,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Clean up converted Laravel Insert to Redux state
// ====================================================================
// START: Typescript Types to PHP class stuff (Laravel)

/**
 * Get PHP class properties from Typescript interface definition
 *
 * created by: Evan Wills
 * created: 2022-06-08
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const ts2Php = (input, extraInputs, GETvars) => {
  /**
   * Convert Typescript types into PHP class private properties
   *
   * @param {string} _whole
   * @param {string|undefined} space
   * @param {string|undefined} comClose
   * @param {string} prop
   * @param {string} propType
   *
   * @returns {string} Get class properties
   */
  const firstClean = (_whole, comClose, prop, propType) => {
    let value = 'null'

    switch (propType.toLowerCase()) {
      case 'boolean':
        value = 'false'
        break

      case 'string':
        value = '\'\''
        break

      case 'number':
        propType = 'integer'
        value = '0'
        break

      case 'array':
        value = '[]'
        break
    }

    const comment = (typeof comClose === 'string' && comClose !== '')
      ? '\n   *\n   * @var ' + propType + ' $_' + prop + '\n   */\n  '
      : ''

    return comment + '  private $_' + prop + ' = ' + value + ';\n'
  }
  const classStr = extraInputs.className()
  const _classstr = camel2human(classStr).toLowerCase()

  let output = '<?php\n' +
               '/**\n' +
               ' * ' + classStr +
               ' class provides a way of importing ' + _classstr + 's from external\n' +
               ' * systems and making their data easy to use\n' +
               ' *\n' +
               ' * PHP Version 8.x\n' +
               ' *\n' +
               ' * @category Expensum_DataExtract\n' +
               ' * @package  Expensum_DataExtract\n' +
               ' * @author   Evan Wills <evan.wills@acu.edu.au>\n' +
               ' * @license  ACU https://www.acu.edu.au\n' +
               ' * @link     https://www.acu.edu.au\n' +
               ' */\n\n\n' +
               '/**\n' +
               ' * ' + classStr +
               ' class provides a way of importing ' + _classstr + 's from external\n' +
               ' * systems and making their data easy to use\n' +
               ' *\n' +
               ' * @category Expensum_DataExtract\n' +
               ' * @package  Expensum_DataExtract\n' +
               ' * @author   Evan Wills <evan.wills@acu.edu.au>\n' +
               ' * @license  ACU https://www.acu.edu.au\n' +
               ' * @link     https://www.acu.edu.au\n' +
               ' */\n\n' +
               'class ' + classStr + '\n{'

  output += input.trim().replace(
    /(?:[\r\n]* +(\*\/[\r\n]+ +))?([a-z0-9]+): ([a-z]+)[^,]*(?:,|$)/ig,
    firstClean
  )

  let construct = ''
  let toStr = ''
  const tmp = input.trim().match(/(?<=[\r\n]+ +)([a-z0-9]+): ([a-z]+)(?=[^,]+(?:,|$))/ig)

  for (let a = 0; a < tmp.length; a += 1) {
    const bits = tmp[a].split(': ')
    const _key = bits[0].trim()
    const _type = bits[1].trim().toLowerCase()
    construct += '\n        $this->_' + _key + ' = $data[\'' + _key + '\'];'
    toStr += '\n            "      ' + _key + ': '
    toStr += (_type === 'array')
      ? '[".implode(\',\\n          \', $this->_' + _key + ')."]'
      : '{$this->_' + _key + '}'
    toStr += ',\\n".'
  }
  output += '\n' +
            '    /**\n' +
            '     * Constructor for ' + classStr + ' object\n' +
            '     *\n' +
            '     * @param array   $data ' + _classstr + ' data from DB\n' +
            '     * @param integer $id   Expensum ID for this ' + _classstr + '\n' +
            '     */\n' +
            '    public function __construct(array $data, int $id)\n' +
            '    {\n' + construct + '\n    }\n\n' +
            '    /**\n' +
            '     * Get this object as a JavaScript object\n' +
            '     *\n' +
            '     * @return string\n' +
            '     */\n' +
            '    public function __toString() : string\n' +
            '    {\n' +
            '        return "{\\n".' + toStr + '\n' +
            '            "    }";\n' +
            '    }\n\n' +
            '    /**\n' +
            '     * Get the expensum ID for this ' + _classstr + '\n' +
            '     *\n' +
            '     * @return integer\n' +
            '     */\n' +
            '    public function id() : string\n' +
            '    {\n' +
            '        return $this->_id;\n' +
            '    }\n\n' +
            '    /**\n' +
            '     * Set the created at & updated at times for this ' + _classstr + '\n' +
            '     *\n' +
            '     * @param integer $time Unix timestamp for when the ' + _classstr + '\n' +
            '     *                      was created' +
            '     *\n' +
            '     * @return boolean TRUE if properties were updated.\n' +
            '     *                 FALSE otherwise\n' +
            '     */\n' +
            '    public function setMeta(int $time) : bool\n' +
            '    {\n' +
            '        if ($this->_createdAt === 0) {\n' +
            '            $this->_createdAt = $time;\n' +
            '            $this->_updatedAt = $time;\n\n' +
            '            return true;\n' +
            '        }\n' +
            '    }\n}\n'

  return output
}

doStuff.register({
  id: 'ts2Php',
  name: 'Typescript Types to PHP class stuff (Laravel)',
  func: ts2Php,
  description: 'Generate a PHP class based',
  // docsURL: '',
  extraInputs: [{
    id: 'className',
    label: 'Class name',
    type: 'text',
    description: 'Name of class that will encapsulate the supplied data',
    pattern: '',
    default: ''
  }],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Typescript Types to PHP class stuff (Laravel)
// ====================================================================
// START: Sort typescript type properties alphabetically

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2022-06-19
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const sortTypeProps = (input, extraInputs, GETvars) => {
  const tmp = input.split('\n').map(
    line => line.trim()
  ).filter(
    line => {
      if (line === '') {
        return false
      }
      const two = line.substring(0, 2)
      console.group('sortTypeProps() - filter')
      console.log('line:', line)
      console.log('two:', two)
      console.log('[\'//\', \'/*\', \' *\'].indexOf(two):', ['//', '/*', ' *'].indexOf(two))
      console.groupEnd()
      return ['//', '/*', '*/', '*,', '* ', ' *'].indexOf(two) === -1
    }
  ).map(
    line => line.replace(/ ?\?? ?: ?/g, ' ? : ')
  )

  tmp.sort((a, b) => {
    if (a < b) {
      return -1
    } else if (a > b) {
      return 1
    }
    return 0
  })

  let sep = ''

  return tmp.reduce(
    (last, line) => {
      const output = last + sep + line.replace(/^(.*?),?$/, '  $1,')
      sep = '\n'
      return output
    },
    ''
  ).replace(/((?<=[\r\n]) {2}[^,]+,[\r\n]+)\1+/g, '$1')
}

doStuff.register({
  id: 'sortTypeProps',
  name: 'Sort typescript type properties alphabetically',
  func: sortTypeProps,
  description: '',
  // docsURL: '',
  extraInputs: [],
  // group: '',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Sort typescript type properties alphabetically
// ====================================================================
// START: Test ACU staff ID regex pattern

/**
 * Test ACU staff ID regex pattern
 *
 * created by: Evan Wills
 * created: 2022-10-15
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const staffIdRegex = (input, extraInputs, GETvars) => {
  const tmp = input.split('\n')
  const regex = /^(?:[0-9][A-Z]|[A-Z]{1,2})?[0-9]{3,6}$/
  let output = ''
  let sep = ''

  // console.log('tmp:', tmp)
  for (let a = 0; a < tmp.length; a += 1) {
    const _tmp = tmp[a].trim()

    if (regex.test(_tmp) === false) {
      output += sep + _tmp
      sep = '\n'
    }
  }

  return output
}

doStuff.register({
  id: 'staffIdRegex',
  name: 'Test ACU staff ID regex pattern',
  func: staffIdRegex,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: true
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Test ACU staff ID regex pattern
// ====================================================================
// START: Test ACU staff username regex pattern

/**
 * Test staff ID regex pattern
 *
 * created by: Evan Wills
 * created: 2022-10-15
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const staffUsernameRegex = (input, extraInputs, GETvars) => {
  const tmp = input.split('\n')
  const regex = /^[a-z_-]{4,24}$/
  let output = ''
  let sep = ''

  // console.log('tmp:', tmp)
  for (let a = 0; a < tmp.length; a += 1) {
    const _tmp = tmp[a].trim()

    console.log('tmp[' + a + ']:', tmp[a])
    console.log('regex:', regex)
    console.log(regex + 'test(' + _tmp + '):', regex.test(_tmp))
    if (regex.test(_tmp) === false) {
      output += sep + _tmp
      sep = '\n'
    }
  }

  return output
}

doStuff.register({
  id: 'staffUsernameRegex',
  name: 'Test ACU staff username regex pattern',
  func: staffUsernameRegex,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: true
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  est ACU staff username regex pattern
// ====================================================================
// START: Modify unit test code

const unitTestCode = `

    // ----------------------------------------------------

    /**
     * Test trying to update user object's \`[[PROPERTY]]\` property with (bad)
     * string value
     *
     * @return void
     */
    public function testFail[[TEST_METHOD]]NotInt() : void
    {
        /**
         * User object to be tested
         *
         * @var ImportUser
         */
        $user = new ImportUser(self::DUMMY_USER);
        $this->expectError(\\Exception::class);
        $this->expectErrorMessageMatches(
            '/^Argument 1 passed to ImportUser::[[METHOD]]\\(\\) '.
            'must be of the type int,/'
        );
        $user->[[METHOD]]('blah');

    }

    /**
     * Test trying to update user object's \`[[PROPERTY]]\` property with (bad)
     * negative integer value
     *
     * @return void
     */
    public function testFail[[TEST_METHOD]]Minus() : void
    {
        /**
         * User object to be tested
         *
         * @var ImportUser
         */
        $user = new ImportUser(self::DUMMY_USER);
        $this->expectException(\\Exception::class);
        $this->expectExceptionMessage(
            'ImportUser::[[METHOD]]() expects only parameter '.
            '\`$[[PROPERTY]]ID\` to be an integer between 0 and [[MAX]] '.
            '(inclusive).'
        );
        $user->[[METHOD]](-1);
    }

    /**
     * Test trying to update user object's \`[[PROPERTY]]\` property with (bad)
     * excessively high integer value
     *
     * @return void
     */
    public function testFail[[TEST_METHOD]]High() : void
    {
        /**
         * User object to be tested
         *
         * @var ImportUser
         */
        $user = new ImportUser(self::DUMMY_USER);
        $this->expectException(\\Exception::class);
        $this->expectExceptionMessage(
            'ImportUser::[[METHOD]]() expects only parameter '.
            '\`$[[PROPERTY]]ID\` to be an integer between 0 and [[MAX]] '.
            '(inclusive).'
        );
        $user->[[METHOD]]([[MAX1]]);
    }

    /**
     * Test trying to update user object's \`[[PROPERTY]]\` property with (good)
     * integer value
     *
     * @return void
     */
    public function test[[TEST_METHOD]]() : void
    {
        /**
         * User object to be tested
         *
         * @var ImportUser
         */
        $user = new ImportUser(self::DUMMY_USER);

        $old = $user->[[PROPERTY]];
        $expected = 1;
        $user->[[METHOD]]($expected);
        $actual = $user->[[PROPERTY]];

        $this->assertNotEquals(
            $old,
            $actual,
            'Expected ImportUser::[[METHOD]]() to update the '.
            '\`[[PROPERTY]]\` property of user object'
        );
        $this->assertIsInt(
            $actual,
            'Expected user property \`[[PROPERTY]]\` to be an integer '.
            'after calling ImportUser::[[METHOD]]() with valid input'
        );
        $this->assertEquals(
            $expected,
            $actual,
            'Expected user property \`[[PROPERTY]]\` to be the integer '.
            $expected.' after calling ImportUser::[[METHOD]]() with '.
            'valid input'
        );
    }`

/**
 * Test staff ID regex pattern
 *
 * created by: Evan Wills
 * created: 2022-10-15
 *
 * @param {string} input user supplied content (expects HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *               fields specified when registering the ation
 * @param {object} GETvars all the GET variables from the URL as
 *               key/value pairs
 *               NOTE: numeric strings are converted to numbers and
 *                     "true" & "false" are converted to booleans
 *
 * @returns {string} modified version user input
 */
const modifyUnitTestCode = (input, extraInputs, GETvars) => {
  const prop = extraInputs.property()
  const method = ucFirst(snakeToCamelCase(prop))
  const things = [
    { key: 'max', value: extraInputs.max() },
    { key: 'max1', value: (extraInputs.max() + 1) },
    { key: 'property', value: prop },
    { key: 'method', value: 'set' + method },
    { key: 'test_method', value: 'Set' + method }
  ]
  const findReplace = []
  for (let a = 0; a < things.length; a += 1) {
    findReplace.push(
      {
        find: new RegExp('\\[\\[' + things[a].key.toUpperCase() + '\\]\\]', 'g'),
        replace: things[a].value
      }
    )
  }

  return multiLitRegexReplace(unitTestCode, findReplace)
}

doStuff.register({
  id: 'modifyUnitTestCode',
  name: 'Modify unit test code',
  func: modifyUnitTestCode,
  description: '',
  // docsURL: '',
  extraInputs: [{
    id: 'property',
    label: 'property',
    type: 'text',
    description: '',
    pattern: '',
    default: ''
  }, {
    id: 'max',
    label: 'Max',
    min: 1,
    max: 100000,
    step: 10,
    default: 0,
    type: 'number'
  }],
  group: 'evan',
  ignore: true
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Modify unit test code
// ====================================================================
// START: Get Unit test stats

/**
 * Action description goes here
 *
 * created by: Firstname LastName
 * created: YYYY-MM-DD
 *
 * @param {string} input       user supplied content
 *                             (expects text HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *                             fields specified when registering
 *                             the ation
 * @param {object} GETvars     all the GET variables from the URL as
 *                             key/value pairs
 *                             NOTE: numeric strings are converted
 *                                   to numbers and "true" & "false"
 *                                   are converted to booleans
 *
 * @returns {string} modified version user input
 */
const getUnitTestStats = (input, extraInputs, GETvars) => {
  const regex = /(?<=^|[\r\n])={80}[\r\n\t ]+([a-z ]+?) Tests.*?Time: ([0-9]{2}):([0-9]{2}\.[0-9]{3}).*?(?:OK \(([0-9]+) tests, ([0-9]+) assertions\)|Tests: ([0-9]+), Assertions: ([0-9]+), Failures: ([0-9]+).)/gism
  const basic = [['Test suite', 'Tests', 'Assertions', 'Errors', 'Time', 'Avg assert/test', 'Avg time/test'].join('\t')]
  const overall = {
    suites: {
      total: 0,
      average: -1,
      averagePerTest: -1,
      min: -1,
      max: -1
    },
    tests: {
      total: 0,
      average: 0,
      averagePerTest: -1,
      min: 100000,
      max: 0
    },
    assertions: {
      total: 0,
      average: 0,
      averagePerTest: 0,
      min: 100000,
      max: 0
    },
    time: {
      total: 0,
      average: 0,
      averagePerTest: 0,
      min: 100000,
      max: 0
    },
    errors: {
      total: 0,
      average: 0,
      averagePerTest: 0,
      min: 100000,
      max: 0
    }
  }
  let bits

  const emptyStr = (input) => {
    return (input < 0)
      ? ''
      : round(input, 3)
  }

  while ((bits = regex.exec(input)) !== null) {
    const temp = {
      name: (bits[1]),
      tests: (typeof bits[6] !== 'undefined')
        ? (bits[6] * 1)
        : (bits[4] * 1),
      assertions: (typeof bits[7] !== 'undefined')
        ? (bits[7] * 1)
        : (bits[5] * 1),
      errors: (typeof bits[8] !== 'undefined')
        ? (bits[8] * 1)
        : 0,
      time: (bits[2] * 60) + (bits[3] * 1),
      avgAssertions: 0,
      avgTime: 0
    }

    temp.avgAssertions = temp.assertions / temp.tests
    temp.avgTime = temp.time / temp.tests

    basic.push(
      [
        ucFirst(temp.name),
        temp.tests,
        temp.assertions,
        temp.errors,
        temp.time,
        round(temp.avgAssertions, 3),
        round(temp.avgTime, 3)
      ].join('\t')
    )

    overall.suites.total += 1

    overall.tests.total += temp.tests
    if (temp.tests < overall.tests.min) {
      overall.tests.min = temp.tests
    }
    if (temp.tests > overall.tests.max) {
      overall.tests.max = temp.tests
    }

    overall.assertions.total += temp.assertions
    if (temp.assertions < overall.assertions.min) {
      overall.assertions.min = temp.assertions
    }
    if (temp.assertions > overall.assertions.max) {
      overall.assertions.max = temp.assertions
    }

    overall.time.total += temp.time
    if (temp.time < overall.time.min) {
      overall.time.min = temp.time
    }
    if (temp.time > overall.time.max) {
      overall.time.max = temp.time
    }

    overall.errors.total += temp.errors
    if (temp.errors < overall.errors.min) {
      overall.errors.min = temp.errors
    }
    if (temp.errors > overall.errors.max) {
      overall.errors.max = temp.errors
    }
  }

  overall.tests.average = round((overall.tests.total / overall.suites.total), 3)
  overall.assertions.average = round((overall.assertions.total / overall.suites.total), 3)
  overall.assertions.averagePerTest = round((overall.assertions.total / overall.tests.total), 3)
  overall.time.average = round((overall.time.total / overall.suites.total), 3)
  overall.time.averagePerTest = round((overall.time.total / overall.tests.total), 3)
  overall.errors.average = round((overall.errors.total / overall.suites.total), 3)
  overall.errors.averagePerTest = round((overall.errors.total / overall.tests.total), 3)

  // console.log('overall:', overall)
  // console.log('basic:', basic)

  const tmp = [['\tTotal\tAverage\tAvg/Test\tMinimum\tMaximum']]

  for (const key in overall) {
    tmp.push([
      ucFirst(key),
      round(overall[key].total, 3),
      emptyStr(overall[key].average),
      emptyStr(overall[key].averagePerTest),
      emptyStr(overall[key].min),
      emptyStr(overall[key].max)
    ].join('\t'))
  }

  let output = '__Last run:__ ' + new Date().toLocaleString('en-au')
  output += '\n\nThe following table provides basic statistics for ' +
            'the whole run\n\n'
  output += tab2markdown(tmp.join('\n'), extraInputs, GETvars)

  output += '\n\n\nThe following table provides statistics for ' +
            'each suite of unit tests\n\n'
  output += tab2markdown(basic.join('\n'), extraInputs, GETvars)

  return output
}

doStuff.register({
  id: 'getUnitTestStats',
  name: 'Get Unit test stats',
  func: getUnitTestStats,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Get Unit test stats
// ====================================================================
// START: Extract unit test data

/**
 * Action Extract unit test data
 *
 * created by: Evan Wills
 * created: 2022-11-16
 *
 * @param {string} input       user supplied content
 *                             (expects text HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *                             fields specified when registering
 *                             the ation
 * @param {object} GETvars     all the GET variables from the URL as
 *                             key/value pairs
 *                             NOTE: numeric strings are converted
 *                                   to numbers and "true" & "false"
 *                                   are converted to booleans
 *
 * @returns {string} modified version user input
 */
const extractUnitTestData = (input, extraInputs, GETvars) => {
  const regex1 = /={80}[\r\n\t ]*(.*?)[\r\n\t ]*-{80}/gsm
  const regex2 = /^(.*?) test/i
  let outer = []

  while ((outer = regex1.exec(input)) !== null) {
    console.log('outer[1]:', outer[1])
    const bits = outer[1].match(regex2)
    console.log('bits:', bits)
  }

  return input
}

doStuff.register({
  id: 'extractUnitTestData',
  name: 'Extract unit test data',
  func: extractUnitTestData,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Extract unit test data
// ====================================================================
// START: Row comment

/**
 * Action description goes here
 *
 * created by: Evan Wills
 * created: 2022-12-05
 *
 * @param {string} input       user supplied content
 *                             (expects text HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *                             fields specified when registering
 *                             the ation
 * @param {object} GETvars     all the GET variables from the URL as
 *                             key/value pairs
 *                             NOTE: numeric strings are converted
 *                                   to numbers and "true" & "false"
 *                                   are converted to booleans
 *
 * @returns {string} modified version user input
 */
const rowComment = (input, extraInputs, GETvars) => {
  let c = -1
  const doReplace = (whole) => {
    c += 1
    return whole + ' data-row="' + c + '"'
  }

  return input.replace(/(?<=<tr)(?=>)/g, doReplace)
}

doStuff.register({
  id: 'rowComment',
  name: 'Row comment',
  func: rowComment,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Row comment
// ====================================================================
// START: Laravel fixed option to CFB insert SQL

/**
 * Laravel fixed option to CFB insert SQL
 *
 * created by: Evan Wills
 * created: 2022-12-19
 *
 * @param {string} input       user supplied content
 *                             (expects text HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *                             fields specified when registering
 *                             the ation
 * @param {object} GETvars     all the GET variables from the URL as
 *                             key/value pairs
 *                             NOTE: numeric strings are converted
 *                                   to numbers and "true" & "false"
 *                                   are converted to booleans
 *
 * @returns {string} modified version user input
 */
const laravelToSql = (input, extraInputs, GETvars) => {
  const fieldID = extraInputs.id()

  const l1 = (whole, inner) => {
    const bits = {
      key: '',
      label: '',
      show: 1
    }
    const regex = /'(value|label|hide)' => (?:(true|false)|'(.*?)'(?:[.][\s\r\n\t ]*'(.*?)'(?:[.][\s\r\n\t ]*'(.*?)')?)?)(?=,|$)/igsm
    let subBits

    while ((subBits = regex.exec(inner)) !== null) {
      console.log('subBits:', subBits)
      switch (subBits[1]) {
        case 'value':
          bits.key = subBits[3]

          if (typeof subBits[4] === 'string') {
            bits.key += subBits[4]
            if (typeof subBits[4] === 'string') {
              bits.key += subBits[4]
            }
          }
          break

        case 'label':
          bits.label = subBits[3]
          if (typeof subBits[4] === 'string') {
            bits.label += subBits[4]
            if (typeof subBits[4] === 'string') {
              bits.label += subBits[4]
            }
          }
          break

        case 'hide':
          bits.show = (subBits[2] === 'true')
            ? '0'
            : '1'
          break
      }
    }

    if (bits.label === '') {
      bits.label = bits.key
    }

    console.log('inner:', inner)
    console.log('bits:', bits)

    return ',\n     ( ' + fieldID + ', "' + bits.key + '", ' +
          '"' + bits.label + '", ' + bits.show + ' )'
  }

  return input.replace(/\[[a-z]+\]/ig, '').replace(/[\s\r\n\t ]*\[[\s\r\n\t ]*(.*?)[\s\r\n\t ]*\][\s\r\n\t ]*,?/gism, l1)
}

doStuff.register({
  id: 'laravelToSql',
  name: 'Laravel fixed option to CFB insert SQL',
  func: laravelToSql,
  description: '',
  // docsURL: '',
  extraInputs: [{
    id: 'id',
    label: 'ID',
    min: 1,
    max: 1000,
    step: 1,
    default: 0,
    type: 'number'
  }],
  // group: '',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Laravel fixed option to CFB insert SQL
// ====================================================================
// START: Stored Procedure Parameters

/**
 * Convert table defnition to Stored Procedure Parameters
 *
 * created by: Evan Wills
 * created: 2022-12-20
 *
 * @param {string} input       user supplied content
 *                             (expects text HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *                             fields specified when registering
 *                             the ation
 * @param {object} GETvars     all the GET variables from the URL as
 *                             key/value pairs
 *                             NOTE: numeric strings are converted
 *                                   to numbers and "true" & "false"
 *                                   are converted to booleans
 *
 * @returns {string} modified version user input
 */
const storedProcParams = (input, extraInputs, GETvars) => {
  const _cols = []
  const _tableName = input.replace(/^[\r\n\t \s]*CREATE TABLE `([^`]+)`.*$/ism, '$1')
  const _thingName = _tableName.replace(/s$/i, '')
  const regex = /(-- +)?`([a-z_]+)`( (?:varchar|char|float|datetime|timestamp|text|(?:tiny|small|medium)?int)(?:\([0-9]+\))?(?: unsigned)?)[^,]*(,|$)/ig
  let maxCol = 0
  let maxIn = 0
  let maxParam = 0
  let _tmp
  let _x = 0

  let outputIn = ''
  let outputInsertFields = ''
  let outputInsertValues = ''
  let outputUpdate = ''
  let outputSelect = ''

  while ((_tmp = regex.exec(input)) !== null) {
    // console.log('_tmp:', _tmp);
    const _cmnt = (typeof _tmp[1] === 'string')
    const _col = _tmp[2]
    const _param = _tmp[2].replace(/_/g, '')
    const _in = 'IN ' + _param + _tmp[3]

    if (_param.length > maxCol) {
      maxCol = _param.length
    }
    if (_in.length > maxIn) {
      maxIn = _in.length
    }
    if (_param.length > maxParam) {
      maxParam = _param.length
    }

    _cols.push({
      comment: _cmnt,
      col: _col,
      param: _param,
      camel: snakeToCamelCase(_col),
      in: _in
    })
  }

  maxIn += 2
  maxCol += 4
  const maxColIn = maxCol + 1
  maxParam += 2

  for (let a = 0; a < _cols.length; a += 1) {
    const _sep = (a < _cols.length - 1)
      ? ','
      : ''
    let _pre = '\n        '
    _pre += _cols[a].comment
      ? '--  '
      : '    '
    _x += (_cols[a].comment)
      ? 0
      : 1
    const _b = (_cols[a].comment)
      ? '  '
      : (_x < 10)
          ? ' ' + _x
          : _x

    outputIn += _pre + strPad(_cols[a].in + _sep, maxIn) + '-- ' + _b
    outputInsertValues += _pre + strPad(_cols[a].param + _sep, maxParam) + '-- ' + _b + ' - `' + _cols[a].col + '`'
    outputInsertFields += _pre + strPad('`' + _cols[a].col + '`' + _sep, maxColIn) + '-- ' + _b + ' - ' + _cols[a].param + ''
    outputUpdate += _pre + strPad('`' + _cols[a].col + '`', maxCol) + ' = ' + _cols[a].param + _sep
    outputSelect += _pre + '   ' + strPad('`' + _cols[a].col + '`', maxCol) + ' AS `' + snakeToCamelCase(_cols[a].col) + '`' + _sep
  }
  const extraSelect = 'SELECT ' + outputSelect.replace(/^[\r\n\t\ ]+/, '') + '\n        FROM   `' + _tableName + '`\n        WHERE  `id` = '

  const output =  '     CREATE PROCEDURE `get_' + _thingName + '_by_id` (\n        uniqueid int(11) unsigned\n     )\n' +
                  '     BEGIN\n        ' + extraSelect + 'uniqueid;\n' +
                  '     END;\n\n\n' +
                  '     -- ==========================================\n\n\n' + 
                  '     CREATE PROCEDURE `add_new_' + _thingName + '` (' + outputIn + '\n     )\n' +
                  '     BEGIN\n        INSERT INTO `' + _tableName + '` (' + outputInsertFields + '\n' +
                  '        ) VALUES (' + outputInsertValues + '\n        );\n\n' +
                  '        CALL get_' + _thingName + '_by_id(LAST_INSERT_ID());\n' +
                  '     END;\n\n\n' +
                  '     -- ==========================================\n\n\n' + 
                  '     CREATE PROCEDURE `update_' + _thingName + '` (' + outputIn + '\n     )\n' +
                  '     BEGIN\n        UPDATE `' + _tableName + '`\n' +
                  '        SET' + outputUpdate + '\n        WHERE `id` = uniqueid;\n\n' +
                  '        CALL get_' + _thingName + '_by_id(id);\n' +
                  '     END;'
  
  return output.replace(/(`[a-z0-9_]+`) +AS \1/g, '$1')
}

doStuff.register({
  id: 'storedProcParams',
  name: 'Table definition to Stored procedure parameters',
  func: storedProcParams,
  description: '',
  // docsURL: '',
  extraInputs: [
    // {
    //   id: 'tableName',
    //   label: 'Table name',
    //   type: 'text',
    //   description: '',
    //   pattern: '',
    //   default: ''
    // }
  ],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Stored Procedure Parameters
// ====================================================================
// START: turning tool codes

/**
 * Action description goes here
 *
 * created by: Firstname LastName
 * created: YYYY-MM-DD
 *
 * @param {string} input       user supplied content
 *                             (expects text HTML code)
 * @param {object} extraInputs all the values from "extra" form
 *                             fields specified when registering
 *                             the ation
 * @param {object} GETvars     all the GET variables from the URL as
 *                             key/value pairs
 *                             NOTE: numeric strings are converted
 *                                   to numbers and "true" & "false"
 *                                   are converted to booleans
 *
 * @returns {string} modified version user input
 */
const turningToolCodes = (input, extraInputs, GETvars) => {
  const angles = ['000', '075', '150', '225', '300', '375', '450']
  const hand = ['L', 'R']
  const type = ['H', 'F']
  const codes = []
  let x = 1
  let output = ''
  for (let a = 0; a < type.length; a += 1) {
    output += '\n' + x + '\t' + type[a] + 'S'

    for (let b = 1; b < angles.length; b += 1) {
      x += 1
      output += '\n' + x + '\t' + type[a] + 'S-' + angles[b]
    }

    for (let b = 0; b < hand.length; b += 1) {
      x += 1
      const code = type[a] + hand[b]

      output += '\n' + x + '\t' + code

      for (let c = 0; c < angles.length; c += 1) {
        for (let d = 0; d < angles.length; d += 1) {
          const bend = '-' + angles[d]

          const arc = (d > 0)
            ? '-' + angles[c]
            : ''

          const tail = arc + bend
          x += 1

          if (c > 0 || d > 0) {
            output += '\n' + x + '\t' + code + tail
          }
        }
      }
      codes.push(code)
    }
    x += 1
  }

  return output
}

doStuff.register({
  id: 'turningToolCodes',
  name: 'Turning tool codes',
  func: turningToolCodes,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Action name
// ====================================================================
