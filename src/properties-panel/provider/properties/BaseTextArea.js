import {
  TextAreaEntry,
} from '@bpmn-io/properties-panel';

import { useService } from '../../../utils';

export default function BaseTextArea(props) {
  const {
    element,
    id,
    label,
    parameterKey,
    ...additionalProps
  } = props;

  const debounce = useService('debounceInput');
  const modeling = useService('modeling');

  const options = {
    element,
    id,
    label,
    ...additionalProps,
    debounce,
    getValue: (e) => {
      if (e.businessObject) {
        return e.businessObject[parameterKey];
      }
      return null;
    },
    setValue: (value) => {
      modeling.updateProperties(element, { [parameterKey]: value });
    },
  };

  return TextAreaEntry(options);
}
