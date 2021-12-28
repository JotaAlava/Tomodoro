import { combineReducers } from "redux";
import tomatoReducer from "./tomatoReducers";

// This is where state gets combine into what gets passed as input to "mapStateToProps"
const rootReducer = combineReducers({
  tomatoes: tomatoReducer,
});

export default rootReducer;
