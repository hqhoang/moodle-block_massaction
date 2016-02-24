<?php
$string['pluginname'] = 'ניהול רכיבים כולל';
$string['massaction:use'] = 'ניהול רכיבים כולל:זמין לשימוש';
$string['blockname'] = 'ניהול רכיבים כולל';
$string['blocktitle'] = 'ניהול רכיבים כולל';
$string['usage'] = 'הנחיות שימוש בניהול רכיבים כולל';

$string['select'] = 'בחירה';
$string['selectall'] = 'בחירה כוללת';
$string['itemsin'] = 'פריטים ב';
$string['allitems'] = 'בחירת כל הפריטים ביחידת־הוראה:';
$string['deselect'] = 'ביטול בחירה';
$string['deselectall'] = 'ביטול בחירה כוללת';
$string['withselected'] = 'ביצוע פעולה על הנבחרים';

$string['action_moveleft'] = 'הזחה לימין';
$string['action_moveright'] = 'הזחה לשמואל';
$string['action_hide'] = 'הסתרה';
$string['action_show'] = 'הצגה';
$string['action_delete'] = 'מחיקה';
$string['action_moveto'] = 'הסטה';
$string['action_dupto'] = 'עתק של';
$string['action_movetosection'] = 'הסטה ליחידת־הוראה';
$string['action_duptosection'] = 'שכפל לסעיף';

$string['week'] = 'שבועי';
$string['topic'] = 'יחידת־הוראה';
$string['section'] = 'יחידת־הוראה';
$string['section_zero'] = 'יחידת מבוא';
$string['selecttarget'] = 'אנא בחרו יחידת־הוראה אליה יועברו הפריטים';
$string['noitemselected'] = 'יש לבחור פריט אחד לפחות לשם הפעלת הרכיב';



$string['noaction'] = 'לא נחברה פעולה';
$string['invalidaction'] = 'פעולה לא ידועה: {$a}';
$string['invalidmoduleid'] = 'קוד רכיב שגוי: {$a}';
$string['invalidcoursemodule'] = 'רכיב שגוי';
$string['invalidcourseid'] = 'קוד קורס שגוי';
$string['deletecheck'] = 'האם אתם מעוניינים למחוק את כל הפריטים';
$string['deletecheckpreconfirm'] = 'Are you sure you want to delete the following module(s)?';
$string['deletecheckconfirm'] = 'Are you REALLY sure you want to delete the following module(s)?';
$string['sectionnotexist'] = 'Target section does not exist';
$string['missingparam'] = 'Error coding: missing required JSON param "{$a}"';

$string['usage_help'] = <<< EOB
<p>This block allows instructors to perform actions upon multiple resources or activities in the class view, rather than having to perform repeated actions on individual items.</p>
<p>To use this block, Javascript must be enabled in your browser, you must be in editing mode in the course home page, and AJAX must be disabled. Only the courses in the Week or Topics formats are supported.</p>
<p>Supported actions include mass deletion, mass hiding, mass showing, and mass moving. To select items to perform actions on, simply click the checkbox to the right of it in the course home page, or you may select all items, or select all items in a section using the block. To perform actions, click the action you would like to perform inside the block.</p>
EOB;
