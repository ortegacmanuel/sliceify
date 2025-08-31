import inherits from 'inherits-browser';
import { domify } from 'min-dom';
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
import TimelineModule from './timeline';

import 'diagram-js/assets/diagram-js.css';
import '@bpmn-io/properties-panel/assets/properties-panel.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
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
  TimelineModule,

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
    '<div class="event-modeling-designer-container" style="width: 100%; height: 100%"></div>'
  );
};

/**
 * Initialize the editor
 */
Editor.prototype.init = function (container, options) {
  const { additionalModules, canvas, ...additionalOptions } = options;

  const baseModules = options.modules || this.modules;

  const modules = [...baseModules, ...(additionalModules || [])];

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
 * Import diagram from JSON definitions.
 */
Editor.prototype.import = function (definitions) {
  this.clear();

  // Support sandbox-style timeline imports as well as existing EventModel format
  try {
    if (definitions && (Array.isArray(definitions.timelines) || Array.isArray(definitions.groups))) {
      // New timeline import path (lightweight)
      const { canvas, elementFactory, modeling } = this.get('injector')._providers;
      const c = this.get('canvas');
      const ef = this.get('elementFactory');
      const m = this.get('modeling');

      // Initialize an empty root
      const root = ef.createRoot({ id: 'root' });
      c.setRootElement(root);

      const timelines = definitions.timelines || (definitions.groups || []).map(g => ({
        id: g.id,
        name: g.title || 'Timeline',
        headerHeight: g.headerHeight || 120,
        scale: g.scale || { pxPerUnit: 240, origin: 0 },
        slices: g.slices
      }));

      let y = 40;
      timelines.forEach((t) => {
        const tl = ef.createShape({ type: 'Timeline', x: 40, y, width: 1600, height: t.headerHeight, businessObject: { name: t.name, headerHeight: t.headerHeight, scale: t.scale } });
        m.createShape(tl, { x: tl.x, y: tl.y, width: tl.width, height: tl.height }, root);

        // system + actor lanes
        const actor = ef.createShape({ type: 'Lane', x: tl.x, y: tl.y - 120, width: tl.width, height: 120, businessObject: { name: 'Actor 1', kind: 'actor', order: 0, height: 120, timelineId: tl.businessObject.id } });
        m.createShape(actor, { x: actor.x, y: actor.y, width: actor.width, height: actor.height }, root);
        const system = ef.createShape({ type: 'Lane', x: tl.x, y: tl.y + t.headerHeight, width: tl.width, height: 120, businessObject: { name: 'System 1', kind: 'system', order: 0, height: 120, timelineId: tl.businessObject.id } });
        m.createShape(system, { x: system.x, y: system.y, width: system.width, height: system.height }, root);

        // one default panel aligned to first slice
        const panel = ef.createShape({ type: 'SlicePanel', x: tl.x + ((t.scale && t.scale.origin) || 0) + 240, y: system.y, width: 240, height: 120, businessObject: { name: 'Slice Panel 1', label: 'Slice 1', timelineId: tl.businessObject.id } });
        m.createShape(panel, { x: panel.x, y: panel.y, width: panel.width, height: panel.height }, root);

        // carry over domain slices if provided
        if (Array.isArray(t.slices)) {
          tl.businessObject.slices = t.slices;
        }

        y += 420;
      });

      return;
    }
  } catch (err) {
    // fall back to default importer
    console.warn('Timeline import failed, falling back to default importer', err);
  }

  this.get('EMImporter').import(definitions);
};

/**
 * A utility function to expose the event bus
 */
Editor.prototype.emit = function (type, event) {
  return this.get('eventBus').fire(type, event);
};

// Export sandbox-style timeline JSON
Editor.prototype.export = function () {
  const canvas = this.get('canvas');
  const root = canvas.getRootElement();
  const all = (root && root.children) || [];

  function findTimelines(nodes) {
    const out = [];
    function visit(node) {
      if (!node) return;
      if (node.type === 'Timeline') out.push(node);
      (node.children || []).forEach(visit);
    }
    nodes.forEach(visit);
    return out;
  }

  const timelines = findTimelines(all).map((tl) => {
    const parent = tl.parent;
    const tid = tl.businessObject && tl.businessObject.id;
    const siblings = (parent && parent.children) || [];
    const lanes = siblings.filter(c => c.type === 'Lane' && c.businessObject && c.businessObject.timelineId === tid);
    const panels = siblings.filter(c => c.type === 'SlicePanel' && c.businessObject && c.businessObject.timelineId === tid);

    // collect elements recursively under the same parent to include children of lanes
    function collectElements(node) {
      const out = [];
      function visit(n) {
        if (!n) return;
        (n.children || []).forEach(k => {
          if (['Event','Command','ReadModel','View'].includes(k.type)) out.push(k);
          if (k.children && k.children.length) visit(k);
        });
      }
      visit(node);
      return out;
    }
    const elems = collectElements(parent);

    const unit = (tl.businessObject && tl.businessObject.scale && tl.businessObject.scale.pxPerUnit) || 240;
    const origin = (tl.businessObject && tl.businessObject.scale && tl.businessObject.scale.origin) || 0;

    function center(el) {
      const cx = (el.x || 0) + (el.width || 0) / 2;
      const cy = (el.y || 0) + (el.height || 0) / 2;
      return { cx, cy };
    }

    function sliceIndexOf(el) {
      const { cx } = center(el);
      const localX = cx - tl.x;
      const idx = Math.floor((localX - origin) / unit);
      return idx < 1 ? 1 : idx;
    }

    function laneOf(el) {
      const { cy } = center(el);
      return lanes.find(l => cy >= l.y && cy <= (l.y + l.height));
    }

    // Ensure we have a slices array to enrich
    let slices = (tl.businessObject && tl.businessObject.slices);
    if (!Array.isArray(slices)) {
      // compute slices covering current width
      const width = tl.width || 0;
      const firstIndex = Math.max(1, Math.ceil((0 - origin) / unit));
      const lastIndex = Math.max(firstIndex, Math.floor((width - origin - 1) / unit));
      slices = [];
      for (let i = firstIndex; i <= lastIndex; i++) {
        const offsetX = origin + i * unit;
        if (offsetX >= 0 && offsetX < width) {
          slices.push({ id: `${tid || 'tl'}_sl_${i}`, index: i, offsetX, width: unit, laneIds: [] });
        }
      }
    }

    const outSlices = slices.map(s => {
      const inSlice = (el) => sliceIndexOf(el) === s.index;
      const events = elems.filter(el => el.type === 'Event' && inSlice(el));
      const commands = elems.filter(el => el.type === 'Command' && inSlice(el));
      const readModels = elems.filter(el => (el.type === 'ReadModel' || el.type === 'View') && inSlice(el));

      const laneIds = Array.from(new Set(
        events.map(el => laneOf(el)).filter(Boolean).map(l => l.businessObject.id)
      ));

      return {
        id: s.id,
        index: s.index,
        offsetX: s.offsetX,
        width: s.width,
        laneIds,
        events: events.map(el => el.businessObject && (el.businessObject.id || el.id)).filter(Boolean),
        commands: commands.map(el => el.businessObject && (el.businessObject.id || el.id)).filter(Boolean),
        readModels: readModels.map(el => el.businessObject && (el.businessObject.id || el.id)).filter(Boolean)
      };
    });

    return {
      id: tid,
      name: tl.businessObject && tl.businessObject.name,
      headerHeight: tl.businessObject && tl.businessObject.headerHeight,
      scale: tl.businessObject && tl.businessObject.scale,
      slices: outSlices,
      lanes: lanes.map(l => ({ id: l.businessObject.id, name: l.businessObject.name, kind: l.businessObject.kind, order: l.businessObject.order, height: l.businessObject.height })),
      panels: panels.map(p => ({ id: p.businessObject.id, name: p.businessObject.name || p.businessObject.label, sliceIndex: sliceIndexOf(p), width: p.width, height: p.height }))
    };
  });

  const name = (root && root.businessObject && (root.businessObject.Name || root.businessObject.name)) || 'diagram';
  return { Name: name, timelines };
};

// Export SVG as string
Editor.prototype.exportSvg = function () {
  try {
    const canvas = this.get('canvas');
    const container = canvas.getContainer && canvas.getContainer();
    const svg = container ? container.querySelector('svg') : null;
    if (svg) return svg.outerHTML;
  } catch (err) {
    console.warn('SVG export failed', err);
  }
  return '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
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
