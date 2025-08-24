import inherits from 'inherits-browser';
import { domify, query } from 'min-dom';
import { innerSVG } from 'tiny-svg';
import Diagram from 'diagram-js';

import AlignElementsModule from 'diagram-js/lib/features/align-elements';
import AttachSupport from 'diagram-js/lib/features/attach-support';
import AutoScrollModule from 'diagram-js/lib/features/auto-scroll';
import BendpointsModule from 'diagram-js/lib/features/bendpoints';
import ConnectModule from 'diagram-js/lib/features/connect';
import ContextPadModule from 'diagram-js/lib/features/context-pad';
import ConnectPreviewModule from 'diagram-js/lib/features/connection-preview';
import CreateModule from 'diagram-js/lib/features/create';
import EditorActionsModule from 'diagram-js/lib/features/editor-actions';
import GridSnappingModule from 'diagram-js/lib/features/grid-snapping';
import KeyboardModule from 'diagram-js/lib/features/keyboard';
import KeyboardMoveModule from 'diagram-js/lib/navigation/keyboard-move';
import KeyboardMoveSelectionModule from 'diagram-js/lib/features/keyboard-move-selection';
import LassoToolModule from 'diagram-js/lib/features/lasso-tool';
import MoveCanvasModule from 'diagram-js/lib/navigation/movecanvas';
import MoveModule from 'diagram-js/lib/features/move';
import OutlineModule from 'diagram-js/lib/features/outline';
import PaletteModule from 'diagram-js/lib/features/palette';
import ResizeModule from 'diagram-js/lib/features/resize';
import RulesModule from 'diagram-js/lib/features/rules';
import SelectionModule from 'diagram-js/lib/features/selection';
import SnappingModule from 'diagram-js/lib/features/snapping';
import ZoomScrollModule from 'diagram-js/lib/navigation/zoomscroll';

import GridModule from 'diagram-js-grid';

import Providers from './providers';
import Render from './render';
import Modeling from './modeling';

import 'diagram-js/assets/diagram-js.css';
import './style.css';

/**
 * Event Modeling Designer editor constructor
 *
 * @param { { container: Element, additionalModules?: Array<any> } } options
 *
 * @return {Diagram}
 */
export default function Editor(options) {
  this.container = this.createContainer();
  this.init(this.container, options);
}

// Make Editor inherit from diagram-js/Diagram
inherits(Editor, Diagram);

// Add modules for the Editor
Editor.prototype.modules = [
  // Customized modules
  Providers,
  Render,
  Modeling,

  // Built-in modules
  AlignElementsModule,
  AttachSupport,
  AutoScrollModule,
  BendpointsModule,
  ConnectModule,
  ConnectPreviewModule,
  ContextPadModule,
  CreateModule,
  GridModule,
  GridSnappingModule,
  EditorActionsModule,
  KeyboardModule,
  KeyboardMoveModule,
  KeyboardMoveSelectionModule,
  LassoToolModule,
  MoveCanvasModule,
  MoveModule,
  OutlineModule,
  PaletteModule,
  ResizeModule,
  RulesModule,
  SelectionModule,
  SnappingModule,
  ZoomScrollModule,
];

/**
 * Create a container to mount
 * @returns {HTMLElement}
 */
Editor.prototype.createContainer = function () {
  return domify(
    '<div class="event-modeling-designer-container" style="width: 100%; height: 100%"></div>',
  );
};


/**
 * Initialize the editor
 */
Editor.prototype.init = function (container, options) {
  const {
    additionalModules,
    canvas,
    ...additionalOptions
  } = options;

  const baseModules = options.modules || this.modules;

  const modules = [
    ...baseModules,
    ...(additionalModules || []),
  ];

  const diagramOptions = {
    ...additionalOptions,
    canvas: {
      ...canvas,
      container,
    },
    modules,
  };

  // invoke diagram constructor
  Diagram.call(this, diagramOptions);

  if (options && options.container) {
    this.attachTo(options.container);
  }

  this.get('eventBus').fire('editor.attached');
};

/**
 * A utility function to expose the event bus
 */
Editor.prototype.emit = function (type, event) {
  return this.get('eventBus').fire(type, event);
};

/**
 * Detach the editor from the actual container
 */
Editor.prototype.detach = function () {
  const { container } = this;
  const { parentNode } = container;

  if (!parentNode) {
    return;
  }

  this.emit('detach', {});

  parentNode.removeChild(container);
};

/**
 * Attach the editor to a specific container
 */
Editor.prototype.attachTo = function (parentNode) {
  if (!parentNode) {
    throw new Error('parentNode required');
  }

  // ensure we detach from the
  // previous, old parent
  this.detach();

  parentNode.appendChild(this.container);

  this.emit('attach', {});

  this.get('canvas').resized();
};
  