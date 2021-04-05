/* jslint browser: true */
/* global  */

// other global functions available:
//   invalidString, invalidStrNum, invalidNum, invalidArray, makeAttributeSafe, isFunction, makeHumanReadableAttr

import { isBoolTrue } from '../../utilities/validation.mjs'
import { multiLitRegexReplace } from '../repeatable-utils.mjs'
import { repeatable as doStuff } from '../repeatable-init.mjs'

// ====================================================================
// START: Convert Schedule of Unit Offerings to 2020

const admissionToCourseworkProgramsPolicyLink = (input) => input.replace(
  /(?:<a[^>]*>\\s*?)?(Admission.*?Policy)(?:<\/a>)?/igm,
  '<a href="./?a=2345726">$1</a>'
)

const unitDescriptionLinks = (input) => {
  const output = removeAll(input)
  return output.replace(
    /(<a[^>]*>\s*?)?([A-Z]{4}[0-9]{3})(<\/a>)?/gm,
    '<a class="js-remote-modal" href="./?a=2347176?unit=$2&amp;SQ_DESIGN_NAME=modal">$2</a>'
  )
}

const clickHereForUnitDescriptionsLink = (input) => input.replace(
  /(<[^>]*>\\s*?Schedule.*?Offerings\\s*?<[^>]*>)(\\s*?<[^>]*>\\s*?Click.*?Descriptions\\s*?<[^>]*>|\\s*?<[^>]*>\\s*?<[^>]*>\\s*?Click.*?Descriptions\\s*?<[^>]*>\\s*?<[^>]*>)?/igm,
  '$1<p><a href="./?a=2347163">Click here for Unit Descriptions</a></p>'
)

const sampleCourseMap = (input) => {
  const regex = [{
    find: /(<a[^>]*>\s*?)?([A-Z]{4}[0-9]{3})(<\/a>)?/gm,
    replace: '<a class="js-remote-modal" href="./?a=2347384?unit=$2">$2</a>'
  }, {
    find: /<a[^>]*>(handbook)(<\/a>)/igm,
    replace: '<a href="./?a=2345662">$1$2'
  }]

  return multiLitRegexReplace(
    removeAll(input),
    regex
  )
}

const unitsAndCosts = (input) => {
  const TH = /(<table[^>]*>\s*?<tr>\s*?<)td[^>]*(>.*?<\/)td(>\s*?<)td[^>]*(>.*?<\/)td(>\s*?<)td[^>]*(>.*?<\/)td(>\s*?<)td[^>]*(>.*?<\/)td(>\s*?<)td[^>]*(>.*?<\/)td(>\s*?<)td[^>]*(>.*?<\/)td(>)/igm

  const regex = [{
    find: /(<table)[^>]*(>)/gm,
    replace: '$1 data-tablesaw-mode="stack"class="tablesaw-stack"$2'
  }, {
    find: /(<col[^>]*>)/igm,
    replace: ''
  }, {
    find: /(<TD)[^>]*(>)/igm,
    replace: '$1$2'
  }, {
    find: TH,
    replace: '$1th$2th$3th$4th$5th$6th$7th$8th$9th$10th$11th$12th$13'
  }, {
    find: TH,
    replace: '$1<tbody>$2</tbody>$3'
  }]

  return multiLitRegexReplace(removeAll(input), regex)
}

const classAllocationDates = (input) => {
  const TH = /(<TD)[^>]*(>)/igm
  const regex = [{
    find: /(<table)[^>]*(>)/gm,
    replace: '$1$2'
  // }, {
  //   find: '(<table[^>]*>)(.*?)(<\/table>)', 'gm',
  //   replace:
  }, {
    find: /(<col[^>]*>)/igm,
    replace: ''
  }, {
    find: TH,
    replace: '$1$2'
  }, {
    find: TH,
    replace: '$1th$2th$3th$4th$5th$6th$7th$8th$9th$10th$11th$12th$13'
  }, {
    find: TH,
    replace: '$1th$2th$3th$4th$5th$6th$7th$8th$9th$10th$11th$12th$13'
  }]

  multiLitRegexReplace(removeAll(input), regex)
}

const cleanTables = (input) => {
  const output = removeAll(input)
  return stripTables(output)
}

