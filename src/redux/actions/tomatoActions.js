import * as types from "./actionTypes";

export function createTomato(tomato) {
  return { type: types.CREATE_TOMATO, tomato };
}
