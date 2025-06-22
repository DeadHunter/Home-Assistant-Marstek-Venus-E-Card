# Marstek Venus E Card
Eine Homeassistant UI Card für den Marstek Venus E Speicher

## Installation
### HACS
`HACS` > `Benutzerdefinierte Repositories`

Repository: `https://github.com/DeadHunter/Home-Assistant-Marstek-Venus-E-Card`

Typ: `Dashboard`

## Card einrichten
```yaml
type: custom:marstek-venus-e-card
entities:
  soc: sensor.venus_e_5kwh_battery_soc
  ac_power: sensor.venus_e_5kwh_ac_power
  inverter_status: sensor.venus_e_5kwh_inverter_state
  user_work_mode: sensor.venus_e_5kwh_user_work_mode
  voltage: sensor.venus_e_5kwh_battery_voltage
  temperature: sensor.venus_e_5kwh_internal_temperature
name: Marstek Venus E 5kWh
```

- `user_work_mode` und `inverter_status` müssen den Numerischen Zustand enthalten.
- Alle `entities` werden benötigt.
- `name` ist optional