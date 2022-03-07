# Hardware part

This project was done with KiCad. Schematic and PCB are provided in this format.

- Schematic has a complete overview of all components needed (including sockets, holes and mounting stuff)
    - Each component is socketed
    - A schematic and footprint is provided for SMT socket, (but also component - not used in this project) and simple edge component
    - BOM references are included for Mouser provider
- PCB is done with SMT components to avoid potential shortcuts through accessible pins on background plate
    - Raspberry pi zero footprint is used
    - There is also a classical Raspberry pi footprint available (that can fit on PCB if desired)

The Kicad project is located in [pcb](pcb/) folder.

![pcb](images/pcb.png)

![pcb-3d](images/pcb-3d.png)

## BOM

Approximate price: 430€ (in 2022)

- e-ink screen: 175€
- Raspberry Pi Zero 2 W + sdcard, power…: 90€
- Temperature/Humidity/Pressure/IAQ Sensor: 20€
- Capactive touch sensor: 15€
- PCB printing (+shipping): 30€
- Frame: 25€
- Screws, standoffs, nuts, sockets…: 75€

## Detailed BOM

| Description | Mouser ref. | Quantity | Comments |
| --- | --- | --- | --- |
| UC |  |  |  |
| Raspberry Pi Zero 2 W |  | 1 | Raspberry pi Zero 2 W on Raspbery website
Raspberry 4 should work too (enough space on board) |
| Socket Raspberry | 200-SSM120FDV | 1 | 2x20-pins female socket |
| Temperature/Humidity/Pressure/IAQ Sensor |  |  |  |
| CJMCU-680 |  | 1 | Temperature/humidity/pressure/IAQ sensor |
| Socket BME680 | 200-SSM106SSV | 1 | 6-pins female socket |
| Screen |  |  |  |
| Waveshare e-ink 7.8” display |  | 1 | 7.8inch epaper on Waveshare website |
| Socket IT8951 | 649-95278-101-40LF | 1 | 2x20-pins male socket |
| IT8951 ribbon | 710-687640100002 | 1 | The one provided by Waveshare is too long |
| Standoff M2.5 | 761-M2113-2545-AL | 4 | Standoff for IT8951 driver (pairing with nuts and screws) |
| Capacitive keys |  |  |  |
| Adafruit MPR121 |  | 1 | Capacitive keys
Warn: 2 revisions exist with different pins |
| Socket MPR121 contacts | 200-SSM113SSV | 1 | 7-pins female socket |
| Socket MPR121 comm | 200-SSM107LSV | 1 | 13-pins female socket |
| Screw Terminal 01x03 | 571-2383945-3 | 4 | Hard to source. May be optional by directly ironing wires on pads |
| Wire 24AWG | 650-100G0111-0.25-0 | 4 | Probably less is needed (wires needed from screw terminals to frame picture turn buttons) |
| Terminal | 571-151439 | 12 (or # of needed keys) | To fix wires on frame picture turn buttons |
| Frame picture turn button |  | 12 (or # of needed keys) | As large as possible: used as capacitive keys
May be another system like rivets through frame |
| Frame |  |  |  |
| Photo frame |  | 1 | Inner dim. 127.6 * 173.8
(= screen size) |
| Insert M3 | 153-PFLA-M3-2 | 4 | To fix PCB in frame |
| Standoff M3 | 761-M2115-3005-SS | 4 | Length may differ according to frame height. A secure length is 23mm (pairing with inserts and screws) |
| Screw M3 | 534-9191-3 | 4 | To fix PCB in frame |
| Cable tie | 644-BC1M-S4-M0 | 1 | To maintain USB cable |
| Misc |  |  |  |
| Nut M2.5 | 144-04M025045HN | 14 |  |
| Screw M2.5 | 534-29300 | 14 |  |
| Standoff M2.5 | 761-M2105-2545-AL | 8 | Standoffs for all boards except IT8951 driver (pairing with nuts and screws) |

## Photo frame

The frame have some constraints to fit with the PCB:

- back border must have width ≥ 15mm (insert has ~4mm diameter)
- border must have depth ≥ 15mm (insert has ~7mm length)

## Useful references during development

### KiCad

- KiCad EDA: [https://www.kicad.org/](https://www.kicad.org/)

### Raspberry Pi Zero 2 W

- Raspberry pinout: [https://pinout.xyz/#](https://pinout.xyz/#)
- 3D model by [Hasanain Shuja](https://grabcad.com/hasanain.shuja-1)

### Waveshare e-ink 7.8”

- Waveshare e-ink and driver hat: [https://www.waveshare.com/product/displays/e-paper/epaper-1/7.8inch-e-paper-hat.htm](https://www.waveshare.com/product/displays/e-paper/epaper-1/7.8inch-e-paper-hat.htm)
- Waveshare 7.8inch e-Paper HAT(including links to schematics, spec and datasheets): [https://www.waveshare.com/wiki/7.8inch_e-Paper_HAT](https://www.waveshare.com/wiki/7.8inch_e-Paper_HAT)

### Adafruit MPR121 module

- MPR121 Capacitive Touch Sensor on Raspberry Pi: [https://learn.adafruit.com/adafruit-mpr121-12-key-capacitive-touch-sensor-breakout-tutorial/overview](https://learn.adafruit.com/adafruit-mpr121-12-key-capacitive-touch-sensor-breakout-tutorial/overview)

### CJMCU-680

- 3D model by [Hasanain Shuja](https://grabcad.com/hasanain.shuja-1) 
