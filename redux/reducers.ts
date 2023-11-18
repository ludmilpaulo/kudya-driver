import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";
import locationSlice from "./slices/locationSlice";
import driverLocationSlice from "./slices/driverLocationSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  location: locationSlice,
  driverLocation: driverLocationSlice,
});

export default rootReducer;
