<?php
/**
 * This file does the primary bootstrapping for "regex-mulit-tool"
 *
 * PHP version 7.2
 *
 * @category RegexMultiTool
 * @package  RegexMultiTool
 * @author   Evan Wills <evan.i.wills@gmail.com>
 * @license  GPL3 https://www.gnu.org/licenses/gpl-3.0.en.html
 * @link     https://github.com/evanwills/regex-multi-tool
 */

require_once __DIR__.'/config.php';
require_once __DIR__.'/init-debug.inc.php';
require_once __DIR__.'/includes/pre-utils.inc.php';

/**
 * The mode the API will operate under
 *
 * Must be one of the following:
 *  * "stuff"   - parse the body using an action from do-regex-stuff
 *  * "test"    - validate the regular expression and it's
 *                flags/modifiers
 *  * "match"   - See what the regular expression(s) matches for a
 *                given string
 *  * "replace" - Do find/replace using the regular expression(s) on
 *                the supplied string
 *
 * If request is made via HTTP, value comes form $_GET['mode']
 * If request is made via CLI, value comes from the first argument
 *
 * @var string
 */
$mode = '';

/**
 * The "Do regex stuff" action to be performed
 *
 * If request is made via HTTP, value comes form $_GET['action']
 * If request is made via CLI, value comes from the second argument
 *
 * NOTE: "action-list" is a reserved for returning a list of actions
 *       available to the supplied group
 *
 * NOTE ALSO: actions (other than "action-list") are limited to
 *       thirty (case insensitive) alpha numeric characters.
 *       BUT the first character MUST be alphabetical
 *
 * @var string
 */
$action = '';

/**
 * List of groups the user has access to
 *
 * If request is made via HTTP, value comes form $_GET['action']
 * If request is made via CLI, value comes from any argument
 *    matching /^action=/i
 *
 * @var array
 */
$groups = array();

/**
 * Associative array extracted from json object in
 *
 * If request is made via HTTP, value comes form $_POST['body']
 * If request is made via CLI, value comes from any argument
 *    matching /^body=/i
 *
 * @var array
 */
$body = array();

/**
 * Error code for unrecoverable error
 *
 * Error code is sent (along with human readable error message) back
 * to the user without any additional processing
 *
 * @var integer
 */
$errorCode = 0;

// Do primary validation of user inputs
if (ALLOW_CLI) {
    require_once __DIR__.'/includes/parse-cli-args.inc.php';
    define('OUTPUT_TO_HTTP', false);
} elseif (ALLOW_HTTP) {
    require_once __DIR__.'/includes/parse-http-args.inc.php';
    define('OUTPUT_TO_HTTP', true);
} else {
    die('Regex multi tool is unavailable');
}

// Do secondary validation of user inputs
if ($errorCode === 0 && $action !== 'action-list') {
    if ($body === '') {
        $errorCode = 5;
    } elseif (MAX_BODY_LENGTH > 0 && strlen($body) > MAX_BODY_LENGTH) {
        $errorCode = 6;
    } else {
        $body = getJSON($body);

        if ($body === false) {
            $errorCode = 7;
        }
    }
}

if ($errorCode > 0) {
    // Something went wrong
    // Let the user know and bail.
    require_once __DIR__.'/includes/errorCodes.inc.php';

    $errorMsg = (array_key_exists($errorCode, $errorCodes))
        ? $errorCodes[$errorCode]
        : 'Unknown error code: '.$errorCode;
    if ($errorCode === 4) {
        $errorMsg .= $mode;
    }

    renderOutput(
        array(
            'error' => array(
                'code' => $errorCode,
                'message' => $errorMsg
            )
        )
    );
    exit;
}

// So far so good
// Now on to the real business.
if ($mode === 'stuff') {
    require_once __DIR__.'/includes/doStuff/do-regex-stuff.inc.php';
} else {
    require_once __DIR__.'/includes/regexTest/regex-text.inc.php';
}
