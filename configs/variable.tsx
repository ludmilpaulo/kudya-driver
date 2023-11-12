import axios from "axios";
import * as Device from "expo-device";
import * as Location from "expo-location";
import { useState } from "react";
import { Platform } from "react-native";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/authSlice";



export const googleAPi = "AIzaSyDn1X_BlFj-57ydasP6uZK_X_WTERNJb78";

const apiUrl = "https://www.sunshinedeliver.com";

export const fetchData = async (endpoint: string) => {
  try {
    const response = await axios.get(apiUrl + endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getOrder = async (endpoint: string) => {
  try {
    const response = await axios.get(apiUrl + endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};





export const userLocation = async () => {
  if (Platform.OS === "android" && !Device.isDevice) {
    alert(
      "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
    );
    return;
  }
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    alert("Permission to access location was denied");
    return;
  }

  let location = await Location.getCurrentPositionAsync({});
  return location.coords;
  //setLatitude(location.coords.latitude);

};


