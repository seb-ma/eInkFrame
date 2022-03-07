#!/bin/bash

currentpath=$(pwd)

pushd /opt/local/MagicMirror/

echo "patch < $currentpath/eInkFrame.patch"

popd