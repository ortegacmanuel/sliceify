import { assign } from 'min-dash';

import Event from '../spec/Event';
import Timeline from '../spec/Timeline';
import Lane from '../spec/Lane';
import Slice from '../spec/Slice';
import SlicePanel from '../spec/SlicePanel';

const SPEC_LIST = [
  Event,
  Timeline,
  Lane,
  Slice,
  SlicePanel
];

/**
 * A example palette provider.
 */
export default function MyPaletteProvider(create, elementFactory, lassoTool, palette) {
  this.create = create;
  this.elementFactory = elementFactory;
  this.lassoTool = lassoTool;
  this.palette = palette;

  palette.registerProvider(this);
}

MyPaletteProvider.$inject = ['create', 'elementFactory', 'lassoTool', 'palette'];

MyPaletteProvider.prototype.getPaletteEntries = function () {
  const create = this.create || this._create;
  const elementFactory = this.elementFactory || this._elementFactory;
  const lassoTool = this.lassoTool || this._lassoTool;

  function createAction(type, group, className, title, options) {
    function createListener(event) {
      const shape = elementFactory.createShape(assign({ type }, options));
      create.start(event, shape);
    }

    return {
      group,
      className,
      title,
      action: {
        dragstart: createListener,
        click: createListener,
      },
    };
  }

  const entries = {
    'lasso-tool': {
      group: 'tools',
      className: 'palette-icon-lasso-tool',
      title: 'Activate Lasso Tool',
      action: {
        click(event) {
          lassoTool.activateSelection(event);
        },
      },
    },
    'tool-separator': {
      group: 'tools',
      separator: true,
    },
  };
  SPEC_LIST.forEach((Spec) => {
    const type = Spec.prototype.type;
    entries[`create-${type}`] = createAction(
      type,
      'state',
      Spec.prototype.THUMBNAIL_CLASS,
      `Create ${type}`
    );
  });
  return entries;
};
