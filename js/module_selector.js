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
var Module_selector = function() {
    /*
     * A registry consisting of an object having a modules property that
     * is an array of objects each having a box_id and module_id property
     * which values are the CSS ids for the checkbox and its corresponding
     * activity module, respectively. This registry may also have other
     * properties depending on the course format.
     */
    this.sections = {};

    try {
        this.init();
    } catch(e) {
        // If there's an error, print it to the console. If the user knows to look
        // there, then they can share that information with us.
        window.console.log(e);
    }
};

/**
 * add checkboxes to all sections
 */
Module_selector.prototype.add_checkboxes = function() {
    var self = this;

    var section_number = 0;

    if (Y.one('div.onetopic')) {
        var ulist = Y.one('ul.nav-tabs').get('children');
        var isactive = false;
        var innertext = '';
        ulist.each(function(ulist_child) {
            innertext = ulist_child.get('innerText');

            if (ulist_child.hasClass('active')) {
                isactive = true;
            }

            /*
             * We have to check if innertext is an empty string because the + and - icons
             * in the navbar are included as children in the get() from line 56. Their
             * innerText property is an empty string. So, this makes a good way to
             * exclude them from our list of topics.
             */
            if (innertext !== '') {
                self.add_section(section_number, 'onetopic', innertext, isactive);
            }

            section_number += 1;
            isactive = false;
        });
    } else {
        var sections = Y.all('li.section');
        sections.each(function(section_el) {
            var id = section_el.getAttribute('id').split('-');
            section_number = id[1];
            self.add_section(section_number);
        });
    }
};

/**
 * add section to array
 */
Module_selector.prototype.add_section = function(section_number, parentclass, innertext, isactive) {
    var self = this;
    var LIs = '';

    if (parentclass === 'onetopic') {
        // Add the section to the registry.
        self.sections[section_number] = {'innertext': innertext, 'isactive': isactive, modules: []};

        if (Y.one('#section-' + section_number)) {
            LIs = Y.one('div.content ul').all('li');
        }
    } else {
        // Add the section to the registry.
        self.sections[section_number] = [];

        // Initialize modules property.
        self.sections[section_number].modules = [];

        // Find all LI with class 'activity' or 'resource'.
        LIs = Y.one('#section-' + section_number).all('li.activity');
    }

    if (LIs !== '') {
        LIs.each(function(module_el) {
            if (module_el.hasAttribute('id')) {
                var module_id = module_el.getAttribute('id');

                // Verify if it's a module container.
                if (module_id === null || module_id.substring(0, 7) !== 'module-') {
                    return false;
                }

                self.add_module_checkbox(section_number, module_el);
            }
        });
    }
};


/**
 * add a checkbox to a module element
 */
Module_selector.prototype.add_module_checkbox = function(section_number, module_el) {
    var self = this;

    var module_id = module_el.getAttribute('id');
    var box_id = 'module_selector-' + module_id;

    // Avoid creating duplicate checkboxes (in case sharing the library).
    if (Y.one('#' + box_id) === null) {
        // Add the checkbox.
        var box = Y.Node.create('<input type="checkbox" id="' + box_id + '" class="module_selector_checkbox" />');

        // Attach it to the command/action box.
        var control_box = module_el.one('span.commands');
        if (control_box === null) {
            control_box = module_el.one('span.actions');
        }

        if (control_box !== null) {
            control_box.appendChild(box);
        }
    }

    // Keep track in registry.
    self.sections[section_number].modules.push({
        'module_id'   : module_id,
        'box_id'      : box_id
    });
};


Module_selector.prototype.get_section_structure = function() {
    return this.sections;
};


Module_selector.prototype.init = function() {
    var self = this;

    Y.one('div.block_massaction_jsdisabled').addClass('hidden');
    Y.one('div.block_massaction_jsenabled').removeClass('hidden');
    self.add_checkboxes();
};
