import Element from './Element';
import ColorUtil from '../utils/ColorUtil';

export default class Processor extends Element {
  constructor() {
    super();
  }
}

Processor.prototype.THUMBNAIL_CLASS = 'palette-icon-create-processor';

Processor.prototype.DEFAULT_SIZE = {
  width: 180,
  height: 80,
};
Processor.prototype.DEFAULT_COLOR = ColorUtil.GRAY;

Processor.prototype.type = 'Processor';