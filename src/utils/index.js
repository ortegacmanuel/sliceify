import { forEach, reduce } from 'min-dash';
import { useContext } from '@bpmn-io/properties-panel/preact/hooks';
import PropertiesPanelContext from '../properties-panel/PropertiesPanelContext';

/**
 * Returns a random generated string for initial decision definition id.
 * @returns {string}
 */
export function randomString() {
  // noinspection SpellCheckingInspection
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  const maxPos = chars.length;
  let str = '';
  for (let i = 0; i < 7; i++) {
    str += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}

export function useService(type, strict) {
  const { getService } = useContext(PropertiesPanelContext);

  return getService(type, strict);
}

export function getProperties(businessObject, propertyNames) {
  return reduce(propertyNames, (result, key) => {
    result[key] = businessObject[key];
    return result;
  }, {});
}

export function setProperties(businessObject, properties, override) {
  if (override) {
    Object.keys(businessObject)
      .filter((key) => key !== 'style')
      .forEach((key) => delete businessObject[key]);
  }
  forEach(properties, (value, key) => {
    businessObject[key] = value;
  });
}

export function is(element, target) {
  const type = element?.businessObject?.Type || element?.Type || element;

  if (target === 'Event') {
    return type === 'StartState' || type === 'CompensationTrigger' || type === 'Catch' || type === 'Fail' || type === 'Succeed';
  }

  if (target === 'End') {
    return type === 'Fail' || type === 'Succeed';
  }

  if (target === 'Task') {
    return type === 'ServiceTask' || type === 'ScriptTask' || type === 'SubStateMachine';
  }

  if (target === 'Connection') {
    return type === 'Transition' || type === 'ChoiceEntry' || type === 'ExceptionMatch' || type === 'Compensation';
  }

  return type === target;
}

