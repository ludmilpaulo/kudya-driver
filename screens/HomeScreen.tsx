import React, { useEffect, useState } from "react";
import {
  ScrollView,
  ActivityIndicator,
  Vibration,
} from "react-native";
import HeaderTabs from "../components/HeaderTabs";
import Screen from "../components/Screen";

import Geocoder from "react-native-geocoding";

import { useNavigation } from "@react-navigation/native";



import tailwind from "tailwind-react-native-classnames";


import * as Notifications from "expo-notifications";

import colors from "../configs/colors";

import OrdersItem from "../components/OrdersItem";
import { selectUser } from "../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { googleAPi } from "../configs/variable";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

type MyType = {

    latitude: number;
    longitude: number;
  };
 
const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Delivery");
  const [data, setData] = useState<any>([]);
 
  const [vibrar, setVibrar] = useState(undefined);

  const user = useSelector(selectUser);

  const DURATION = 2000;

  const getUserData = async () => {
    try {
      let response = await fetch(
        "https://www.sunshinedeliver.com/api/driver/profile/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user?.token,
          }),
        }
      )
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.customer_detais.avatar == null) {
            alert("Por favor, preencha seus dados");
            navigation.navigate("UserProfile");
          }
        });
    } catch (e) {
      alert(e);
    }
  };

  const getOrders = async () => {
    try {
      const response = await fetch(
        "https://www.sunshinedeliver.com/api/driver/orders/ready/"
      );
      const json = await response.json();
      setVibrar(json.orders);
      setData(json.orders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  const orderNotification = async () => {
    try {
      if ( (vibrar as unknown as any[]).length == 0) {
        setLoading(false);
      } else {
        Vibration.vibrate(DURATION);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const resData = Object.keys(data).reduce((result, key) => {
    return result.concat(data[key].restaurant);
  }, []);

  let resAd = resData.map(({ address }) => {
    return `${address}`.toString();
  });
  let restAddress = resAd.toString();

  const customerData = Object.keys(data).reduce((result, key) => {
    return result.concat(data[key].customer);
  }, []);

  const orderData = Object.keys(data).reduce((result, key) => {
    return result.concat(data[key].order_details);
  }, []);

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getOrders();
      getAddress();
      orderNotification();
    }, 2000);
    return () => {
      // clears timeout before running the new effect
      clearTimeout(timeout);
    };
  }, [data]);

  // const [ restAddress, setResAddress] = useState();
  const [restlongitude, setRestLongitude] = useState(0);
  const [restlatitude, setRestLatitude] = useState(0);

  const coordinates : MyType = {
    latitude: restlatitude,
    longitude: restlongitude,
  };

  // With more options
  // Geocoder.init("xxxxxxxxxxxxxxxxxxxxxxxxx", {language : "en"}); // set the language

  const getAddress = async () => {
  
    // Initialize the module (needs to be done only once)
    Geocoder.init(googleAPi); // use a valid API key

    try {
      // Search by address
      Geocoder.from(restAddress)
        .then((json) => {
          let location = json.results[0].geometry.location;
          setRestLongitude(location.lng);
          setRestLatitude(location.lat);
        })
        .catch((error) => console.warn(error));
    } catch (e) {
      alert(e);
    }
  };

  return (
    <Screen style={tailwind`bg-white flex-1`}>
      <HeaderTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <ScrollView style={tailwind`flex-1`} showsVerticalScrollIndicator={false}>
        {loading && (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={tailwind`mt-2 mb-6`}
          />
        )}
        <OrdersItem
          resData={resData}
          coordinates={coordinates}
          client={customerData}
          order={orderData}
          data={data}
        />
      </ScrollView>
    </Screen>
  );
};

export default HomeScreen;
