import {
  TextAreaEntry,
  isTextFieldEntryEdited, CollapsibleEntry,
} from '@bpmn-io/properties-panel';

import { assign } from 'min-dash';
import { useService } from '../../../utils';

function State(props) {
  const { element } = props;

  const debounce = useService('debounceInput');
  const modeling = useService('modeling');

  const options = {
    component: TextAreaEntry,
    element,
    id: 'props',
    // label: 'Props',
    debounce,
    autoResize: true,
    getValue: (e) => {
      const value = assign({}, e.businessObject);
      // Exclude style
      delete value.style;
      // Exclude Catch for Task
      delete value.Catch;
      return JSON.stringify(value, null, 2);
    },
    validate: (value) => {
      try {
        JSON.parse(value);
      } catch (e) {
        return e.message;
      }

      return null;
    },
    setValue: (value, newValidationError) => {
      try {
        JSON.parse(value);
      } catch (e) {
        newValidationError = e;
      }
      if (newValidationError) {
        return;
      }
      const businessObject = JSON.parse(value);
      modeling.updateProperties(element, businessObject, true);
    },
  };

  return CollapsibleEntry({
    id: 'collapsible-props',
    label: 'Props',
    element,
    entries: [options],
    open: true,
  });
}

export default function StateProps(props) {
  const {
    element,
  } = props;

  return [
    {
      component: State,
      element,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}
