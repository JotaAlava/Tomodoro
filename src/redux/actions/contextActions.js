import * as types from "./actionTypes";
// TODO: Fix contextService import
import * as contextService from "../../services/contextService";

export function updateContext(context) {
  return { type: types.CREATE_CONTEXT, context };
}

export function createContext(context) {
  return { type: types.CREATE_CONTEXT, context };
}

export function saveContextSuccess(context) {
  return { type: types.SAVE_CONTEXT_SUCCESS, context };
}

export function loadContextsSuccess(contexts) {
  return { type: types.LOAD_CONTEXTS_SUCCESS, contexts };
}

export function loadContexts() {
  return function (dispatch) {
    return contextService.contextService
      .getContexts()
      .then((contexts) => {
        dispatch(loadContextsSuccess(contexts));
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function saveContext(context) {
  return function (dispatch) {
    return contextService.contextService
      .saveContext(context)
      .then((savedCtx) => {
        dispatch(saveContextSuccess(savedCtx));
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function loadContextsById(id) {
  return { type: types.LOAD_CONTEXT_BY_ID, id };
}
