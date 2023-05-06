#!/bin/bash
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

# Installation directory
pushd ~/MagicMirror/

cd ./modules/MMM-Nantes-TAN
echo Applying patch MMM-Nantes-TAN.patch
git apply --ignore-whitespace --whitespace=nowarn $SCRIPT_DIR/patches/MMM-Nantes-TAN.patch
cd -

cd ./modules/MMM-Saint
echo Applying patch MMM-Saint.patch
git apply --ignore-whitespace --whitespace=nowarn $SCRIPT_DIR/patches/MMM-Saint.patch
cd -

cd ./modules/MMM-Pollen-FR
echo Applying patch MMM-Pollen-FR.patch
git apply --ignore-whitespace --whitespace=nowarn $SCRIPT_DIR/patches/MMM-Pollen-FR.patch
cd -

cd ./modules/MMM-Spotify
echo Applying patch MMM-Spotify.patch
git apply --ignore-whitespace --whitespace=nowarn $SCRIPT_DIR/patches/MMM-Spotify.patch
cd -

cd ./modules/MMM-MPR121
echo Applying patch MMM-MPR121.patch
git apply --ignore-whitespace --whitespace=nowarn $SCRIPT_DIR/patches/MMM-MPR121.patch
cd -

cd ./modules/MMM-FreeBox-Monitor
echo Applying patch MMM-FreeBox-Monitor.patch
git apply --ignore-whitespace --whitespace=nowarn $SCRIPT_DIR/patches/MMM-FreeBox-Monitor.patch
cd -

cd ./modules/MMM-Trello
echo Applying patch MMM-Trello.patch
git apply --ignore-whitespace --whitespace=nowarn $SCRIPT_DIR/patches/MMM-Trello.patch
cd -

cd ./modules/MMM-Traffic
echo Applying patch MMM-Traffic.patch
git apply --ignore-whitespace --whitespace=nowarn $SCRIPT_DIR/patches/MMM-Traffic.patch
cd -

cd ./modules/MMM-vCard2Calendar
echo Applying patch MMM-vCard2Calendar.patch
git apply --ignore-whitespace --whitespace=nowarn $SCRIPT_DIR/patches/MMM-vCard2Calendar.patch
cd -

cd .
echo Applying patch MagicMirror.patch
git apply --ignore-whitespace --whitespace=nowarn $SCRIPT_DIR/patches/MagicMirror.patch
cd -


popd
