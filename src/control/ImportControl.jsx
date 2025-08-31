import { h, Fragment, render } from '@bpmn-io/properties-panel/preact';

import React from '@bpmn-io/properties-panel/preact/compat';

export default function ImportControl(props) {
  const { editor } = props;
  const inputRef = React.useRef(null);

  function onOpenFileChange(e) {
    const localFile = e.target.files[0];
    if (localFile) {
      const reader = new FileReader();
      let data = '';
      reader.readAsText(localFile);
      reader.onload = (event) => {
        data = JSON.parse(event.target.result);
        editor.import(data);
      };
    }
  }

  return (
    <ul className="io-control io-control-list">
      <li>
        <input ref={inputRef} onChange={onOpenFileChange} id="open-file" type="file" accept=".json," style={{ display: 'none' }} />
        <button
          id="import-json"
          type="button"
          title="Import a state machine definition from local file system"
          onClick={() => inputRef.current.click()}
        >
          <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="1em">
            <path
              d="M481.882353 240.941176L363.941647 120.470588H0v903.529412h1024V240.941176H481.882353zM338.642824 180.705882L456.583529 301.176471H963.764706v122.096941L60.235294 421.707294V180.705882h278.40753zM60.235294 963.764706V481.942588l903.529412 1.566118V963.764706H60.235294z"
            />
          </svg>
        </button>
      </li>
    </ul>
  );
}
