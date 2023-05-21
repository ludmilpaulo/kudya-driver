import React, { useContext, useReducer, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";

//import React Native chart Kit for different kind of Chart
import { LineChart, BarChart } from "react-native-chart-kit";

import Screen from "../components/Screen";
import tailwind from "tailwind-react-native-classnames";

import { logoutUser, selectUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

const GroceryScreen = () => {
  const user = useSelector(selectUser);

  const [userdata, setUserData] = useState();

  console.log("MPLA Out ++>", userdata);

  const pickRevenue = async () => {
    let response = await fetch(
      "https://www.sunshinedeliver.com/api/driver/revenue/",
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
        console.log("MPLA Out ++>", responseJson);
        setUserData(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    pickRevenue();
  }, []);

  return (
    <Screen style={tailwind`flex-1 bg-white`}>
      <>
        <View>
          <Text style={styles.header}>Bar Chart</Text>
          <BarChart
            data={{
              labels: ["January", "February", "March", "April", "May", "June"],
              datasets: [
                {
                  data: [20, 45, 28, 80, 99, 43],
                },
              ],
            }}
            width={Dimensions.get("window").width - 16}
            height={220}
            yAxisLabel={"Rs"}
            chartConfig={{
              backgroundColor: "#1cc910",
              backgroundGradientFrom: "#eff3ff",
              backgroundGradientTo: "#efefef",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      </>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    padding: 10,
  },
  header: {
    textAlign: "center",
    fontSize: 18,
    padding: 16,
    marginTop: 16,
  },
});

export default GroceryScreen;
