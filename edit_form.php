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
 * Defines the form for editing Grades at a Glance block instances.
 *
 * @package    block_massaction
 * @copyright  2013 University of Minnesota
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

class block_massaction_edit_form extends block_edit_form {
    protected function specific_definition($mform) {
        global $DB, $USER;

        $blockconfig = get_config('block_massaction');

        $blockinstanceid = required_param('bui_editid', PARAM_INT);
        $sql = 'SELECT context.instanceid, instance.configdata
                FROM {context} context
                JOIN {block_instances} instance
                ON instance.parentcontextid=context.id
                WHERE instance.id=?';
        $blockinstancerecord = $DB->get_record_sql($sql, array($blockinstanceid));

        if ($blockinstancerecord->instanceid == $USER->id && !(empty($blockinstancerecord->configdata))) {
            $configdata = unserialize(base64_decode($blockinstancerecord->configdata));
            $javascriptcheck = $configdata->javascriptcheck;
        } else {
            $javascriptcheck = $blockconfig->javascriptcheck;
        }

        $mform->addElement('header', 'configheader', get_string('blocksettings', 'block'));

        $javascriptcheckinput = $mform->createElement('advcheckbox', 'config_javascriptcheck',
            get_string('javascriptcheck', 'block_massaction'));

        if ($javascriptcheck) {
            $javascriptcheckinput->setChecked(true);
        }

        $mform->addElement($javascriptcheckinput);

        if ($blockconfig->javascriptcheck_locked) {
            $mform->freeze('config_javascriptcheck');
        }
    }
}
