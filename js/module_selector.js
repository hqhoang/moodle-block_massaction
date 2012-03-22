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
 *
 * @package    blocks
 * @subpackage massaction
 * @copyright  2011 University of Minnesota
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * a class that handles inserting checkboxes to the course sections
 */

var module_selector = function() {
    /* a registry of checkbox IDs, of the format:
     *  'section_number' => [{'module_id'   : <module-ID>,
     *                       'box_id'       : <checkbox_id>}]
     */
    this.sections = {};

    this.init();
};




/**
 * add checkboxes to all sections
 */
module_selector.prototype.add_checkboxes = function() {
    var self = this;

    var section_number   = 0;
    var section          = document.getElementById('section-0');

    while (section) {
        // add the section to the registry
        self.sections[section_number] = [];

        // find all LI with class 'activity' or 'resource'
        var LIs = YAHOO.util.Dom.getElementsByClassName('activity', 'li', section);

        for (var i = 0; i < LIs.length; i++) {
            // check if the LI is a module
            var id = YAHOO.util.Dom.getAttribute(LIs[i], 'id');

            if (id != null && id.substring(0, 7) == 'module-') {
                self.add_module_checkbox(section_number, LIs[i]);
            }
        }

        section_number++;  // advance the loop
        section = document.getElementById('section-' + section_number);
    }
};



/**
 * add a checkbox to a module element
 */
module_selector.prototype.add_module_checkbox = function(section_number, module_el) {
    var self = this;

    var module_id      = YAHOO.util.Dom.getAttribute(module_el, 'id');
    var box_id         = 'module_selector-' + module_id;

    // avoid creating duplicate checkboxes (in case sharing the library)
    if (document.getElementById(box_id) == null) {
        // add the checkbox
        var box = document.createElement("input");
        box.setAttribute('type', 'checkbox');
        box.setAttribute('id', box_id);
        box.setAttribute('name', box_id);
        YAHOO.util.Dom.addClass(box, 'module_selector_checkbox');

        // attach it to the command box
        var command_box = YAHOO.util.Dom.getElementsByClassName('commands', 'span', module_el);
        command_box[0].appendChild(box);
    }

    // keep track in registry
    self.sections[section_number].push({
        'module_id'   : module_id,
        'box_id'      : box_id
    });
};


module_selector.prototype.get_section_structure = function() {
    return this.sections;
};


module_selector.prototype.init = function() {
    var self = this;

    self.add_checkboxes();
};
