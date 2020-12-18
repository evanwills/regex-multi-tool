<?php
/**
 * This file extracts user supplied values from CLI supplied arguments
 *
 * It modifies the following variables:
 *  * $mode
 *  * $action
 *  * $groups
 *  * $body
 *  * $errorCode
 *
 * PHP version 7.2
 *
 * @category RegexMultiTool
 * @package  RegexMultiTool
 * @author   Evan Wills <evan.i.wills@gmail.com>
 * @license  GPL3 https://www.gnu.org/licenses/gpl-3.0.en.html
 * @link     https://github.com/evanwills/regex-multi-tool
 */

if (array_key_exists('argc', $_SERVER) && $_SERVER['argc'] > 1) {
    $mode = isValidMode($_SERVER['argv'][1]);

    if ($mode === false) {
        $errorCode = 2;
    } elseif ($_SERVER['argc'] > 2) {
        $action = isValidAction($_SERVER['argv'][2], $mode);

        if ($action === false) {
            $errorCode = 4;
        }

        if ($action !== 'action-list') {
            if ($_SERVER['argc'] > 3) {
                for ($a = 3; $a <= $_SERVER['argc']; $a += 1) {
                    $tmp = ltrim(substr($_SERVER['argv'][$a], 0, 20));
                    if (substr($tmp, 0, 5) === 'body=') {
                        $body = substr($_SERVER['argv'][$a], 5);
                    } elseif (substr($tmp, 0, 1) === '{') {
                        $body = $_SERVER['argv'][$a];
                    } elseif (substr($tmp, 0, 6) === 'group=') {
                        $group = isValidGroupsAll(substr($_SERVER['argv'][$a], 6));

                        if ($group === false) {
                            $errorCode = 2000;
                            break;
                        }
                    }
                }
            }
        }
    } else {
        $errorCode = 3;
    }
} else {
    $errorCode = 1;
}
