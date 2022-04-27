#!/bin/bash

# Installation directory
pushd ~/MagicMirror/

# Stash modifications, update repository and reapply modifications
git stash && git pull && git stash pop
# Install
npm install --only=production

# Update MagicMirror² and modules
cd modules/
find . -name .git -print -execdir git stash \; -execdir git pull \; -execdir git stash pop \; -execdir npm install --only=production \;
#find . -name .git -print -execdir npm update \;
# Specific update for MMM-MPR121
cd MMM-MPR121/; npm install; npm rebuild i2c-bus --update-binary; cd -
# Specific update for MMM-Bosch-BME680-sensor
cd MMM-Bosch-BME680-sensor/; npm install; npm rebuild i2c-bus --update-binary; cd -
# Specific case for rpio dependency in MMM-IT8951
cd MMM-IT8951/; npm install; npm rebuild rpio --update-binary; cd -

popd
