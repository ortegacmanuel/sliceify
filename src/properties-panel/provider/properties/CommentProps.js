import {
  isTextFieldEntryEdited,
} from '@bpmn-io/properties-panel';
import BaseTextArea from './BaseTextArea';

export default function CommentProps(props) {
  const {
    element,
  } = props;

  return [
    {
      id: 'comment',
      label: 'Comment',
      parameterKey: 'Comment',
      component: BaseTextArea,
      element,
      isEdited: isTextFieldEntryEdited,
    },
  ];
}
