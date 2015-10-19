#!/bin/bash
set -x
g_application_name="linshare-ui-upload-request"
g_enable_no_min=0
g_application_config_file=config.js
g_application_version_file=bower.json
g_build_cmd="./node_modules/.bin/gulp build"
# needed if g_enable_no_min=1
#g_build_min_cmd="./node_modules/.bin/gulp build"
set +x
