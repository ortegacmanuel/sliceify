
import { assign } from 'min-dash';

import TextUtil from 'diagram-js/lib/util/Text';

const DEFAULT_FONT_SIZE = 12;
const LINE_HEIGHT_RATIO = 1.2;

export default function TextRenderer(config) {
  const defaultStyle = assign({
    fontFamily: 'Arial, sans-serif',
    fontSize: DEFAULT_FONT_SIZE,
    fontWeight: 'normal',
    lineHeight: LINE_HEIGHT_RATIO,
  }, (config && config.defaultStyle) || {});

  const textUtil = new TextUtil({
    style: defaultStyle,
  });

  /**
   * Create a layouted text element.
   *
   * @param {string} text
   * @param {Object} [options]
   *
   * @return {SVGElement} rendered text
   */
  this.createText = function (text, options) {
    return textUtil.createText(text, options || {});
  };

  /**
   * Get default text style.
   */
  this.getDefaultStyle = function () {
    return defaultStyle;
  };
}

TextRenderer.$inject = [
  'config.textRenderer',
];
