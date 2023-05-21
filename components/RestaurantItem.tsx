import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import tailwind from "tailwind-react-native-classnames";
import { Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import colors from "../configs/colors";
import RestaurantMap from "../components/RestaurantMap";

import Geolocation from "react-native-geolocation-service";
import * as Location from "expo-location";
import Geocoder from "react-native-geocoding";

const RestaurantItem = ({ restaurantData, coordinates }) => {
  const navigation = useNavigation();

  const handlePress = (item) => {
    navigation.navigate("DetailsScreen", {
      item: { ...item },
    });
  };

  return (
    <View>
      {restaurantData?.map((item, index) => (
        <RestaurantItemCard
          key={index}
          item={item}
          onPress={() => handlePress(item)}
        />
      ))}
    </View>
  );
};

export default RestaurantItem;

const RestaurantItemCard = ({ item, onPress }) => {
  const [loved, setLoved] = useState(false);

  return (
    <TouchableOpacity style={tailwind`mx-4 mb-4`} onPress={onPress}>
      <TouchableOpacity
        style={tailwind`absolute top-2 right-2`}
        onPress={() => setLoved((e) => !e)}
      >
        <Entypo
          name={`${loved ? "heart" : "heart-outlined"}`}
          size={28}
          color="#fff"
        />
      </TouchableOpacity>
      <View style={tailwind`flex-row items-center mt-1`}>
        <View style={tailwind`flex-grow`}>
          <Text style={tailwind`font-bold text-lg`} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={tailwind`flex-row items-center`}>
            <MaterialCommunityIcons
              name="clock-time-four"
              size={13}
              color="#06C167"
            />
            <Text style={tailwind`text-xs text-gray-700`}>{item.address}</Text>
          </View>
        </View>
        <View
          style={tailwind`flex-row justify-center items-center bg-gray-100 `}
        >
          <MaterialCommunityIcons name="phone" size={13} color="#06C167" />
          <Text style={tailwind`text-gray-600 text-xs`}>{item.phone}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    position: "relative",
    flex: 1,
  },
  mapImageWrpper: {
    position: "absolute",
    width: "100%",
  },
  image: {
    width: "100%",
    resizeMode: "cover",
    height: 260,
  },
  content: {
    position: "relative",
    zIndex: 20,
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 25,
    paddingHorizontal: 25,
    marginTop: 220,
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 23,
    color: colors.title,
    fontWeight: "700",
    maxWidth: "80%",
  },
  price: {
    fontSize: 20,
    color: colors.primary,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    backgroundColor: colors.light,
    borderRadius: 5,
    marginRight: 7,
  },
  infoText: {
    marginLeft: 4,
    fontSize: 12,
  },
});
