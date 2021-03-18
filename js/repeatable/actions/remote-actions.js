/* jslint browser: true */
/* global doStuff */

// doStuff.register({
//   action: 'Base64',
//   description: 'Encode/Decode Base64 string',
//   // group: 'it',
//   ignore: true,
//   name: 'Base64 encode/decode',
//   extraInputs: [
//     {
//       id: 'mode',
//       label: 'Encode/Decode mode',
//       options: [
//         {
//           value: 'true',
//           label: 'Encode',
//           default: true
//         },
//         {
//           value: 'false',
//           label: 'Decode'
//         }
//       ],
//       type: 'radio'
//     }
//   ],
//   remote: true
// })

doStuff.register({
  action: 'BackwardsSort',
  description: 'Sort a (line separated) list of text by from the end of the line (rather than the begining).',
  // group: 'it',
  // ignore: true,
  name: 'Backwards sort',
  extraInputs: [],
  remote: true
})
