<?php
/**
 * This file sets config constants for the regex-mulit-tool API
 *
 * PHP version 7.2
 *
 * @category RegexMultiTool
 * @package  RegexMultiTool
 * @author   Evan Wills <evan.i.wills@gmail.com>
 * @license  GPL3 https://www.gnu.org/licenses/gpl-3.0.en.html
 * @link     https://github.com/evanwills/regex-multi-tool
 */


/**
 * Whether or not to allow API requests via the CLI
 *
 * @var boolean
 */
define('ALLOW_CLI', true);

/**
 * Whether or not to allow API requests via the HTTP
 *
 * @var boolean
 */
define('ALLOW_HTTP', true);

/**
 * Whether or not to allow "Do regex stuff" API requests
 *
 * @var boolean
 */
define('ALLOW_DO_STUFF', true);

/**
 * Whether or not to allow regular expression test API requests
 *
 * @var boolean
 */
define('ALLOW_TEST', true);

/**
 * Whether or not to allow regular expression match API requests
 *
 * @var boolean
 */
define('ALLOW_MATCH', true);

/**
 * Whether or not to allow regular expression find & replace API requests
 *
 * @var boolean
 */
define('ALLOW_REPLACE', true);

/**
 * Maximum number of characters the body of the unparsed body of the
 * request can be. (0 = unlimited)
 *
 * @var integer
 */
define('MAX_BODY_LENGTH', 0);

/**
 * Whether or not to run the API in debug mode.
 *
 * @var boolean
 */
define('DEBUG_MODE', true);
