import BaseSpec from '../BaseSpec';

export default class NodeStyle extends BaseSpec {
  /**
   * @typedef {{x: number, y: number, width: number, height: number}} Bounds
   * @type {Bounds}
   */
  bounds = {};
}

NodeStyle.prototype.Type = 'Node';
