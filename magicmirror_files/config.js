/* Magic Mirror Config
 *
 * By Sébastien Mazzon
 * MIT License
 */

const configPrivateParts = {
	"decimalSymbol": ",",
	"animationSpeed": 0,

	"mock": false,
	"it8951_vcom": "1480",

	"buttons_order": [3, 4, 5, 0, 1, 2, 9, 10, 11, 6, 7, 8],

	"home": { "lat": 0.000000, "lon": 0.000000 },
	"work": { "lat": 0.000000, "lon": 0.000000 },

	"apikey_openweather": "xxx",
	"apikey_tomtom": "xxx",
	"apikey_meteofrance": {
		"key": "xxx",
		"secret": "xxx"
	},
	"vCard": {
		"url": "https://xxx",
		"username": "xxx",
		"password": "xxx"
	},
	"trello": {
		"api_key": "xxx",
		"token": "xxx",
		"list": "xxx"
	},
	"caldav_config": {
		"serverUrl": "xxx",
		"username": "xxx",
		"password": "xxx"
	},
	"department": "00",
	"tan_busStations": [
		{ "arret": "xxxx", "ligne": "xx", "sens": "x", "symbol": "bus" },
		{ "arret": "xxxx", "ligne": "xx", "sens": "x", "symbol": "bus" },
		{ "arret": "xxxx", "ligne": "xx", "sens": "x", "symbol": "bus" }
	],
	"trafficLine": "Dest_xxx {duration} mins – Impact trafic : {trafficDelay} min"
};

