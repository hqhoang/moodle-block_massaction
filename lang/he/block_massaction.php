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
 * Mass Actions block Hebrew language strings.
 *
 * @package    block_massaction
 * @copyright  2013 University of Minnesota
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

$string['pluginname'] = 'ניהול רכיבים כולל';
$string['massaction:use'] = 'ניהול רכיבים כולל:זמין לשימוש';
$string['blockname'] = 'ניהול רכיבים כולל';
$string['blocktitle'] = 'ניהול רכיבים כולל';
$string['usage'] = 'הנחיות שימוש בניהול רכיבים כולל';

$string['selectall'] = 'בחירה כוללת';
$string['itemsin'] = 'פריטים ב';
$string['allitems'] = 'בחירת כל הפריטים ביחידת־הוראה:';
$string['selectnone'] = 'ביטול בחירה כוללת';
$string['withselected'] = 'ביצוע פעולה על הנבחרים';

$string['action_outdent'] = 'הזחה לימין';
$string['action_indent'] = 'הזחה לשמואל';
$string['action_hide'] = 'הסתרה';
$string['action_show'] = 'הצגה';
$string['action_delete'] = 'מחיקה';
$string['action_move'] = 'הסטה ליחידת־הוראה';
$string['action_clone'] = 'שכפל לסעיף';

$string['week'] = 'שבועי';
$string['topic'] = 'יחידת־הוראה';
$string['section'] = 'יחידת־הוראה';
$string['section_zero'] = 'יחידת מבוא';
$string['selecttarget'] = 'אנא בחרו יחידת־הוראה אליה יועברו הפריטים';
$string['noitemselected'] = 'יש לבחור פריט אחד לפחות לשם הפעלת הרכיב';

$string['confirmation'] = 'Are you sure you want to delete {$a} items?';
$string['noaction'] = 'לא נחברה פעולה';
$string['invalidaction'] = 'פעולה לא ידועה: {$a}';
$string['invalidmoduleid'] = 'קוד רכיב שגוי: {$a}';
$string['invalidcoursemodule'] = 'רכיב שגוי';
$string['invalidcourseid'] = 'קוד קורס שגוי';
$string['confirmdeletiontitle'] = 'האם אתם מעוניינים למחוק את כל הפריטים';
$string['confirmdeletiontext'] = 'Are you sure you want to delete the following module(s)?';
$string['moduledeletionname'] = 'Module name';
$string['moduledeletiontype'] = 'Module type';
$string['sectionnotexist'] = 'Target section does not exist';
$string['missingparam'] = 'Error coding: missing required JSON param "{$a}"';

$string['usage_help'] = "<p>This block allows instructors to perform actions upon multiple resources or activities in the class view, rather than having to perform repeated actions on individual items.</p>
<p>To use this block, Javascript must be enabled in your browser, you must be in editing mode in the course home page, and AJAX must be disabled. Only the courses in the Week or Topics formats are supported.</p>
<p>Supported actions include mass deletion, mass hiding, mass showing, and mass moving. To select items to perform actions on, simply click the checkbox to the right of it in the course home page, or you may select all items, or select all items in a section using the block. To perform actions, click the action you would like to perform inside the block.</p>";

$string['jsdisabled'] = 'You must enable Javascript to use this block.';
