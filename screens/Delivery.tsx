import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Linking,
  ActivityIndicator,
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
  const ref = useRef<MapView | null>(null);

  const [userLatitude, setUserLatitude] = useState(0);
  const [userLongitude, setUserLongitude] = useState(0);

  const [loading, setLoading] = useState<boolean>(true);

  const mapRef = useRef(null);

  const route = useRoute<any>(); // Use useRoute to access the route prop

  const { order, customerData } = route.params || {};
  const user = useSelector(selectUser);
  const isDriver = !user?.is_customer;

  console.log(order.address)

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
          setUserLatitude(location.latitude);
          setUserLongitude(location.longitude);

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


  const completeOrder = async() => {
   

    let response = await fetch('https://www.sunshinedeliver.com/api/driver/order/complete/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: user?.token,
            order_id : order.id
          })
      })
       .then((response) => response.json())
        .then((responseJson) => {
          console.log("JLO", responseJson)
          setTimeout(() => {
          navigation.navigate("SuccessScreen");
        }, 1000)
      })
        .catch((error) => {
          console.error(error);
        });

}
// Extract latitude and longitude from the order.address string
const match = order.address ? order.address.match(/Latitude: (.*), Longitude: (.*)/) : null;
const latitude = match ? parseFloat(match[1]) : 0;
const longitude = match ? parseFloat(match[2]) : 0;

const customerCoordinates = useMemo(() => {
  return {
    latitude,
    longitude,
  };
}, [order.address]);

useEffect(() => {
  if (customerCoordinates) {
    ref.current?.animateCamera({ center: customerCoordinates, zoom: 10 });
    setLoading(false);
  }
}, [customerCoordinates]);

let center = {
  latitude: customerCoordinates ? customerCoordinates.latitude : 0,
  longitude: customerCoordinates ? customerCoordinates.longitude : 0,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
};


console.log(center)


  return (
    <View style={tailwind`bg-blue-500 flex-1`}>
      <SafeAreaView style={tailwind`z-50`}>
        <View style={tailwind`flex-row items-center justify-between p-5`}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <XCircleIcon color="#004AAD" size={30} />
          </TouchableOpacity>

          <Text 
          onPress={completeOrder}
          style={tailwind`text-lg font-bold text-white`}>
            Concluir o Pedido
          </Text>
        </View>

        <View
          style={tailwind`z-50 p-6 mx-5 my-2 bg-white rounded-md shadow-md`}
        >
          <View style={tailwind`flex-row justify-between`}>
            <View>
              <Text style={tailwind`text-lg text-gray-400`}>
               levar para  {customerData.name}
              </Text>
              <Text style={tailwind`text-4xl font-bold`}>45-55 Minutes</Text>
            </View>
            <Image
              source={{ uri: `${apiUrl}${customerData.avatar}` || "" }}
              style={tailwind`w-20 h-20`}
            />
          </View>

          <Progress.Bar color="#004AAD" indeterminate={true} 
          />

          <Text style={tailwind`mt-3 text-gray-500`}>{order.address}</Text>
        </View>
      </SafeAreaView>
      {loading ? (
        <ActivityIndicator size="large" color="#004AAD" />
      ) : center ? (
        <View style={[tailwind`bg-blue-300 relative`, { height: 350 }]}>
        <MapView
          ref={ref}
          region={{
            ...center
          }}
          style={tailwind`h-full w-full z-10`}
        >
          <Marker
            coordinate={{
              latitude: customerCoordinates ? customerCoordinates?.latitude : 0,
              longitude: customerCoordinates ? customerCoordinates?.longitude : 0,
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
        </View>
      ) : null}

      <SafeAreaView style={tailwind`flex-row items-center ml-0 bg-white`}>
        

        <View style={tailwind`flex-1`}>
        <Text style={tailwind`text-lg`}>{order?.customerData?.name}</Text>

          <ChatComponent
          user="driver"
          userData={userData}
          accessToken={user?.token}
          orderId={order.id}
        />
        </View>

        <Text
          onPress={handlePhoneCall}
          style={tailwind`text-blue-500 text-lg mr-2 font-bold`}
        >
          Ligar
        </Text>
      </SafeAreaView>
    </View>
  );
};

export default Delivery;
