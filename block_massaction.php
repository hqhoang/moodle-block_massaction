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
 * @package    block_massaction
 * @copyright  2013 University of Minnesota
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

class block_massaction extends block_base {

    /**
     * initialize the plugin
     */
    function init() {
        $this->title = get_string('blocktitle', 'block_massaction');
    }

    /**
     * @see block_base::applicable_formats()
     */
    function applicable_formats() {
	    return array('course-view' => true, 'mod' => false, 'tag' => false);
    }

    /**
     * no need to have multiple blocks to perform the same functionality
     */
    function instance_allow_multiple() {
        return false;
    }

    /**
     * @see block_base::get_content()
     */
    function get_content() {
        global $CFG, $PAGE, $USER, $COURSE, $OUTPUT;

        if ($this->content !== NULL) {
            return $this->content;
        }

        $this->content = new stdClass();
        $this->content->text   = '';
        $this->content->footer = '';

        if ($PAGE->user_is_editing()) {
            $jsmodule = array(
                'name'         => 'block_massaction',
                'fullpath'     => '/blocks/massaction/module.js',
                'requires'     => array('base', 'io', 'node', 'json', 'event'),
                'strings'	   => array(
                    array('week', 'block_massaction'),
                    array('topic', 'block_massaction'),
                    array('section', 'block_massaction'),
                    array('section_zero', 'block_massaction'),
                    array('selecttarget', 'block_massaction'),
                    array('noitemselected', 'block_massaction'),
                    array('confirmation', 'block_massaction')
                )
            );

            $PAGE->requires->js('/blocks/massaction/js/module_selector.js');
            $PAGE->requires->js_init_call('M.block_massaction.init',
                                          array(array('course_format' => $COURSE->format)), true, $jsmodule);

            $str = array(
            	'selectall'             => get_string('selectall', 'block_massaction'),
            	'itemsin'               => get_string('itemsin', 'block_massaction'),
            	'allitems'              => get_string('allitems', 'block_massaction'),
            	'deselectall'           => get_string('deselectall', 'block_massaction'),
                'withselected'	        => get_string('withselected', 'block_massaction'),
                'action_movetosection'	=> get_string('action_movetosection', 'block_massaction'),
                'action_duptosection'	=> get_string('action_duptosection', 'block_massaction')
            );

            $jsdisabled = get_string('jsdisabled', 'block_massaction');
            $this->content->text  = <<< EOB
<div class="block_massaction_jsdisabled">{$jsdisabled}</div>
<div class="block_massaction_jsenabled hidden">
    <a id="mod-massaction-control-selectall" href="javascript:void(0);">{$str['selectall']}</a><br/>
    <select id="mod-massaction-control-section-list-select">
    	<option value="all">{$str['allitems']}</option>
    </select>
    <a id="mod-massaction-control-deselectall" href="javascript:void(0);">{$str['deselectall']}</a><br/><br/>

    {$str['withselected']}:
EOB;

            // Print the action links.
            $action_icons = array(
                'moveleft'     => 't/left',
                'moveright'    => 't/right',
                'hide'         => 't/show',
                'show'         => 't/hide',
                'delete'       => 't/delete'
                //'moveto'     => 't/move',
                //'dupto'      => 't/duplicate'
            );

            foreach ($action_icons as $action => $icon_path) {
                $pix_path    = $OUTPUT->pix_url($icon_path);
                $action_text = get_string('action_'.$action, 'block_massaction');

                $this->content->text .= <<< EOB
    <br/>
    <a id="mod-massaction-action-{$action}" class="massaction-action" href="javascript:void(0);">
    	<img src="{$pix_path}" alt="{$action_text}" title="{$action_text}"/>&nbsp;{$action_text}
    </a>
EOB;
            }
            $this->content->text .= html_writer::empty_tag('br');
            $this->content->text .= <<< EOB
    <select id="mod-massaction-control-section-list-moveto">
    	<option value="">{$str['action_movetosection']}</option>
    </select>
    <select id="mod-massaction-control-section-list-dupto">
    	<option value="">{$str['action_duptosection']}</option>
    </select>
    <form id="mod-massaction-control-form" name="mod-massaction-control-form" action="{$CFG->wwwroot}/blocks/massaction/action.php" method="POST">
    	<input type="hidden" id="mod-massaction-control-request" name="request" value="">
    	<input type="hidden" id="mod-massaction-instance_id" name="instance_id" value="{$this->instance->id}">
    	<input type="hidden" id="mod-massaction-return_url" name="return_url" value="{$_SERVER['REQUEST_URI']}">
    </form>
    <div id="mod-massaction-help-icon">{$OUTPUT->help_icon('usage', 'block_massaction')}</div>
</div>
EOB;
        }

        return $this->content;
    }
}
