#!/bin/bash
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

# Installation directory
pushd ~/MagicMirror/

cd ./modules/MMM-Nantes-TAN
patch -p1 -i $SCRIPT_DIR/patches/MMM-Nantes-TAN.patch
cd -

cd ./modules/MMM-Saint
patch -p1 -i $SCRIPT_DIR/patches/MMM-Saint.patch
cd -

cd ./modules/MMM-Pollen-FR
patch -p1 -i $SCRIPT_DIR/patches/MMM-Pollen-FR.patch
cd -

cd ./modules/MMM-VigilanceMeteoFrance
patch -p1 -i $SCRIPT_DIR/patches/MMM-VigilanceMeteoFrance.patch
cd -

cd ./modules/MMM-Spotify
patch -p1 -i $SCRIPT_DIR/patches/MMM-Spotify.patch
cd -

cd ./modules/MMM-MPR121
patch -p1 -i $SCRIPT_DIR/patches/MMM-MPR121.patch
cd -

cd ./modules/MMM-FreeBox-Monitor
patch -p1 -i $SCRIPT_DIR/patches/MMM-FreeBox-Monitor.patch
cd -

cd ./modules/MMM-Trello
patch -p1 -i $SCRIPT_DIR/patches/MMM-Trello.patch
cd -

cd ./modules/MMM-Traffic
patch -p1 -i $SCRIPT_DIR/patches/MMM-Traffic.patch
cd -

cd ./modules/MMM-CalDAV
patch -p1 -i $SCRIPT_DIR/patches/MMM-CalDAV.patch
cd -

cd ./modules/MMM-vCard2Calendar
patch -p1 -i $SCRIPT_DIR/patches/MMM-vCard2Calendar.patch
cd -

cd .
patch -p1 -i $SCRIPT_DIR/patches/MagicMirror.patch
cd -


popd
