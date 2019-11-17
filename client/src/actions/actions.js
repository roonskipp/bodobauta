/*
 * action types
 */

export const TEXTACTION = 'TEXTACTION';
export const NUMBERACTION = 'NUMBERACTION';
export const BOOLEANACTION = 'BOOLEANACTION';

/*
 * action creators
 */

export function changeText(text) {
  return { type: TEXTACTION, text }
}

export function changeNumber(number) {
  return { type: NUMBERACTION, number }
}

export function changeBoolean(boolean) {
  return { type: BOOLEANACTION, boolean }
}