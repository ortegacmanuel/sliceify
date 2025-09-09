import { Group } from '@bpmn-io/properties-panel';

import NameProps from './properties/NameProps';
import CommentProps from './properties/CommentProps';
import VersionProps from './properties/VersionProps';
import StateProps from './properties/StateProps';
import StyleProps from './properties/StyleProps';
import FieldsProps from './properties/FieldsProps';
import { is } from '../../utils';

function GeneralGroup(element) {
  const entries = [
    ...NameProps({ element }),
    ...CommentProps({ element }),
    ...FieldsProps({ element }),
  ];

  if (is(element, 'StateMachine')) {
    entries.push(...VersionProps({ element }));
  }

  if (is(element, 'Connection') || is(element, 'StartState') || is(element, 'Catch')) {
    return null;
  }

  return {
    id: 'general',
    label: 'General',
    entries,
    component: Group,
  };
}

function JsonGroup(element) {
  const entries = [
    ...StateProps({ element }),
    ...StyleProps({ element }),
  ];

  if (is(element, 'Transition') || is(element, 'Compensation') || is(element, 'StartState') || is(element, 'Catch')) {
    entries.splice(0, 1);
  }

  return {
    id: 'json',
    label: 'Json Props',
    entries,
    shouldOpen: true,
    component: Group,
  };
}

function getGroups(element) {
  const groups = [
    GeneralGroup(element),
    JsonGroup(element),
  ];

  // contract: if a group returns null, it should not be displayed at all
  return groups.filter((group) => group !== null);
}

export default class PropertiesProvider {
  constructor(propertiesPanel) {
    propertiesPanel.registerProvider(this);
  }

  getGroups(element) {
    return (groups) => {
      return [
        ...groups,
        ...getGroups(element),
      ];
    };
  }
}

PropertiesProvider.$inject = ['propertiesPanel'];