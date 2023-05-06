import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import PolylineDirection from '@react-native-maps/polyline-direction';
import { View, StyleSheet, Dimensions, Platform, Image, TouchableOpacity, Text } from 'react-native';
import Screen from '../components/Screen';
import tailwind from 'tailwind-react-native-classnames';

import * as Device from 'expo-device';
import * as Location from 'expo-location';
import Geocoder from 'react-native-geocoding';

import MapViewDirections from 'react-native-maps-directions';

import colors from '../configs/colors';

import { useNavigation } from "@react-navigation/native";
import { useRoute } from '@react-navigation/native';

import AppButton from '../components/AppButton';
import AppHead from '../components/AppHead';

import { logoutUser, selectUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";



const RestaurantMap = (props) => {

    const user = useSelector(selectUser);


    const navigation = useNavigation();
    const route = useRoute();
    const item = route.params.item;

    const mapRef = useRef(null)

    
    const [destination, setDestination ] = useState(item.restaurant.address);
    const [restaurantName, setRestaurantName ] = useState(item.restaurant.name);
    const [ orderId, setOrderId ] = useState(item.id);
    const [ restlongitude, setRestLongitude ] = useState(0);
    const [ restlatitude, setRestLatitude ] = useState(0);

    const GOOGLE_MAPS_APIKEY = 'AIzaSyDn1X_BlFj-57ydasP6uZK_X_WTERNJb78';

    const [location, setLocation] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);

    const [longitude, setLongitude ] = useState(0);
    const [latitude, setLatitude ] = useState(0);

    const [loadingOrder, setLoadingOrder] = useState(false);

 
    const initialRegion = {
      latitude: latitude,                     
      longitude: longitude, 
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }

   const coordinates = {
            latitude: restlatitude,
            longitude: restlongitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
        };


      // Initialize the module (needs to be done only once)
    Geocoder.init("AIzaSyDn1X_BlFj-57ydasP6uZK_X_WTERNJb78"); // use a valid API key
// With more options
// Geocoder.init("xxxxxxxxxxxxxxxxxxxxxxxxx", {language : "en"}); // set the language

// Search by address
    Geocoder.from(destination)
        .then(json => {
          let location = json.results[0].geometry.location;
            setRestLongitude(location.lng);
            setRestLatitude(location.lat);
         
        })
        .catch(error => console.warn(error));


 const userLocation = async () => {
        if (Platform.OS === 'android' && !Device.isDevice) {
          alert(
            'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
          );
          return;
        }
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLongitude(location.coords.longitude);
        setLatitude(location.coords.latitude);
        setLocation(location);
      };


  useEffect(() => {
    const timeout = setTimeout(() => {
            userLocation();
            
            }, 1000);
      return () => {
      // clears timeout before running the new effect
      clearTimeout(timeout);
    };
    
  }, [initialRegion]);



  const pickOrder = async() => {
   
    let tokenvalue = user.token;


      let response = await fetch('https://www.sunshinedeliver.com/api/driver/order/pick/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_token: tokenvalue,
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


useEffect(() => {
  pickOrder();
}, []);
        
    

   return (
      <>
        <Screen style={tailwind`flex-1 bg-white`}>
        
          <View style={styles.container}>

           <MapView 
             provider = { PROVIDER_GOOGLE }
             region={initialRegion}
             style={styles.map} >

             <PolylineDirection
              origin={initialRegion}
              destination={coordinates}
              apiKey={GOOGLE_MAPS_APIKEY}
              strokeWidth={4}
              strokeColor="#004AAD"
            />

            {initialRegion && (
                    <Marker
                        coordinate={{
                            ...initialRegion
                        }}
                        identifier="shop"
                        anchor={{ x: 0.5, y: 0.5 }}
                        title={destination}
                    >
                        <Image source={require('../assets/you-are-here.png')} style={{ height: 27, width: 27 }} />
                    </Marker>
                )}


             {coordinates && (
                    <Marker
                        coordinate={{
                            ...coordinates
                        }}
                        identifier="shop"
                        anchor={{ x: 0.5, y: 0.5 }}
                        title={destination}
                    >
                        <Image source={require('../assets/images/shop.png')} style={{ height: 27, width: 27 }} />
                    </Marker>
                )}

          </MapView>

           <TouchableOpacity style={{
               width: '100%',
               borderTopWidth: 0,
               borderRadius: 100,
                    paddingTop: 10,
                    paddingBottom: 10,
                    height: 100,
                    backgroundColor: "rgba(0,74,173,1)",
            }} >
              <Text style={{
              width: '100%',
               borderTopWidth: 0,
              paddingTop: 1,
                   paddingBottom: 10,
                   //height: 90,
                    color: colors.white,
                    fontSize: 28,
                    textAlign: "center",
            }}
            onPress={() => navigation.navigate("CartScreen")}
               >Retirar no restaurante</Text>
            </TouchableOpacity>  

          
        </View>

        
           
 
         
            
        </Screen>
    </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
    input: {
        borderColor: colors.medium,
        borderWidth: 1,
    },
    button: {
    top: 18,
    left: 6,
    position: "absolute",
    backgroundColor: "rgba(230,230,230,1)",
    right: 0,
    bottom: 0
  },
  rect: {
    width: 348,
    height: 48,
    backgroundColor: "rgba(0,74,173,1)",
    borderRadius: 100,
    marginTop: 725,
    marginLeft: 7
  },
  buttonStack: {
    backgroundColor: "rgba(0,74,173,1)",
    borderRadius: 100,
    width: 348,
    height: 48
  },
    text: {
        color: colors.white,
        fontSize: 18,
        // textTransform: 'uppercase',
        fontWeight: '700'
    }

})


export default RestaurantMap;



 
