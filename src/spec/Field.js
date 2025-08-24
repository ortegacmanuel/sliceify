import BaseSpec from './BaseSpec';

export default class Field extends BaseSpec {
  constructor() {
    super();
    this.Type = 'Field';
    this.Name = `${this.Type}`;
    this.Required = true;
    this.Description = '';
    this.DefaultValue = '';
  }
}