import BaseSpec from './BaseSpec';

export default class Field extends BaseSpec {
  constructor() {
    super();
    this.name = `${this.type}`;
    this.required = true;
    this.description = '';
    this.defaultValue = '';
  }
}

Field.prototype.type = 'Field';