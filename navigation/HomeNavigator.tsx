import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SuccessScreen from '../screens/SuccessScreen';
import MainTabNavigator from './MainTabNavigator';
import CartScreen from '../screens/CartScreen';
import UserProfile from '../screens/UserProfile';
import RestaurantMap from '../components/RestaurantMap';
import OrderMap from '../components/OrderMap';



const Stack = createStackNavigator();



export default function HomeNavigator() {





    return (
      
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
       
            <Stack.Screen name="HomeScreen" component={MainTabNavigator} />
            <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="RestaurantMap" component={RestaurantMap} />
            <Stack.Screen name="OrderMap" component={OrderMap} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
           
     

        </Stack.Navigator>
        
    )
}