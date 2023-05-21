import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  FlatList,
  ScrollView,
  Image,
} from "react-native";
import Screen from "../components/Screen";
import tailwind from "tailwind-react-native-classnames";
import AppHead from "../components/AppHead";
import AppButton from "../components/AppButton";

import colors from "../configs/colors";
import CartItems from "../components/CartItems";
import CheckoutModal from "../components/CheckoutModal";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import { logoutUser, selectUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

const CartScreen = () => {
  const user = useSelector(selectUser);
  const [data, setData] = useState([{}]);
  const [customerData, setCustomerData] = useState({});
  const [restaurantData, setRestaurantData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const pickOrder = async () => {
    let response = await fetch(
      "https://www.sunshinedeliver.com/api/driver/order/latest/",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: user?.token,
        }),
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setData(responseJson.order);
        setCustomerData(responseJson.order.customer);
        setRestaurantData(responseJson.order.restaurant);
        setOrderData(responseJson.order.order_details);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    pickOrder();
  }, []);

  console.log("PEGOU", customerData);

  return (
    <Screen style={tailwind`flex-1 bg-white`}>
      <AppHead title={`Confira`} icon="basket-outline" />
      <View style={tailwind`flex-1`}>
        <CartItems
          resData={restaurantData}
          client={customerData}
          order={orderData}
          data={data}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  left: {
    marginRight: 20,
  },
  right: {
    flex: 1,
  },
  total: {
    fontSize: 14,
    color: colors.title,
  },
  totalAmount: {
    fontSize: 23,
  },
});

export default CartScreen;
