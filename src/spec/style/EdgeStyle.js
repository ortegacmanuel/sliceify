import BaseSpec from '../BaseSpec';

export default class EdgeStyle extends BaseSpec {
  /**
   * @type {djs.model.Base}
   */
  source;

  /**
   * @type {djs.model.Base}
   */
  target;

  /**
   * @typedef {{original: WayPoint, x: number, y: number}} WayPoint
   */
  /**
   * @type {[WayPoint]}
   */
  waypoints = [];
}

EdgeStyle.prototype.Type = 'Edge';