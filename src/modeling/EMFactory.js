import Event from '../spec/Event';
import EventModel from '../spec/EventModel';
import Timeline from '../spec/Timeline';
import Lane from '../spec/Lane';
import Slice from '../spec/Slice';
import SlicePanel from '../spec/SlicePanel';
import Screen from '../spec/Screen';
import Command from '../spec/Command';

export default function EMFactory() {
  const typeToSpec = new Map();
  typeToSpec.set('Event', Event);
  typeToSpec.set('EventModel', EventModel);
  typeToSpec.set('Timeline', Timeline);
  typeToSpec.set('Lane', Lane);
  typeToSpec.set('Slice', Slice);
  typeToSpec.set('SlicePanel', SlicePanel);
  typeToSpec.set('Screen', Screen);
  typeToSpec.set('Command', Command);
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
