/* jshint ignore:start */
define(['jquery', 'core/str'], function($, corestr) {

    return {
        init: function(data) {
            /*
             * We're importing a two-dimensional array of data, including section numbers and their
             * module/activity ids, section numbers and their human-readable labels, and the course
             * format. The array has this structure:
             *
             *  [
             *   courseformat: "topics",
             *   sectionmodules: {0: ["1", "2"], 1: ["3"], 2: ["4", "5", "6"], ...},
             *   sectionnames: ["Main", "Topic 1", "Topic 2", "Topic 3", ...]
             *  ]
             *
             * The "sectionmodules" array will only contain sections that have modules/activities.
             * Any sections that do not have any modules/activities will not be present in this
             * array. Having this information makes us much less dependent upon the DOM.
             *
             * The "sectionnames" array contains the labels for all sections in the course, without
             * regard for whether those sections have modules/activities. This is primarily used to
             * populate the three drop menus. This is not an explicitly associative array, but the
             * section labels are added in the order in which they display on the screen.
             *
             * Moodle always numbers the sections from zero to N. It's only the module id numbers that
             * will vary. In addition, the sections and their activities are always in the order in
             * which they appear in the browser. This is true even if the third section/topic/week/etc
             * is moved to be in, say, the second position; its id in these arrays will change from 2 to 1,
             * while the other section/week/topic/etc id will change from 1 to 2. The code uses sectionId
             * to refer to the section number (display order number) and should not be confused with the
             * section's id in the database.
             */
            this.data = data;

            // Draw the checkboxes next to the activities.
            this.drawCheckboxes(this.data);

            // Populate the drop menus.
            this.populateMenus(this.data);

            // Assign handlers.
            $('#block-massaction-selectall').on('click', this.data, this.selectAllHandler);
            $('#block-massaction-selectsome').on('change', this.data, this.selectAllHandler);
            $('#block-massaction-selectnone').on('click', this.data, this.selectAllHandler);

            $('#block-massaction-outdent').on('click', this.data, this.actionHandler);
            $('#block-massaction-indent').on('click', this.data, this.actionHandler);

            $('#block-massaction-hide').on('click', this.data, this.actionHandler);
            $('#block-massaction-show').on('click', this.data, this.actionHandler);

            $('#block-massaction-delete').on('click', this.data, this.actionHandler);

            $('#block-massaction-move').on('change', this.data, this.actionHandler);

            $('#block-massaction-clone').on('change', this.data, this.actionHandler);

            // Display the block.
            this.showBlock();
        },
        drawCheckboxes: function(data) {
            var courseActivities = '';
            var inputControl = '';
            var jQueryIdentifier = '';
            var moduleId = 0;
            var moduleKey = 0;
            var sectionId = 0;

            // Iterate through our sections and their activities, drawing checkboxes for each activity.
            for (sectionId in data['sectionmodules']) {
                /*
                 * Also check if the section exists in the DOM so we don't attempt to draw checkboxes
                 * for activities that do not exist in the DOM.
                 */
                if (sectionId !== null && $('#section-' + sectionId).length !== 0) {
                    /*
                     * We need the spans that house the edit controls in order to append our checkboxes
                     * to them later.
                     */
                    jQueryIdentifier = sectionId + ' ul.section li.activity ' + 'div.mod-indent-outer div';
                    courseActivities = $('#section' + jQueryIdentifier).children('span.actions');

                    for (moduleKey in data['sectionmodules'][sectionId]) {
                        if (moduleKey !== null) {
                            moduleId = data['sectionmodules'][sectionId][moduleKey];
                            inputControl = document.createElement('input');
                            inputControl.type = 'checkbox';
                            inputControl.id = 'massaction-input-' + moduleId;
                            inputControl.className = 'massaction-checkbox';

                            courseActivities[moduleKey].append(inputControl);
                        }
                    }
                }
            }
        },
        populateMenus: function(data) {
            var dropMenus = ['block-massaction-selectsome',
                             'block-massaction-move',
                             'block-massaction-clone'];
            var menuId = 0;
            var menuItem = '';
            var sectionId = 0;

            // This loop creates and appends all the options to the three drop menus.
            for (sectionId in data['sectionnames']) {
                if (sectionId !== null) {
                    for (menuId in dropMenus) {
                        if (menuId !== null) {
                            menuItem = document.createElement('option');
                            menuItem.text = data['sectionnames'][sectionId];
                            menuItem.value = sectionId;

                            /*
                             * We are disabling menu options in the "Select all in section" menu for
                             * sections that do not currently have any modules available to select.
                             */
                            if (dropMenus[menuId] === 'block-massaction-selectsome') {
                                if ((sectionId in data['sectionmodules'])) {
                                    menuItem.disabled = false;
                                } else {
                                    menuItem.disabled = true;
                                }
                            } else {
                                // We aren't disabling any options in the other two menus.
                                menuItem.disabled = false;
                            }

                            $('#' + dropMenus[menuId]).append(menuItem);
                        }
                    }
                }
            }
        },
        selectAllHandler: function(eventData) {
            // Defaults. Assume we have a bad target and plan to do nothing.
            var checkAll  = false;
            var checkNone = false;
            var checkSome = false;
            var sectionId = '';
            var moduleId  = '';
            var moduleKey = '';

            if (eventData.currentTarget.id == 'block-massaction-selectall') {
                checkAll = true;
            } else if (eventData.currentTarget.id == 'block-massaction-deselectall') {
                checkNone = true;
            } else if (eventData.currentTarget.id == 'block-massaction-selectsome') {
                /*
                 * If we are checking modules in one section only, we want to first uncheck all modules.
                 * This makes it easier for users to change their selections or correct erroneous selections
                 * because we reset to the default state (all unchecked) before checking the modules in the
                 * selected section. For example, if the user clicks 'Select all' and intended to click the
                 * drop menu instead, then they can simply make the correct selection from the drop menu
                 * and move on, rather than having to deselect all first. The same is true if they make
                 * an erroneous selection in the drop menu.
                 */
                checkNone = true;
                checkSome = true;
            }

            if (checkNone === true) {
                /*
                 * They clicked "Deselect all" or "Select all in section", which means that if they
                 * previously clicked "Select all", then they have over-ridden that choice.
                 * Set this input's value to false to track that change.
                 */
                $('#block-massaction-selected-all').val('false');

                // Proceed to uncheck all the boxes.
                for (sectionId in eventData.data['sectionmodules']) {
                    if (sectionId !== null) {
                        for (moduleKey in eventData.data['sectionmodules'][sectionId]) {
                            if (moduleKey !== null) {
                                moduleId = eventData.data['sectionmodules'][sectionId][moduleKey];

                                /*
                                 * Make sure this module exists in the DOM. No point setting state
                                 * on a non-existent input.
                                 */
                                if ($('#massaction-input-' + moduleId).length > 0) {
                                    $('#massaction-input-' + moduleId).prop('checked', false);
                                }
                            }
                        }
                    }
                }

                if (checkSome === true) {
                    sectionId = eventData.target['value'];

                    /*
                     * If the "Select all in section" selected option is "all", we don't want to try
                     * to check any boxes because this is not a section id.
                     */
                    if (sectionId !== 'all') {
                        for (moduleKey in eventData.data['sectionmodules'][sectionId]) {
                            if (moduleKey !== null) {
                                moduleId = eventData.data['sectionmodules'][sectionId][moduleKey];

                                    /*
                                     * Make sure this module exists in the DOM. No point setting state
                                     * on a non-existent input.
                                     */
                                if ($('#massaction-input-' + moduleId).length > 0) {
                                    $('#massaction-input-' + moduleId).prop('checked', true);
                                }
                            }
                        }
                    }
                }
            } else if (checkAll === true) {
                // This lets us track whether the user clicked "Select all".
                $('#block-massaction-selected-all').val('true');

                // Proceed to check all the boxes.
                for (sectionId in eventData.data['sectionmodules']) {
                    if (sectionId !== null) {
                        for (moduleKey in eventData.data['sectionmodules'][sectionId]) {
                            if (moduleKey !== null) {
                                moduleId = eventData.data['sectionmodules'][sectionId][moduleKey];

                                /*
                                 * Make sure this module exists in the DOM. No point setting state
                                 * on a non-existent input.
                                 */
                                if ($('#massaction-input-' + moduleId).length > 0) {
                                    $('#massaction-input-' + moduleId).prop('checked', true);
                                }
                            }
                        }
                    }
                }
            }
        },
        actionHandler: function(eventData) {
            var activities = new Array();
            var courseFormat = eventData.data['courseformat'];
            var moduleId = '';
            var moduleKey = null;
            var numberOfActivities = 0;
            var sectionId = $('#block-massaction-selectsome').val();
            var target = '';

            /*
             * When a course uses the OneTopic format and the user clicks 'Select all' or chooses
             * an option from the "Select all in section" menu, then we will need to know which
             * section was active. This enables us to determine whether they manually deselected
             * any of the modules/activities displayed on the screen. We don't have to perform this
             * check for any other section when the user has clicked 'Select all' because those
             * sections' modules/activities are not present in the DOM and therefore could not be
             * be manually deselected.
             */
            if (courseFormat === 'onetopic') {
                var activeTab = $('li.active:eq(0)');
                var textContent = activeTab[0]['textContent'];
                var activeSection = $("li[aria-label='" + textContent + "']").attr('id');
                activeSection = activeSection.split('-');
                var activeTabId = activeSection[1];
            }

            $('#block-massaction-selected-section').val(sectionId);

            // Find out what the user wants to do.
            var actionTarget = eventData['currentTarget']['id'].split('-');
            var action = actionTarget[actionTarget.length - 1];

            // Find out to which section the user wants to do it.
            if ($('#block-massaction-selected-all').val !== 'true') {
                // They did not select all in a section.
                if (sectionId === 'all') {
                    // Find which checkbxoes they actually checked.
                    for (sectionId in eventData.data['sectionmodules']) {
                        if (sectionId !== null) {
                            for (moduleKey in eventData.data['sectionmodules'][sectionId]) {
                                if (moduleKey !== null) {
                                    moduleId = eventData.data['sectionmodules'][sectionId][moduleKey];

                                    if ($('#massaction-input-' + moduleId).length > 0 &&
                                        $('#massaction-input-' + moduleId).is(':checked')) {

                                        activities.push(moduleId);
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // They selected all in a section.
                    for (moduleKey in eventData.data['sectionmodules'][sectionId]) {
                        /*
                         * Ensure the activity is actually checked because it is possible they selected
                         * all in a section, then changed their minds and manually deselected one or more.
                         * Assuming they are all checked in the selected section would mean that, in such
                         * a situation, the user would have to manually change ther selection in the drop
                         * menu, as well.
                         */
                        if (moduleKey !== null) {
                            moduleId = eventData.data['sectionmodules'][sectionId][moduleKey];

                            if (courseFormat === 'onetopic') {
                                /*
                                 * If the selected section is also the active section, then there
                                 * are checkboxes in the DOM which state we can check. If the
                                 * selected section is not the active section, then there are no
                                 * checkboxes in the DOM which state to check and so we add all
                                 * module ids for the selected section to the activities array
                                 * for submission.
                                 */
                                if (activeTabId === sectionId) {
                                    if ($('#massaction-input-' + moduleId).length > 0 &&
                                        $('#massaction-input-' + moduleId).is(':checked')) {

                                        activities.push(moduleId);
                                    }
                                } else {
                                    activities.push(moduleId);
                                }
                            } else {
                                if ($('#massaction-input-' + moduleId).length > 0 &&
                                    $('#massaction-input-' + moduleId).is(':checked')) {

                                    activities.push(moduleId);
                                }
                            }
                        }
                    }
                }
            } else {
                /*
                 * The user clicked "Select All". However, just like if they'd selected all in a section,
                 * we need to check that each of these activities' checkboxes is actually checked because
                 * they may have selected all and then manually deselected one or more. We don't want the
                 * user to have to manually check 15 of 16 (or 96 of 100) checkboxes on the page. They
                 * should be able to click "Select All" and then manually deselect a few to save time.
                 */
                for (sectionId in eventData.data['sectionmodules']) {
                    if (sectionId !== null) {
                        for (moduleKey in eventData.data['sectionmodules'][sectionId]) {
                            if (moduleKey !== null) {
                                moduleId = eventData.data['sectionmodules'][sectionId][moduleKey];

                                if (courseFormat === 'onetopic') {
                                    /*
                                     * If the current section is also the active section, then there
                                     * are checkboxes in the DOM which state we can check. If the
                                     * current section is not the active section, then there are no
                                     * checkboxes in the DOM which state to check and so we add all
                                     * module ids for the current section to the activities array
                                     * for submission.
                                     */
                                    if (activeTabId === sectionId) {
                                        if ($('#massaction-input-' + moduleId).length > 0 &&
                                            $('#massaction-input-' + moduleId).is(':checked')) {

                                            activities.push(moduleId);
                                        } else {
                                            activities.push(moduleId);
                                        }
                                    }
                                } else {
                                    if ($('#massaction-input-' + moduleId).length > 0 &&
                                        $('#massaction-input-' + moduleId).is(':checked')) {

                                        activities.push(moduleId);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            numberOfActivities = activities.length;

            switch(action) {
                case 'delete':
                    if (numberOfActivities > 0) {
                        var confirmDelete = corestr.get_string('confirmation',
                                                               'block_massaction',
                                                               numberOfActivities);

                        $.when(confirmDelete).done(function(confirmDelete) {
                            if (!window.confirm(confirmDelete)) {
                                return false;
                            }
                        });
                    }
                    break;

                case 'move':
                case 'clone':
                    target = $('#block-massaction-' + action).val();
                    break;

                default:
                    // Doing nothing intentionally.
                    break;
            }

            $('#block-massaction-action').val(action);
            $('#block-massaction-activities').val(JSON.stringify(activities));
            $('#block-massaction-target').val(target);

            if (numberOfActivities > 0) {
                $('#block-massaction-control-form').submit();
            } else {
                var nothingSelected = corestr.get_string('noitemselected', 'block_massaction');
                $.when(nothingSelected).done(window.alert(nothingSelected));
            }
        },
        showBlock: function() {
            $('div.block-massaction-jsdisabled').addClass('hidden');
            $('div.block-massaction-jsenabled').removeClass('hidden');
        }
    };
});
/* jshint ignore:end */
