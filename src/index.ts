import { MarstekVenusECard } from './MarstekVenusECard';

declare global {
  interface Window {
    customCards: Array<Object>;
  }
}

customElements.define(
  "marstek-venus-e-card",
  MarstekVenusECard
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "marstek-venus-e-card",
  name: "Marstek Venus E Card",
  description: "Zeigt den Status eines Marstek Venus E an.",
  documentationURL: "https://github.com/DeadHunter/Home-Assistant-Marstek-Venus-E-Card",
});

console.log('Loaded Marstek Venus E Card');