const Log = require("logger");
const exec = require("child_process").exec;

const user = {
    scheduleWatchdog: function () {
        if (this.timerWatchdog) {
            clearTimeout(this.timerWatchdog);
        }
        this.timerWatchdog = setTimeout(() => {
            Log.error("No heartbeat - Restarting MagicMirror service");
            exec('sudo systemctl restart magicmirror.service');
        }, 2 * 60 * 1000); // Watchdog of 2 minutes
    }
};

module.exports = user;
