/* jslint browser: true */
/* global doStuff */

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

  console.log('extraInputs.convertMode():', extraInputs.convertMode())

  switch (extraInputs.convertMode()) {
    case 'hex':
      for (let a = 0; a < colourData.length; a += 1) {
        output = output.replace(colourData[a].old, colourData[a].new);
      }
      break;

    case 'html':

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
