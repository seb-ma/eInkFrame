#!/bin/bash

pushd /opt/local/


# Retrieving MagicMirror²
git clone https://github.com/MichMich/MagicMirror
cd MagicMirror/

# Installation (~10 minutes on RP3)
npm install --only=production


# Modules


## Core
##
### Configure the positions and visibility of any module to make pages
git clone https://github.com/Veldrovive/MMM-Page-Selector

## Weather
##
### pollen.fr forecast
git clone https://github.com/lekesako/MMM-Pollen-FR
### current level of vigilance of weather phenomena
git clone https://github.com/grenagit/MMM-VigilanceMeteoFrance
### Windy weather map
#git clone https://github.com/TheStigh/MMM-WindyV2

## Entertainment / Misc
##
### O-clock inspired by PolarClock Screensaver
#git clone https://github.com/eouia/MMM-OClock
### Saint of the day
git clone https://github.com/bugsounet/MMM-Saint
### Spotify controller
git clone https://github.com/skuethe/MMM-Spotify
### Information about the rising and setting of the sun
#git clone https://github.com/mykle1/MMM-SunRiseSet
# Displays all of the planets and their current relation to the Sun
#git clone https://github.com/hoyski/MM-orrery

## Transport / Travel
##
### Nantes Bus Traffic Timetable, from given stops, given bus / tramway & navibus number, and direction
git clone https://github.com/normyx/MMM-Nantes-TAN
# Gas Station Price
git clone https://github.com/fewieden/MMM-Fuel
### Map with traffic and incidents information from TomTom
#git clone https://github.com/Travelbacon/MMM-TomTomTrafficIncidents
### Travel time between two locations
git clone https://github.com/samlewis0602/MMM-Traffic

## Utility / IOT / 3rd Party / Integration
##
### CalDav broker
git clone https://github.com/MMRIZE/MMM-CalDAV
### Module to add the birthday of contacts to the default calendar module
git clone https://github.com/n-gao/MMM-vCard2Calendar
### Alternative calendar module
#git clone https://github.com/MMM-CalendarExt2/MMM-CalendarExt2
### Extension for MMM-CalendarExt2: Display a timeline
#git clone https://github.com/MMM-CalendarExt2/MMM-CalendarExtTimeline
### Displaying data from FreeBox v6 server (Revolution)
git clone https://github.com/tataille/MMM-FreeBox-Monitor
### Displaying any JEEDOM command value
#git clone https://github.com/prysme01/MMM-Jeedom
### Managing capacitive touchs with MPR121
git clone https://github.com/PatriceG/MMM-MPR121
### Displaying data from Pronote
#git clone https://github.com/bugsounet/MMM-Pronote
### Displaying Trello cards
git clone https://github.com/Jopyth/MMM-Trello

## Personal modules
##
### Retrievieng and displaying data of BME680 sensor
git clone https://github.com/seb-ma/MMM-Bosch-BME680-sensor
### Displaying on Waveshare eink with IT8951
git clone https://github.com/seb-ma/MMM-IT8951
### Executing custom actions on broadcast notifications
git clone https://github.com/seb-ma/MMM-NotifCustomActions
### Weather charts
git clone https://github.com/mtatsuma/MMM-WeatherChartD3

## Default installed modules (some of them)
##
### Displays events from public .ical calendars
# https://docs.magicmirror.builders/modules/calendar.html
### Displays the current date and time
# https://docs.magicmirror.builders/modules/clock.html
### Display a message whenever a new version of MagicMirror is available
# https://docs.magicmirror.builders/modules/updatenotification.html
### Displays a current weather view or the forecast
# https://docs.magicmirror.builders/modules/weather.html

##
# Dependencies installation for each module
# (given each module is from a git repository)
##
find . -name .git -print -execdir npm install --only=production \;
# Specific case for i2c-bus dependency in MMM-MPR121
cd MMM-MPR121/; npm install; npm rebuild i2c-bus --update-binary; cd -


popd

# Copy config file and css
cp config.js /opt/local/MagicMirror/config/config.js
cp custom.css /opt/local/MagicMirror/css/custom.css
