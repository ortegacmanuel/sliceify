import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import { create as svgCreate, append as svgAppend, attr as svgAttr } from 'tiny-svg';

const HIGH_PRIORITY = 1500;

export default class TimelineRenderer extends BaseRenderer {
  constructor(eventBus, styles) {
    super(eventBus, HIGH_PRIORITY);
    this._styles = styles;
  }

  canRender(element) {
    return [ 'Timeline', 'Lane', 'Slice', 'SlicePanel' ].includes(element.type);
  }

  drawShape(parentGfx, element) {
    const bo = element.businessObject || {};

    // shared rect helper
    const drawRect = (parent, w, h, rx, attr) => {
      const r = svgCreate('rect');
      svgAttr(r, { x: 0, y: 0, width: w, height: h, rx, ry: rx, ...attr });
      svgAppend(parent, r);
      return r;
    };

    // simple label (name) at top-left
    const drawName = (parent, text, x, y) => {
      if (!text) return;
      const t = svgCreate('text');
      svgAttr(t, { x, y, class: 'djs-label', 'font-size': 12, 'font-weight': 'bold', 'fill': '#111827' });
      t.textContent = text;
      svgAppend(parent, t);
    };

    // All drawing is in local coordinates (0,0). Diagram-js applies element.x/y.
    if (element.type === 'Timeline') {
      const g = svgCreate('g');
      const color = element.color || bo.color || '#eef3f7';
      drawRect(g, element.width, element.height, 4, { fill: color, 'fill-opacity': 0.6, stroke: '#334155', 'stroke-opacity': 0.4 });
      drawName(g, bo.name || 'Timeline', 6, 16);
      svgAppend(parentGfx, g);
      return g;
    }

    if (element.type === 'Lane') {
      const g = svgCreate('g');
      const color = element.color || bo.color || '#9ca3af';
      drawRect(g, element.width, element.height, 6, { fill: color, 'fill-opacity': 0.1, stroke: '#64748b', 'stroke-opacity': 0.35 });
      drawName(g, bo.name || (bo.kind === 'actor' ? 'Actor' : 'Lane'), 6, 16);
      svgAppend(parentGfx, g);
      return g;
    }

    if (element.type === 'Slice') {
      const g = svgCreate('g');
      const color = element.color || bo.color || '#64748b';
      drawRect(g, element.width, element.height, 6, { fill: color, 'fill-opacity': 0.15, stroke: color, 'stroke-opacity': 0.45 });
      drawName(g, bo.name || `Slice #${bo.index || ''}`, 6, 16);
      svgAppend(parentGfx, g);
      return g;
    }

    if (element.type === 'SlicePanel') {
      const g = svgCreate('g');
      const color = element.color || bo.color || '#10b981';
      drawRect(g, element.width, element.height, 6, { fill: color, 'fill-opacity': 0.1, stroke: color, 'stroke-opacity': 0.35 });
      drawName(g, bo.name || bo.label || 'Slice Panel', 6, 16);
      svgAppend(parentGfx, g);
      return g;
    }
  }
}

TimelineRenderer.$inject = [ 'eventBus', 'styles' ];