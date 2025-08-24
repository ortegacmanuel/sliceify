import Renderer from './Renderer';
import TextRenderer from './TextRenderer';
import PathMap from './PathMap';

export default {
  __init__: ['renderer'],
  renderer: ['type', Renderer],
  textRenderer: ['type', TextRenderer],
  pathMap: ['type', PathMap],
};