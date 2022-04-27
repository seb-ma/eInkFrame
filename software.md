# Software part

This project works thanks to [MagicMirror²](https://magicmirror.builders/) *("The open source modular smart mirror platform”)* running on [Raspberry Pi OS](https://www.raspberrypi.com/software/).

![homescreen](images/d-screen-home.png)

![screen music](images/d-screen-music.png)

This document is a guide (step-by-step) to install and configure all software, dependencies and modules from scratch.

## Disclaimer

This guide works but only with the `root` user.

This is due to a problem accessing `/dev/mem` (witch is needed for e-ink).
It currently can't be accessed thru npm call at this stage, neither as `sudo npm` nor with sticky bit or `cap_sys_rawio` capability set.

It works only with user `root` (`sudo su`).

Thus, all parts about `serverusr` must be replaced by `root`.

## Raspberry Pi OS

This section deals with the installation and configuration of the operating system.

### Preparing the SD card

Create the SD card with Raspberry Pi Imager: [Raspberry Pi OS - Raspberry Pi](https://www.raspberrypi.com/software/)
May be installed from linux distribution of manually.

⚠️ This project requires a `desktop` version and not `lite`.

⚠️ Because of a dependency on a module that does not seem to compile on a 32-bit version (i2c_bus for adafruit-mpr121), it is necessary to use a 64-bit version:
[https://downloads.raspberrypi.org/raspios_full_arm64/images/](https://downloads.raspberrypi.org/raspios_full_arm64/images/)

### SSH activation

Create a file named `ssh` in the `boot` partition of the card (no extension, no content).

### WIFI activation and configuration

Create a file named `wpa_supplicant.conf` in the `boot` partition of the card.
The file should contain the following data (change SSID and password):

```properties
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=FR

network={
  ssid="SSID"
  psk="password"
  key_mgmt=WPA-PSK
}
```

### Security

<aside>
ℹ️ By default, the user is `pi` and the password is `raspberry`.
</aside>

```sh
# Change the password
passwd
```

### Raspberry configuration

```sh
sudo raspi-config
```

- Disabling the graphical interface
  - System Options
  - Boot / Auto login
  - Console
- Change timezone
  - Location Options
  - Change Timezone
- Change keyboard layout
  - Location Options
  - Change Keyboard Layout
- Enable SPI
  - Interfacing options
  - P4 SPI Enable / Disable automatic loading of SPI core module
- Enable i²c
  - Interfacing options
  - P5 I2C Enable / Disable automatic loading of the I2C kernel module

### Creation and privileges of a specific user

To run MagicMirror², a specific user `serverusr` is created.

```sh
# Creation of the user running the MagicMirror service
sudo adduser serverusr
# Add user to the groups allowing access to the i2c and spi
sudo adduser serverusr i2c
sudo adduser serverusr spi
sudo adduser serverusr kmem
```

Add `serverusr` user to sudoers for `shutdown` command.
Edit sudoers file:

```sh
sudo visudo
```

Add line:

```sh
serverusr ALL=NOPASSWD: /sbin/shutdown
```

### GPIO access

Configure GPIO access (from https://github.com/jperkin/node-rpio):

Disable GPIO interrupts:

Edit `/boot/config.txt`:

```sh
sudo nano /boot/config.txt
```

Add following line:

```properties
dtoverlay=gpio-no-irq
```

Enable `/dev/gpiomem` access:

Create `/etc/udev/rules.d/20-gpiomem.rules`:
```sh
sudo nano /etc/udev/rules.d/20-gpiomem.rules
```

Add following line:

```properties
SUBSYSTEM=="bcm2835-gpiomem", KERNEL=="gpiomem", GROUP="gpio", MODE="0660"
```

### Installation of the necessary packages

```sh
# Installation of auto updates
sudo apt install -y unattended-upgrades
# Installation of MagicMirror dependencies
sudo apt install -y npm nodejs
# Installation of tools (probably already present by default)
sudo apt install -y git make gcc-c++
```

### Installation of more up-to-date nodejs package

Installation of a required nodejs version using project https://github.com/nodesource/distributions.

```sh
# Execute script used to add repository
curl -fsSL https://deb.nodesource.com/setup_17.x | sudo -E bash -
sudo apt-get install -y nodejs
# To compile and install native addons from npm you may also need to install build tools
apt-get install -y build-essential
```

### Automatic updates

### System update

Configure automatic updates for the distribution:

Run the following commands to create the automatic updates configuration files:

```sh
echo 'APT::Periodic::Enable "1";
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";'
| sudo tee /etc/apt/apt.conf.d/20auto-upgrades


```sh
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

Uncomment / Edit following lines:

```js
Unattended-Upgrade::Origins-Pattern {
        "origin=Debian,codename=${distro_codename}-updates";
//      "origin=Debian,codename=${distro_codename}-proposed-updates";
        "origin=Debian,codename=${distro_codename},label=Debian";
        "origin=Debian,codename=${distro_codename},label=Debian-Security";
        "origin=Debian,codename=${distro_codename}-security,label=Debian-Security";
};

Unattended-Upgrade::Automatic-Reboot True;
Unattended-Upgrade::Automatic-Reboot-Time "03:00";'
```

### Increasing the swap

The Raspberry pi zero 2 W has few RAM.

In order to be able to compile some modules, it is necessary to have a larger swap than the default (100mb)

```sh
sudo nano /etc/dphys-swapfile

# change the line to "CONF_SWAPSIZE=1024

sudo dpkg-reconfigure dphys-swapfile
```

### Limiting writes to the SD card

To increase the life of the SD card, it is possible to mount the `tmp` partition and logs directory in RAM (or disable logs).

### Change `/tmp` to `tmpfs`.

Run the command :

```sh
sudo cp -v /usr/share/systemd/tmp.mount /etc/systemd/system/
sudo systemctl enable tmp.mount
```

### Change `/var/log` to `tmpfs`.

Edit the `/etc/fstab` file:

```sh
sudo nano /etc/fstab
```

Add the following lines (if they have no entries) to the `/etc/fstab` file:

```sh
tmpfs /tmp tmpfs defaults,noatime,nosuid,nodev,size=100M 0 0
tmpfs /var/tmp tmpfs defaults,noatime,nosuid,nodev,noexec,size=10M 0 0
tmpfs /var/log tmpfs defaults,noatime,nosuid,nodev,noexec,mode=0755,size=10M 0 0
```

### Limit log files size

To limit size of logs to `1M`, edit the `/etc/rsyslog.conf` file:

```sh
sudo nano /etc/rsyslog.conf
```

Replace the following lines:

```sh
*.*;auth,authpriv.none         -/var/log/syslog
daemon.*                       -/var/log/daemon.log
```

by:

```sh
$outchannel mysyslog,/var/log/syslog,1048576
$outchannel mydaemon,/var/log/daemon.log,1048576
*.*;auth,authpriv.none          :omfile:$mysyslog
daemon.*                        :omfile:$daemonlog
```

### Set hostname

Change hostname to `einkframe`

```sh
sudo echo "einkframe" > /etc/hostname
```

### Reboot the OS

When configuration is done, run the following command to reboot:

```sh
sudo reboot
```

### Add SSH public key

To configure SSH for login without password, execute from computer:

```sh
ssh-copy-id -i ~/.ssh/<filename.pub> pi@einkframe.local
```

## MagicMirror²

This section deals with the installation and configuration of the application and data display modules.

See [MagicMirror²](https://magicmirror.builders/) for details.

### Installation

See [Installation & Usage | MagicMirror² Documentation](https://docs.magicmirror.builders/getting-started/installation.html#manual-installation) for details.

Run the script [installMM.sh](magicmirror_files/installMM.sh) commands to retrieve and install MagicMirror² and all necessary modules for this project:
Then, apply patch [applyPatches.sh](magicmirror_files/applyPatches.sh) to adapt some modules that need it.

```sh
cd ~
git clone https://github.com/seb-ma/eInkFrame
eInkFrame/magicmirror_files/installMM.sh
```

<aside>
ℹ️ List (not exhaustive) of existing modules: [3rd Party Modules - MichMich/MagicMirror Wiki](https://github.com/MichMich/MagicMirror/wiki/3rd-party-modules#development--core-magicmirror)
</aside>

### Setting up the modules

<aside>
ℹ️ General configuration information: [Configuration Module | MagicMirror² Documentation](https://docs.magicmirror.builders/modules/configuration.html)
</aside>

The configuration is split in 2 parts:

- one for near all of the configuration including modules (variable `config`)
- one specific for all private data (location, api keys, passwords) (variable `configPrivateParts`)

Edit the configuration file in `~/MagicMirror/config/` and fill variable `configPrivateParts` (+ adapt configuration of each module if necessary).


To adapt modules position, see visual representation of module positions in a [thread of MagicMirror² forum: module positions](https://forum.magicmirror.builders/topic/286/regions).

[https://docs.magicmirror.builders/configuration/introduction.html](https://docs.magicmirror.builders/configuration/introduction.html)

```sh
nano ~/MagicMirror/config/config.js
```

And fill needed data.
Some modules need a specific initialization in order to work.
Follow each procedure:

- MMM-FreeBox-Monitor: [https://github.com/tataille/MMM-FreeBox-Monitor#readme](https://github.com/tataille/MMM-FreeBox-Monitor#readme)
- MMM-Spotify: [https://github.com/skuethe/MMM-Spotify#install](https://github.com/skuethe/MMM-Spotify#install)
- MMM-Trello: [https://github.com/Jopyth/MMM-Trello#readme](https://github.com/Jopyth/MMM-Trello#readme)

### Modify display styles

Custom CSS is copied by install script into `~/MagicMirror/css/custom.css`.

### Manual execution

To run MagicMirror² run the following command in `~/MagicMirror` directory:

```sh
npm run server
```

### Automatic execution

Create a service to automatically start the server:

```sh
sudo nano /etc/systemd/system/magicmirror.service
```

Put the following content in the file:

```properties
[Unit]
Description=MagicMirror²
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
User=serverusr
WorkingDirectory=/home/serverusr/MagicMirror/
ExecStart=node serveronly

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```sh
# Starting the service
sudo systemctl start magicmirror.service
systemctl status magicmirror.service
# Enabling the service
sudo systemctl enable magicmirror.service
```

### Upgrade (including modules)

To update MagicMirror² and all installed modules, run the commands in the script [updateMM.sh](magicmirror_files/updateMM.sh)

```sh
updateMM.sh
```

### Access to the screen from a browser

Within the same network, open http://einkframe.local:8080/ in a browser. 

## Manual update

Run the following commands:

```sh
# Distribution
sudo apt update
sudo apt full-upgrade -y
sudo apt clean
```
