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
 * @package    block_massaction
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

    try {
        this.init();
    } catch(e) {
    }
};

/**
 * add checkboxes to all sections
 */
module_selector.prototype.add_checkboxes = function() {
    var self = this;

    var section_number   = 0;
    var section = Y.one('#section-0');

    while (section) {
        // Add the section to the registry.
        self.sections[section_number] = [];

        // Find all LI with class 'activity' or 'resource'.
        var LIs = section.all('li.activity');

        LIs.each(function(module_el) {
            var module_id = module_el.getAttribute('id');

            // Verify if it's a module container.
            if (module_id == null || module_id.substring(0, 7) != 'module-') {
                return false;
            }

            self.add_module_checkbox(section_number, module_el);
        });

        section_number++;  // Advance the loop.
        section = Y.one('#section-' + section_number);
    }
};

/**
 * add a checkbox to a module element
 */
module_selector.prototype.add_module_checkbox = function(section_number, module_el) {
    var self = this;

    var module_id = module_el.getAttribute('id');
    var box_id = 'module_selector-' + module_id;

    // Avoid creating duplicate checkboxes (in case sharing the library).
    if (Y.one('#' + box_id) == null) {
        // Add the checkbox.
        var box = Y.Node.create('<input type="checkbox" id="' + box_id + '" class="module_selector_checkbox" />');

        // Attach it to the command/action box.
        var control_box = module_el.one('span.commands');
        if (control_box == null) {
            control_box = module_el.one('span.actions');
        }

        if (control_box != null) {
            control_box.appendChild(box);
        }
    }

    // Keep track in registry.
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

    Y.one('div.block_massaction_jsdisabled').addClass('hidden');
    Y.one('div.block_massaction_jsenabled').removeClass('hidden');
    self.add_checkboxes();
};
