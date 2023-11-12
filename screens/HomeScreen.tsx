import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { getOrder } from "../configs/variable";
import {
  Order,
  Customer,
  Restaurant,
  OrderDetail,
  UserOrder,
} from "../configs/types";
import OrdersItem from "../components/OrdersItem";

type Props = {};

const HomeScreen = () => {
  const [userOrder, setUserOrder] = useState<UserOrder[]>([]);
  const [customerOrder, setCustomerOrder] = useState<Customer | undefined>();
  const [restaurantOrder, setRestaurantOrder] = useState<
    Restaurant | undefined
  >();
  const [orderDetails, setOrderDetails] = useState<OrderDetail[] | undefined>();
  const [orderTotal, setOrderTotal] = useState<number | undefined>();
  const [orderStatus, setOrderStatus] = useState<string | undefined>();
  const [orderAddress, setOrderAddress] = useState<string | undefined>();

  useEffect(() => {
    const fetchDataFromOrderEndpoint = async () => {
      try {
        const { orders }: { orders: UserOrder[] } = await getOrder(
          "/api/driver/orders/ready/",
        );

        if (orders.length > 0) {
          setUserOrder(orders);
          orders.forEach((order: UserOrder) => {
            const {
              customer,
              restaurant,
              order_details,
              total,
              status,
              address,
            } = order;

            setCustomerOrder(customer);
            setRestaurantOrder(restaurant);
            setOrderDetails(order_details);
            setOrderTotal(total);
            setOrderStatus(status);
            setOrderAddress(address);
          });
        } else {
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    const fetchDataInterval = 3000; // 3 seconds

    const fetchDataIntervalId = setInterval(() => {
      fetchDataFromOrderEndpoint();
    }, fetchDataInterval);

    return () => {
      // Clear the interval before component unmounts
      clearInterval(fetchDataIntervalId);
    };
  }, []); // Empty dependency array to run the effect once on mount

  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <OrdersItem orderReady={userOrder} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
