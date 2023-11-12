import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Image, SafeAreaView, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import tailwind from "tailwind-react-native-classnames";

import { useNavigation, useRoute } from "@react-navigation/native";
import { UserOrder } from "../configs/types";
import { userLocation } from "../configs/variable";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/authSlice";

const RestaurantMap = () => {
  const user = useSelector(selectUser);
  const route = useRoute();
  const navigation = useNavigation<any>();
  const order = (route.params as { order: UserOrder })?.order;

  const mapRef = useRef(null);

  const [destination, setDestination] = useState(order?.restaurant.address);
  const [restaurantName, setRestaurantName] = useState(order?.restaurant.name);
  const [orderId, setOrderId] = useState(order?.id);
  const [restLongitude, setRestLongitude] = useState(0);
  const [restLatitude, setRestLatitude] = useState(0);

  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [loadingOrder, setLoadingOrder] = useState(false);



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
            'https://www.sunshinedeliver.com/api/driver/location/update/',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                access_token: user?.token,
                location: location,
              }),
            }
          );

          // Handle the response
          if (response.ok) {
            const data = await response.json();
            // Check the data and take appropriate actions
            console.log('Location update successful:', data);
          } else {
            // Handle error scenarios
            console.error('Location update failed. HTTP status:', response.status);
            const errorData = await response.json(); // if the server returns error details
            console.error('Error details:', errorData);
          }
        } else {
          console.error('User location is undefined.');
        }
      } catch (error) {
        console.error('Error fetching user location:', error);
      }
    };

    // Fetch user location immediately
    fetchUserLocation();

    // Set up interval to fetch user location every 2 seconds
    const intervalId = setInterval(() => {
      fetchUserLocation();
    }, 2000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const pickOrder = async() => {
        let response = await fetch('https://www.sunshinedeliver.com/api/driver/order/pick/', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              access_token: user?.token,
              order_id : orderId
            })
        })
         .then((response) => response.json())
          .then((responseJson) => {
            alert(responseJson.status);
            
     
            if(responseJson.error){
              setTimeout(() => {
                setLoadingOrder(false);
                 alert(responseJson.error);
                navigation.navigate("HomeScreen");
              }, 1300)}else{
                  setLoadingOrder(true);
              }
            })
  
            .catch( error => {alert("Selecione apenas um restaurante")
               navigation.navigate("CartScreen");
              console.log(error)}
              );
  
  
    }
    if (order) {
      // Update state values based on the order
      setDestination(order.restaurant.address);
      setRestaurantName(order.restaurant.name);
      setOrderId(order.id);
      setRestLongitude(18.4202406);
      setRestLatitude(-33.9214634);
      // You may need to set restLongitude and restLatitude based on order coordinates if available
    }

    pickOrder()
  }, [order]);

  return (
    <SafeAreaView style={tailwind`flex-1`}>
      <View style={tailwind`flex-1`}>
        <Text style={tailwind`mt-10 text-white text-lg bg-blue-500 p-4 text-center`}>
          Restaurante {order.restaurant.name} 
        </Text>
        <View style={[tailwind`bg-blue-300 relative `, { flex: 1 }]}>
          <MapView
            region={{
              latitude: restLatitude,
              longitude: restLongitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            ref={mapRef}
            style={tailwind`h-full z-10`}
          >
           

            {order && (
              <Marker
                coordinate={{
                  latitude: restLatitude,
                  longitude: restLongitude,
                }}
                identifier="shop"
                anchor={{ x: 0.5, y: 0.5 }}
                title={restaurantName}
              >
                <Image
                  source={require("../assets/shop.png")}
                  style={{ height: 27, width: 27 }}
                />
              </Marker>
            )}

            {destination && (
              <Marker
                coordinate={{
                  latitude: latitude,
                  longitude: longitude,
                }}
                identifier="shop"
                anchor={{ x: 0.5, y: 0.5 }}
                title={restaurantName}
              >
                <Image
                  source={require("../assets/shop.png")}
                  style={{ height: 27, width: 27 }}
                />
              </Marker>
            )}
          </MapView>
        </View>
        <View style={tailwind`w-full border-t-0 rounded-full pt-10 pb-10 bg-blue-500`}>
  <TouchableOpacity onPress={() => navigation.navigate("OrderCartScreen")}>
    <Text style={tailwind`text-white text-2xl text-center`}>
      Retirar no restaurante
    </Text>
  </TouchableOpacity>
</View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default RestaurantMap;
