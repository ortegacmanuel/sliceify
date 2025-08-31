import {
  TextAreaEntry,
  isTextFieldEntryEdited, CollapsibleEntry,
} from '@bpmn-io/properties-panel';

import { useService } from '../../../utils';

function Style(props) {
  const { element } = props;

  const debounce = useService('debounceInput');

  const options = {
    component: TextAreaEntry,
    element,
    id: 'style',
    debounce,
    autoResize: true,
    disabled: true,
    getValue: (e) => {
      return JSON.stringify(e.businessObject.style, null, 2);
    },
  };

  return CollapsibleEntry({
    id: 'collapsible-props',
    label: 'Style',
    element,
    entries: [options],
  });
}

export default function StateProps(props) {
  const {
    element,
  } = props;

  return [
    {
      component: Style,
      element,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}
