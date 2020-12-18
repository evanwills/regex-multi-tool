# `Do-JS-Regex-Stuff` PHP API

# How it works

`POST` Requests are made to `json.php`. 

Each request must have:
1. An `action` GET variable that matches one of the registered actions
2. An `input` POST variable containing the string that is to be modified

It can also contain
1. A `group` GET variable containing a single group name<br />
   or 
2. A `groups` GET variable containing a comma separated list of group names the use should have access to
3. Any number of other GET and/or POST variables required by the action

When the action is initialised, both GET & POST variables are passed to the action's class constructor.

Once initialised the action's `modify` method is called with the `POST` `input` value passed as the only parameter.

As with the javascript action functions, the `modify` method must return the string that is to be returned to the client.

The request will return either a success response object:

```json
{
  "success": true,
  "error": {
    "code": 0,
    "message": ""
  },
  "output": "[action output]",
  "action": "[action identifier]",
  "group": "[Group name (optional)]",
  "extraOutputs": false // May contain an object with abitrary key/value pairs as needed by the action.
}
```
or a fail response object:
```json
{
  "success": false,
  "error": {
    "code": 0,
    "message": "Some human readable info about the error"
  },
  "action": "[action identifier]"
}
```

## About action classes

Action classes must implement the `IRegexAction` interface usually by extending the `RegexAction` abstract base class

### `IRegexAction` methods

#### static methods

#### object methods

##### `modify($input)`

Modify the user supplied input for this type of action

Parameter: `$input` {string} User input from post request

Returns {string} Modified input, to be sent back to the client


##### `extraOutputs()`

Get a list of extra key/value pairs to be returned to the client with the response JSON blob

Returns {false,array} If the action doesn't output any extra outputs, then `FALSE` is returned otherwise an associative array of key/value pairs is returned.
