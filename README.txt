This is the Mass Actions block for Moodle 2.4 and up. Its appearance and behaviors
are largely the same as the version for Moodle 1.9.

Created at University of Minnesota by the Custom Solutions team.

To install using git, type this command in the root of your Moodle install
    git clone git@github.com:at-tools/moodle-block_massaction.git

Alternatively, download the zip from
    https://github.com/at-tools/moodle-block_massaction/zipball/master
unzip it into the blocks folder, and then rename the new folder to massaction.


Once installed, capability "block/massaction:use" needs to be added to the roles/users
(e.g. teacher) in order for them to be able to use the block.


RELEASE NOTE
[2016052401]
- Moved the string displayed when Javascript is disabled into the language file.
[2016052400]
- Enabled the block to inform the user, when Javascript is disabled, that Javascript
  is required in order to use the block

[2016052300]
- Fix bug with Topics/Weekly formats when Course Layout is set to 'Show one section
  per page' from Matt Davidson (syxton)

[2016030400]
- Fix bug with Flexible Sections course format where multiple checkboxes would be
  displayed for each activity in a sub-section

[2016022400]
- Add 'Duplicate to' functionality from Matt Davidson (syxton)

[2015120100]
- Merge a deletion confirmation prompt from Rex Lorenzo (rlorenzo)

[2015091400]
- Improved checkbox processing to make it more robust, in case there are non-input
  elements with an id matching the expected pattern

[2015032600]
- Updated applicable_formats() to allow any course format, while still
  preventing plugins and tags from using this block (sharpchi)

[2015022700]
- Renamed README to README.txt
- Added $plugin->component for Moodle 3.0 compatibility
- Changed $plugin->release to an actual version number
- Updated course formats for which this plugin is available to include all of:
    Flexible Sections, Collapsed Topics, Topics, and Weekly.
    **If you use a course format not listed and feel it should be able to use
    the Mass Actions block, please let me know and I will install your course
    format plugin and test this block with that format.

[2014081900]
- merge lang string from Skylar Kelty (sk-unikent)
- Cosmetic change to move drop-down to new line

[2013112101]
- merge Hebrew translation from Nadav Kavalerchik (nadavkav)

[2013112100]
- initialize $this->content properly to avoid strict warning

[2013112000]
- convert calls to deprecated get_context_instance() to context_xxx::instance()
- fix javascript to work with 2.6, catch errors to avoid breaking the page' script
- use course_delete_module() when available (Moodle 2.5 and above)

[2013040400]
- try to parse the section names into the listboxes when possible

[2013040100]
- updated to be compatible with Moodle 2.4

[2012032201]
- added additional checking to avoid Javascript error

[2012032200]
- added French translation from Luiggi Sansonetti

[2012012500]
- fixed incorrect call to rebuild_course_cache(), which rebuild all courses leading to
performance problem.

[2011081500]
- initial release