const WIPExtendedCalendar = (input) => {
  const findReplace = [{ // one
    find: /(<table)[^>]*(>)/igm,
    replace: '$1 class="table table-bordered table-hover table-striped"$2'
  }, { // two
    find: /(<td).*?(?:( rowspan="[0-9]")[^>]*(>)|( colspan="[0-9]")[^>]*(>)|(>))/igm,
    replace: '$1$2$3$4$5$6'
  }, { // three & six
    find: /<\/?p>/igm,
    replace: ''
  }, { // four & five
    find: /<\/?strong>/igm,
    replace: ''
  }, { // seven & eight
    find: /<\/?a[^>]*>/igm,
    replace: ''
  }, { // nine
    find: /(<t)d( colspan="[0-9]"| rowspan="[0-9]")(>)(.*?)(<\/t)d(>)/igm,
    replace: '$1h$2$3$4$5h$6'
  }, { // ten
    find: /(<tr>\s*?<t[hd])(.*?<t[hd])(.*?<t[hd])(.*?<t[hd])(.*?<t[hd])(.*?<t[hd])(.*?<t[hd])(.*?<t[hd])(.*?<t[hd])(.*?<t[hd])(.*?<\/tr>)/igm,
    replace: '$1 headers="1"$2 headers="2"$3 headers="3"$4 headers="4"$5 headers="5"$6 headers="6"$7 headers="7"$8 headers="8"$9 headers="9"$10 headers="10"$11'
  }]

  return multiLitRegexReplace(removeAll(input), findReplace, 'igm')
}

//  END:  Convert Schedule of Unit Offerings to 2020
// ====================================================================
// START: Jon's Remove White Space

function removeAll (input) {
  let output = ''
  // var content = ''
  // var tmp = ''
  // var removeSpaces = new RegExp()

  output = input.replace(/(?:&nbsp;|\s)+/igm, ' ')
  // output = output.replace(/\s+/gm, ' ')
  return output.replace(/<(t[dh])([^>]*)>\s*<\/\1>/igm, '<$1$2>&nbsp;</$1>')
}

//  END:  Jon's Remove White Space
// ====================================================================

// ====================================================================
// START: Jon's Table Stripping

function stripTables (input) {
  const regex = [{
    find: /(<table)[^>]*(?=>)/igm,
    replace: '$1'
    // }, {
    // // var removeSpaces = new RegExp('')
    // // output = output.replace(removeSpaces, )
    //   find: /\s{2,}/igm,
    //   replace: ' '
  }, {
    find: /(<t[dhr])[^>]*(?=>)/igm,
    replace: '$1'
  }, {
    find: /(<t[dhr]>)(?:<br>|<\/br>)/igm,
    replace: '$1'
  }, {
    find: /(<(t[dhr])>)<p>(.*?)<\/p>(<\/\2>)/igm,
    replace: '$1$3$4'
  }, {
    find: /(<table)[^>]*(?=>)/igm,
    replace: '$1'
  }]

  return multiLitRegexReplace(removeAll(input), regex)
}

//  END:  Jon's Table Stripping
// ====================================================================

// ====================================================================
// START: Jon's Schedule of Unit Offerings Tables

function scheduleOfUnitOfferingsTableFormatting (input) {
  const regex = [{
    find: /(<table)[^>]*(?=>)/igm,
    replace: '$1'
  }, {
    find: /(<t[dhr])[^>]*(?=>)/igm,
    replace: '$1'
  }, {
    find: /(<t[dhr]>)(?:<br>|<\/br>)/igm,
    replace: '$1'
    // }, {
    //   // var removeSpaces = new RegExp('')
    //   // output = output.replace(removeSpaces, )
    //   find: /\s{2,}/igm,
    //   replace: ' '
  }, {
    find: /(<(t[dhr])>)<p[^>]*>(.*?)<\/p>(<\/\2>)/igm,
    replace: '$1$3$4'
    // }, {
    // output = output.replace(StripBR, '$1')
    //   find: ,
    //   replace:
  }, {
    find: /(<table)[^>]*(>)/igm,
    replace: '$1 class="table table-bordered table-hover table-striped"$2<tbody>'
  }, {
    find: /(<tbody)[^>]*(>)\s*?<tr[^>]*>/igm,
    replace: '$1$2<tr class="noWrap">'
  }, {
    find: /(<\/table>)/igm,
    replace: '</tbody>$1'
  }, {
    find: /(<tr[^>]*>\s*?<td)[^>]*(>.*?<\/td>\s*?<td)[^>]*(>.*?<\/td>\s*?<td)[^>]*(>.*?<\/td>\s*?<td)[^>]*(>.*?<\/td>)/igm,
    replace: '$1 headers="a1"$2 headers="a2"$3 headers="a3"$4 headers="a4"$5'
  }, {
    find: /(<tr class="nowrap"[^>]*>\s*?<)td[^>]*(>.*?<\/)td(>\s*?<)td[^>]*(>.*?<\/)td(>\s*?<)td[^>]*(>.*?<\/)td(>\s*?<)td[^>]*(>.*?<\/)td(>)/igm,
    replace: '$1th id="a1"$2th$3th id="a2"$4th$5th id="a3"$6th$7th id="a4"$8th$9'
  }, {
    find: /<\/?u>/igm,
    replace: ''
  }, {
    find: /<\/?em>/igm,
    replace: ''
  }]

  return multiLitRegexReplace(removeAll(input), regex)
}

//  END:  Jon's Schedule of Unit Offerings Tables
// ====================================================================

// ====================================================================
// START: Jon's remove underline

// function RUL (input) {
//   let output = ''

//   output = removeAll(input)
//   output = output.replace(/<\/?(?:ul|em)>/igm, '')
//   return output
// }

