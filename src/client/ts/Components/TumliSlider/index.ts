import {tns, TinySliderSettings} from "../../../../../node_modules/tiny-slider/src/tiny-slider";
// Style was imported in common.scss
// import "../../../../../node_modules/tiny-slider/dist/tiny-slider.css";
// import "./_style.scss";

export class TumliSlider {
  constructor(options: TinySliderSettings) {
    tns(options);
  }
}