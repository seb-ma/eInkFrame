# Software part

This project works thanks to [MagicMirror²](https://magicmirror.builders/) *("The open source modular smart mirror platform”)* running on [Raspberry Pi OS](https://www.raspberrypi.com/software/).

This document is a guide (step-by-step) to install and configure all software, dependencies and modules from scratch.

## Raspberry Pi OS

This section deals with the installation and configuration of the operating system.

### Preparing the SD card

Create the SD card with Raspberry Pi Imager: [Raspberry Pi OS - Raspberry Pi](https://www.raspberrypi.com/software/)

<aside>
⚠️ This project requires a `desktop` version and not `lite`.

</aside>

<aside>
⚠️ Because of a dependency on a module that does not seem to compile on a 32-bit version (i2c_bus for adafruit-mpr121), it is necessary to use a 64-bit version:
[https://downloads.raspberrypi.org/raspios_full_arm64/images/](https://downloads.raspberrypi.org/raspios_full_arm64/images/)

</aside>

### SSH activation

Create a file named `ssh` in the `boot` partition of the card (no extension, no content).

### WIFI activation and configuration

Create a file named `wpa_supplicant.conf` in the `boot` partition of the card.
The file should contain the following data (change SSID and password):

```bash
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

```bash
# Change the password
passwd
```

### Raspberry configuration

```bash
# Change hostname to "frameEink
sudo echo "frameEink" > /etc/hostname
```

```bash
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
- Enable I2C
    - Interfacing options
    - P5 I2C Enable / Disable automatic loading of the I2C kernel module

### Creation and privileges of a specific user

To run MagicMirror², a specific user `serverusr` is created.

```bash
# Creation of the user running the MagicMirror service
sudo adduser serverusr
# Add user to the groups allowing access to the i2c and spi
sudo adduser serverusr i2c
sudo adduser serverusr spi
```

Add `serverusr` user to sudoers for `shutdown` command.
Edit sudoers file:

```bash
sudo visudo
```

Add line:

```bash
serverusr ALL=NOPASSWD: /sbin/shutdown
```

### Installation of the necessary packages

```bash
# Installation of VNC and auto updates
sudo apt install -y unattended-upgrades
# Installation of MagicMirror dependencies
sudo apt install -y npm nodejs
# Installation of tools (already present by default)
#sudo apt install -y git make
```

### Automatic updates

### System update

Configure automatic updates for the distribution:

Run the following commands to create the automatic updates configuration files:

```bash
sudo nano /etc/apt/apt.conf.d/20auto-upgrades

#sudo nano /etc/apt/apt.conf.d/20auto-upgrades
echo '
APT::Periodic::Enable "1";
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
| sudo tee /etc/apt/apt.conf.d/20auto-upgrades

#sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
echo 'Unattended-Upgrade::Origins-Pattern {
// Fix missing Raspbian sources.
        "origin=Debian,codename=${distro_codename},label=Debian";
        "origin=Debian,codename=${distro_codename},label=Debian-Security";
        "origin=Raspbian,codename=${distro_codename},label=Raspbian";
        "origin=Raspberry Pi Foundation,codename=${distro_codename},label=Raspberry Pi Foundation";
        "origin=Node Source,codename=${distro_codename},label=Node Source";
};
Unattended-Upgrade::Automatic-Reboot True;
Unattended-Upgrade::Automatic-Reboot-Time "03:00";
| sudo tee /etc/apt/apt.conf.d/51unattended-upgrades-raspbian
```

### Updating NPM packages

Add an update script for `npm` packages:

Run the following command to set up the update *(every Saturday at 2:00am)*:

```bash
#sudo nano /etc/crontab
sudo echo "0 2 * * 0 root npm update --save/--save-dev" >> /etc/crontab
```

<aside>
ℹ️ *Hint to read the setting of `cron`:* [Crontab.guru - The cron schedule expression editor](https://crontab.guru/)

</aside>

### Increasing the swap

The Raspberry pi zero 2 W has few RAM.

In order to be able to compile some modules, it is necessary to have a larger swap than the default (100mb)

```bash
sudo nano /etc/dphys-swapfile

# change the line to "CONF_SWAPSIZE=1024

sudo dpkg-reconfigure dphys-swapfi
```

### Limiting writes to the SD card

To increase the life of the SD card, it is possible to mount the `tmp` partition and logs directory in RAM (or disable logs).

### Change `/tmp` to `tmpfs`.

Run the command :

```bash
sudo systemctl enable tmp.mount
```

### Change `/var/log` to `tmpfs`.

Edit the `/etc/fstab` file:

```bash
sudo nano /etc/fstab
```

Add the following lines (if they have no entries) to the `/etc/fstab` file:

```bash
tmpfs /tmp tmpfs defaults,noatime,nosuid,nodev,size=100M 0 0
tmpfs /var/tmp tmpfs defaults,noatime,nosuid,nodev,noexec,size=10M 0 0
tmpfs /var/log tmpfs defaults,noatime,nosuid,nodev,noexec,mode=0755,size=10M 0 0
```

### [Optional] x11vnc configuration

Create VNC server configuration to automatically run and allow passwordless login only on `localhost`.

Create a service to automatically start the server:

```bash
sudo nano /etc/systemd/system/x11vnc.service
```

Put the following content in the file:

```bash
[Unit]
Description=x11vnc
After=multi-user.target

[Service]
Type=simple
ExecStart=/usr/bin/x11vnc -auth guess -forever -loop -noxdamage -repeat -shared -localhost

[Install]
WantedBy=multi-user.target
```

Set up the service launch:

```bash
# Starting the service
sudo systemctl start x11vnc.service
sudo systemctl status x11vnc.service
# Activate the service
sudo systemctl enable x11vnc.service
```

### Testing VNC

Run the following commands (from the client computer on the same network):

```bash
# Create SSH tunnel
ssh -L 5901:localhost:5900 pi@frameEink.local

# Open the VNC through the tunnel (in another terminal)
vncviewer localhost:5901
```

### Manual update

Run the following commands:

```bash
# Distribution
sudo apt update
sudo apt full-upgrade -y
sudo apt clean

# nodejs and all packages
nvm install-latest-npm
nvm install node --reinstall-packages-from=node
```

### Reboot the OS

When configuration is done, run the following command to reboot:

```bash
sudo reboot
```

## MagicMirror²

This section deals with the installation and configuration of the application and data display modules.

See [MagicMirror²](https://magicmirror.builders/) for details.

### Prerequisites

Some modules have dependencies on `node` > 8 (which is in 2022 the version available in the distribution), so it is necessary to use `nvm` (or whatever) to install a compatible version:

```bash
# Connected to serverUsr, execute:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash

# Then disconnect / reconnect
# ctrl+d + login

# Install the latest version
nvm install node

```

### Installation

See [Installation & Usage | MagicMirror² Documentation](https://docs.magicmirror.builders/getting-started/installation.html#manual-installation) for details.

Run the script [installMM.sh](magicmirror_files/installMM.sh) commands to retrieve and install MagicMirror² and all necessary modules for this project:
Then, apply patch [applyPatch.sh](magicmirror_files/applyPatch.sh) to adapt some modules that need it.

```bash

installMM.sh
applyPatch.sh

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

Edit the configuration file in `/opt/local/MagicMirror/config/` and fill variable `configPrivateParts` (+ adapt configuration of each module if necessary).


To adapt modules position, see visual representation of module positions in a [thread of MagicMirror² forum: module positions](https://forum.magicmirror.builders/topic/286/regions).

[https://docs.magicmirror.builders/configuration/introduction.html](https://docs.magicmirror.builders/configuration/introduction.html)

```bash
nano /opt/local/MagicMirror/config/config.js
```

And fill needed data.
Some modules need a specific initialization in order to work.
Follow each procedure:

- MMM-FreeBox-Monitor: [https://github.com/tataille/MMM-FreeBox-Monitor#readme](https://github.com/tataille/MMM-FreeBox-Monitor#readme)
- MMM-Spotify: [https://github.com/skuethe/MMM-Spotify#install](https://github.com/skuethe/MMM-Spotify#install)
- MMM-Trello: [https://github.com/Jopyth/MMM-Trello#readme](https://github.com/Jopyth/MMM-Trello#readme)

### Modify display styles

Custom CSS is copied to `custom.css` file into `/opt/local/MagicMirror/css/custom.css`.

### Automatic execution

Create a service to automatically start the server:

```bash
sudo nano /etc/systemd/system/magicmirror.service
```

Put the following content in the file:

```bash
[Unit]
Description=Magic Mirror
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
User=serverusr
WorkingDirectory=/opt/local/MagicMirror/
ExecStart=node serveronly

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
# Starting the service
sudo systemctl start magicmirror.service
sudo systemctl status magicmirror.service
# Enabling the service
sudo systemctl enable magicmirror.service
```

### Upgrade (including modules)

To update MagicMirror² and all installed modules, run the commands in the script [updateMM.sh](magicmirror_files/updateMM.sh)

```bash

updateMM.sh

# npm packages
#npm update --save/--save-dev

```

### Access to the screen from a browser

Within the same network, open [http://frameEink.local:8080](http://frameeink.local:8080/) in a browser. 
