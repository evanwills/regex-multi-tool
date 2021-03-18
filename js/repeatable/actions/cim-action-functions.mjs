/* jslint browser: true */
/* global  */

// other global functions available:
//   invalidString, invalidStrNum, invalidNum, invalidArray, makeAttributeSafe, isFunction, makeHumanReadableAttr

import { multiLitRegexReplace } from '../repeatable-utils.mjs'
import { repeatable as doStuff } from '../repeatable.init.mjs'

// ====================================================================
// START: Convert Schedule of Unit Offerings to 2020

// Jon with no idea haha
function completeUpdate (input, extraInputs, GETvars) {
  let output = ''
  // var content = ''
  // var tmp = ''

  const _extra = extraInputs.additional()

  // var TD = new RegExp('(<tr[^>]*>\\s*?<td)[^>]*(>.*?</td>\\s*?<td)[^>]*(>.*?</td>\\s*?<td)[^>]*(>.*?</td>)', 'igm')

  // var TH = new RegExp('(<tr[^>]*>\\s*?<th)[^>]*(>.*?</th>\\s*?<th)[^>]*(>.*?</th>\\s*?<th)[^>]*(>.*?</th>)', 'igm')

  // var TD1 = new RegExp('(<tr[^>]*>\\s*?<td)[^>]*(>\\s*?.*?\\s*?</td>)', 'igm')

  // var TD2 = new RegExp('(<tr[^>]*>\\s*?<td[^>]*>\\s*?.*?\\s*?</td>\\s*?<td)[^>]*(>\\s*?.*?\\s*?</td>)', 'igm')

  // var TD3 = new RegExp('(<tr[^>]*>\\s*?<td[^>]*>\\s*?.*?\\s*?</td>\\s*?<td[^>]*>\\s*?.*?\\s*?</td>\\s*?<td)[^>]*(>\\s*?.*?\\s*?</td>)', 'igm')

  // var TH1 = new RegExp('(<tr[^>]*>\\s*?<th)[^>]*(>\\s*?.*?\\s*?</th>)', 'igm')

  // var TH2 = new RegExp('(<tr[^>]*>\\s*?<th[^>]*>\\s*?.*?\\s*?</th>\\s*?<th)[^>]*(>\\s*?.*?\\s*?</th>)', 'igm')

  // var TH3 = new RegExp('(<tr[^>]*>\\s*?<th[^>]*>\\s*?.*?\\s*?</th>\\s*?<th[^>]*>\\s*?.*?\\s*?</th>\\s*?<th)[^>]*(>\\s*?.*?\\s*?</th>)', 'igm')

  // var checkinc = new RegExp('(inc)\\s+', 'igm')

  // var checkpre = new RegExp('(pre)\\s+', 'igm')

  // var addFourthCol = new RegExp('(<(t[dh])[^">]*?\\s+(?:id|headers)=")a3("[^>]*?>)\\s*(?:<p>\\s*?)?(.*?)\\s*(?:</p>\\s*?)?(<\\/\\2>)', 'igm')

  // var stripMainUnitAndLeavePnI = new RegExp('(<td headers="a4">).*?(?:(pre[:.].*?)\\)?(</td>)|(inc[:.].*?)\\)?(</td>)|(</td>))', 'igm')

  // var fixPcolon = new RegExp(';(\\s*(?=inc:|pre:).*?)<', 'igm')

  // var fixcommaor = new RegExp(',(\\s*?or)', 'igm')

  // var fixPtoI = new RegExp(', (inc)[^a-z]', 'igm')

  // var fixIdot = new RegExp('(inc)\\.', 'igm')

  // var changePreToP = new RegExp('(<td[^>]*headers="a4"[^>]*>)\\s*pre:\\s*([^<;]*)(?:(;)\\s*([^<]*))?(</td>)', 'igm')

  // var keepOnlyUnitInColThree = new RegExp('(<td[^">]headers="a3"[^>]*>)(.*?)(?=\\(pre|\\(inc|</td>)(?:\\(pre.*?|\\(inc.*?)?</td>', 'igm')

  // var changeIncToI = new RegExp('inc:\\s*([^<;]*)(?:(;)\\s*([^<]*))?(</td>)', 'igm')

  // var fixI = new RegExp('(<br>\\s*?.*?\\s*?);(\\s*?.*?\\s*?\\(I\\))', 'igm')

  // var additionalFixI = new RegExp('(<td headers="a4">\\s*?)<br>', 'igm')

  // var addNil = new RegExp('(<td headers="a4">)\\s*(</td>)', 'igm')

  // var fourthColTitle = new RegExp('(<th id="a4">).*?(</th>)', 'igm')*/

  // /*Not sure if the broken third col is still required*/
  // /*var brokenThirdCol = new RegExp('(<td headers=")a3(">)\\s*(<p>(.|\\s*)+?)\\s*(</td>)', 'igm')

  // //var RemoveAndAddLinks = new RegExp('<a[^>]*>([a-z]{4}[0-9]{3})</a>', 'igm')

  // var RemoveAndAddLinks = new RegExp('(?:<a[^>]*>\\s*?)?([A-Z]{4}[0-9]{3})(?:</a>)?', 'gm')

  // var ClickHere = new RegExp('<a[^>]*>(Click here for Unit Descriptions)</a>', 'igm')

  // var colspan = new RegExp('(<td)[^>]*(colspan=.[123])[^>]*>(.*?)</td>', 'igm')

  // var colspan2 = new RegExp('(<tp)([^>]*)colspan=.[123]([^>]*>.*?)(</tp>)', 'igm')

  // var preinfo = new RegExp('<p>\\s*?pre.*?\\s*?</p>', 'igm')

  if (_extra === 'ACPP') {
    return input.replace(
      /(?:<a[^>]*>\\s*?)?(Admission.*?Policy)(?:<\/a>)?/igm,
      '<a href="./?a=2345726">$1</a>'
    )
  // } else if(_extra === 'SUO'){
  //   output = removeAll(input)
  //   output = output.replace(colspan, '<tp $2">$3</tp>')
  //   output = output.replace(TD, '$1 headers="a1"$2 headers="a2"$3 headers="a3"$4')
  //   output = output.replace(TH, '$1 id="a1"$2 id="a2"$3 id="a3"$4')
  //   output = input.replace(TD1, '$1 headers="a1"$2')
  //   output = output.replace(TD2, '$1 headers="a2"$2')
  //   output = output.replace(TD3, '$1 headers="a3"$2')
  //   output = output.replace(TH1, '$1 id="a1"$2')
  //   output = output.replace(TH2, '$1 id="a2"$2')
  //   output = output.replace(TH3, '$1 id="a3"$2')
  //   output = output.replace(checkinc, '$1: ')
  //   output = output.replace(checkpre, '$1: ')
  //   output = output.replace(addFourthCol, '$1a3$3$4$5$1a4$3$4$5')
  //   output = output.replace(stripMainUnitAndLeavePnI, '$1$2$3$4$5$6')
  //   output = output.replace(fixPcolon, ',$1<')
  //   output = output.replace(fixcommaor, '$1')
  //   output = output.replace(fixPtoI, ';$1:')
  //   output = output.replace(fixIdot, '$1:')
  //   output = output.replace(changePreToP, '$1$2 (P)$3 $4$5')
  //   output = output.replace(keepOnlyUnitInColThree, '$1$2</td>')
  //   output = output.replace(changeIncToI, '<br>$1 (I)$2')
  //   output = output.replace(fixI, '$1,$2')
  //   output = output.replace(additionalFixI, '$1')
  //   output = output.replace(addNil, '$1Nil$2')
  //   output = output.replace(fourthColTitle, '$1Prerequisites (P)<br>Incompatible Units (I)$2')
  //   output = output.replace(RemoveAndAddLinks, '<a class="js-remote-modal" href="./?a=2317124?unit=$1&amp;SQ_DESIGN_NAME=modal">$1</a>')
  //   output = output.replace(ClickHere, '<a href="./?a=2317111">$1</a>')
  //   output = output.replace(colspan2, '<td$2headers="a1" colspan="4$3</td>')
  //   output = output.replace(preinfo, '')
  //   return output
  // }
  } else if (_extra === 'RWS') {
    output = removeAll(input)
    return output
  } else if (_extra === 'SUOT') {
    output = SUOT(input)
    // if (OtherOptions === 'UL') {
    //   output = RUL(output)
    // }
    return output
  } else if (_extra === 'SU') {
    output = removeAll(input)
    return output.replace(
      /(<a[^>]*>\s*?)?([A-Z]{4}[0-9]{3})(<\/a>)?/gm,
      '<a class="js-remote-modal" href="./?a=2347176?unit=$2&amp;SQ_DESIGN_NAME=modal">$2</a>'
    )
    // } else if (_extra === 'RAA'){
    //   //var _raa = new RegExp('(<[^/a][a-z]*[0-9]*)[^>]*(>)', 'igm')
    //   var _raa = new RegExp('(<[^/a][a-z]*[0-9]*)(( colspan="4")|[^>]*)(>)', 'igm')
    //   var _raaP = new RegExp('(<td>)<p>', 'igm')
    //   var _raaP2 = new RegExp('</p>(</td>)', 'igm')
    //   var _raat = new RegExp('<tbody>', 'igm')
    //   var _raat2 = new RegExp('(<table)[^>]*(>)', 'igm')
    //   var _raatb = new RegExp('(<tbody)[^>]*(>)\\s*?<tr[^>]*>', 'igm')
    //   var TDA = new RegExp('(<tr[^>]*>\\s*?<td)[^>]*(>.*?</td>\\s*?<td)[^>]*(>.*?</td>\\s*?<td)[^>]*(>.*?</td>\\s*?<td)[^>]*(>.*?</td>)', 'igm')
    //   var THA = new RegExp('(<tr class="nowrap"[^>]*>\\s*?<)td[^>]*(>.*?</)td(>\\s*?<)td[^>]*(>.*?</)td(>\\s*?<)td[^>]*(>.*?</)td(>\\s*?<)td[^>]*(>.*?</)td(>)', 'igm')
    //   var addlinks = new RegExp('(?:<a[^>]*>\\s*?)?([a-z]{4}[0-9]{3})(?:</a>)?', 'igm')
    //   var clickherelink = new RegExp('(<[^>]*>\\s*?Schedule.*?Offerings\\s*?<[^>]*>)(\\s*?<[^>]*>Click.*?Descriptions<[^>]*>|\\s*?<[^>]*><[^>]*>Click.*?Descriptions<[^>]*><[^>]*>)?', 'igm')
    //   var colspan = new RegExp('(<td)[^>]*(colspan=.[1234])[^>]*>(.*?)</td>', 'igm')
    //   var colspan2 = new RegExp('(<tp)([^>]*)colspan=.[1234]([^>]*>.*?)(</tp>)', 'igm')

    //   output = removeAll(input)
    //   output = output.replace(colspan, '<tp $2">$3</tp>')
    //   output = output.replace(_raa, '$1$3$4')
    //   output = output.replace(_raaP, '$1')
    //   output = output.replace(_raaP2, '$1')
    //   output = output.replace(_raat, '')
    //   output = output.replace(_raat2, '$1 class="table table-bordered table-hover table-striped"$2<tbody>')
    //   output = output.replace(_raatb, '$1$2<tr class="noWrap">')
    //   output = output.replace(TDA, '$1 headers="a1"$2 headers="a2"$3 headers="a3"$4 headers="a4"$5')
    //   output = output.replace(THA, '$1th id="a1"$2th$3th id="a2"$4th$5th id="a3"$6th$7th id="a4"$8th$9')
    //   output = output.replace(addNil, '$1Nil$2')
    //   output = output.replace(addlinks, '<a class="js-remote-modal" href="./?a=2317124?unit=$1&amp;SQ_DESIGN_NAME=modal">$1</a>')
    //   output = output.replace(clickherelink, '$1<p><a href="./?a=2317111">Click here for Unit Descriptions</a></p>')
    //   output = output.replace(preinfo, '')
    //   output = output.replace(colspan2, '<td$2headers="a1" colspan="4$3</td>')
    //   return output
  } else if (_extra === 'CHUD') {
    return input.replace(
      /(<[^>]*>\\s*?Schedule.*?Offerings\\s*?<[^>]*>)(\\s*?<[^>]*>\\s*?Click.*?Descriptions\\s*?<[^>]*>|\\s*?<[^>]*>\\s*?<[^>]*>\\s*?Click.*?Descriptions\\s*?<[^>]*>\\s*?<[^>]*>)?/igm,
      '$1<p><a href="./?a=2347163">Click here for Unit Descriptions</a></p>'
    )
  } else if (_extra === 'SCM') {
    const regex = [{
      find: /(<a[^>]*>\s*?)?([A-Z]{4}[0-9]{3})(<\/a>)?/gm,
      replace: '<a class="js-remote-modal" href="./?a=2347384?unit=$2&amp;SQ_DESIGN_NAME=modal">$2</a>'
    }, {
      find: /<a[^>]*>(handbook)(<\/a>)/igm,
      replace: '<a href="./?a=2345662">$1$2'
    }]

    return multiLitRegexReplace(
      removeAll(input),
      regex
    )
  } else if (_extra === 'U&C') {
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
  } else if (_extra === 'CAD') {
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
  } else if (_extra === 'CT') {
    output = removeAll(input)
    output = stripTables(output)
    return output
  } else if (_extra === 'EC') {
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
}

doStuff.register({
  action: 'CIM Scripts',
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
        { value: 'U&C', label: 'Units and Costs' }
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
}

)

//  END:  Convert Schedule of Unit Offerings to 2020

// $("#additional").change(function(){
//   var vSelection = $('#additional').find(":selected").val();
//   console.log(vSelection)

//   /*if (vSelection === "SUO"){
//     $("#no-action").html("<p>Only use this option when the Schedule of Unit Offerings has 3 columns.<br>\
//   Copy the source code from Squiz and paste into the Text to be modified box below. Then click on Modify Input<br>\
//   Copy the code into dreamweaver to make sure that the contents are accurate, then paste back into squiz</p>\
//   <ul>\
//   <li>This option will:</li>\
//     <ul>\
//     <li>Update all unit links to 2020.</li>\
//     <li>Update the click here for unit descriptions link.</li>\
//     <li>Remove text regarding prerequisite/incompatibles which sits under the Schedule of Unit Offerings title.</li>\
//     <li>Add a fourth column for the prerequisites/incompatibles and moves them from the third column to the fourth column.</li>\
//     <li>Provide ID/Headers for each of the cells for accessibility</li>\
//     </ul>\
//   </ul>");
//   }
//   else*/ if (vSelection === "SU"){
//     $("#no-action").html("<p>Use this option to add links to units that have been added to existing Schedule of Unit Offerings tables</p>\
//     <ul>\
//     <li>This option will:</li>\
//       <ul>\
//       <li>Add links to all Unit Codes that aren't already linked within the Schedule of Unit Offerings</li>\
//       </ul>\
//     </ul>");
//   }
//     else if (vSelection === "U&C"){
//     $("#no-action").html("<p>Use this option to format the Units and Costs</p>\
//     <ul>\
//     <li>This option will:</li>\
//       <ul>\
//       <li>Apply appropriate formatting to the Units and Costs table</li>\
//       </ul>\
//     </ul>");
//   }
//   else if (vSelection === "RWS"){
//     $("#no-action").html("<p>Use this option to remove all whitespace in your HTML code before pasting back into the CMS</p>\
//     <ul>\
//     <li>This option will:</li>\
//       <ul>\
//       <li>Remove all whitespace in the code</li>\
//       </ul>\
//     </ul>");
//   }
//   else if (vSelection === "ACPP"){
//     $("#no-action").html("<p>Use this option to amend or create a link for the Admission to Coursework Programs Policy</p>\
//     <ul>\
//     <li>This option will:</li>\
//       <ul>\
//       <li>Amend or create a link to the Admission to Coursework Programs Policy text in the Admission Requirements</li>\
//       </ul>\
//     </ul>");
//   }
//   /*else if (vSelection === "RAA"){
//     $("#no-action").html("<p>To use this script, copy the entire Schedule of Unit Offerings, including the heading and paste into dreamweaver.<br>\
//     Then copy the source code from dreamweaver into the Text to be modified box below. Then click on Modify Input<br>\
//     You can then copy the code back into dreamweaver to check the content and make additional amendments where necessary</p>\
//     <ul>\
//     <li>This option will:</li>\
//       <ul>\
//       <li>Remove all attributes associated with HTML tags that come from copying content from WORD to Dreamweaver</li>\
//       <li>Link all units to their description</li>\
//       <li>Add a link for Click here for Unit Descriptions</li>\
//       <li>Provide the table its class elements</li>\
//       <li>Provide ID/Headers for each of the cells for accessibility</li>\
//       <li>Remove prerequisite information below the Schedule of Unit Offerings heading if it exists</li>\
//       <li>Add Nil to blank cells in column 4</li>\
//       <li>Remove all whiteSpace</li>\
//       </ul>\
//     </ul>");
//   }*/
//   else if (vSelection === "CHUD"){
//     $("#no-action").html("<p>Use this option to amend or create a link for the Click here for Unit Descriptions</p>\
//     <ul>\
//     <li>This option will:</li>\
//       <ul>\
//       <li>Amend or create a link for Click here for Unit Descriptions under the heading Schedule of Unit Offerings</li>\
//       </ul>\
//     </ul>");
//   }
//   else if (vSelection === "SCM"){
//     $("#no-action").html("<p>Use this option to update the links in the Sample Course Maps</p>\
//     <ul>\
//     <li>This option will:</li>\
//       <ul>\
//       <li>Amend or create links to all Unit Codes within the Sample Course Maps table</li>\
//       </ul>\
//     </ul>");
//   }
//   else if (vSelection === "CAD"){
//     $("#no-action").html("<p>Use this option to clean the table for Class Allocation Dates</p>\
//     <ul>\
//     <li>This option will:</li>\
//       <ul>\
//       <li>Remove widths, alignments and anything else not needed for the table</li>\
//       </ul>\
//     </ul>");
//   }
//   else if (vSelection === "CT"){
//     $("#no-action").html("<p>Use this option to strip tables of styles</p>\
//     <ul>\
//     <li>This option will:</li>\
//       <ul>\
//       <li>Remove widths, alignments and anything else not needed for the table</li>\
//       </ul>\
//     </ul>");
//   }
//   else if (vSelection === "SUOT"){
//     $("#no-action").html("<p>Use this option to strip tables of styles and apply styles for Handbook Schedule of Unit Offerings</p>\
//     <ul>\
//     <li>This option will:</li>\
//       <ul>\
//       <li>Remove widths, alignments and anything else not needed for the table</li>\
//       <li>Apply Headers, IDs and Classes</li>\
//       </ul>\
//     </ul>");
//   }
//   else if (vSelection === "EC"){
//     $("#no-action").html("<p>Use this option to format the Extended Calendar</p>\
//     <h3>THIS IS A WORK IN PROGRESS</h3>\
//     <ul>\
//     <li>This option will:</li>\
//       <ul>\
//       <li>Remove widths, alignments and anything else not needed for the table</li>\
//       <li>Format the table to the necessary style</li>\
//       </ul>\
//     </ul>");
//   }
//   else if (vSelection === "vdefault"){
//     $("#no-action").html("<p>Select an option from the list below</p>");
//   };
// });

// $("#input[type=radio][name=OtherOptions]").change(function(){
//   var vSelection2 = $('#input[type=radio][name=OtherOptions]').find(":selected").val();
//   console.log(vSelection2)

//   if (vSelection === "SUO"){
//     $("#no-action").html("<p>Only use this option when the Schedule of Unit Offerings has 3 columns.<br>\
//   Copy the source code from Squiz and paste into the Text to be modified box below. Then click on Modify Input<br>\
//   Copy the code into dreamweaver to make sure that the contents are accurate, then paste back into squiz</p>\
//   <ul>\
//   <li>This option will:</li>\
//     <ul>\
//     <li>Update all unit links to 2020.</li>\
//     <li>Update the click here for unit descriptions link.</li>\
//     <li>Remove text regarding prerequisite/incompatibles which sits under the Schedule of Unit Offerings title.</li>\
//     <li>Add a fourth column for the prerequisites/incompatibles and moves them from the third column to the fourth column.</li>\
//     <li>Provide ID/Headers for each of the cells for accessibility</li>\
//     </ul>\
//   </ul>");
//   }
//   else if (vSelection === "SU"){
//     $("#no-action").html("<p>Use this option to add links to units that have been added to existing Schedule of Unit Offerings tables</p>\
//     <ul>\
//     <li>This option will:</li>\
//       <ul>\
//       <li>Add links to all Unit Codes that aren't already linked within the Schedule of Unit Offerings</li>\
//       </ul>\
//     </ul>");
//   }
// });

// $('.custom-fields--label').css('width', '18rem');

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
    find: /(<table)[^>]*(>)/igm,
    replace: '$1$2'
    // }, {
    // // var removeSpaces = new RegExp('')
    // // output = output.replace(removeSpaces, )
    //   find: /\s{2,}/igm,
    //   replace: ' '
  }, {
    find: /(<t[dhr])[^>]*(>)/igm,
    replace: '$1$2'
  }, {
    find: /(<t[dhr]>)(?:<br>|<\/br>)/igm,
    replace: '$1'
  }, {
    find: /(<(t[dhr])>)<p>(.*?)<\/p>(<\/\2>)/igm,
    replace: '$1$3$4'
  }, {
    find: /(<table)[^>]*(>)/igm,
    replace: '$1$2'
  }]

  return multiLitRegexReplace(removeAll(input), regex)
}

