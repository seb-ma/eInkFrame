#!/bin/bash
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

# Installation directory
pushd ~/MagicMirror/

cd ./modules/MMM-Nantes-TAN
git apply $SCRIPT_DIR/patches/MMM-Nantes-TAN.patch
cd -

cd ./modules/MMM-Saint
git apply $SCRIPT_DIR/patches/MMM-Saint.patch
cd -

cd ./modules/MMM-Pollen-FR
git apply $SCRIPT_DIR/patches/MMM-Pollen-FR.patch
cd -

cd ./modules/MMM-Spotify
git apply $SCRIPT_DIR/patches/MMM-Spotify.patch
cd -

cd ./modules/MMM-MPR121
git apply $SCRIPT_DIR/patches/MMM-MPR121.patch
cd -

cd ./modules/MMM-FreeBox-Monitor
git apply $SCRIPT_DIR/patches/MMM-FreeBox-Monitor.patch
cd -

cd ./modules/MMM-Trello
git apply $SCRIPT_DIR/patches/MMM-Trello.patch
cd -

cd ./modules/MMM-Traffic
git apply $SCRIPT_DIR/patches/MMM-Traffic.patch
cd -

cd ./modules/MMM-CalDAV
git apply $SCRIPT_DIR/patches/MMM-CalDAV.patch
cd -

cd ./modules/MMM-vCard2Calendar
git apply $SCRIPT_DIR/patches/MMM-vCard2Calendar.patch
cd -

cd .
git apply $SCRIPT_DIR/patches/MagicMirror.patch
cd -


popd