let config = {
	serverOnly: true,		// true/false/"local"
							// local for armv6l processors, default - starts serveronly and then starts chrome browser
							// false, default for all NON-armv6l devices
							// true, force serveronly mode, because you want to.. no UI on this device
	address: "localhost", 	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/", 			// The URL path where MagicMirror is hosted. If you are using a Reverse proxy
							// you must set the sub path here. basePath must end with a /
	useHttps: false, 		// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "", 	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "", 	// HTTPS Certificate path, only require when useHttps is true
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1",
				  "::ffff:192.168.1.1/120", "192.168.1.1/24",
				  "::ffff:192.168.2.1/120", "192.168.2.1/24"], 	// Set [] to allow all IP addresses
																// or add a specific IPv4 of 192.168.1.5 : ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
																// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format : ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],
	electronOptions: { fullscreen: true, width: 1872, height: 1404 },

	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging

	language: "fr",
	locale: "fr-FR",
	timeFormat: 24,
	units: "metric",

	modules: [
		{
			module: "MMM-IT8951", // https://github.com/seb-ma/MMM-IT8951
			hiddenOnStartup: true,
			config: {
				defaultTo4levels: true,
				driverParam: { VCOM: configPrivateParts.it8951_vcom },
				mock: configPrivateParts.mock,
			}
		},
		{
			module: "MMM-NotifCustomActions", // https://github.com/seb-ma/MMM-NotifCustomActions
			hiddenOnStartup: true,
			config: {
				actions: [
					{ notification: "DOM_OBJECTS_CREATED", action_client: function (self, sender, payload) { setInterval(() => { self.sendNotification("IT8951_ASK_FULL_REFRESH"); }, 10 * 60 * 1000); } },

					{ notification: "ACTION_SHUTDOWN", action_node: function (self, sender, payload) { exec("sudo shutdown -h now"); } },

					{ notification: "SPOTIFY_CONNECTED", action_client: function (self, sender, payload) { self.isSpotify = true; self.sendNotification("PAGE_SELECT", "musicPage"); } },
					{ notification: "SPOTIFY_DISCONNECTED", action_client: function (self, sender, payload) { self.isSpotify = false; self.sendNotification("PAGE_SELECT", "mainPage"); } },

					{ notification: "PAGE_CHANGED", action_client: function (self, sender, payload) { setTimeout(() => { self.sendNotification("IT8951_ASK_FULL_REFRESH"); }, 1000); } },
					{ notification: "MAIN_PAGE_SELECT", action_client: function (self, sender, payload) { self.sendNotification("PAGE_SELECT", self.isSpotify ? "musicPage" : "mainPage"); } },
				]
			}
		},
		{
			module: "MMM-MPR121", // https://github.com/PatriceG/MMM-MPR121
			hiddenOnStartup: true,
			config: {
				buttons: [
					// Left buttons
					{
						pin: configPrivateParts.buttons_order[0],
						name: "refresh_screen",
						shortPress: { notification: "IT8951_ASK_FULL_REFRESH" }, // MMM-IT8551
					},
					{ pin: configPrivateParts.buttons_order[1], name: "unused", shortPress: { notification: "unused", payload: {} } },
					{ pin: configPrivateParts.buttons_order[2], name: "unused", shortPress: { notification: "unused", payload: {} } },
					// Up buttons
					{
						pin: configPrivateParts.buttons_order[3],
						name: "page_main",
						shortPress: { notification: "MAIN_PAGE_SELECT" }, // MMM-Page-Selector
					},
					{
						pin: configPrivateParts.buttons_order[4],
						name: "page_task",
						shortPress: { notification: "PAGE_SELECT", payload: "taskPage" }, // MMM-Page-Selector
					},
					{
						pin: configPrivateParts.buttons_order[5],
						name: "page_weather",
						shortPress: { notification: "PAGE_SELECT", payload: "weatherPage" }, // MMM-Page-Selector
					},
					{
						pin: configPrivateParts.buttons_order[6],
						name: "spotify_toggle",
						shortPress: { notification: "SPOTIFY_TOGGLE" }, // MMM-Spotify (Play/pause)
					},
					{
						pin: configPrivateParts.buttons_order[7],
						name: "spotify_next_previous",
						shortPress: { notification: "SPOTIFY_NEXT" }, // MMM-Spotify
						longPress: {
							title: "Piste précédente",
							message: "Garder appuyé 3 secondes pour revenir à la piste précédente",
							imageFA: "backward-step",
							notification: "SPOTIFY_PREVIOUS", // MMM-Spotify
						},
					},
					{ pin: configPrivateParts.buttons_order[8], name: "unused", shortPress: { notification: "unused", payload: {} } },
					// Right buttons
					{
						pin: configPrivateParts.buttons_order[9],
						name: "spotify_volume_up",
						shortPress: { notification: "SPOTIFY_VOLUME_UP" }, // MMM-Spotify
					},
					{
						pin: configPrivateParts.buttons_order[10],
						name: "spotify_volume_down",
						shortPress: { notification: "SPOTIFY_VOLUME_DOWN" } // MMM-Spotify
					},
					{
						pin: configPrivateParts.buttons_order[11],
						name: "power",
						longPress: {
							title: "Extinction",
							message: "Garder appuyé 3 secondes pour éteindre",
							imageFA: "power-off",
							notification: "ACTION_SHUTDOWN", // MMM-NotifCustomActions
						},
					},
				]
			}
		},
		{
			module: "MMM-Page-Selector", // https://github.com/Veldrovive/MMM-Page-Selector
			position: "top_bar",
			hiddenOnStartup: true,
			config: {
				defaultPage: "mainPage",
				displayTitle: false,
			}
		},
		{
			module: "alert",
		},
		{
			module: "updatenotification", // https://docs.magicmirror.builders/modules/updatenotification.html
			position: "top_bar",
			pages: { mainPage: "top_bar", musicPage: "top_bar" }, // Config for MMM-Page-Selector
		},
		{
			module: "clock", // https://docs.magicmirror.builders/modules/clock.html
			position: "top_left",
			pages: { mainPage: "top_left", musicPage: "top_left" }, // Config for MMM-Page-Selector
			config: {
				displaySeconds: false,
				showWeek: false,
				showSunTimes: true,
				showMoonTimes: true,
				lat: configPrivateParts.home.lat,
				lon: configPrivateParts.home.lon,
			}
		},
		{
			module: "MMM-Saint", // https://github.com/bugsounet/MMM-Saint#readme
			position: "top_left",
			pages: { mainPage: "top_left", musicPage: "top_left" }, // Config for MMM-Page-Selector
			configDeepMerge: true,
			config: {
				debug: false,
				update: 60 * 60 * 1000, // 1 hour
			}
		},
		{
			module: "MMM-VigilanceMeteoFrance", // https://github.com/grenagit/MMM-VigilanceMeteoFrance
			position: "top_left",
			pages: { mainPage: "top_left", musicPage: "top_left" }, // Config for MMM-Page-Selector
			config: {
				apiConsumerKey: configPrivateParts.apikey_meteofrance.key,
				apiConsumerSecret: configPrivateParts.apikey_meteofrance.secret,
				department: configPrivateParts.department, // Department number
				updateInterval: 10 * 60 * 1000, // 10 minutes
				animationSpeed: configPrivateParts.animationSpeed,
				showNotification: false,
				showDescription: false, // No more description provided since v2.0
				showRiskLegend: false,
				hideGreenLevel: true,
				useColorLegend: false,
			}
		},
		{
			module: "MMM-CalDAV", // https://github.com/MMRIZE/MMM-CalDAV#readme
			hiddenOnStartup: true,
			config: {
				name: "familial",
				serverUrl: configPrivateParts.caldav_config.serverUrl,
				credentials: {
					username: configPrivateParts.caldav_config.username,
					password: configPrivateParts.caldav_config.password,
				},
				calendarFilter: ["Familial"],
				updateInterval: 10 * 60 * 1000, // 10 minutes
				vcalendarHeader: false,
			}
		},
		{
			module: "MMM-vCard2Calendar", // https://github.com/n-gao/MMM-vCard2Calendar#readme
			hiddenOnStartup: true,
			config: {
				url: configPrivateParts.vCard.url,
				auth: {
					user: configPrivateParts.vCard.username,
					password: configPrivateParts.vCard.password
				}
			}
		},
		{
			module: "calendar", // https://docs.magicmirror.builders/modules/calendar.html
			header: "Prochains évènements",
			position: "top_center",
			pages: { mainPage: "top_center", taskPage: "top_right" }, // Config for MMM-Page-Selector
			config: {
				maximumEntries: 15,
				fetchInterval: 15 * 60 * 1000, // 15 minutes
				fade: false,
				animationSpeed: configPrivateParts.animationSpeed,
				calendars: [
					{
						symbol: "house-user",
						displaySymbol: true,
						url: "http://localhost:8080/CALDAV/familial.ics", // fourni par MMM-CalDAV
					},
					{
						symbol: "umbrella-beach",
						displaySymbol: true,
						url: "https://cache.media.education.gouv.fr/ics/Calendrier_Scolaire_Zone_B.ics",
					},
					{
						symbol: "bell-slash",
						displaySymbol: true,
						url: "https://etalab.github.io/jours-feries-france-data/ics/jours_feries_metropole.ics",
					},
					{
						symbol: "birthday-cake",
						url: "http://localhost:8080/MMM-vCard2Calendar", // This url is fixed
					},
				]
			}
		},
		/*{
			module: "MMM-FreeBox-Monitor", // https://github.com/tataille/MMM-FreeBox-Monitor#readme
			position: "top_center",
			pages: {mainPage: "top_center", musicPage: "top_center"}, // Config for MMM-Page-Selector
			config: {
				mirrorName: "CadreEink",
				ip: "http://192.168.0.254",
				displaySystemData: false,
				displayDownloads: false,
				requestRefresh: 300, // secondes - [30 .. 300]
			}
		},*/
		{
			module: "MMM-Spotify", // https://github.com/skuethe/MMM-Spotify#readme
			classes: "no-eink-4levels", // For MMM-IT8951
			position: "top_center",
			pages: { musicPage: "top_center" }, // Config for MMM-Page-Selector
			hiddenOnStartup: true,
			config: {
				deviceDisplay: "en écoute sur",
				debug: false, // debug mode
				style: "default", // "default" or "mini" available (inactive for miniBar)
				moduleWidth: 520, // width of the module in px
				control: "hidden", // "default" or "hidden"
				showAlbumLabel: true, // if you want to show the label for the current song album
				showVolumeLabel: true, // if you want to show the label for the current volume
				showAccountName: true, // also show the current account name in the device label; useful for multi account setup
				showAccountButton: false, // if you want to show the "switch account" control button
				showDeviceButton: false, // if you want to show the "switch device" control button
				useExternalModal: false, // if you want to use MMM-Modal for account and device popup selection instead of the build-in one (which is restricted to the album image size)
				updateInterval: 1000, // update interval when playing
				idleInterval: 30000, // update interval on idle
				defaultAccount: 1, // default account number, attention : 0 is the first account
				defaultDevice: "Home mini", // optional - if you want the "SPOTIFY_PLAY" notification to also work from "idle" status, you have to define your default device here (by name)
				allowDevices: ["Home mini", "SHIELD Android TV"], //If you want to limit devices to display info, use this. f.e. allowDevices: ["RASPOTIFY", "My Home speaker"],
				onStart: null, // disable onStart feature with `null`
			}
		},
		{
			module: "MMM-Pollen-FR", // https://github.com/lekesako/MMM-Pollen-FR#readme
			position: "top_right",
			pages: { mainPage: "top_right", musicPage: "top_right" }, // Config for MMM-Page-Selector
			header: "Alertes pollens",
			config: {
				updateInterval: 2 * 60 * 60 * 1000, // every 2 hours
				fadeSpeed: 0,
				region_code: configPrivateParts.department,
				minLevel: 1,
			}
		},
		{
			module: "MMM-Nantes-TAN", // https://github.com/normyx/MMM-Nantes-TAN#readme
			position: "top_right",
			pages: { mainPage: "top_right", musicPage: "top_right" }, // Config for MMM-Page-Selector
			header: "TAN",
			config: {
				showSecondsToNextUpdate: false,
				busStations: configPrivateParts.tan_busStations, // see http://open.tan.fr/ewp/arrets.json for ids
			}
		},
		{
			module: "MMM-Traffic", // https://github.com/samlewis0602/MMM-Traffic#readme
			position: "top_right",
			pages: { mainPage: "top_right", musicPage: "top_right" }, // Config for MMM-Page-Selector
			header: "Trajet voiture",
			config: {
				interval: 5 * 60 * 1000, // 5 minutes
				provider: "tomtom",
				accessToken: configPrivateParts.apikey_tomtom,
				originCoords: `${configPrivateParts.home.lat},${configPrivateParts.home.lon}`,
				destinationCoords: `${configPrivateParts.work.lat},${configPrivateParts.work.lon}`,
				firstLine: configPrivateParts.trafficLine,
				//secondLine: "Trajet : {duration} mins",
				days: [1, 2, 3, 4, 5], // 0 = sunday
				hoursStart: "06:00",
				hoursEnd: "10:00",
			}
		},
		{
			module: "MMM-Bosch-BME680-sensor", // https://github.com/seb-ma/MMM-Bosch-BME680-sensor
			header: "Intérieur",
			position: "bottom_left", // Remove position to have only notifications
			pages: { mainPage: "bottom_left", musicPage: "bottom_left" }, // Config for MMM-Page-Selector
			config: {
				updateInterval: 30 * 1000, // 30 seconds
				animationSpeed: configPrivateParts.animationSpeed,
				decimalSymbol: configPrivateParts.decimalSymbol,
				mock: configPrivateParts.mock,
				i2cAddress: 0x77,
				offsetTemperature: 0.5,
				gasLimitLow: 15000, 
				gasLimitHigh: 150000,
			}
		},
		{
			module: "weather", // https://docs.magicmirror.builders/modules/weather.html
			position: "bottom_left",
			pages: { mainPage: "bottom_left", musicPage: "bottom_left" }, // Config for MMM-Page-Selector
			header: "Extérieur",
			config: {
				initialLoadDelay: 30 * 1000, // 30 seconds
				updateInterval: 1 * 60 * 1000, // 1 minute
				animationSpeed: configPrivateParts.animationSpeed,
				weatherProvider: "../../../mmm-weatherproviderunique/proxyweatherprovider",
				weatherEndpoint: "mmm-weatherproviderunique",
				decimalSymbol: configPrivateParts.decimalSymbol,
				appendLocationNameToHeader: false,
				showPrecipitationAmount: true,
				showUV: true,
				//showIndoorTemperature: true,
				//showIndoorHumidity: true,

				type: "current",
				windUnits: "kmh",
				showHumidity: true,
				showSun: false,
				showAQI: true,
			}
		},
		{
			// This module is not used to display the weather but only to have a unique call to weather provider for all the modules
			module: "mmm-weatherproviderunique", // https://github.com/seb-ma/mmm-weatherproviderunique
			hiddenOnStartup: true,
			config: {
				apiKey: configPrivateParts.apikey_openweather,
				lat: configPrivateParts.home.lat,
				lon: configPrivateParts.home.lon,
			}
		},
		{
			module: "MMM-WeatherChartD3", // https://github.com/seb-ma/MMM-WeatherChartD3
			position: "bottom_right",
			pages: { mainPage: "bottom_right", musicPage: "bottom_right" }, // Config for MMM-Page-Selector
			header: "Prévisions météo",
			config: {
				initialLoadDelay: 30 * 1000, // 30 seconds
				updateInterval: 5 * 60 * 1000, // 5 minutes
				animationSpeed: configPrivateParts.animationSpeed,
				weatherProvider: "../../../mmm-weatherproviderunique/proxyweatherprovider",
				weatherEndpoint: "mmm-weatherproviderunique",
				height: 400,
				width: 1300,
				hoursRatio: 0.5,
				showIcons: true,
				showNights: true,
				showTemperature: true,
				showMinMaxTemperature: false,
				showFeelsLikeTemp: true,
				showPrecipitationAmount: true,
				showPrecipitationProbability: false,
				showSnow: true,
				showPressure: false,
				showHumidity: false,
				showWind: false,
				showAQI: false,
				showUVI: false,
			}
		},
		{
			module: "MMM-WeatherChartD3", // https://github.com/seb-ma/MMM-WeatherChartD3
			position: "middle_center",
			hiddenOnStartup: true,
			pages: { weatherPage: "middle_center" }, // Config for MMM-Page-Selector
			header: "Prévisions météo",
			config: {
				initialLoadDelay: 30 * 1000, // 30 seconds
				updateInterval: 5 * 60 * 1000, // 5 minutes
				animationSpeed: configPrivateParts.animationSpeed,
				weatherProvider: "../../../mmm-weatherproviderunique/proxyweatherprovider",
				weatherEndpoint: "mmm-weatherproviderunique",
				height: 1300,
				width: 1800,
				showIcons: true,
				showNights: true,
				showTemperature: true,
				showMinMaxTemperature: false,
				showFeelsLikeTemp: true,
				showPrecipitationAmount: true,
				showPrecipitationProbability: true,
				showSnow: true,
				showPressure: true,
				showHumidity: true,
				showWind: true,
				showAQI: true,
				showUVI: true,
			}
		},
		{
			module: "newsfeed", // https://docs.magicmirror.builders/modules/newsfeed.html
			position: "bottom_bar",
			pages: { mainPage: "bottom_bar", musicPage: "bottom_bar" }, // Config for MMM-Page-Selector
			config: {
				updateInterval: 10 * 1000, // 10 secondes
				reloadInterval: 5 * 60 * 1000, // 5 minutes
				animationSpeed: configPrivateParts.animationSpeed,
				ignoreOldItems: true,
				ignoreOlderThan: 24 * 60 * 60 * 1000, // 1 day
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true,
				feeds: [
					{
						title: "Le Monde – À la une",
						url: "https://www.lemonde.fr/rss/une.xml"
					},
					{
						title: "France bleu – Loire Océan",
						url: "https://www.francebleu.fr/rss/loire-ocean/rubrique/infos.xml"
					},
				],
			}
		},
		{
			module: "MMM-Trello", // https://github.com/Jopyth/MMM-Trello#readme
			position: "middle_center",
			hiddenOnStartup: true,
			pages: { taskPage: "top_left" }, // Config for MMM-Page-Selector
			config: {
				reloadInterval: 5 * 60 * 1000, // 10 minutes
				animationSpeed: configPrivateParts.animationSpeed,
				api_key: configPrivateParts.trello.api_key,
				token: configPrivateParts.trello.token,
				list: configPrivateParts.trello.list,
				wholeList: true,
				hideCompletedItems: true,
			}
		},
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") { module.exports = config; }
