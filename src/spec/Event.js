import BaseSpec from './BaseSpec';

export default class Event extends BaseSpec {
  constructor() {
    super();
    this.Type = 'Event';
    this.Source = 'internal';
  }
}

Event.prototype.THUMBNAIL_CLASS = 'palette-icon-create-event';

Event.prototype.DEFAULT_SIZE = {
  width: 100,
  height: 80,
};

Event.prototype.DEFAULT_COLOR = '#FF9D48';

Event.prototype.Type = 'Event';

Event.prototype.DEFAULT_NAME = 'Event';