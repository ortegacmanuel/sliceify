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

(() => {
  const root = document.querySelector('#root');
  const properties = document.querySelector('#properties');
  if (!root || !properties) return;

  const btn = document.createElement('button');
  btn.id = 'properties-toggle';
  btn.title = 'Toggle properties panel';
  btn.textContent = '⟘';
  btn.style.position = 'absolute';
  btn.style.top = '10px';
  btn.style.right = '10px';
  btn.style.zIndex = '1000';
  btn.style.padding = '6px 10px';
  btn.style.border = '1px solid #ccc';
  btn.style.borderRadius = '4px';
  btn.style.background = '#fff';
  btn.style.cursor = 'pointer';

  const canvas = document.querySelector('#canvas');
  if (canvas && canvas.appendChild) canvas.appendChild(btn);

  function setCollapsed(collapsed) {
    if (collapsed) {
      // store current width and hide
      const w = properties.offsetWidth || 400;
      properties.dataset.prevWidth = String(w);
      properties.style.display = 'none';
      btn.textContent = '⟘◀';
    } else {
      properties.style.display = '';
      const prev = parseInt(properties.dataset.prevWidth || '400', 10);
      properties.style.width = prev + 'px';
      btn.textContent = '⟘▶';
    }
  }

  // initialize expanded
  setCollapsed(false);

  let collapsed = false;
  btn.addEventListener('click', () => {
    collapsed = !collapsed;
    setCollapsed(collapsed);
    // trigger canvas resize so diagram reflows
    try { editor.get('canvas').resized(); } catch (e) {}
  });
})();
