import {
  isTextFieldEntryEdited,
} from '@bpmn-io/properties-panel';

import BaseText from './BaseText';

export default function NameProps(props) {
  const {
    element,
  } = props;

  return [
    {
      id: 'name',
      label: 'Name',
      parameterKey: 'name',
      component: BaseText,
      element,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}
