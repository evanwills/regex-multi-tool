<?php
/**
 * This file contains a collection of functions for doing primary
 * validating user inputs
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
 * Check whether the supplied mode is valid
 *
 * @param mixed $input Value to be tested
 *
 * @return string,false Valid mode string or FALSe
 */
function isValidMode($input)
{
    if (is_string($input)) {
        $output = strtolower(trim($input));
        if ($output === 'simple' || $output === 'fancy') {
            return $output;
        }
    }
    return false;
}


/**
 * Check whether the supplied action is valid
 *
 * @param mixed  $input Value to be tested
 * @param string $mode  Which mode is regex-multi-tool operating in
 *
 * @return string,false String if action is valid action string or FALSE
 */
function isValidAction($input, $mode)
{
    if (is_string($input)) {
        $output = strtolower(trim($input));

        if ($mode === 'fancy') {
            if ($output === 'action-list') {
                return $output;
            } else {
                $len = strlen($output);
                if ($len > 3 && $len <= 32
                    && preg_match('`^[a-z][a-z0-9]{2,31}$`', $output)
                ) {
                    return $output;
                }
            }
        } else {
            switch($output) {
            case 'test':
            case 'match':
            case 'replace':
                return $output;
            }
        }
    }
    return false;
}

/**
 * Validate group name
 *
 * @param string $input group name to be validated
 *
 * @return string,false String name of group if valid. FALSE otherwise
 */
function isValidGroup($input)
{
    $output = preg_replace('`[^a-z0-9-]+`i', '', $input);
    return (preg_match('`^[a-z0-9]([-a-z0-9]{2,31}$', $output)) ? $output : false;
}

/**
 * Get list of validated group names
 *
 * @param string $input Comma separated list of group names
 *
 * @return array,false List of validated group names or FALSE
 */
function isValidGroupsAll($input)
{
    if (is_string($input)) {
        $output = array();
        $groups = explode(',', strtolower(trim($input)));

        for ($a = 0; $a < count($groups); $a += 1) {
            if (trim($groups[$a]) === '') {
                continue;
            }

            $tmp = isValidGroup($groups[$a]);

            if ($tmp === false) {
                return false;
            } else {
                $output[] = $tmp;
            }
        }

        return $output;
    }
    return false;
}

/**
 * Get body of request as associative array from JSON
 *
 * @param string $input Body parameter for the current request
 *
 * @return array,false
 */
function getJSON($input)
{
    if (is_string($input)) {
        try {
            $output = json_decode($input, true, 5);
        } catch (Exception $e) {
            return false;
        }
        return $output;
    }
    return false;
}

/**
 * Render output to user
 *
 * @param array $output Associative array to be converted to JSON
 *
 * @return void
 */
function renderOutput($output)
{
    if (!is_array($output)) {
        user_error(
            'renderOutput() expects only parameter to be an array. '.
            gettype($output).' given',
            E_USER_ERROR
        );
    }

    if (OUTPUT_TO_HTTP) {
        echo json_encode($output);
    } else {
        echo print_r($output, true);
    }
}
