import Editor from './Editor.js';
import './style.css';

new Editor({
  container: document.querySelector('#canvas'),
  propertiesPanel: { parent: '#properties' },
  // Add properties panel as additional modules
  additionalModules: [],
});
