import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { fireEvent } from 'custom-card-helpers';
import style from 'bundle-text:./styles/style.scss';

export class MarstekVenusECard extends LitElement {
  declare _hass;

  static styles = css`${unsafeCSS(style)}`;

  @state()
  private _entities = {};

  @state({ state: true })
  private _states = {};

  @property()
  private _name = "MARSTEK";

  private static inverter_states = {
    0: 'sleep',
    1: 'standby',
    2: 'charge',
    3: 'discharge',
    4: 'backup mode',
    5: 'OTA upgrade',
  }

  private static user_work_modes = {
    0: 'manual',
    1: 'anti-feed',
    2: 'trade',
  }

  render() {

    let soc = this._states["soc"];
    let ac_power = this._states["ac_power"];
    let inverter_status = this._states["inverter_status"];
    let voltage = this._states["voltage"];
    let temperature = this._states["temperature"];
    let user_work_mode = this._states["user_work_mode"];

    let state = MarstekVenusECard.inverter_states[inverter_status.state] !== undefined ? MarstekVenusECard.inverter_states[inverter_status.state] : inverter_status.state;
    let mode = MarstekVenusECard.user_work_modes[user_work_mode.state] !== undefined ? MarstekVenusECard.user_work_modes[user_work_mode.state] : user_work_mode.state;

    return html`
      <marstek-venus-e state="${state}">
        <div class="head">
          <div class="power-bar pointer" @click=${() => this._openMoreInfo(this._entities["soc"])}>
            <div class="bar" style="width: ${parseInt(soc.state)}%"></div>
          </div>
          <div class="row">
            <div class="pointer" @click=${() => this._openMoreInfo(this._entities["soc"])}>SOC: ${soc.state} %</div>
            <div class="pointer" @click=${() => this._openMoreInfo(this._entities["ac_power"])}>AC-Power: ${ac_power.state} W</div>
          </div>
        </div>
        <div class="body">
          <div class="row pointer" @click=${() => this._openMoreInfo(this._entities["user_work_mode"])}>
            <div>Modus:</div>
            <div>${mode}</div>
          </div>
          <div class="row pointer" style="margin-bottom: 2em" @click=${() => this._openMoreInfo(this._entities["inverter_status"])}>
            <div>Inverter Status:</div>
            <div>${state}</div>
          </div>
          <div class="text-center pointer" @click=${() => this._openMoreInfo(this._entities["voltage"])}>${voltage.state} V</div>
          <div class="text-center pointer" @click=${() => this._openMoreInfo(this._entities["temperature"])}>${temperature.state} °C</div>
          <div class="name">${this._name}</div>
        </div>
      </marstek-venus-e>
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
      } else {
        this._entities[i] = config.entities[i];
      }
    });

    if (config.name) {
      this._name = config.name;
    }

    if (this._hass) {
      this.hass = this._hass
    }
  }

  set hass(hass) {
    this._hass = hass;

    const newStates: Record<string, any> = {};

    for (let [key, val] of Object.entries(this._entities)) {
      newStates[key] = hass.states[val];
    }
    this._states = newStates;
  }

  private _openMoreInfo(entityId: string) {
    fireEvent(this, "hass-more-info", { entityId });
  }
}