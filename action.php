<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * @package    blocks
 * @subpackage massaction
 * @copyright  2011 University of Minnesota
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


require('../../config.php');

require_login();

$instance_id         = required_param('instance_id', PARAM_INT);
$massaction_request  = required_param('request', PARAM_TEXT);
$return_url          = required_param('return_url', PARAM_TEXT);
$del_preconfirm      = optional_param('del_preconfirm', 0, PARAM_BOOL);
$del_confirm         = optional_param('del_confirm', 0, PARAM_BOOL);

// check capability
$context = context_block::instance($instance_id);
require_capability('block/massaction:use', $context);


// parse the submitted data
$data = json_decode($massaction_request);

// verify that the submitted module IDs do belong to the course
if (!is_array($data->module_ids) || count($data->module_ids) == 0)
    print_error('missingparam', 'block_massaction', 'Module ID');

$module_records = $DB->get_records_select('course_modules',
                                          'ID IN (' . implode(',', array_fill(0, count($data->module_ids), '?')) . ')',
                                          $data->module_ids);

$courses_to_rebuild = array();    // keep track of courses to rebuild cache

foreach ($data->module_ids as $mod_id) {
    if (!isset($module_records[$mod_id])) {
        print_error('invalidmoduleid', 'block_massaction', $mod_id);
    }

    $courses_to_rebuild[$module_records[$mod_id]->course] = true;
}

if (!isset($data->action))
    print_error('noaction', 'block_massaction');

// dispatch the submitted action
switch ($data->action) {
    case 'moveleft':
    case 'moveright':
        require_capability('moodle/course:manageactivities', $context);
        adjust_indentation($module_records, $data->action == 'moveleft' ? -1 : 1);
        break;

    case 'hide':
    case 'show':
        require_capability('moodle/course:activityvisibility', $context);
        set_visibility($module_records, $data->action == 'show');
        break;

    case 'delete':
        if ( !$del_preconfirm ) {
            print_deletion_confirmation($module_records, 'preconfirm');
        }
        else if ( !$del_confirm ) {
            print_deletion_confirmation($module_records, 'confirm');
        }
        else {
            perform_deletion($module_records);
        }
        break;

    case 'moveto':
        if (!isset($data->moveto_target)) {
            print_error('missingparam', 'block_massaction', 'moveto_target');
        }
        perform_moveto($module_records, $data->moveto_target);
        break;

    default:
        print_error('invalidaction', 'block_massaction', $data->action);
}

// rebuild course cache
foreach ($courses_to_rebuild as $course_id => $nada) {
    rebuild_course_cache($course_id);
}

// redirect back to the previous page
redirect($return_url);





/**
 * helper function to perform indentation/outdentation
 * @param array $modules list of module records to modify
 * @param int $amount, 1 for indent, -1 for outdent
 */
function adjust_indentation($modules, $amount) {
    global $DB;

    foreach ($modules as $cm) {
        $cm->indent += $amount;

        if ($cm->indent < 0) {
            $cm->indent = 0;
        }

        $DB->set_field('course_modules', 'indent', $cm->indent, array('id' => $cm->id));
    }
}



/**
 * helper function to set visibility
 * @param array $modules list of module records to modify
 * @param bool $visible true to show, false to hide
 */
function set_visibility($modules, $visible) {
    global $DB, $CFG;

    require_once($CFG->dirroot.'/course/lib.php');

    foreach ($modules as $cm) {
        set_coursemodule_visible($cm->id, $visible);
    }
}



/**
 * print out the list of course-modules to be deleted for confirmation
 * @param array $modules
 * @param string $mode either 'preconfirm' or 'confirm'
 */
