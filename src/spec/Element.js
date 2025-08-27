import BaseSpec from './BaseSpec';

export default class Element extends BaseSpec {
  constructor() {
    super();
    this.name = `${this.type}`;
    this.fields = [];
    this.description = '';
    this.metadata = {
      version: 1
    };
  }
}

Element.prototype.type = 'Element';