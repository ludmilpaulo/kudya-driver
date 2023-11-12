import React, { useEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { XCircleIcon } from "react-native-heroicons/outline";
import * as Progress from "react-native-progress";
import MapView, { Marker } from "react-native-maps";
import tailwind from "tailwind-react-native-classnames";
import { apiUrl, userLocation } from "../configs/variable";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/authSlice";
import ChatComponent from "../components/ChatComponent";

type Props = {};

const Delivery = (props: Props) => {
  const navigation = useNavigation<any>();

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const mapRef = useRef(null);

  const route = useRoute<any>(); // Use useRoute to access the route prop

  const { order, customerData } = route.params || {};
  const user = useSelector(selectUser);
  const isDriver = !user?.is_customer;

  let userData = user;

  const handlePhoneCall = () => {
    const phoneNumber = customerData.phone;

    // Check if the device supports the `tel` scheme
    Linking.canOpenURL(`tel:${phoneNumber}`).then((supported) => {
      if (supported) {
        // Open the phone dialer with the given phone number
        Linking.openURL(`tel:${phoneNumber}`);
      } else {
        console.error(`Phone calls are not supported on this device`);
      }
    });
  };

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const location = await userLocation();

        // Check if location is defined before sending the request
        if (location) {
          setLatitude(location.latitude);
          setLongitude(location.longitude);

          // Send location to your API
          const response = await fetch(
            "https://www.sunshinedeliver.com/api/driver/location/update/",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                access_token: user?.token,
                location: location,
              }),
            },
          );

          // Handle the response
          if (response.ok) {
            const data = await response.json();
            // Check the data and take appropriate actions
            console.log("Location update successful:", data);
          } else {
            // Handle error scenarios
            console.error(
              "Location update failed. HTTP status:",
              response.status,
            );
            const errorData = await response.json(); // if the server returns error details
            console.error("Error details:", errorData);
          }
        } else {
          console.error("User location is undefined.");
        }
      } catch (error) {
        console.error("Error fetching user location:", error);
      }
    };

    // Fetch user location immediately
    fetchUserLocation();

    // Set up interval to fetch user location every 2 seconds
    const intervalId = setInterval(() => {
      fetchUserLocation();
    }, 3000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={tailwind`bg-blue-500 flex-1`}>
      <SafeAreaView style={tailwind`z-50`}>
        <View style={tailwind`flex-row items-center justify-between p-5`}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <XCircleIcon color="#004AAD" size={30} />
          </TouchableOpacity>
          <Text style={tailwind`text-lg font-light text-white`}>
            Order Help
          </Text>
        </View>

        <View
          style={tailwind`z-50 p-6 mx-5 my-2 bg-white rounded-md shadow-md`}
        >
          <View style={tailwind`flex-row justify-between`}>
            <View>
              <Text style={tailwind`text-lg text-gray-400`}>
                {customerData.name}
              </Text>
              <Text style={tailwind`text-4xl font-bold`}>45-55 Minutes</Text>
            </View>
            <Image
              source={{ uri: `${apiUrl}${customerData.avatar}` || "" }}
              style={tailwind`w-20 h-20`}
            />
          </View>

          <Progress.Bar size={30} color="#004AAD" indeterminate={true} />

          <Text style={tailwind`mt-3 text-gray-500`}>{order.address}</Text>
        </View>
      </SafeAreaView>

      <MapView
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        style={tailwind`z-0 flex-1 -mt-10`}
        ref={mapRef}
      >
        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
          title={customerData.name}
          identifier="region"
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <Image
            source={{ uri: `${apiUrl}${customerData.avatar}` || "" }}
            style={tailwind`w-8 h-8 p-4 ml-5 bg-gray-300 rounded-full`}
          />
        </Marker>
      </MapView>

      <SafeAreaView style={tailwind`flex-row items-center ml-0 bg-white h-28`}>
        <ChatComponent
          user="driver"
          userData={userData}
          accessToken={user?.token}
          orderId={order.id}
        />

        <View style={tailwind`flex-1`}>
          <Text style={tailwind`text-lg`}>{order.customerData.name}</Text>
          <Text style={tailwind`text-gray-400`}>
            {order.customerData.phone}
          </Text>
        </View>

        <Text
          onPress={handlePhoneCall}
          style={tailwind`text-blue-500 text-lg mr-5 font-bold`}
        >
          Ligar
        </Text>
      </SafeAreaView>
    </View>
  );
};

export default Delivery;
