# "Do JS regex stuff"



## How "Do JS regex stuff" works

So you have some dodgy text and you'd like to clean it up? Well you've come to the right place.

In the _[js/action-functions.js](js/action-functions.js)_ file you need to write a function that does all the stuff you need for one action.

Then you need to register that function so the app knows what to do.

> `Do-JS-Regex-Stuff` now has the ability to call a server-side API. 
> This allows you to create actions that can do things that are not 
> as easy to do in JavaScript.
> Currently I only have a [PHP implementation](README.php.md) of the server side API. And `Do-JS-Regex-Stuff` can only handle one output from the API, but I plan on implementing

## The `action` function

There are a few things you need to know about the `action` function:

1. The function must have a unique name (so you don't override someone else's work).
2. It must accept three parameters:
   1. __`input`__: {string} text from the main "Text to be modified" textarea
   2. __`extraInputs`__: {object} list of key/value pairs where the key is the contents of the `name` attribute of the field and the value is a function that can be called to retrieve the value of that field
        (see below for more info on extra fields that you can define when you register the function)
   3. __`GETvars`__: {object} list of all supplied GET variables from URL
3. It must return a string (to be used as the replacement contents for the "Text to be modified" textarea
4. It must be a pure function (i.e. it must not make changes to variables that are not defined within the function)

## Registering an `action` function

After you've defined the function, you need to register it by calling doStuff.register(), which accepts an object with the following keys:

1. __`func`__: {function} _[required]_ (forbidden/ignored for remote 
   actions)<br />
   The function (the name of the function, not quoted)
2. __`action`__: {string} _[required]_ [Action identifier](#about-action-identifiers).<br />
   The GET '`action`' value that tells the script that this is the 
   right action function to use
3. __`remote`__: {boolean} _[optional]_ (required for remote actions)
   If true, it indicates that the action is to be run on the same 
   server `Do-JS-Regex-Stuff` is served from, via an API call. 
   (currently only `json.php`)
4. __`name`__: {string} _[required]_ Used as the sub-title when the
   action is selected also used as the link text for the action in 
   the menu
5. `description`: {string} _[optional (but recommended)]_ short 
   paragraph decribing the purpose of the function. <br />
   (Displayed below the action's title)
6. `group`: {string} [_optional]_ The [name of the group](#about-group-names) 
   the action belongs to. Used to restrict access to (or visibility
   of) a given action to people who belong to a specific group
7. `docURL`: {string} _[optional]_ URL for documentation page
   (must be relative or HTTPS). Used in a popup to give detailed
   information about the action. Including the expected input what
   will be changed and the expected output why this needs to be done.
   It should also include details about the use/purpose of any extra
   inputs the action specifies.<br />
   Normally, documentation is written in HTML and stored in the
   `docs/` directory in this repo.
8. `extraInputs`: {array} _[option]_ list of objects for extra input  
   fields needed for the find/replace<br />
   Extra inputs fields allow you to augment the functionalty of your actions
   by letting the user control options you specify to get specific  
   behaviour that meets their needs.
   ([Read more about Extra inputs objects](#about-extrainput-objects))
9. `rawGET`: by default GET variables are "URL decoded" and converted
    to appropriate types. By specifying `rawGET` as `TRUE` the action function receives the _raw_ (all strings) GET variables.

### About `action` identifiers

`action` identifiers must follow a few simple rules:
1. They must start with at least two alphabetical characters
2. They can only contain alpha-numeric characters
3. They must be a minimum of 6 characters long and a maximum of 50 characters long
4. They are case insensitive when compared
5. They must be unique

### About `group` names

Like `action` identifiers `group` names must follow some rules to be valid:
1. They must start with at least two alphabetical characters
2. They can only contain alpha-numeric characters
3. They must be a minimum of 2 characters long and a maximum of 50 characters long
4. They are case insensitive when compared

Unlike `action` identifiers there is no need for them to be unique

### About `extraInput` objects

Having extra user input fields gives your action more flexibility. `extraInput` objects allow you to define all the attributes you'd like for a given input field, textarea, select field, group of radio buttons or checkboxes.

`extraInput` objects have the following properties:

1. __`id`__: {string} _[required]_
   used to identify the input (also used as the key when the '`extraInputs`' are passed to the function
2. __`label`__: {string} _[required]_
   text to describe the field (or group of checkboxes/radio buttons)
3. `type`: {string} _[optional]_
   text (default), textarea, number, radio, checkbox, select
   (if type is invalid, an error will be shown in the console)
4. `default`: {string, number} _[optional]_ (not radio, checkbox or select)
   the default value for the input<br />
   __NOTE:__ If there is a `GET` variable matching the ID of the 
   field and the `GET` variable's value will be used as the default for the field
5. `options`: {array} [required for radio, checkbox, select] list of
   option objects<br />
   [Read more about option objects](#option-objects)
6. `placeholder`: {string} _[optional]_
   Text displayed within the text or number field
   (only used for text & number inputs)
7. `pattern`: {string} _[optional]_
   regular expression to validate the contents of the text/number
   field (only used for text & number inputs)
8. `description`: {string} _[optional]_ Information about what this 
   field is used for. (Displayed below the input field input)
9. `min`: {number} _[optional]_ (number, date & time fields only)
   Minumum value the number field can contain
10. `max`: {number} _[optional]_ (number, date & time fields only)
    Maximum value the number field can contain
11. `step`: {number} _[optional]_ (number fields only)
    The amount to increment the field's value up and down when using the arrow keys or number scroller
12. __`options`__: {array} _[required]_ (select, radio & checkbox fields only) List of option objects<br />
    Option objects have the following keys:

#### `option` objects 

When specifying multi option fields like Select/dropdown fields, Radio button fields, or Checkbox fields, You will need to list each option value/label pair. You can do so by defining option objects.

`option` object have the following properties:

1. __`value`__: {string, number} _[required]_ the field value
2. __`label`__: {string} _[required]_ The text visible to the user
3. `default`: {boolean} _[optional]_ Whether or not this field/option 
   is checked/selected by default

__NOTE:__ If there is a `GET` variable matching the ID of the field and the value of that `GET` variable matches the value of the option, then that option will be checked/selected by default.

-----

## Using the values from extra input fields

Say you have an action function with three _extra input_ fields. One for year with the ID `year` and another for gender and a group of checkboxes for mood. You can get the value of `year` by calling `extraInputs.year()` and the value of gender by calling `extraInputs.gender()`. You can get the value for each type of mood by calling the mood function, passing the value of that mood as the only parameter  e.g.

``` javascript
const exposeChickens = (input, extraInputs, GETvars) => {
  let _unsure = (extraInputs.mood('unsure')) ? ' I think' : ''
  let _angry = extraInputs.mood('angry')
  let _boc = 'BOC! BOC!!'
  var _chicken = 'chicken'
  var _excited = extraInputs.mood('excited')
  // We retrieve the value of _gender by calling the function that
  // matches the ID (or name) of the input field
  var _gender = extraInputs.gender()
  let output = ''
  var _spring = ''
  // We do the same for _year
  var _year = extraInputs.year()

  // Test the gender of the chicken
  if (_gender === 'male') {
    _chicken = 'rooster'
    _boc = 'COCK-A-DOODLE-DO'
  } else if (_gender === 'female') {
    _chicken = 'hen'
  } else if (_gender === 'other') {
    _chicken += ' first don\'t try to pigeon hole me'
  }

  // Test the Year (as defined by the user)
  if (_year >= 2020) {
    _spring = ' spring'
  } else if (_year < 2018) {
    _spring = 'n old'
    _chicken += '. Please don\'t boil me and make me into soup.'
  }

  if (_excited === true) {
    _boc += ' BOC-OCK!!! '
    output = ' [[' + _boc + _unsure + ' ' + _boc + _boc
    output += 'I am a ' + _boc + _boc + _boc
    output += _spring + ' ' + _boc + _boc + _boc + _boc
    output += _chicken + ' ' + _boc + _boc + _boc + _boc + _boc + '!!]] '
  } else {
    output = ' [[' + _boc + '!!' + _unsure + ' I am a' + _spring + ' ' + _chicken + ']] '
  }

  if (_angry === true) {
    output = output.toUpperCase()
  }

  // Do the replacement and return the updated string
  return input.replace(/[aeiou]+/ig, output)
}

doStuff.register({
  action: 'doChicken',
  name: 'Expose the chickens',
  func: exposeChickens,
  extraInputs: [
    {
      id: 'year',
      label: 'Year chicken was born',
      type: 'number',
      min: 2013,
      max: 2019,
      step: 1,
      default: 2019
    },
    {
      id: 'gender',
      label: 'Gender of chicken',
      type: 'radio',
      options: [
        { 'value': 'male', label: 'Male (rooster)' },
        { 'value': 'female', label: 'Female (hen)', default: true },
        { 'value': 'other', label: 'Other' }
      ],
      description: 'This is used to give extra info about how this input should be used.'
    },
    {
      id: 'mood',
      label: 'Mood of the chicken',
      type: 'checkbox',
      options: [
        { 'value': 'unsure', label: 'Chicken is confused about its identity' },
        { 'value': 'angry', label: 'Chicken woke up on the wrong side of its purch', default: true },
        { 'value': 'excited', label: 'Chicken is super excited', default: true }
      ]
    }
  ],
  description: 'Change all vowels into chickens'
})
```

### Checkbox fields

All input types have the same way of accessing their values except checkboxes. __do-JS-regex-stuff__ is set up to allow for multiple checkbox inputs for a single "field" but checkboxes are unique and each needs a unique ID, so you access whether a checkbox is checked or not by passing the value to the function.

__NOTE:__ Checkbox values are always boolean (`TRUE` or `FALSE`)

In the above code sample we have "_Mood of the chicken_" group of checkboxes identified by `mood`. To get whether a given mood is checked we pass value for that mood to the `mood` function. e.g.

``` javascript
var _unsure = (extraInputs.mood('unsure')) ? ' I think' : ''
var _angry = extraInputs.mood('angry')
var _excited = extraInputs.mood('excited')
```


## Using GET variables from the URL

URL GET variables are used in two ways in __do-JS-regex-stuff__:
1. GET variables are used to preset "_extra input_" fields
2. GET variables are also available within an action function

### Pre-Processing GET variables

Where possible, the value of GET variables are converted to their appropriate javascript variable types. e.g.
*  `'true'` will be converted to boolean `TRUE` (case _insensitive_)
*  `'false'` will be converted to boolean `FALSE` (case _insensitive_)
*  `'2019'` will be converted to number `2019`

GET variables are also URL decoded. (But JSON objects are not parsed)

### Presetting _extra input_ fields

For text type fields, if the field's ID matches a GET variable, then the value of the GET variable is used as the default value for that field.

For checkbox, radio & select fields, if the field's `name` matches a get variable and the field's (or option's) value matches the value of the GET variable then that field/option will be checked/selected

### Using GET variables within action function

It's probably a bad idea to use GET variables within you action function because it hides functionality from the user which they may or may not need to change.

However, there are times when that's exactly what you want.

Action functions get the GET variables passed an object via the third parameter when the function is called.

As an action function author, you need to test whether the GET variable exists before you use it. Otherwise, an error will be thrown and your function won't work.

__NOTE:__ If the pre-processed GET variables don't work in your usecase, you can include the `rawGET` property in your registration object. This means that when the GET variables are passed to the action function you get the raw version of the variables.


## Regular expressions

Because there are somethings you can't normally do with regular Javascript RegExp regular expressions [XRegExp](http://xregexp.com/) is included.

XRegExp adds a lot of very useful extra functionality to RegExp. Checkout the [XRegExp documentation](https://github.com/slevithan/xregexp/blob/master/README.md) for more info on how to use it.


## More reading

* [Helper & utility functions](README.utils.md)
* [PHP API](README.php.md)
