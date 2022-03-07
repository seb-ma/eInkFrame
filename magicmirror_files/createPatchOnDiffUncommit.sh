#!/bin/bash

currentpath=$(pwd)

pushd /opt/local/MagicMirror/

find . -name .git -execdir git diff --ignore-space-change ':(exclude)package-lock.json' ':(exclude).gitignore' > $currentpath/eInkFrame.patch \;

popd