function print_deletion_confirmation($modules, $mode = 'preconfirm') {
    global $DB, $PAGE, $OUTPUT, $CFG, $massaction_request, $instance_id, $return_url;

    $module_list = array();

    foreach ($modules as $cm_record) {
        if (!$cm = get_coursemodule_from_id('', $cm_record->id, 0, true)) {
            print_error('invalidcoursemodule');
        }

        if (!$course = $DB->get_record('course', array('id'=>$cm->course))) {
            print_error('invalidcourseid');
        }

        $context     = context_course::instance($course->id);
        $modcontext  = context_module::instance($cm->id);
        require_capability('moodle/course:manageactivities', $context);

        $fullmodulename = get_string('modulename', $cm->modname);

        $module_list[] = array($fullmodulename, $cm->name);
    }

    $options_yes = array('del_preconfirm'  => 1,
                         'instance_id'     => $instance_id,
                         'return_url'    => $return_url,
                         'request'         => $massaction_request);

    if ($mode == 'confirm') {
        $options_yes['del_confirm'] = 1;
    }

    $options_no  = array('id' => $cm->course);

    $str_del_check = get_string('deletecheck', 'block_massaction');

    require_login($course->id);

    $PAGE->requires->css('/blocks/massaction/styles.css');
    $PAGE->set_url(new moodle_url('/blocks/massaction/action.php'));
    $PAGE->set_title($str_del_check);
    $PAGE->set_heading($course->fullname);
    $PAGE->navbar->add($str_del_check);
    echo $OUTPUT->header();

    // prep the content
    if ($mode == 'preconfirm') {
        $content = get_string('deletecheckpreconfirm', 'block_massaction');
    }
    else {
        $content = get_string('deletecheckconfirm', 'block_massaction');
    }

    $content .= '<table id="block_massaction_module_list"><thead><th>Module name</th><th>Module type</th></thead><tbody>';
    foreach ($module_list as $m_name) {
        $content .= "<tr><td>{$m_name[1]}</td><td>{$m_name[0]}</td></tr>";
    }
    $content .= '</tbody></table>';

    echo $OUTPUT->box_start('noticebox');
    $form_continue = new single_button(new moodle_url("{$CFG->wwwroot}/blocks/massaction/action.php", $options_yes), get_string('delete'), 'post');
    $form_cancel   = new single_button(new moodle_url("{$CFG->wwwroot}/course/view.php?id={$course->id}", $options_no), get_string('cancel'), 'get');
    echo $OUTPUT->confirm($content, $form_continue, $form_cancel);
    echo $OUTPUT->box_end();
    echo $OUTPUT->footer();

    exit;
}



/**
 * perform the actual deletion of the selected course modules
 * @param array $modules
 */
function perform_deletion($modules) {
    global $CFG, $OUTPUT, $DB, $USER;

    require_once($CFG->dirroot.'/course/lib.php');

    foreach ($modules as $cm_record) {
        if (!$cm = get_coursemodule_from_id('', $cm_record->id, 0, true)) {
            print_error('invalidcoursemodule');
        }

        if (!$course = $DB->get_record('course', array('id'=>$cm->course))) {
            print_error('invalidcourseid');
        }

        $context     = context_course::instance($course->id);
        $modcontext  = context_module::instance($cm->id);
        require_capability('moodle/course:manageactivities', $context);

        $modlib = $CFG->dirroot.'/mod/'.$cm->modname.'/lib.php';

        if (file_exists($modlib)) {
            require_once($modlib);
        }
        else {
            print_error('modulemissingcode', '', '', $modlib);
        }

        course_delete_module($cm->id);
    }
}




/**
 * perform the actual deletion of the selected course modules
 * @param array $modules
 * @param int $target ID of the section to move to
 */
function perform_moveto($modules, $target) {
    global $CFG, $DB;

    require_once($CFG->dirroot.'/course/lib.php');

    foreach ($modules as $cm_record) {
        if (!$cm = get_coursemodule_from_id('', $cm_record->id, 0, true)) {
            print_error('invalidcoursemodule');
        }

        // verify target
        if (!$section = $DB->get_record('course_sections', array('course' => $cm->course, 'section' => $target))) {
            print_error('sectionnotexist', 'block_massaction');
        }

        $context = context_course::instance($section->course);
        require_capability('moodle/course:manageactivities', $context);

        moveto_module($cm_record, $section);
    }
}

