import Element from './Element';
import ColorUtil from '../utils/ColorUtil';

export default class Event extends Element {
  constructor() {
    super();
    this.source = 'internal';
  }
}

Event.prototype.THUMBNAIL_CLASS = 'palette-icon-create-event';

Event.prototype.DEFAULT_SIZE = {
  width: 100,
  height: 80,
};
Event.prototype.DEFAULT_COLOR = ColorUtil.ORANGE;

Event.prototype.type = 'Event';
