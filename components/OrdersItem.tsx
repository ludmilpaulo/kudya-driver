import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import tailwind from 'tailwind-react-native-classnames';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import colors from '../configs/colors'

import RestaurantMap from '../components/RestaurantMap'



const OrdersItem = ({ resData, data }) => {
    const navigation = useNavigation()

    const handlePress = (item) => {
        navigation.navigate("RestaurantMap", {
            item: {...item}
        })
    }

return (
    <View>
        {data?.map((item, index) => (
            <OrdersItemCard key={index} item={item} onPress={() => handlePress(item)} />
        ))}
    </View>
);
}

export default OrdersItem;

const OrdersItemCard = ({ item, onPress }) => {
    const url = 'https://www.sunshinedeliver.com';
    const client = `${item.customer.avatar}`;
    const helloWorld = `${url}${client}`; 

   
    return (
        <TouchableOpacity style={tailwind`mx-4 mb-4`} onPress={onPress}>
              
         <View style={[styles.container]}>
            <View style={styles.cardBody}>
              <View style={styles.bodyContent}>
                <Text style={styles.titleStyle}>{item.restaurant.name}</Text>
                <MaterialCommunityIcons name="phone" size={13} color="#06C167" />
                <Text style={styles.subtitleStyle}>{item.restaurant.phone}</Text>
              </View>
              <Image
                source={{ uri: helloWorld   }}
                style={styles.cardItemImagePlace}
              ></Image>
            </View>
            <View style={styles.actionBody}>
                <Text style={styles.actionText1}>{item.restaurant.address} {'\n'} {'\n'}{item.address}</Text>
            
    
                <Text style={styles.actionText2}> </Text>
            
            </View>
    </View>
           
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "#CCC",
    flexWrap: "nowrap",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: -2,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 3,
    overflow: "hidden"
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  bodyContent: {
    padding: 16,
    paddingTop: 24,
    flex: 1
  },
  titleStyle: {
    fontSize: 24,
    color: "#000",
    paddingBottom: 12
  },
  subtitleStyle: {
    fontSize: 14,
    color: "#000",
    lineHeight: 16,
    opacity: 0.5
  },
  cardItemImagePlace: {
    backgroundColor: "#ccc",
    height: 80,
    width: 80,
    margin: 16
  },
  actionBody: {
    padding: 8,
    flexDirection: "row"
  },
  actionButton1: {
    padding: 8,
    height: 36
  },
  actionText1: {
    fontSize: 14,
    color: "#000",
    opacity: 0.9
  },
  actionButton2: {
    padding: 8,
    height: 36
  },
  actionText2: {
    fontSize: 14,
    color: "#000",
    opacity: 0.9
  }
});
