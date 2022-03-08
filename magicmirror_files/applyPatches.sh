#!/bin/bash
pushd /opt/local/MagicMirror/

cd ./modules/MMM-FreeBox-Monitor
patch < patches/MMM-FreeBox-Monitor.patch
cd -

cd ./modules/MMM-MPR121
patch < patches/MMM-MPR121.patch
cd -

cd ./modules/MMM-Nantes-TAN
patch < patches/MMM-Nantes-TAN.patch
cd -

cd ./modules/MMM-Pollen-FR
patch < patches/MMM-Pollen-FR.patch
cd -

cd ./modules/MMM-Saint
patch < patches/MMM-Saint.patch
cd -

cd ./modules/MMM-Spotify
patch < patches/MMM-Spotify.patch
cd -

cd ./modules/MMM-Traffic
patch < patches/MMM-Traffic.patch
cd -

cd ./modules/MMM-Trello
patch < patches/MMM-Trello.patch
cd -

cd ./modules/MMM-VigilanceMeteoFrance
patch < patches/MMM-VigilanceMeteoFrance.patch
cd -

cd ./modules/MMM-vCard2Calendar
patch < patches/MMM-vCard2Calendar.patch
cd -

cd .
patch < patches/MagicMirror.patch
cd -

