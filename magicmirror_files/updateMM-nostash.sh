#!/bin/bash


SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

# Installation directory
pushd $SCRIPT_DIR/../../MagicMirror/

# Reset modifications and update repository
find . -name .git -print -execdir git reset --hard HEAD \; -execdir git pull \;

# Apply patch
$SCRIPT_DIR/applyPatches.sh

# Update MagicMirror² and modules
find . -name .git -print -execdir npm install --no-audit --no-fund --no-update-notifier --only=prod --omit=dev \;

# Go into modules folder
cd modules/

# Specific update for MMM-Bosch-BME680-sensor
cd MMM-Bosch-BME680-sensor/; npm rebuild i2c-bus --update-binary; cd -
# Specific case for rpio dependency in MMM-IT8951
cd MMM-IT8951/; npm install --no-audit --no-fund --no-update-notifier; npm rebuild rpio --update-binary; cd -
# Specific update for MMM-MPR121
cd MMM-MPR121/; npm install --no-audit --no-fund --no-update-notifier; npm rebuild i2c-bus --update-binary; cd -

popd
