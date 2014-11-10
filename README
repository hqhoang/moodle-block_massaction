This is the Mass Actions block for Moodle 2. Its appearance and behaviors are largely the same as the version for Moodle 1.9.

Created at University of Minnesota by the Custom Solutions team.

To install using git, type this command in the root of your Moodle install
    git clone git://github.com/jmarthaler/moodle-block_massaction.git blocks/massaction

Alternatively, download the zip from
    https://github.com/jmarthaler/moodle-block_massaction/zipball/master
unzip it into the blocks folder, and then rename the new folder to massaction.


Once installed, capability "block/massaction:use" needs to be added to the roles/users
(e.g. teacher) in order for them to be able to use the block.


RELEASE NOTE
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
