import BaseSpec from './BaseSpec';

export default class Element extends BaseSpec {
  constructor() {
    super();
    this.Type = 'Element';
    this.Name = `${this.Type}`;
    this.Fields = [];
    this.Description = '';
    this.Metadata = {
      version: 1
    };
  }
}