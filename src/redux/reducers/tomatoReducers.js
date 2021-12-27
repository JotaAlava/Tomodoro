import { actions } from "../actions/tomatoActions";

export default function tomatoReducer(state = [], action) {
  switch (action.type) {
    case actions.CREATETOMATO:
      return [...state, { ...action.tomato }];
    default:
      return state;
  }
}
