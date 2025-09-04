import Element from './Element';
import ColorUtil from '../utils/ColorUtil';

export default class ReadModel extends Element {
  constructor() {
    super();
  }
}

ReadModel.prototype.THUMBNAIL_CLASS = 'palette-icon-create-read-model';

ReadModel.prototype.DEFAULT_SIZE = {
  width: 180,
  height: 80,
};
ReadModel.prototype.DEFAULT_COLOR = ColorUtil.GREEN;

ReadModel.prototype.type = 'ReadModel';