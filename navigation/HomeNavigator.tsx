import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Delivery from "../screens/Delivery";
import RestaurantMap from "../screens/RestaurantMap";
import SuccessScreen from "../screens/SuccessScreen";
import OrderCartScreen from "../screens/OrderCartScreen";
import MainTabNavigator from "./MainTabNavigator";
import UserProfile from "../screens/UserProfile";
import OrderHistory from "../screens/OrderHistory";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../redux/slices/authSlice";

const Stack = createStackNavigator();

export default function HomeNavigator() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeScreen" component={MainTabNavigator} />
      <Stack.Screen name="RestaurantMap" component={RestaurantMap} />
      <Stack.Screen name="OrderCartScreen" component={OrderCartScreen} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
     
      <Stack.Screen name="OrderHistory" component={OrderHistory} />
      <Stack.Screen name="Delivery" component={Delivery} />
    </Stack.Navigator>
  );
}
