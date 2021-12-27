import { combineReducers } from "redux";
import tomatoReducer from "./tomatoReducers";

const rootReducer = combineReducers({
  tomato: tomatoReducer,
});

export default rootReducer;
