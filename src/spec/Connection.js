import Edge from './style/Edge';

export default class Connection extends Edge {
  exportJson() {
    const json = super.exportJson();
    json.Type = this.Type;
    return json;
  }
}

Connection.prototype.THUMBNAIL_CLASS = 'bpmn-icon-connection';

Connection.prototype.Type = 'Connection';