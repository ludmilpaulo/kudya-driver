import React, { useEffect, useState } from 'react';
import { Image, Text, ScrollView, Alert, ActivityIndicator, View, StyleSheet, TouchableOpacity, Platform, Vibration } from 'react-native';
import HeaderTabs from '../components/HeaderTabs';
import Screen from '../components/Screen'

import Geolocation from 'react-native-geolocation-service';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';


import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';



import SearchBar from '../components/SearchBar'

import tailwind from 'tailwind-react-native-classnames';

import * as Device from 'expo-device';

import * as Notifications from 'expo-notifications';

import colors from '../configs/colors'
import RestaurantMap from '../components/RestaurantMap'

import OrdersItem from '../components/OrdersItem'
import { user } from '../configs/variable';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const HomeScreen = () => {

      const navigation = useNavigation();

      const [loading, setLoading] = useState(false);
      const [activeTab, setActiveTab] = useState("Delivery");
      const [data, setData] = useState([]);
      const [restaurant, setRestaurant ] = useState(resData);
 
      const [customer, setCustomer ] = useState(customerData);

      const [ vibrar, setVibrar ] = useState(undefined)

      

      const DURATION = 2000;



const getUserData = async()=>{
  try{
  

    let response = await fetch('https://www.sunshinedeliver.com/api/driver/profile/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user?.token,
          
          })
      })
       .then((response) => response.json())
       .then((responseJson) => {
        if(responseJson.customer_detais.avatar == null){
          alert("Por favor, preencha seus dados");
          navigation.navigate("UserProfile");
        };
        })  
      }catch (e) {
        
          alert(e)
         
        }
 }  


      const getOrders = async () => {
        try {
              const response = await fetch('https://www.sunshinedeliver.com/api/driver/orders/ready/');
              const json = await response.json();

              
               
              setVibrar(json.orders) 
              setData(json.orders);
            
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }

console.log("vibe==>",data)

const orderNotification = async () => {

         try {
           if ( vibrar?.length == 0 ){
            setLoading(false)
           }
           else{
             Vibration.vibrate(DURATION);
           }
        } catch (e) {
            console.log(e);
        }
    } 



const resData = Object.keys(data).reduce((result, key) => {
  return result.concat(data[key].restaurant);

}, [])

let resAd = resData.map(({address})=>{
      return (`${address}`).toString()
    })
let restAddress = resAd.toString();  


const customerData = Object.keys(data).reduce((result, key) => {
  return result.concat(data[key].customer);
}, [])


const orderData = Object.keys(data).reduce((result, key) => {
  return result.concat(data[key].order_details);
}, [])

useEffect(() =>{
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
    const [ restlongitude, setRestLongitude ] = useState(0);
    const [ restlatitude, setRestLatitude ] = useState(0);

   
    const coordinates = {
            latitude: restlatitude,
            longitude: restlongitude
        };

  
// With more options
// Geocoder.init("xxxxxxxxxxxxxxxxxxxxxxxxx", {language : "en"}); // set the language

const getAddress = async() =>{
    // Initialize the module (needs to be done only once)
    Geocoder.init("AIzaSyBBkDvVVuQBVSMOt8wQoc_7E-2bvDh2-nw"); // use a valid API key

try{
// Search by address
    Geocoder.from(restAddress)
        .then(json => {
          let location = json.results[0].geometry.location;
            setRestLongitude(location.lng);
            setRestLatitude(location.lat);
          
        })
        .catch(error => console.warn(error));
    }catch (e) {
        
          alert(e)
         
        }

}
   
 return (
        <Screen style={tailwind`bg-white flex-1`}>
            <HeaderTabs activeTab={activeTab} setActiveTab={setActiveTab} />
           
            <ScrollView style={tailwind`flex-1`} showsVerticalScrollIndicator={false}>
              
                {loading && <ActivityIndicator size="large" color={colors.primary} style={tailwind`mt-2 mb-6`} />}
                <OrdersItem resData={resData} coordinates={coordinates} client={customerData} order={orderData} data={data} />
            </ScrollView>
        </Screen>
    );
}

export default HomeScreen;
