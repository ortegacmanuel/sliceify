import inherits from 'inherits-browser';

import { assign, isObject } from 'min-dash';

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  classes as svgClasses,
} from 'tiny-svg';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

const BLACK = 'hsl(225, 10%, 15%)';
const DEFAULT_FILL_OPACITY = 0.95;
const DEFAULT_TEXT_SIZE = 16;
const DEFAULT_FONT_WEIGHT = 'normal';

// helper functions //////////////////////

function getSemantic(element) {
  return element.businessObject;
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

  const defaultFillColor = (config && config.defaultFillColor) || 'white';
  const defaultStrokeColor = (config && config.defaultStrokeColor) || BLACK;

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

      return rect;
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
    return [ 'Event'].includes(element.type);
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
