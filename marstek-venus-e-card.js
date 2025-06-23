import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

class MarstekVenusECard extends LitElement {

  static get properties() {
      return {
          hass: {},
          config: {
              entities: {
                  soc: null,
                  ac_power: null,
                  inverter_status: null,
                  user_work_mode: null,
                  voltage: null,
                  temperature: null,
              }
          },
      };
  }

  static inverter_states = {
      0: 'sleep',
      1: 'standby',
      2: 'charge',
      3: 'discharge',
      4: 'backup mode',
      5: 'OTA upgrade',
  }

  static user_work_modes = {
      0: 'manual',
      1: 'anti-feed',
      2: 'trade',
  }

  render() {

      let name = this.config.name === undefined ? 'MARSTEK' : this.config.name;
      let soc = this.hass.states[this.config.entities.soc];
      let ac_power = this.hass.states[this.config.entities.ac_power];
      let inverter_status = this.hass.states[this.config.entities.inverter_status];
      let voltage = this.hass.states[this.config.entities.voltage];
      let temperature = this.hass.states[this.config.entities.temperature];
      let user_work_mode = this.hass.states[this.config.entities.user_work_mode];

      let state = MarstekVenusECard.inverter_states[inverter_status.state] !== undefined ? MarstekVenusECard.inverter_states[inverter_status.state] : inverter_status.state;
      let mode = MarstekVenusECard.user_work_modes[user_work_mode.state] !== undefined ? MarstekVenusECard.user_work_modes[user_work_mode.state] : user_work_mode.state;

      return html`
          <marstek-venus-e state="${state}">
              <div class="head">
                  <div class="power-bar">
                      <div class="bar" style="width: ${parseInt(soc.state)}%"></div>
                  </div>
                  <div class="row">
                      <div>SOC: ${soc.state} %</div>
                      <div>AC-Power: ${ac_power.state} W</div>
                  </div>
              </div>
              <div class="body">
                  <div class="row">
                      <div>Modus:</div>
                      <div>${mode}</div>
                  </div>
                  <div class="row" style="margin-bottom: 3em">
                      <div>Inverter Status:</div>
                      <div>${state}</div>
                  </div>
                  <div class="text-center">${voltage.state} V</div>
                  <div class="text-center">${temperature.state} °C</div>
                  <div class="name">${name}</div>
              </div>
          </marstek-venus-e>
      `;
  }

  static get styles() {
      return css`
marstek-venus-e {
display: block;
color: #fff;
border: 2px solid #999;
border-radius: 2em;
background: #4a4a4a;
background: linear-gradient(100deg, rgb(74, 74, 74) 0%, rgb(55, 55, 55) 15%, rgb(38, 38, 38) 15%, rgb(10, 10, 10) 100%);
}
marstek-venus-e .head {
padding: 2em;
border-bottom: 2px solid #999;
margin-bottom: 4em;
}
marstek-venus-e .head .power-bar {
width: 80%;
border: 1px solid #999;
border-radius: 1em;
padding: 2px;
margin: 2em auto;
position: relative;
}
marstek-venus-e .head .power-bar .bar {
height: 4px;
box-shadow: 0 0 9px 2px #fff;
border-radius: 1em;
background: #fff;
position: relative;
}
marstek-venus-e .head .power-bar .bar::after {
display: block;
content: "";
border-radius: 100%;
position: absolute;
top: 0;
right: 0;
bottom: 0;
}
marstek-venus-e .body {
padding: 2em;
font-size: 1.4em;
}
marstek-venus-e .body .row {
margin-bottom: 1em;
}
marstek-venus-e .row {
display: flex;
justify-content: space-between;
margin: 0 auto;
width: 80%;
}
marstek-venus-e .text-center {
text-align: center;
}
marstek-venus-e .name {
text-align: center;
margin-top: 2em;
}
marstek-venus-e[state=charge] .power-bar .bar {
animation: marstek-charging ease-in-out 3s infinite;
background: #4aff03;
}
marstek-venus-e[state=charge] .power-bar .bar::after {
background: #6cff25;
box-shadow: 0 0 9px 2px #6cff25;
animation: marstek-energy cubic-bezier(0.38, 0.6, 0.53, 1.03) 1500ms infinite;
}
marstek-venus-e[state=discharge] .power-bar .bar {
animation: marstek-discharging ease-in-out 3s infinite;
background: #ff4a03;
}
marstek-venus-e[state=discharge] .power-bar .bar::after {
background: #ff6c25;
box-shadow: 0 0 9px 2px #ff6c25;
animation: marstek-energy ease-in-out 1500ms infinite reverse;
}

@keyframes marstek-charging {
0% {
  box-shadow: 0 0 9px 2px #4aff03;
}
50% {
  box-shadow: 0 0 9px 0px #4aff03;
}
100% {
  box-shadow: 0 0 9px 2px #4aff03;
}
}
@keyframes marstek-discharging {
0% {
  box-shadow: 0 0 9px 2px #ff4a03;
}
50% {
  box-shadow: 0 0 9px 0px #ff4a03;
}
100% {
  box-shadow: 0 0 9px 2px #ff4a03;
}
}
@keyframes marstek-energy {
0% {
  opacity: 0;
  left: 0;
  right: 90%;
}
20% {
  opacity: 1;
  left: 0;
}
80% {
  opacity: 1;
  right: 0;
}
100% {
  opacity: 0;
  left: 90%;
  right: 0;
}
}
      `;
  }

  setConfig(config) {
      if (!config.entities) {
          throw new Error("You need to define entities");
      }

      // check if entities are configured
      ['soc', 'ac_power', 'inverter_status', 'user_work_mode', 'voltage', 'temperature'].forEach(i => {
          if (config.entities[i] === undefined) {
              throw new Error(`${i} is not defined in config.entites`);
          }
      });
      this.config = config;
  }
}

customElements.define("marstek-venus-e-card", MarstekVenusECard);
console.log('🔋 Marstek Venus E Card 1.0.0');