import { isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

import BaseText from './BaseText';

export default function VersionProps(props) {
  const {
    element,
  } = props;

  return [
    {
      id: 'version',
      label: 'Version',
      parameterKey: 'Version',
      component: BaseText,
      element,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}
