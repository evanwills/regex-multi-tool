/* jslint browser: true */
/* global doStuff */

import { strPad } from '../../utilities/general.mjs';
import { repeatable as doStuff } from '../repeatable-init.mjs'

// ====================================================================
// START: TSF brand refresh


/**
 * TSF brand refresh - Convert old brand colours into SASS variables
 * or colour utility classes
 *
 * created by: Evan Wills
 * created: 2023-01-27
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
const tsfBrandRefresh = (input, extraInputs, GETvars) => {
  const colourData = [
    {
      old: /#e31837/ig,
      new: '#da1710',
      var: '$tsf-red'
    },
    {
      old: /#ba0414/ig,
      new: '#b2150f',
      var: '$tsf-field-borders'
    },
    {
      old: /#(d8){3}/ig,
      new: '#8295ab',
      var: '$tsf-field-borders'
    },
    {
      old: /#0069d5/ig,
      new: '#0021ea',
      var: '$tsf-bright-blue'
    },
    {
      old: /#e58221/ig,
      new: '#da7e1b',
      var: '$tsf-golden-sand-dark'
    },
    {
      old: /#d75b05/ig,
      new: '#985812',
      var: '$tsf-golden-sand-dark-hover'
    },
    {
      old: /#002647/ig,
      new: '#0a214d',
      var: '$navy-blue'
    },
    {
      old: /#003767/ig,
      new: '#003767',
      var: '$light-navy-blue'
    },
    {
      old: /#259ad5/ig,
      new: '#259ad5',
      var: '$electric-blue'
    },
    {
      old: /#003768/ig,
      new: '#003768',
      var: '$middle-blue'
    },
    {
      old: /#184f7e/ig,
      new: '#184f7e',
      var: '$light-blue'
    },
    {
      old: /#e6f1f6/ig,
      new: '#e6f1f6',
      var: '$pale-blue'
    },
    {
      old: /#f37814/ig,
      new: '#f37814',
      var: '$orange'
    },
    {
      old: /#(f7){3}/ig,
      new: '#F7F7F7',
      var: '$grey'
    },
    {
      old: /#(4{3}){1,2}/ig,
      new: '#333',
      var: '$dark-grey'
    },
    {
      old: /#(6{3}){1,2}/ig,
      new: '#666',
      var: '$light-grey-para'
    },
    {
      old: /#(c{3}){1,2}/ig,
      new: '#ccc',
      var: '$regular-grey'
    },
    {
      old: /#(e5){3}/ig,
      new: '#e5e5e5',
      var: '$middle-grey'
    },
    {
      old: /#FDFAFA/ig,
      new: '#FDFAFA',
      var: '$light-grey'
    },
    {
      old: /#0F870F/ig,
      new: '#0F870F',
      var: '$utility-green'
    },
    {
      old: /#E31837/ig,
      new: '#E31837',
      var: '$utility-red'
    },
    {
      old: /#E31837/ig,
      new: '#E31837',
      var: '$utility-red-hover'
    },
    {
      old: /#(f{3}){1,2}/ig,
      new: '#fff',
      var: '$white'
    },
    {
      old: /#(bd){3}/ig,
      new: '#bdbdbd',
      var: '$off-white'
    },
    {
      old: /#(0{3}){1,2}/ig,
      new: '#000',
      var: '$black'
    },
    {
      old: /#0069D5/ig,
      new: '#0069D5',
      var: '$utility-blue'
    },
    {
      old: /#025DA3/ig,
      new: '#0017a3',
      var: '$utility-blue-hover'
    },
    {
      old: /#F1C761/ig,
      new: '#F1C761',
      var: '$utility-yellow'
    },
    {
      old: /#0069D5/ig,
      new: '#0069D5',
      var: '$blue'
    },
    {
      old: /#025DA3/ig,
      new: '#0017a3',
      var: '$blue-hover'
    },
    {
      old: /#ffebeb/ig,
      new: '#ffebeb',
      var: '$utility-lightred'
    }
  ];

  let output = input;

  // console.log('extraInputs.convertMode():', extraInputs.convertMode())

  switch (extraInputs.convertMode()) {
    case 'hex':
      for (let a = 0; a < colourData.length; a += 1) {
        output = output.replace(colourData[a].old, colourData[a].new);
      }
      break;

      // case 'html':

    default:
      for (let a = 0; a < colourData.length; a += 1) {
        output = output.replace(colourData[a].old, colourData[a].var);
      }
  }

  return output;
}

doStuff.register({
  id: 'tsfBrandRefresh',
  name: 'TSF brand refresh',
  func: tsfBrandRefresh,
  description: 'Convert old brand colours into SASS variables or ' +
               'colour utility classes',
  // docsURL: '',
  extraInputs: [{
    id: 'convertMode',
    label: 'Conversion mode',
    options: [
      {
        default: true,
        label: 'SASS',
        value: 'sass'
      },
      {
        default: false,
        label: 'HEX',
        value: 'hex'
      },
      {
        default: false,
        label: 'HTML (utility class)',
        value: 'html'
      }
    ],
    type: 'radio'
  }],
  group: 'tsf',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  TSF brand refresh
// ====================================================================
// START: Brand colour variables to MD table


/**
 * Brand colour variables to MD table
 *
 * created by: Evan Wills
 * created: 2023-02-01
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
const sassVarsMdTable = (input, extraInputs, GETvars) => {
  const brandCols = '$tsf-red: #da1710; // was #e31837\n' +
                    '$tsf-red-hover: #b2150f; // was #ba0414' +
                    '$tsf-field-borders: #8295ab; // was #d8d8d8' +
                    '$tsf-bright-blue: #0021ea; // was #0069d5' +
                    '$tsf-golden-sand-dark: #da7e1b; // was #e58221' +
                    '$tsf-golden-sand-dark-hover: #985812; // was #d75b05' +
                    '$navy-blue: #0a214d;  // was #002647' +
                    '$light-navy-blue: #003767;' +
                    '$electric-blue: #259ad5;' +
                    '$middle-blue: #003768;' +
                    '$light-blue: #184f7e;' +
                    '$pale-blue: #e6f1f6;' +
                    '$orange: #f37814;' +
                    '$grey: #F7F7F7;' +
                    '$dark-grey: #333333; // was #444444' +
                    '$light-grey-para: #666666;' +
                    '$regular-grey: #cccccc;' +
                    '$middle-grey: #e5e5e5;' +
                    '$light-grey: #FDFAFA;' +
                    '$utility-green: #0F870F;' +
                    '$utility-red: #E31837;' +
                    '$utility-red-hover: #E31837;' +
                    '$white: #ffffff;' +
                    '$off-white: #bdbdbd;' +
                    '$black: #000000;' +
                    '$utility-blue: #0069D5;' +
                    '$utility-blue-hover: #0017a3; // was #025DA3' +
                    '$utility-yellow: #F1C761;' +
                    '$blue: #0069D5;' +
                    '$blue-hover: #0017a3; // was #025DA3' +
                    '$utility-lightred: #ffebeb;'

  const regex = /(\$[a-z0-9-]+)\s*?:\s*(#[a-f0-9]{3,6})\s*(?:;?\s*\/\/\s*was\s*(#[a-f0-9]{3,6}))?/ig
  const sorter = (a, b) => {
    // if (a.val > b.val) {
    //   return 1
    // } else if (a.val < b.val) {
    //   return -1
    // } else {
    //   if (a.var > b.var) {
    //     return 1
    //   } else if (a.var < b.var) {
    //     return -1
    //   } else {
    //     return 0;
    //   }
    // }
    if (a.var > b.var) {
      return 1
    } else if (a.var < b.var) {
      return -1
    } else {
      if (a.val > b.val) {
        return 1
      } else if (a.val < b.val) {
        return -1
      } else {
        return 0;
      }
    }
  }

  let output = '';
  const colours = [];
  let _tmp
  let maxVar = 'variable name'.length;
  let maxVal = 0;
  let maxOld = 'old colour'.length;

  while ((_tmp = regex.exec(brandCols)) !== null) {
    const tmp = {
      var: _tmp[1],
      val: '`' + _tmp[2] + '`',
      old: (typeof _tmp[3] === 'string')
        ? _tmp[3]
        : ''
    }

    if (tmp.var.length > maxVar) {
      maxVar = tmp.var.length
    }
    if (tmp.val.length > maxVal) {
      maxVal = tmp.val.length
    }
    if (tmp.old.length > maxOld) {
      maxOld = tmp.old.length
    }

    colours.push(tmp);
  }

  colours.sort(sorter)

  output = '| ' + strPad('variable name', maxVar) +
          ' | ' + strPad('colour', maxVal) +
          ' | ' + strPad('old colour', maxOld) + ' |\n' +
           '|-' + strPad('', maxVar, '-') +
          '-|-' + strPad('', maxVal, '-') +
          '-|-' + strPad('', maxOld, '-') + '-|'

  for (let a = 0; a < colours.length; a += 1) {
    output += '\n| ' + strPad(colours[a].var, maxVar) +
               ' | ' + strPad(colours[a].val, maxVal) +
               ' | ' + strPad(colours[a].old, maxOld) + ' |'
  }

  return output;
}

doStuff.register({
  id: 'sassVarsMdTable',
  name: 'Brand colour variables to MD table',
  func: sassVarsMdTable,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'tsf',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Brand colour variables to MD table

// ====================================================================
// START: Test file type

/**
 * Test if file type is valid
 *
 * created by: Evan Wills
 * created: 2023-02-28
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
const testFileType = (input, extraInputs, GETvars) => {
  const types = [
    { type: 'image/png', ok: true },
    { type: 'image/jpeg', ok: true },
    { type: 'image/webp', ok: true },
    { type: 'application/pdf', ok: true },
    { type: 'application/msword', ok: true },
    { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ok: true },
    { type: 'audio/aac', ok: false },
    { type: 'application/x-abiword', ok: false },
    { type: 'video/x-msvideo', ok: false },
    { type: 'image/avif', ok: false },
    { type: '', ok: false },
    { type: 'OOOO', ok: false },
    { type: 'text/csv', ok: false },
    { type: false, ok: false },
    { type: { type: 'image/webp' }, ok: false },
    { type: 'application/epub+zip', ok: false },
    { type: 'image/gif', ok: false },
    { type: 'text/javascript', ok: false },
    { type: 'application/json', ok: false },
    { type: 'text/html', ok: false },
    { type: 'text/plain', ok: false },
    { type: 'audio/webm', ok: false },
    { type: 'application/vnd.ms-excel', ok: false },
    { type: 'application/xml', ok: false },
    { type: 'text/xml', ok: false },
    { type: 'application/x-7z-compressed', ok: false }
  ]

  const isValidFileType = (fileType) => {
    const allwedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    const tmpType = (typeof fileType.type === 'string')
      ? fileType.type.trim()
      : ''

    console.group('isValidFileType()')
    console.log(`fileType: "${fileType.type}"`);
    console.log(`tmpType: "${tmpType}"`);
    const OK = (tmpType !== '' && allwedTypes.indexOf(tmpType) > -1)

    if (OK === true) {
      console.info('isValid:', OK)
    } else {
      console.warn('isValid:', OK)
    }
    console.groupEnd();

    return (tmpType !== '' && OK === true);
  }

  types.map(fType => isValidFileType(fType))
}

doStuff.register({
  id: 'testFileType',
  name: 'Test if file type is valid',
  func: testFileType,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'tsf',
  ignore: true
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  Test file type

// ====================================================================
// START: branch name

/**
 * Get branch name for current sprint
 *
 * created by: Evan Wills
 * created: 2023-02-28
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
const getBranchName = (input, extraInputs, GETvars) => {
  const sprint = extraInputs.sprint()
  const id = extraInputs.id()
  let title = extraInputs.title()
  // const sprint = 4
  // const id = 94719
  // let title = 'MSF | Address allows save when state is Select from List'
  title = title.replace(/^[^|]+\|/, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/ig, '-')

  const _now = new Date()
  let year = _now.getFullYear()
  const month = _now.getMonth() + 1
  let q = 3

  if (month > 3) {
    if (month > 6) {
      year += 1
      if (month > 9) {
        q = 2
      } else {
        q = 1
      }
      year += 1
    } else {
      q = 4
    }
  }

  year = year.toString().replace(/^[0-9]{2}/, '')

  return 'family/feature/FY' + year + '.Q' + q + '/Sprint-' + sprint + '/' + id + '-' + title;

}

doStuff.register({
  id: 'getBranchName',
  name: 'Get branch name for current sprint',
  func: getBranchName,
  description: '',
  // docsURL: '',
  extraInputs: [{
    id: 'sprint',
    label: 'Sprint number',
    min: 1,
    max: 7,
    step: 1,
    default: 0,
    type: 'number'
  }, {
    id: 'id',
    label: 'Ticket ID',
    min: 1,
    max: 100000,
    step: 1,
    default: 0,
    type: 'number'
  }, {
    id: 'title',
    label: 'Ticket title',
    type: 'text',
    description: '',
    pattern: '',
    default: ''
  }],
  // group: 'evan',
  ignore: false
  // inputLabel: '',
  // remote: false,
  // rawGet: false,
})

//  END:  branch name
// ====================================================================
