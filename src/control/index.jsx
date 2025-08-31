import { domify } from 'min-dom';
import { h, Fragment, render } from '@bpmn-io/properties-panel/preact';

import ImportControl from './ImportControl';
import ExportControl from './ExportControl';

export default function (editor) {
  const container = domify('<div class="io-control-list-container"/>');
  const canvas = editor.get('canvas');
  canvas._container.appendChild(container);

  render(
    <div style={{ position: 'fixed', bottom: '10px', left: '20px' }}>
      <ImportControl editor={editor} />
      <ExportControl editor={editor} />
    </div>,
    container,
  );
}
