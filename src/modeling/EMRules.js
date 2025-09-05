import inherits from 'inherits-browser';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';
import { getOrientation } from 'diagram-js/lib/layout/LayoutUtil';
import { is } from '../utils';

export default function EMRules(injector) {
  injector.invoke(RuleProvider, this);
}

inherits(EMRules, RuleProvider);

EMRules.$inject = ['injector'];

function canConnect(source, target) {
  if (!source || !target) {
    return null;
  }

  if (target.parent !== source.parent || source === target) {
    return false;
  }

  return { type: 'Connection' };
}

function canCreate(shapes, target) {
  return true;
}

function canAttach(shapes, target, position) {
  return true;
}

function canMove(shapes, target, position) {
  return true;
}

EMRules.prototype.init = function () {
  this.addRule('connection.create', (context) => {
    const { source } = context;
    const { target } = context;

    return canConnect(source, target);
  });

  this.addRule('connection.reconnect', (context) => {
    const { source } = context;
    const { target } = context;

    return canConnect(source, target);
  });
};