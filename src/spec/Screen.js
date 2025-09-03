import Element from './Element';
import ColorUtil from '../utils/ColorUtil';

export default class Screen extends Element {
  constructor() {
    super();
  }
}

Screen.prototype.THUMBNAIL_CLASS = 'palette-icon-create-screen';

Screen.prototype.DEFAULT_SIZE = {
  width: 180,
  height: 80,
};
Screen.prototype.DEFAULT_COLOR = ColorUtil.WHITE;

Screen.prototype.type = 'Screen';
