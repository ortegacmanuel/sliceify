import Event from '../spec/Event';
import EventModel from '../spec/EventModel';

export default function EMFactory() {
  const typeToSpec = new Map();
  typeToSpec.set('Event', Event);
  typeToSpec.set('EventModel', EventModel);
  this.typeToSpec = typeToSpec;
}

EMFactory.prototype.create = function (type) {
  const Spec = this.typeToSpec.get(type);
  return new Spec();
};

EMFactory.prototype.getDefaultSize = function (semantic) {
  if (semantic.DEFAULT_SIZE) {
    return semantic.DEFAULT_SIZE;
  }

  return {
    width: 100,
    height: 80,
  };
};

EMFactory.prototype.getDefaultColor = function (semantic) {
  if (semantic.DEFAULT_COLOR) {
    return semantic.DEFAULT_COLOR;
  }

  return 'black';
};
