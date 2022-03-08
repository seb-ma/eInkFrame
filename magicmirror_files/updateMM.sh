#!/bin/bash

pushd /opt/local/MagicMirror/

git pull && npm install --only=production

# Update modules (assuming that each module is a git repository)
cd modules
find . -name .git -print -execdir git pull \;
#find . -name .git -print -execdir npm update \;
find . -name .git -print -execdir npm install --only=production \;
# Specific update for MMM-MPR121
cd MMM-MPR121/; npm install; npm rebuild i2c-bus --update-binary; cd -

popd