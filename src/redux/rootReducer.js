//take all the slices that we are creating (combined all the reducers)
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import appReducer from "./slices/app";
import UserReducer from "./slices/user";

//slices

//create root configuration (how data store and how read out data from store)
const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  // whitelist:[],
  // blacklist:[]
};

//create combine reducer
const rootReducer = combineReducers({
  app: appReducer,
  userData: UserReducer,
});

export { rootPersistConfig, rootReducer };