//  END:  Jon's Schedule of Unit Offerings Tables
// ====================================================================

// START: Fix handbook (and Course Browser) unit modal links
// ====================================================================

// Jon with no idea haha
function completeUpdate (input, extraInputs, GETvars) {
  console.log('inside completeUpdate()')
  console.log('extraInputs.additional():', extraInputs.additional())
  switch (extraInputs.additional()) {
    case 'ACPP':
      return admissionToCourseworkProgramsPolicyLink(input)

    case 'CAD':
      return classAllocationDates(input)

    case 'CHUD':
      return clickHereForUnitDescriptionsLink(input)

    case 'CT':
      return cleanTables(input)

    case 'EC':
      return WIPExtendedCalendar(input)

    case 'RWS':
      return removeAll(input)

    case 'SCM':
      return sampleCourseMap(input)

    case 'SU':
      console.log('about to update unit description links')
      return unitDescriptionLinks(input)

    case 'SUOT':
      return scheduleOfUnitOfferingsTableFormatting(input)

    case 'U&C':
      return unitsAndCosts(input)
  }
}

doStuff.register({
  id: 'CIMscripts',
  description: '<p>Select an option from the list below</p>',
  func: completeUpdate,
  extraInputs: [
    {
      id: 'additional',
      label: 'What changes do you want to make',
      type: 'select',
      options: [
        { value: 'vdefault', label: 'Select an option', default: true },
        // { value: 'SUO', label: 'Add 4th column to Schedule of Unit Offerings'},
        { value: 'ACPP', label: 'Admission to Coursework Programs Policy link' },
        { value: 'CHUD', label: 'Click here for Unit Descriptions link' },
        // { value: 'RAA', label: 'Remove bad code from WORD' },
        { value: 'RWS', label: 'Remove White Space' },
        { value: 'SCM', label: 'Sample Course Map' },
        { value: 'SU', label: 'Unit Description links' },
        { value: 'CT', label: 'Clean Tables' },
        { value: 'SUOT', label: 'Schedule of Unit Offerings Table Formatting' },
        { value: 'CAD', label: 'Class Allocation Dates' },
        { value: 'EC', label: 'WIP - Extended Calendar' },
        { value: 'U&C', label: 'Units and Costs' },
        { value: 'noModal', label: 'Remove link to modal for units' }
      ]
    // }, {
    //   id: 'OtherOptions',
    //   label: 'What additions do you want to include',
    //   type: 'radio',
    //   options: [
    //     { value: 'UL', label: 'Remove Underline' }
    //   ]
    }
  ],
  group: 'cim',
  ignore: false,
  name: 'CIM Scripts'
})

const unitDescriptionLinksInner = (yearID, doModal) => {
  const modalClass = (isBoolTrue(doModal)) ? 'js-remote-modal' : 'no-js-modal'
  return (whole, spaceBefore1, spaceBefore2, code, spaceAfter1, spaceAfter2) => {
    const before = (spaceBefore1 !== '' || spaceBefore2 !== '') ? ' ' : ''
    const after = (spaceAfter1 !== '' || spaceAfter2 !== '') ? ' ' : ''

    return before +
           '<a href="./?a=' + yearID + '?unit=' + code + '" class="' + modalClass + '">' +
           code +
           '</a>' +
           after
  }
}

const fixUnitDescriptionLinks = (input, extraInputs, GETvars) => {
  return input.replace(
    /(?:(\s*)<a[^>]*>(\s*))?([A-Z]{4}[0-9]{3})(?:(\s*)<\/a>)?(\s*)/gs,
    unitDescriptionLinksInner(extraInputs.year(), extraInputs.doModal('openModal'))
  )
}

doStuff.register({
  id: 'fixUnitLinks',
  description: '<p>This tool finds unit codes and converts them to links to unit descriptions. If the unit code is already linked, it will rewrite the link to conform the controls below.</p><ol><li>Set the year that applies to the unit/course</li><li>If you wish to enable unit description in the modal, Check the "<em>Open unit description in a modal</em>" checkbox otherwise modal will be explicitly blocked.</li></ol>',
  func: fixUnitDescriptionLinks,
  inputLabel: 'Metadata field content',
  extraInputs: [
    {
      id: 'year',
      label: 'Which year do these units applie to',
      type: 'select',
      options: [
        { value: '', label: 'Select an option', default: true },
        { value: 2347176, label: '2021' },
        { value: 2317124, label: '2020' },
        { value: 1423077, label: '2019' },
        { value: 1256438, label: '2018' },
        { value: 948634, label: '2017' },
        { value: 763485, label: '2016' },
        { value: 2045535, label: '2015' }
      ]
    },
    {
      id: 'doModal',
      label: 'Modal',
      type: 'checkbox',
      options: [
        { value: 'openModal', label: 'Open unit description in a modal' }
      ]
    }
  ],
  group: 'cim',
  ignore: false,
  name: 'Fix unit description links'
})
