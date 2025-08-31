import { assign } from 'min-dash';
import { randomString } from '../utils';
import BaseSpec from './BaseSpec';

export default class EventModel extends BaseSpec {
  constructor() {
    super();
    this.Name = `${this.Type}-${randomString()}`;
  }

  importJson(json) {
    const { style, edge, StartState, States, ...props } = json;
    assign(this, props);
  }

  exportJson() {
    return assign({}, this);
  }  
}

EventModel.prototype.THUMBNAIL_CLASS = 'bpmn-icon-transaction';

EventModel.prototype.Type = 'EventModel';