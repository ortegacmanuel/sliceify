import { assign } from 'min-dash';
import BaseSpec from '../BaseSpec';
import EdgeStyle from './EdgeStyle';

export default class Edge extends BaseSpec {
  style = new EdgeStyle();

  importJson(json) {
    this.style.source = json.style.source;
    this.style.target = json.style.target;
    assign(this.style.waypoints, json.style.waypoints);
  }

  exportJson() {
    const json = assign({ style: new EdgeStyle() }, { style: { waypoints: this.style.waypoints } });
    json.style.source = this.style.source.businessObject.Name;
    json.style.target = this.style.target.businessObject.Name;
    return json;
  }
}