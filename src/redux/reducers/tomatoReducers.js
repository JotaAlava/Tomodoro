import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function tomatoReducer(state = initialState.tomatoes, action) {
  switch (action.type) {
    case types.CREATE_TOMATO:
      return [...state, { ...action.tomato }];
    default:
      return state;
  }
}
