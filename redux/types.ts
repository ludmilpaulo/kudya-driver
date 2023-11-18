import { AuthState } from "./slices/authSlice"; // Import your specific slice state types
import { LocationState } from "./slices/locationSlice";
import { DriverLocationState } from "./slices/driverLocationSlice";

export interface RootState {
  auth: AuthState;
  location: LocationState;
  driverLocation: DriverLocationState;
}
