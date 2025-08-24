import { assign } from 'min-dash';

import inherits from 'inherits-browser';

import BaseElementFactory from 'diagram-js/lib/core/ElementFactory';

/**
 * A drd-aware factory for diagram-js shapes
 */
export default function ElementFactory(EMFactory) {
  BaseElementFactory.call(this);

  this.EMFactory = EMFactory;
}

inherits(ElementFactory, BaseElementFactory);

ElementFactory.$inject = ['EMFactory'];

ElementFactory.prototype.baseCreate = BaseElementFactory.prototype.create;

ElementFactory.prototype.create = function (elementType, attrs) {
  const { EMFactory } = this;

  attrs = attrs || {};

  let { businessObject } = attrs;

  if (!businessObject) {
    if (!attrs.type) {
      throw new Error('no shape type specified');
    }

    businessObject = EMFactory.create(attrs.type);
  }

  const size = EMFactory.getDefaultSize(businessObject);
  const color = EMFactory.getDefaultColor(businessObject);
  const name = EMFactory.getDefaultName(businessObject);

  businessObject.color = color;
  businessObject.name = name;

  attrs = assign({ businessObject }, size, attrs);

  return this.baseCreate(elementType, attrs);
};