//  END:  Jon's Table Stripping
// ====================================================================

// ====================================================================
// START: Jon's Schedule of Unit Offerings Tables

function SUOT (input) {
  const regex = [{
    find: /(<table)[^>]*(>)/igm,
    replace: '$1$2'
  }, {
    find: /(<t[dhr])[^>]*(>)/igm,
    replace: '$1$2'
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

function RUL (input) {
  let output = ''

  output = removeAll(input)
  output = output.replace(/<\/?(?:ul|em)>/igm, '')
  return output
}

//  END:  Jon's Schedule of Unit Offerings Tables
// ====================================================================

// START: Fix handbook (and Course Browser) unit modal links
// /*
// function fixUnitMOdalLinks (input, extraInputs, GETvars) {
//   var _regex = new RegExp('(<a href=")https?://www\\.acu\\.edu\\.au/units/(20[12][0-9])/units_20[12][0-9]/(?:unit_display\\?unit=)?([a-z0-9]+)"(?: (?:class|target)="[^"]*")*(?=>[a-z0-9]+</a>)', 'ig')
// */
//   /**
//    * Callback function used for updating modal link URLs
//    *
//    * @param {string} match
//    * @param {string} aHref
//    * @param {string} year
//    * @param {string} unitID
//    *
//    * @returns {string} new URL to use for modal link
//    */
//   /*function _makeIDlinks (match, aHref, year, unitID) {
//     var _output = aHref
//     var _id = ''
//     var _join = '?'
//     var years = {
//       2020: 2317124,
//       2019: 1423077,
//       2018: 1256438,
//       2017: 948634,
//       2016: 741667,
//       2015: 626141,
//       2014: 552347,
//       2013: 364844,
//       2012: 331660
//     }

//     if (typeof years[year] !== 'undefined') {
//       if (year > 2015) {
//         _id = './?a=' + years[year] + '?unit='
//         _join = '&'
//       } else {
//         _id = 'https://units.acu.edu.au/' + year + '/units_' + year + '/'
//       }
//     }

//     _output += _id + unitID + _join + 'SQ_DESIGN_NAME=modal" class="js-remote-modal"'

//     return _output
//   }

//   return input.replace(_regex, _makeIDlinks)
// }

// doStuff.register({
//   action: 'fixUnitMOdalLinks',
//   description: 'Fix handbook (and Course Browser) unit modal links',
//   func: fixUnitMOdalLinks,
//   group: 'cim',
//   ignore: false,
//   name: 'Fix unit modal links'
// })
// */
// START: Fix handbook (and Course Browser) unit modal links
// ====================================================================
