<?php
/**
 * This file sets up the custom debugging function.
 *
 * When it is finished a global debug() function will be available
 * for reporting on variables & constants
 *
 * PHP version 7.2
 *
 * @category RegexMultiTool
 * @package  RegexMultiTool
 * @author   Evan Wills <evan.i.wills@gmail.com>
 * @license  GPL3 https://www.gnu.org/licenses/gpl-3.0.en.html
 * @link     https://github.com/evanwills/regex-multi-tool
 */


if (!defined('DEBUG_MODE')) {
    define('DEBUG_MODE', false);
}
if (!defined('APPLICATION_PATH')) {
    define('APPLICATION_PATH', '');
}
if (!defined('DEBUG_PATH')) {
    if (is_dir(APPLICATION_PATH)) {
        define(
            'DEBUG_PATH',
            realpath(APPLICATION_PATH.'/../includes/').DIRECTORY_SEPARATOR
        );
    } else {
        define('DEBUG_PATH', realpath('../../includes/').DIRECTORY_SEPARATOR);
    }
}

// ==============================================
// START: debug() setup

if (defined('DEBUG_MODE') && DEBUG_MODE === true) {
    ini_set('error_reporting', 'E_ALL');
    ini_set('display_errors', 1);

    if (is_dir(DEBUG_PATH) && is_dir(APPLICATION_PATH)) {
        // Get the debug function - outputs debugging info to screen
        if (!function_exists('debug')) {
            if (file_exists(DEBUG_PATH . 'debug.inc.php')) {
                if (!file_exists(APPLICATION_PATH . 'debug.info')
                    && is_writable(APPLICATION_PATH)
                    && file_exists(DEBUG_PATH . 'template.debug.info')
                ) {
                    copy(
                        DEBUG_PATH . 'template.debug.info',
                        APPLICATION_PATH . 'debug.info'
                    );
                }
                include DEBUG_PATH . 'debug.inc.php';
            }
        }
    }
}
if (!function_exists('debug')) {
    /**
     * Dummy debug function that does nothing
     * (except prevent calls to it throwing errors)
     *
     * @return void
     */
    function debug()
    {
    }
}

//  END:  debug() setup
// ==============================================
