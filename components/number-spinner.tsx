import * as React from 'react';
import { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tailwind from 'tailwind-react-native-classnames';
import { selectCartItems, updateBusket } from '../redux/slices/basketSlice';
import BouncyCheckbox from "react-native-bouncy-checkbox";

import colors from '../configs/colors';

export default function NumberSpinner(props) {
   const allCartItems = useSelector(selectCartItems)
   const dispatch = useDispatch()

   console.log('all cart', allCartItems)
  const [quantity, setquantity] = useState(1);

  const quantityDown = () => {
    let temp = quantity - 1;
    if (temp > 0) {
      setquantity(temp);
      props.changeItemquantity(props.item, temp)
    }
    else if (temp == 0) {
      Alert.alert("", "Do you want to delete the item?", [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'OK', onPress: () => {
            props.deleteItem(props.item)
          }
        }
      ],
        { cancelable: false })
    }
  };

  const quantityUp = () => {
    let temp = quantity + 1;
    if (temp >= 0) {
      setquantity(temp);
      props.changeItemquantity(props.item, temp)
    }
  };

  return (
    <View
      style={{
        borderRadius: 5,
        borderWidth: 2,
        borderColor: colors.gray,
        width: 96,
        height: 35,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        style={{
          width: 32,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={quantityDown}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>-</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{quantity}</Text>
      <TouchableOpacity
        style={{
          width: 32,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={quantityUp}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
