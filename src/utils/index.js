import { forEach, reduce } from 'min-dash';

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

export function getProperties(businessObject, propertyNames) {
  return reduce(
    propertyNames,
    (result, key) => {
      result[key] = businessObject[key];
      return result;
    },
    {}
  );
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
  const type = element?.businessObject?.type ?? element?.type ?? element;

  if (target === 'Event') return type === 'Event';
  return type === target;
}
