import Element from './Element';
import ColorUtil from '../utils/ColorUtil';

export default class Command extends Element {
  constructor() {
    super();
  }
}

Command.prototype.THUMBNAIL_CLASS = 'palette-icon-create-command';

Command.prototype.DEFAULT_SIZE = {
  width: 180,
  height: 80,
};
Command.prototype.DEFAULT_COLOR = ColorUtil.BLUE;

Command.prototype.type = 'Command';
