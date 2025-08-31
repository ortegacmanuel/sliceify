import PropertiesPanel from './properties-panel';
import PropertiesProvider from './properties-panel/provider';
import Editor from './Editor.js';
import control from './control';
import { randomString } from './utils';
import './style.css';

const editor = new Editor({
  container: document.querySelector('#canvas'),
  propertiesPanel: { parent: '#properties' },
  // Add properties panel as additional modules
  additionalModules: [
    PropertiesPanel,
    PropertiesProvider,
  ],
});

control(editor);

editor.import({
  name: `EventModel-${randomString()}`,
  comment: 'This event model is modeled by designer tools.',
  version: '0.0.1',
  style: {
    bounds: {
      x: 200,
      y: 200,
      width: 36,
      height: 36,
    },
  },
});

window.editor = editor;
window.di = (cb) => editor.invoke(cb);
