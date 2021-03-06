/* jslint browser: true */

import { multiLitRegexReplace } from '../repeatable-utils.mjs'
import { repeatable as doStuff } from '../repeatable-init.mjs'

import { isNonEmptyStr } from '../../utilities/validation.mjs'

// import { url } from '../url.mjs'
// ====================================================================
// START: SVG ACU Logo cleanup

/**
 * acuLogoClean() remove all unnecessary junk from the ACU logo
 *
 * created by: Evan Wills
 * created: 2019-09-23
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
function acuLogoClean (input, extraInputs, GETvars) {
  const regexes = [{
    find: /<g id="_Group_"[^>]+>/i,
    replace: '<g class="logo-txt">'
  }, {
    find: / class="cls-2"/i,
    replace: '---baahh---'
  }, {
    find: / class="cls-2"/ig,
    replace: ''
  }, {
    find: /---baahh---/i,
    replace: ' class="cls-2"'
  }, {
    find: / (?:id|data-name)="[^"]+"/ig,
    replace: ''
  }, {
    find: /<\/?g>/ig,
    replace: ''
  }, {
    find: /\s+/g,
    replace: ' '
  }, {
    find: /(?: (?=[<,{}@/.])|([>,{};/.]) )/g,
    replace: '$1'
  }, {
    find: ' id="acu-logo"',
    replace: ''
  }, {
    find: '</svg>',
    replace: '</g></svg>'
  }, {
    find: 'Artboard 1',
    replace: 'Australian Catholic University (ACU)'
  }, {
    find: /(<style xmlns="http:\/\/www\.w3\.org\/2000\/svg">).*?(?=<\/style>)/i,
    replace: '$1.cls-1{fill:#ed0c00;}.cls-2,.logo-txt{fill:#fff;}@media print{.logo-txt,.cls-1{fill:#3c1053;}}'
  }, {
    find: /<g class="logo-txt">/ig,
    replace: '---blah---'
  }, {
    find: '---blah---',
    replace: '<g class="logo-txt">'
  }, {
    find: '---blah---',
    replace: ''
  }]

  return multiLitRegexReplace(input, regexes)
}

doStuff.register({
  id: 'acuLogoClean',
  func: acuLogoClean,
  group: 'mer',
  ignore: true,
  name: 'Minify ACU Logo SVG'
  // description: 'Fix heading levels when Migrating HTML from one system to another',
  // docURL: '',
})

//  END:  Syntax highlighting for JS

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
const transformSchoolsJSON = (input, extraInputs, GETvars) => {
  let json

  const sortByKey = (obj) => {
    const output = {}
    const keys = Object.keys(obj)
    keys.sort()
    for (let a = 0; a < keys.length; a += 1) {
      output[keys[a]] = obj[keys[a]]
    }

    return output
  }

  const noQuotes = (input) => {
    return JSON.stringify(input).replace(
      /"([^"]+)"(?=:)/ig, '$1').replace(/^(\[|\{)/, '$1\n  ').replace(/(\}|\])$/,
      '\n$1\n'
    )
  }

  if (extraInputs.mode() === 'suburbs') {
    try {
      json = JSON.parse(input.replace(/(^|[\r\n])[\t ]*\/\/[^\r\n]+/ig, ''))
    } catch (e) {
      console.error('Schools JSON failed to parse.', e)
      return ''
    }
    return '\n\n/**' +
           '\n * A list of Australian suburbs hosting High Schools that offer' +
           '\n * ATAR programs.' +
           '\n *' +
           '\n * NOTE: This variable was generated using' +
           '\n *       https://test-webapps.acu.edu.au/mini-apps/do-JS-regex-stuff/?group=mer&action=transformschoolsjson' +
           '\n *       (following the instructions in the tool)' +
           '\n *' +
           '\n *       The tool converts the JSON into a Javascript variable' +
           '\n *       appropriate for use in this script' +
           '\n *' +
           '\n *       (Repo for the tool is at https://gitlab.acu.edu.au/evwills/do-JS-regex-stuff)\n *' +
           '\n * @var {array} RYIschoolSuburbs\n */\n' +
           'var RYIschoolSuburbs = ' +
           noQuotes(json.Suburbs)
  } else if (extraInputs.mode() === 'studyArea') {
    try {
      json = JSON.parse(input.replace(/^var Campuses = /, '').replace(/([a-z]+)(?=:)/ig, '"$1"'))
    } catch (e) {
      console.error('failed to parse study area object', e)
      return ''
    }

    for (const campus in json) {
      for (const level in json[campus]) {
        if (typeof json[campus][level] !== 'string') {
          json[campus][level] = sortByKey(json[campus][level])
        }
      }
    }

    console.log('json:', json)
    return 'var Campuses = ' + noQuotes(json)
  } else {
    console.error('No mode specified.')
    return ''
  }
}

