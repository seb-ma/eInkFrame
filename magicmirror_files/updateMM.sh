#!/bin/bash

# Installation directory
pushd ~/MagicMirror/

git pull && npm install --only=production

# Update MagicMirro² and modules
cd modules
find . -name .git -print -execdir git pull && npm install --only=production \;
#find . -name .git -print -execdir npm update \;
# Specific update for MMM-MPR121
cd MMM-MPR121/; npm install; npm rebuild i2c-bus --update-binary; cd -

popd