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

if (isset($_GET) && array_key_exists('mode', $_REQUEST)) {
    $mode = isValidMode($_REQUEST['mode']);

    if ($mode === false) {
        $errorCode = 2;
    } elseif (array_key_exists('action', $_REQUEST)) {
        $action = isValidAction($_REQUEST['action'], $mode);

        if ($action === false) {
            $errorCode = 4;
        }

        if ($action !== 'action-list') {
            if (array_key_exists('body', $_POST)) {
                $body = getJSON($_POST['body']);
            }

            if (array_key_exists('group', $_REQUEST)) {
                $group = isValidGroupsAll($_REQUEST['group']);
                if ($group === false) {
                    $errorCode = 2005;
                }
            }
        } else {
            $errorCode = 3;
        }
    }
} else {
    $errorCode = 1;
}