doStuff.register({
  id: 'transformSchoolsJSON',
  func: transformSchoolsJSON,
  description: 'Transform RYI Suburb/Schools JSON string to JavaScript variable for use in WWW RYI from</p><p>For creating the JavaScript variable use in the public website RYI form</p><ol><li>Copy the whole JSON (supplied by marketing) into the text box below</li><li>click MODIFY INPUT (green button on the bottom left)</li><li>Copy the (modified) contents of the text box</li><li>Then replace the existing variable in the sitecore <code>ryi-script.js</code> file</li></ol><p>',
  // docsURL: '',
  extraInputs: [{
    id: 'mode',
    type: 'radio',
    label: 'What to transform',
    options: [{
      value: 'suburbs',
      label: 'Convert Suburbs JSON to variable'
    }, {
      value: 'studyArea',
      label: 'Alphabetise study areas',
      default: true
    }]
  }],
  group: 'mer',
  ignore: false,
  name: 'Transform RYI Suburb/Schools JSON'
})

//  END:  Transform RYI Suburb/Schools JSON
// ====================================================================
// START: Image gallery HTML

const makeURLok = (url) => {
  const _url = url.trim()
  const tmp = _url.subStr(0, 8).toLowerCase()

  if (tmp === 'https://' || tmp.subStr(0, 1) === '/') {
    return _url
  } else {
    return '../img/gallery/' + _url
  }
}

/**
 * Image gallery HTML
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
const imageGalleryHTML = (input, extraInputs, GETvars) => {
  console.log('input:', input)
  const images = input.trim().split('\n')
  console.log('images:', images)

  let gallery = ''
  let modals = ''

  for (let a = 0; a < images.length; a += 1) {
    if (images[a].trim === '') {
      continue
    }
    const row = images[a].trim().split('\t')
    const sm = makeURLok(row[0])
    const alt = isNonEmptyStr(row[1]) ? row[1].trim() : 'No alt text yet'
    const lg = isNonEmptyStr(row[2]) ? row[2].trim() : sm

    gallery += `
\t<li class="img-gallery__item">
\t\t<button type="button" class="img-gallery__modal-btn" data-toggle="modal" data-target="#gallery-img--${a}">
\t\t\t<img src="${sm}" alt="${alt}" class="img-gallery__img" />
\t\t</button>
\t</li>`

    modals += `
<div class="modal fade img-gallery__modal" id="gallery-img--${a}" tabindex="-1" role="dialog" aria-labelledby="gallery-img--${a}-label" aria-hidden="true">
\t<div class="modal-dialog" role="document">
\t\t<div class="modal-content">
\t\t\t<div class="modal-header">
\t\t\t\t<h5 class="modal-title" id="gallery-img--${a}-label">${alt}</h5>
\t\t\t\t<button type="button" class="close" data-dismiss="modal" aria-label="Close">
\t\t\t\t\t<span aria-hidden="true">&times;</span>
\t\t\t\t</button>
\t\t\t</div>
\t\t\t<div class="modal-body">
\t\t\t\t<img src="${lg}" alt="${alt}" class="img-gallery__modal-img" />
\t\t\t</div>
\t\t\t<div class="modal-footer">
\t\t\t\t<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
\t\t\t</div>
\t\t</div>
\t</div>
</div>
`
  }

  return (gallery !== '')
    ? `
<ul class="img-gallery">${gallery}
</ul>

${modals}
`
    : 'No images available'
}

doStuff.register({
  id: 'imageGalleryHTML',
  func: imageGalleryHTML,
  description: '',
  // docsURL: '',
  extraInputs: [],
  group: 'mer',
  ignore: false,
  // inputLabel: '',
  name: 'Image gallery HTML'
  // remote: false,
  // rawGet: false,
})

//  END:  Image gallery HTML
// ====================================================================
