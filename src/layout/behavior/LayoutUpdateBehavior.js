import { assign } from 'min-dash';

import inherits from 'inherits-browser';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

export default function LayoutUpdateBehavior(injector) {
  injector.invoke(CommandInterceptor, this);
  const self = this;

  function updateBounds(context) {
    const { shape } = context;
    self.updateBounds(shape);
  }

  this.executed(['shape.create', 'shape.move', 'shape.resize'], updateBounds, true);
  this.reverted(['shape.create', 'shape.move', 'shape.resize'], updateBounds, true);

  function updateConnectionWaypoints(context) {
    self.updateConnectionWaypoints(context);
  }

  this.executed([
    'connection.create',
    'connection.layout',
    'connection.move',
    'connection.updateWaypoints',
  ], updateConnectionWaypoints, true);

  this.reverted([
    'connection.create',
    'connection.layout',
    'connection.move',
    'connection.updateWaypoints',
  ], updateConnectionWaypoints, true);

  function updateConnectionSourceTarget(context) {
    self.updateConnectionSourceTarget(context);
  }

  this.executed(['connection.create', 'connection.reconnect'], updateConnectionSourceTarget, true);
  this.reverted(['connection.create', 'connection.reconnect'], updateConnectionSourceTarget, true);
}

inherits(LayoutUpdateBehavior, CommandInterceptor);

LayoutUpdateBehavior.$inject = ['injector'];

LayoutUpdateBehavior.prototype.updateBounds = function (shape) {
  const { businessObject } = shape;
  businessObject.style = businessObject.style || {};
  businessObject.style.bounds = businessObject.style.bounds || {};
  const { bounds } = businessObject.style;

  // update bounds
  assign(bounds, {
    x: shape.x,
    y: shape.y,
    width: shape.width,
    height: shape.height,
  });
};

LayoutUpdateBehavior.prototype.updateConnectionWaypoints = function (context) {
  const { connection } = context;
  const { businessObject } = connection;
  businessObject.style = businessObject.style || {};
  businessObject.style.waypoints = businessObject.style.waypoints || [];
  const { waypoints } = businessObject.style;

  assign(waypoints, connection.waypoints);
};

LayoutUpdateBehavior.prototype.updateConnectionSourceTarget = function (context) {
  const { connection } = context;
  const { businessObject } = connection;
  businessObject.style = businessObject.style || {};
  const { source, newSource, target, newTarget } = context;

  businessObject.style.source = newSource || source;
  businessObject.style.target = newTarget || target;
};