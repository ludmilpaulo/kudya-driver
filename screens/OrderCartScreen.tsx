import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import tailwind from "tailwind-react-native-classnames";
import AppButton from "../components/AppButton";
import { useSelector } from "react-redux";
import CheckoutModal from "../components/CheckoutModal";
import { selectUser } from "../redux/slices/authSlice";
import { OrderDetail, Customer, Restaurant, Order } from "../configs/types";
import { useNavigation } from "@react-navigation/native";
import { apiUrl } from "../configs/variable";

interface OrderCartScreenProps {
  // Add any props if needed
}
interface OrderDetailCheckout {
  id: number;
  name: string;
  price: number;
  quantity: number;
  sub_total: number;
}

const OrderCartScreen: React.FC<OrderCartScreenProps> = () => {
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [customerData, setCustomerData] = useState<Customer>({});
  const [restaurantData, setRestaurantData] = useState<Restaurant>({});
  const [orderData, setOrderData] = useState<OrderDetail[]>([]);
  const [order, setOrder] = useState<Order>({});

  const url = "https://www.sunshinedeliver.com";

  const user = useSelector(selectUser);

  console.log("driver order", order);

  const pickOrder = async () => {
    try {
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
        },
      );

      if (response.ok) {
        let responseJson = await response.json();
        setCustomerData(responseJson.order.customer);
        setRestaurantData(responseJson.order.restaurant);
        setOrderData(responseJson.order.order_details);
        setOrder(responseJson.order);
      } else {
        console.error("Error fetching order:", response.status);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  useEffect(() => {
    pickOrder();
  }, []);

  return (
    <SafeAreaView style={tailwind`flex-1 p-4`}>
      <Text style={tailwind`text-lg font-bold mb-4`}>
        Informação ao Cliente
      </Text>

      <View
        style={tailwind`bg-white p-4 mb-4 rounded-md shadow-md flex-row items-center`}
      >
        <View style={tailwind`flex-1`}>
          <Text>Nome:: {customerData.name}</Text>
          <Text>Telefone: {customerData.phone}</Text>
          <Text>Endereço: {order?.address}</Text>
        </View>
        <Image
          source={{ uri: `${apiUrl}${customerData.avatar}` || "" }}
          style={tailwind`w-16 h-full rounded-full mr-2`}
        />
      </View>

      <Text style={tailwind`text-lg font-bold mb-4`}>
        Informações sobre restaurantes
      </Text>
      <View style={tailwind`bg-white p-4 mb-4 rounded-md shadow-md`}>
        <Text>Nome:: {restaurantData.name}</Text>
        <Text>Telefone: {restaurantData.phone}</Text>
        <Text>Endereço: {restaurantData.address}</Text>
      </View>

      <Text style={tailwind`text-lg font-bold mb-4`}>Detalhes do Pedido</Text>

      <ScrollView>
        <View style={tailwind`bg-white p-4 rounded-md shadow-md`}>
          <Text style={tailwind`text-lg font-bold mb-4`}>
            Pedido Número {order.id}
          </Text>
          {orderData.map((item) => (
            <View
              key={item.id}
              style={tailwind`flex-row justify-between items-center mb-2`}
            >
              <View style={tailwind`flex-row items-center`}>
                <Text>{item.meal.name}</Text>
              </View>
              <Text>
                {item.quantity} x{" "}
                {item.meal.price ? item.meal.price.toFixed(2) : "N/A"} Kz
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {order.status === "Entregue" ? (
  <AppButton
    title="Pedido Entrege"
    onPress={() => navigation.navigate("Home")}
    color="black"
    // style={tailwind`mt-5`}
  />
) : (
  <AppButton
    title="Levar Para Cliente"
    onPress={() => navigation.navigate("Delivery", { order, customerData })}
    color="black"
    // style={tailwind`mt-5`}
  />
)}


      

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        {/* Assuming CheckoutModal component is properly implemented */}
        <CheckoutModal setModalVisible={setModalVisible} />
      </Modal>
    </SafeAreaView>
  );
};

export default OrderCartScreen;
