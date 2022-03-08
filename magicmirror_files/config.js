 /* Magic Mirror Config
 *
 * By Sébastien Mazzon
 * MIT License
 */

const configPrivateParts = {
	"decimalSymbol": ",",
	"animationSpeed": 0,

	"mock": false,

	"home": {"lat": 0.000000, "lon": 0.000000},
	"work": {"lat": 0.000000, "lon": 0.000000},

	"apikey_openweather": "xxx",
	"apikey_tomtom": "xxx",
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
		{"arret": "xxxx", "ligne": "xx", "sens": "x", "symbol": "bus"},
		{"arret": "xxxx", "ligne": "xx", "sens": "x", "symbol": "bus"},
		{"arret": "xxxx", "ligne": "xx", "sens": "x", "symbol": "bus"}
	]
}

let config = {
	serverOnly: true,	// true/false/"local"
						// local for armv6l processors, default - starts serveronly and then starts chrome browser
						// false, default for all NON-armv6l devices
						// true, force serveronly mode, because you want to.. no UI on this device
	address: "localhost", 	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/", 	// The URL path where MagicMirror is hosted. If you are using a Reverse proxy
					// you must set the sub path here. basePath must end with a /
	useHttps: false, 		// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "", 	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "", 	// HTTPS Certificate path, only require when useHttps is true
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1",
				  "::ffff:192.168.1.1/120", "192.168.1.1/24",
				  "::ffff:192.168.2.1/120", "192.168.2.1/24"], 	// Set [] to allow all IP addresses
															// or add a specific IPv4 of 192.168.1.5 :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
															// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],
	electronOptions: { fullscreen: true, width: 1872, height: 1404 },

	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging

	language: "fr",
	locale: "fr-FR",
	timeFormat: 24,
	units: "metric",

	modules: [
		{
			module: "MMM-IT8951", // https://github.com/seb-ma/MMM-IT8951
			config: {
				driverParam: {VCOM: 1480},
				mock: configPrivateParts.mock,
			}
		},
		{
			module: "MMM-NotifCustomActions", // https://github.com/seb-ma/MMM-NotifCustomActions
			config: {
				actions: [
					{notification: "ACTION_SHUTDOWN", action_node: function(sender, payload) {exec("sudo shutdown -h now");}},

					{notification: "SPOTIFY_CONNECTED",    action_module: function(sender, payload) {self.sendNotification("PAGE_SELECT", "musicPage");}},
					{notification: "SPOTIFY_DISCONNECTED", action_module: function(sender, payload) {self.sendNotification("PAGE_SELECT", "mainPage");}},

					{notification: "PAGE_CHANGED",         action_module: function(sender, payload) {self.sendNotification("IT8951_ASK_FULL_REFRESH");}},
				]
			}
		},
		{
			module: 'MMM-MPR121', // https://github.com/PatriceG/MMM-MPR121
			config: {
				buttons: [
					{
						pin: 0,
						name: "power",
						longPress: {
							title: "Extinction",
							message: "Garder appuyé 3 secondes pour éteindre",
							imageFA: "power-off",
							notification: "ACTION_SHUTDOWN", // MMM-NotifCustomActions
						},
						shortPress: {notification: "IT8951_ASK_FULL_REFRESH", payload: {}},
					},
					{
						pin: 1,
						name: "page_previous",
						shortPress: {notification: "DECREMENT_PAGE", payload: {}},
					},
					{
						pin: 2,
						name: "page_next",
						shortPress: {notification: "INCREMENT_PAGE", payload: {}},
					},
					{
						pin: 3,
						name: "spotify_toggle",
						shortPress: {notification: "SPOTIFY_TOGGLE", payload: {}}, // Play/pause
					},
					{
						pin: 4,
						name: "spotify_next_previous",
						shortPress: {notification: "SPOTIFY_NEXT", payload: {}},
						longPress: {
							title: "Piste prédédente",
							message: "Garder appuyé 3 secondes pour revenir à la piste précédente",
							imageFA: "backward-step",
							notification: "SPOTIFY_PREVIOUS",
						},
					},
					{
						pin: 5,
						name: "spotify_volume_up",
						shortPress: {notification: "SPOTIFY_VOLUME_UP", payload: {}},
					},
					{
						pin: 6,
						name: "spotify_volume_down",
						shortPress: {notification: "SPOTIFY_VOLUME_DOWN", payload: {}}
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
			pages: {mainPage: "top_bar", musicPage: "top_bar"}, // Config for MMM-Page-Selector
		},
		{
			module: "clock", // https://docs.magicmirror.builders/modules/clock.html
			position: "top_left",
			pages: {mainPage: "top_left", musicPage: "top_left"}, // Config for MMM-Page-Selector
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
			module: 'MMM-Saint', // https://github.com/bugsounet/MMM-Saint#readme
			position: "top_left",
			pages: {mainPage: "top_left", musicPage: "top_left"}, // Config for MMM-Page-Selector
			configDeepMerge: true,
			config: {
				debug: false,
				update: 60 * 60 * 1000, // 1 heure
			}
		},
		{
			module: "MMM-CalDAV", // https://github.com/MMRIZE/MMM-CalDAV#readme
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
			module: 'MMM-vCard2Calendar', // https://github.com/n-gao/MMM-vCard2Calendar#readme
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
			header: "Prochains événements",
			position: "top_center",
			pages: {mainPage: "top_center", taskPage: "top_right"}, // Config for MMM-Page-Selector
			config: {
				maximumEntries: 15,
				fetchInterval: 15 * 60 * 1000, // 15 minutes
				animationSpeed: configPrivateParts.animationSpeed,
					calendars: [
					{
						symbol: "house-user",
						displaySymbol: true,
						url: "http://localhost:8080/CALDAV/familial.ics", // fourni par MMM-CalDAV
					},
					{
						symbol: "island-tropical",
						displaySymbol: true,
						url: "https://cache.media.education.gouv.fr/ics/Calendrier_Scolaire_Zone_B.ics",
					},
					{
						symbol: 'birthday-cake',
						url: 'http://localhost:8080/MMM-vCard2Calendar', // This url is fixed
					},
				]
			}
		},
		/*{
			module: 'MMM-FreeBox-Monitor', // https://github.com/tataille/MMM-FreeBox-Monitor#readme
			position: 'top_center',
			pages: {mainPage: "top_center", musicPage: "top_center"}, // Config for MMM-Page-Selector
			config: {
				mirrorName: "CadreEink",
				ip: "http://192.168.0.254",
				displaySystemData: false,
				displayDownloads: false,
				requestRefresh: 300, // en secondes - entre 30 et 300
			}
		},*/
		{
			module: "MMM-Spotify", // https://github.com/skuethe/MMM-Spotify#readme
			position: "top_center",
			pages: {musicPage: "top_center"}, // Config for MMM-Page-Selector
			hiddenOnStartup: true,
			config: {
				deviceDisplay: "en écoute sur",
				debug: false, // debug mode
				style: "default", // "default" or "mini" available (inactive for miniBar)
				moduleWidth: 520, // width of the module in px
				control: "hidden", // "default" or "hidden"
				showAlbumLabel: true, // if you want to show the label for the current song album
				showVolumeLabel: true, // if you want to show the label for the current volume
				showAccountName: true, // also show the current account name in the device label; usefull for multi account setup
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
			module: "MMM-VigilanceMeteoFrance", // https://github.com/grenagit/MMM-VigilanceMeteoFrance
			position: "top_right",
			pages: {mainPage: "top_right", musicPage: "top_right"}, // Config for MMM-Page-Selector
			config: {
				department: configPrivateParts.department, // Department number
				updateInterval: 10 * 60 * 1000, // 10 minutes
				animationSpeed: configPrivateParts.animationSpeed,
				notificationDuration: 60 * 1000, // 1 minute
				showDescription: true,
				showRiskLegend: false,
				hideGreenLevel: true,
				useColorLegend: false,
			}
		},
		{
			module: "MMM-Pollen-FR", // https://github.com/lekesako/MMM-Pollen-FR#readme
			position: "top_right",
			pages: {mainPage: "top_right", musicPage: "top_right"}, // Config for MMM-Page-Selector
			header: "Alertes pollens",
			config: {
				updateInterval: 2 * 60 * 60 * 1000, // every 2 hours
				fadeSpeed: 0,
				region_code: configPrivateParts.department,
				minLevel: 1,
			}
		},
		{
			module: 'MMM-Nantes-TAN', // https://github.com/normyx/MMM-Nantes-TAN#readme
			position: 'top_right',
			pages: {mainPage: "top_right", musicPage: "top_right"}, // Config for MMM-Page-Selector
			header: 'TAN',
			config: {
				showSecondsToNextUpdate: false,
				busStations: configPrivateParts.tan_busStations, // see http://open.tan.fr/ewp/arrets.json for ids
			}
		},
		{
			module: "MMM-Traffic", // https://github.com/samlewis0602/MMM-Traffic#readme
			position: "top_right",
			pages: {mainPage: "top_right", musicPage: "top_right"}, // Config for MMM-Page-Selector
			header: "Trajet voiture",
			interval: 5 * 60 * 1000, // 5 minutes
			config: {
				provider: "tomtom",
				accessToken: configPrivateParts.apikey_tomtom,
				originCoords: `${configPrivateParts.home.lat},${configPrivateParts.home.lon}`,
				destinationCoords: `${configPrivateParts.work.lat},${configPrivateParts.work.lon}`,
				firstLine: "CGI {duration} mins – Impact trafic : {trafficDelay} min",
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
			pages: {mainPage: "bottom_left", musicPage: "bottom_left"}, // Config for MMM-Page-Selector
			config: {
				updateInterval: 1 * 60 * 1000, // full refresh screen delay // 1 minute
				animationSpeed: configPrivateParts.animationSpeed,
				decimalSymbol: configPrivateParts.decimalSymbol,
				mock: configPrivateParts.mock,
				offsetTemperature: 0,
			}
		},
		{
			module: "weather", // https://docs.magicmirror.builders/modules/weather.html
			position: "bottom_left",
			pages: {mainPage: "bottom_left", musicPage: "bottom_left"}, // Config for MMM-Page-Selector
			header: "Extérieur",
			config: {
				updateInterval: 2 * 60 * 1000, // 2  minutes
				animationSpeed: configPrivateParts.animationSpeed,
				decimalSymbol: configPrivateParts.decimalSymbol,
				appendLocationNameToHeader: false,
				//showIndoorTemperature: true,
				//showIndoorHumidity: true,

				type: "current",
				useBeaufort: false,
				useKmh: true,
				showHumidity: true,
				showSun: false,
				weatherProvider: "openweathermap",
				weatherEndpoint: "/onecall",
				lat: configPrivateParts.home.lat,
				lon: configPrivateParts.home.lon,
				apiKey: configPrivateParts.apikey_openweather,
			}
		},
		{
			module: "MMM-WeatherChartD3", // https://github.com/seb-ma/MMM-WeatherChartD3
			position: "bottom_right",
			pages: {mainPage: "bottom_right", musicPage: "bottom_right"}, // Config for MMM-Page-Selector
			header: "Prévisions météo",
			config: {
				updateInterval: 10 * 60 * 1000, // valeur par défaut : 10 minutes
				animationSpeed: configPrivateParts.animationSpeed,
				apiKey: configPrivateParts.apikey_openweather,
				type: "full",
				height: 350,
				width: 1300,
				iconSize: 48, // in px or undefined to define automatically at first call
				hoursRatio: 0.5,
				lat: configPrivateParts.home.lat,
				lon: configPrivateParts.home.lon,
				color: "#000",
				fillColor: "#ccc",
			}
		},
		{
			module: "MMM-WeatherChartD3", // https://github.com/seb-ma/MMM-WeatherChartD3
			position: "middle_center",
			hiddenOnStartup: true,
			pages: {weatherPage: "middle_center"}, // Config for MMM-Page-Selector
			header: "Prévisions météo",
			config: {
				updateInterval: 10 * 60 * 1000, // valeur par défaut : 10 minutes
				animationSpeed: configPrivateParts.animationSpeed,
				apiKey: configPrivateParts.apikey_openweather,
				type: "full",
				height: 1000,
				width: 1700,
				lat: configPrivateParts.home.lat,
				lon: configPrivateParts.home.lon,
				color: "#000",
				fillColor: "#ccc",
			}
		},
		{
			module: "newsfeed", // https://docs.magicmirror.builders/modules/newsfeed.html
			position: "bottom_bar",
			pages: {mainPage: "bottom_bar", musicPage: "bottom_bar"}, // Config for MMM-Page-Selector
			config: {
				updateInterval: 10 * 1000, // 10 secondes
				reloadInterval: 5 * 60 * 1000, // 5 minutes
				animationSpeed: configPrivateParts.animationSpeed,
				ignoreOldItems: true,
				ignoreOlderThan: 24 * 60 * 60 * 1000, // 1 jour
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
			module: 'MMM-Trello', // https://github.com/Jopyth/MMM-Trello#readme
			position: 'middle_center',
			hiddenOnStartup: true,
			pages: {taskPage: "top_left"}, // Config for MMM-Page-Selector
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
if (typeof module !== "undefined") {module.exports = config;}
