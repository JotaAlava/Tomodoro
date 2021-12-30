import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function contextReducer(state = initialState.contexts, action) {
  switch (action.type) {
    case types.LOAD_CONTEXTS_SUCCESS:
      return action.contexts;
    case types.SAVE_CONTEXT_SUCCESS:
      return state.map((context) =>
        context.tomatoContextId === context.tomatoContextId
          ? action.context
          : context
      );
    default:
      return state;
  }
}
