import BaseSpec from './BaseSpec';
import Node from './style/Node';

export default class Element extends Node {
  constructor() {
    super();
    this.name = `${this.type}`;
    this.fields = [];
    this.description = '';
    this.metadata = {
      version: 1,
    };
  }
}

Element.prototype.type = 'Element';
