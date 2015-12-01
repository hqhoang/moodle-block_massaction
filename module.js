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
 * @copyright  2013 University of Minnesota
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

M.block_massaction = {
    sections   : null
};


/**
 * initialize the mass-action block
 * @param {object} Y, the YUI instance
 * @param {object} data, list of data from server
 *
 * @TODO: use M.util.get_string() for language strings from server side
 */
M.block_massaction.init = function(Y, data) {
    var self = this;
    this.Y = Y;        // keep a ref to YUI instance

    var mod_sel  = new module_selector();

    var sections = mod_sel.get_section_structure();
    M.block_massaction.sections = sections;

    // add the section options to the select boxes
    var section_selector = document.getElementById('mod-massaction-control-section-list-select');
    var section_moveto   = document.getElementById('mod-massaction-control-section-list-moveto');

    for (var section_number in sections) {
        if (section_number == 0) {    // general/first section
            var section_text = M.util.get_string('section_zero', 'block_massaction');
        }
        else {
            // find the section name
            var sectionname_node = Y.one('#section-' + section_number + ' h3.sectionname');

            if (sectionname_node != null) {
                var section_text = sectionname_node.get('text');
            }
            else {

                // determine the option text depending on course format
                switch (data.course_format) {
                    case 'weeks':
                         var section_text = M.util.get_string('week', 'block_massaction') + ' ' + section_number;
                         break;

                    case 'topics':
                         var section_text = M.util.get_string('topic', 'block_massaction') + ' ' + section_number;
                         break;

                    default:
                         var section_text = M.util.get_string('section', 'block_massaction') + ' ' + section_number;
                         break;
                }
            }
        }


        // add to section selector
        var section_option      = document.createElement('option');
        section_option.text     = section_text;
        section_option.value    = section_number;
        section_option.disabled = sections[section_number].length == 0; // if has no module to select
        section_selector.options[section_selector.options.length] = section_option;

        // add to move-to-section
        var section_option      = document.createElement('option');
        section_option.text     = section_text;
        section_option.value    = section_number;
        section_moveto.options[section_moveto.options.length] = section_option;
    }

    // attach event handler for the controls
    Y.on('change', function(e) { self.set_section_selection(true); },
         '#mod-massaction-control-section-list-select');

    Y.on('click', function(e) { self.set_section_selection(true, 'all'); },
         '#mod-massaction-control-selectall');

    Y.on('click', function(e) { self.set_section_selection(false, 'all'); },
         '#mod-massaction-control-deselectall');

    Y.on('click', function(e) { self.submit_action('moveleft'); },
         '#mod-massaction-action-moveleft');

    Y.on('click', function(e) { self.submit_action('moveright'); },
         '#mod-massaction-action-moveright');

    Y.on('click', function(e) { self.submit_action('hide'); },
         '#mod-massaction-action-hide');

    Y.on('click', function(e) { self.submit_action('show'); },
         '#mod-massaction-action-show');

    Y.on('click', function(e) { self.submit_action('delete'); },
         '#mod-massaction-action-delete');

    Y.on('change', function(e) { self.submit_action('moveto'); },
        '#mod-massaction-control-section-list-moveto');
};


/**
 * select all module checkboxes in section(s)
 * @param {bool} value, value to set the checkboxes to
 * @param {string} section_number, set to "all" to apply to all sections
 */
M.block_massaction.set_section_selection = function(value, section_number) {
    var sections = this.sections;
    var box_ids  = [];

    // see if we are toggling all sections
    if (typeof section_number != 'undefined' && section_number == 'all') {
        for (var sec_id in sections) {
            for (var  j = 0; j < sections[sec_id].length; j++) {
                box_ids.push(sections[sec_id][j].box_id);
            }
        }
    }
    else {
        var section_number = document.getElementById('mod-massaction-control-section-list-select').value;

        if (section_number != 'all') {
            for (var i = 0; i < sections[section_number].length; i++) {
                box_ids.push(sections[section_number][i].box_id);
            }
        }
    }

    // un/check the boxes
    for (var i = 0; i < box_ids.length; i++) {
        document.getElementById(box_ids[i]).checked = value;
    }
};



/**
 * submit the selected action to server
 *
 * @TODO: if in AJAX mode, trigger event on the corresponding inline commands of
 * each selected item, if available.
 *
 * @param {string} action
 */
M.block_massaction.submit_action = function(action) {
    var submit_data = {'action'        : action,
                       'module_ids'    : []};

    var sections = M.block_massaction.sections;

    // get the checked box IDs
    for (var sec_id in sections) {
        for (var i = 0; i < sections[sec_id].length; i++) {
            var checkbox = document.getElementById(sections[sec_id][i].box_id);

            if (checkbox !== null && checkbox.checked) {
                // extract the module ID
                var name_comps = sections[sec_id][i].module_id.split('-');
                submit_data.module_ids.push(name_comps[name_comps.length - 1]);
            }
        }
    }

    // verify that at least one checkbox is checked
    if (submit_data.module_ids.length == 0) {
        alert(M.util.get_string('noitemselected', 'block_massaction'));
        return false;
    }

    // prep the submission
    switch (action) {
        case 'moveleft':
        case 'moveright':
        case 'hide':
        case 'show':
            break;

        case 'delete':
            // confirm
            var numItems = submit_data.module_ids.length;
            if (!confirm(M.util.get_string('confirmation', 'block_massaction', numItems))) {
                return false;
            }

            break;

        case 'moveto':
            // get the target section
            submit_data.moveto_target = document.getElementById('mod-massaction-control-section-list-moveto').value;
            if (submit_data.moveto_target.replace(/ /g, '') == '') {
                return false;
            }
            break;

        default:
          alert('Unknown action: ' + action + '. Coding error.');
          return false;
    }

    // set the form value and submit
    document.getElementById('mod-massaction-control-request').value = this.Y.JSON.stringify(submit_data);
    document.getElementById('mod-massaction-control-form').submit();
}
