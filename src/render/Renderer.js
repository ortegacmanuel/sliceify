import inherits from 'inherits-browser';

import { assign, isObject } from 'min-dash';

import { attr as domAttr, query as domQuery } from 'min-dom';

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  classes as svgClasses,
} from 'tiny-svg';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import { createLine } from 'diagram-js/lib/util/RenderUtil';

const BLACK = 'hsl(225, 10%, 15%)';
const DEFAULT_FILL_OPACITY = 0.95;
const DEFAULT_TEXT_SIZE = 16;
const DEFAULT_FONT_WEIGHT = 'normal';

// helper functions //////////////////////

function getSemantic(element) {
  return element.businessObject;
}

function colorEscape(str) {
  // only allow characters and numbers
  return str.replace(/[^0-9a-zA-z]+/g, '_');
}

function getStrokeColor(element, defaultColor) {
  return getColor(element) || defaultColor;
}

function getFillColor(element, defaultColor) {
  return getColor(element) || defaultColor;
}

export default function Renderer(config, eventBus, pathMap, styles, textRenderer) {
  BaseRenderer.call(this, eventBus);

  const { computeStyle } = styles;

  const markers = {};

  const defaultFillColor = (config && config.defaultFillColor) || 'white';
  const defaultStrokeColor = (config && config.defaultStrokeColor) || BLACK;

  function shapeStyle(attrs) {
    return styles.computeStyle(attrs, {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      stroke: BLACK,
      strokeWidth: 2,
      fill: 'white',
    });
  }

  function addMarker(id, options) {
    const attrs = assign({
      strokeWidth: 1,
      strokeLinecap: 'round',
      strokeDasharray: 'none',
    }, options.attrs);

    const ref = options.ref || { x: 0, y: 0 };

    const scale = options.scale || 1;

    // fix for safari / chrome / firefox bug not correctly
    // resetting stroke dash array
    if (attrs.strokeDasharray === 'none') {
      attrs.strokeDasharray = [10000, 1];
    }

    const markerElement = svgCreate('marker');

    svgAttr(options.element, attrs);

    svgAppend(markerElement, options.element);

    svgAttr(markerElement, {
      id,
      viewBox: '0 0 20 20',
      refX: ref.x,
      refY: ref.y,
      markerWidth: 20 * scale,
      markerHeight: 20 * scale,
      orient: 'auto',
    });

    // eslint-disable-next-line no-underscore-dangle
    let defs = domQuery('defs', canvas._svg);

    if (!defs) {
      defs = svgCreate('defs');

      // eslint-disable-next-line no-underscore-dangle
      svgAppend(canvas._svg, defs);
    }

    svgAppend(defs, markerElement);

    markers[id] = markerElement;
  }

  function createMarker(id, type, fill, stroke) {
    const end = svgCreate('path');
    svgAttr(end, { d: 'M 1 5 L 11 10 L 1 15 Z' });

    if (type === 'connection-end') {
      addMarker(id, {
        element: end,
        attrs: {
          fill: stroke,
          stroke: 'none',
        },
        ref: { x: 11, y: 10 },
        scale: 1,
      });
    }

    if (type === 'default-choice-marker') {
      const defaultChoiceMarker = svgCreate('path', {
        d: 'M 6 4 L 10 16',
        ...shapeStyle({
          stroke,
        }),
      });

      addMarker(id, {
        element: defaultChoiceMarker,
        ref: { x: 0, y: 10 },
        scale: 1,
      });
    }
  }

  function marker(type, fill, stroke) {
    const id = `${type}-${colorEscape(fill)
    }-${colorEscape(stroke)}`;

    if (!markers[id]) {
      createMarker(id, type, fill, stroke);
    }

    return `url(#${id})`;
  }  

  function drawLine(p, waypoints, attrs) {
    attrs = computeStyle(attrs, ['no-fill'], {
      stroke: BLACK,
      strokeWidth: 2,
      fill: 'none',
    });

    const line = createLine(waypoints, attrs);

    svgAppend(p, line);

    return line;
  }  

  function drawRect(parentGfx, width, height, r, offset, attrs) {
    if (isObject(offset)) {
      attrs = offset;
      offset = 0;
    }

    offset = offset || 0;

    attrs = computeStyle(attrs, {
      stroke: 'black',
      strokeWidth: 2,
      fill: 'white',
    });

    var rect = svgCreate('rect');
    svgAttr(rect, {
      x: offset,
      y: offset,
      width: width - offset * 2,
      height: height - offset * 2,
      rx: r,
      ry: r,
    });
    svgAttr(rect, attrs);

    svgAppend(parentGfx, rect);

    return rect;
  }

  function renderLabel(parentGfx, label, options) {
    options = assign(
      {
        size: {
          width: 100,
        },
      },
      options
    );

    var text = textRenderer.createText(label || '', options);

    svgClasses(text).add('djs-label');

    svgAppend(parentGfx, text);

    return text;
  }

  function renderFieldsList(parentGfx, element, options) {
    const bo = getSemantic(element) || {};
    const fields = Array.isArray(bo.fields) ? bo.fields : [];
    if (!fields.length) return null;

    const {
      x = 6,
      y = 6,
      width = Math.max(0, element.width - 12),
      lineHeight = 14,
      fontSize = 12,
      maxLines = 6,
    } = options || {};

    const lines = fields.slice(0, maxLines).map((f, i) => {
      const name = f && f.name ? String(f.name) : `field ${i + 1}`;
      const example = f && f.example ? String(f.example) : `example ${i + 1}`;
      return `${name}: ${example}`;
    });

    // draw one text element with explicit <tspan> lines to avoid overlaying and reflow
    const text = svgCreate('text');
    svgAttr(text, { x, y, 'font-size': fontSize, fill: 'black' });
    lines.forEach((line, i) => {
      const tspan = svgCreate('tspan');
      svgAttr(tspan, { x, dy: i === 0 ? 0 : lineHeight });
      tspan.textContent = line;
      svgAppend(text, tspan);
    });
    svgAppend(parentGfx, text);

    return true;
  }

  function renderEmbeddedLabel(parentGfx, element, options) {
    var semantic = getSemantic(element);

    options = options || {};

    const {
      align = 'center-middle',
      padding = 5,
      fontSize = DEFAULT_TEXT_SIZE,
      fontWeight = DEFAULT_FONT_WEIGHT,
      style = {},
    } = options;

    return renderLabel(parentGfx, semantic.name, {
      box: element,
      align: align,
      padding: padding,
      style: assign(
        {
          fill: getColor(element) === 'black' ? 'white' : 'black',
          fontSize: fontSize,
          fontWeight: fontWeight,
        },
        style
      ),
    });
  }

  let handlers;

  function renderer(type) {
    return handlers[type];
  }

  handlers = {
    Connection(p, element) {
      const fill = getFillColor(element, defaultFillColor);
      const stroke = getStrokeColor(element, defaultStrokeColor);
      const attrs = {
        stroke,
        strokeWidth: 1,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        markerEnd: marker('connection-end', fill, stroke),
      };

      return drawLine(p, element.waypoints, attrs);
    },    
    Event(parentGfx, element) {
      var attrs = {
        fill: getFillColor(element, defaultFillColor),
        stroke: getStrokeColor(element, defaultStrokeColor),
      };

      if (!('fillOpacity' in attrs)) {
        attrs.fillOpacity = DEFAULT_FILL_OPACITY;
      }

      var rect = drawRect(parentGfx, element.width, element.height, 0, attrs);

      renderEmbeddedLabel(parentGfx, element, { align: 'left-top', fontWeight: 'bold' });

      renderFieldsList(parentGfx, element, { x: 8, y: 44, width: Math.max(0, element.width - 16), lineHeight: 16, fontSize: 12, maxLines: 6 });

      return rect;
    },
    Screen(parentGfx, element) {
      // geometry
      var borderRadius = 8;
      var headerHeight = Math.max(20, Math.min(28, Math.round(element.height * 0.18)));

      // outer window with rounded corners, transparent fill
      var outerAttrs = {
        fill: 'none',
        stroke: getStrokeColor(element, defaultStrokeColor),
      };
      var outerRect = drawRect(parentGfx, element.width, element.height, borderRadius, outerAttrs);

      // content body uses spec default color (e.g. white)
      var body = svgCreate('rect');
      svgAttr(body, {
        x: 1,
        y: headerHeight,
        width: Math.max(0, element.width - 2),
        height: Math.max(0, element.height - headerHeight - 2),
        fill: getFillColor(element, defaultFillColor),
        stroke: 'none',
      });
      svgAppend(parentGfx, body);

      // header bar
      var header = svgCreate('rect');
      svgAttr(header, {
        x: 0,
        y: 0,
        width: element.width,
        height: headerHeight,
        rx: borderRadius,
        ry: borderRadius,
        fill: '#E6E6E6',
        stroke: 'none',
      });
      svgAppend(parentGfx, header);

      // three circles on the left of the header
      var circleRadius = 4;
      var circleY = Math.round(headerHeight / 2);
      var startX = 14;
      var gap = 12;
      for (var i = 0; i < 3; i++) {
        var dot = svgCreate('circle');
        svgAttr(dot, { cx: startX + i * gap, cy: circleY, r: circleRadius, fill: 'white', stroke: 'none' });
        svgAppend(parentGfx, dot);
      }

      // place name above the window, centered
      var labelBox = { x: 0, y: -headerHeight - 6, width: element.width, height: headerHeight };
      renderLabel(parentGfx, getSemantic(element).name, {
        box: labelBox,
        align: 'center-top',
        padding: 0,
        style: assign({ fill: 'black', fontSize: DEFAULT_TEXT_SIZE, fontWeight: 'bold' }, {}),
      });

      return outerRect;
    },
    Command(parentGfx, element) {
      var attrs = {
        fill: getFillColor(element, defaultFillColor),
        stroke: getStrokeColor(element, defaultStrokeColor),
      };

      if (!('fillOpacity' in attrs)) {
        attrs.fillOpacity = DEFAULT_FILL_OPACITY;
      }

      var rect = drawRect(parentGfx, element.width, element.height, 0, attrs);

      renderEmbeddedLabel(parentGfx, element, { align: 'left-top', fontWeight: 'bold' });

      renderFieldsList(parentGfx, element, { x: 8, y: 44, width: Math.max(0, element.width - 16), lineHeight: 16, fontSize: 12, maxLines: 6 });

      return rect;
    },
    ReadModel(parentGfx, element) {
      var attrs = {
        fill: getFillColor(element, defaultFillColor),
        stroke: getStrokeColor(element, defaultStrokeColor),
      };

      if (!('fillOpacity' in attrs)) {
        attrs.fillOpacity = DEFAULT_FILL_OPACITY;
      }

      var rect = drawRect(parentGfx, element.width, element.height, 0, attrs);

      renderEmbeddedLabel(parentGfx, element, { align: 'left-top', fontWeight: 'bold' });

      renderFieldsList(parentGfx, element, { x: 8, y: 44, width: Math.max(0, element.width - 16), lineHeight: 16, fontSize: 12, maxLines: 6 });

      return rect;
    },
    Processor(parentGfx, element) {
      // draw a cog gear with transparent background
      var labelOffset = DEFAULT_TEXT_SIZE + 8;
      var cx = element.width / 2;
      var contentHalf = Math.max(10, (element.height - labelOffset) / 2);
      var cy = labelOffset + contentHalf;
      var margin = 8;
      var outerRadius = Math.max(8, Math.min(cx, contentHalf) - margin);
      var innerRadius = Math.max(4, Math.round(outerRadius * 0.52));
      var toothCount = 10;
      var toothHeight = Math.max(5, Math.round(outerRadius * 0.28));
      var toothWidth = Math.max(6, Math.round(outerRadius * 0.30));

      var color = getFillColor(element, defaultFillColor);

      // gear ring with punched-out center (evenodd)
      function circlePath(cx, cy, r) {
        return 'M ' + (cx - r) + ' ' + cy +
               ' a ' + r + ' ' + r + ' 0 1 0 ' + (r * 2) + ' 0' +
               ' a ' + r + ' ' + r + ' 0 1 0 ' + (-r * 2) + ' 0';
      }

      var ringPath = svgCreate('path');
      var d = circlePath(cx, cy, outerRadius) + ' ' + circlePath(cx, cy, innerRadius);
      svgAttr(ringPath, { d: d, fill: color, 'fill-rule': 'evenodd', stroke: 'none' });
      svgAppend(parentGfx, ringPath);

      // teeth
      for (var i = 0; i < toothCount; i++) {
        var angle = (360 / toothCount) * i;
        var tooth = svgCreate('rect');
        var x = cx - toothWidth / 2;
        var y = cy - outerRadius - Math.round(toothHeight * 0.45);
        svgAttr(tooth, {
          x: x,
          y: y,
          width: toothWidth,
          height: toothHeight,
          fill: color,
          stroke: 'none',
          transform: 'rotate(' + angle + ' ' + cx + ' ' + cy + ')',
          rx: 2,
          ry: 2,
        });
        svgAppend(parentGfx, tooth);
      }

      // place name above the gear, centered, with dynamic offset to avoid overlap
      var labelHeight = labelOffset;
      var labelBox = { x: 0, y: 0, width: element.width, height: labelHeight };
      renderLabel(parentGfx, getSemantic(element).name, {
        box: labelBox,
        align: 'center-top',
        padding: 0,
        style: assign({ fill: 'black', fontSize: DEFAULT_TEXT_SIZE, fontWeight: 'bold' }, {}),
      });

      return ringPath;
    },       
  };

  function drawShape(parent, element) {
    const h = renderer(element.type);

    if (!h) {
      return BaseRenderer.prototype.drawShape.apply(this, [parent, element]);
    }
    return h(parent, element);
  }

  function drawConnection(parent, element) {
    const { type } = element;
    const h = handlers[type];

    if (!h) {
      return BaseRenderer.prototype.drawConnection.apply(this, [parent, element]);
    }
    return h(parent, element);
  }

  // eslint-disable-next-line no-unused-vars
  this.canRender = function (element) {
    return [ 'Event', 'Screen', 'Command', 'ReadModel', 'Processor', 'Connection'].includes(element.type);
  };

  this.drawShape = drawShape;
  this.drawConnection = drawConnection;
}

function getColor(element) {
  var bo = getSemantic(element);

  return element.color || bo.color;
}

inherits(Renderer, BaseRenderer);

Renderer.$inject = ['config.Renderer', 'eventBus', 'pathMap', 'styles', 'textRenderer', 'canvas'];
