# Helper & utility functions 

## Utility functions

### `multiRegexReplace(input, findReplace, flags) : string`

The most common use of `Do-JS-Regex-Stuff` is to apply multiple regular expessions consecutively to string. To help with this, we have the `multiRegexReplace()` function

* `input`: {string} the single string to which all the regular expressions 
          are applied
* `findReplace`: {array} is an list of find/replace objects. 
   Each *find/replace* object must have a  
    * `find` {string} _[required]_ Regular expression string, 
      passing it as the first parameter to `RegExp()`.
    * `replace`: {string,function} _[required]_ The replacement 
      string (or function) to passed as the second parameter to 
      `input.replace()`
    * `flag`: {string} _[optiona]_ Flags (second parameter for 
      `RegExp()`) to over-ride the default flags used for all
      regular expressions in the function call
* `flags` are RegExp flags passed as the second parameter to RegExp()<br />
  __NOTE:__ the same flags are passed for every regular expression 
            unless there is an over-ride for that find/replace pair<br />
  __NOTE ALSO:__ '`ig`' are the default flags if the `flags` 
            parameter is ommitted.

#### sample:

```javascript
function headerCells(whole, table, trOpen, headerCells, trClose, tbody) {
  return wrapper + '<thead>' + trOpen + 
    headerCells.replace(/<(\/?)td([^>]*)>/ig, '<$1th$2>') + 
    trClose + '</thead><tbody>' + tbody + '</tbody>'
}

var findReplace = [
  { // bold to strong
    find: '<(/?)b([^>]*)>', // becomes: new RegExp('<(/?)b([^>]*)>', 'igm')
    replace: '<$1strong$2>'
  },
  { // convert first row of table to table header
    find: '(<table[^>]*>)(\s+<tr[^>]*>)(.*?)(</tr>)(.*?)(?=<table>)',
    replace: headerCells
  },
  { // Faculty acronym to full faculty name
    find: 'FEA',
    replace: 'Faculty of Education and Arts'
  }
]

output = multiRegexReplace(input, findReplace, 'igm')
```
or, if you'd prefer to name each find/replace pair
```javascript
function headerCells(whole, table, trOpen, headerCells, trClose, tbody) {
  return wrapper + '<thead>' + trOpen + 
    headerCells.replace(/<(\/?)td([^>]*)>/ig, '<$1th$2>') + 
    trClose + '</thead><tbody>' + tbody + '</tbody>'
}

var findReplace = {
  bold: { // bold to strong
    find: '<(/?)b([^>]*)>',
    replace: '<$1strong$2>'
  },
  cell: { // table cell to table header cell
    find: '(<table[^>]*>)(\s+<tr[^>]*>)(.*?)(</tr>)(.*?)(?=<table>)',
    replace: headerCells
  },
  acro: { // Faculty acronym to full faculty name
    find: 'FEA',
    replace: 'Faculty of Education and Arts'
  }
]

output = multiRegexReplace(input, findReplace, 'igm')
```

## Validation helper function

Because data validation is important so we don't break things there are a number of helper functions for validation.

The following set of functions validate the existence of and data type properties of an object (useful for validating `GETvars`)

### `invalidString(prop, input, notEmpty) : false, string`

This is a shortcut function to see if an object contains a property and if that property's value is a string. 

It returns `FALSE` if the property does exist and is a string. Otherwise it returns the data type of input or "empty string" if the propety exists and is a string but is empty (and `notEmpty` is *not* false).

### `invalidNum(prop, input) : false, string`

Basically the same as `invalidString()` but for numbers

### `invalidStrNum(prop, input)`

Basically the same as `invalidString()` but accepts numbers and strings (although empty strings are allowed)

### `invalidArray(prop, input, notEmpty) : false, string`

Basically the same as `invalidString()` but for arrays (empty arrays are considered invalid)

### `isFunction(functionToCheck) : boolean`

Test whether a value is a function


