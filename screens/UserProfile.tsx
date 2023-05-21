import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from "react-native";
import Screen from "../components/Screen";
import tailwind from "tailwind-react-native-classnames";
import AppHead from "../components/AppHead";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import colors from "../configs/colors";

import * as ImagePicker from "expo-image-picker";

import { useNavigation } from "@react-navigation/native";
import * as Updates from "expo-updates";

import { logoutUser, selectUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

const UserProfile = () => {
  const auth = useSelector(selectUser);
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");

  const [photo, setPhoto] = useState(null);

  const [Type, setType] = useState("");

  const navigation = useNavigation();

  const [keyboardStatus, setKeyboardStatus] = useState(undefined);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus("Keyboard Shown");
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus("Keyboard Hidden");
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const userUpdate = async () => {
    let tokenvalue = auth.token;

    // ImagePicker saves the taken photo to disk and returns a local URI to it
    let localUri = image.uri;
    let filename = localUri.split("/").pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    formData.append("avatar", { uri: localUri, name: filename, type });
    formData.append("access_token", tokenvalue);
    formData.append("address", address);
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("phone", phone);

    try {
      let response = await fetch(
        "https://www.sunshinedeliver.com/api/driver/profile/update/",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );
      //response = await response.json();

      if (response.status == 200) {
        let data = await response.json();

        console.log(data.status);
        alert(data.status);
        navigation.navigate("Home");
        //Updates.reloadAsync()
        return true;
      }
    } catch (e) {
      console.log("alila", e);
      alert(
        "O usuário não existe, ou foi desativado inscreva-se ou tente fazer login novamente"
      );
      await AsyncStorage.removeItem("authUser");
      Updates.reloadAsync();
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result);
      //setImage(result.uri.replace('file://', ''));
      setType(result.uri.substring(result.uri.lastIndexOf(".") + 1));
      setPhoto(result.uri);
    }
  };

  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert(
        "Você se recusou a permitir que este aplicativo acesse sua câmera!"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setImage(result);
      //setImage(result.uri.replace('file://', ''));
      setType(result.uri.substring(result.uri.lastIndexOf(".") + 1));
      setPhoto(result.uri);
      console.log(result.uri);
    }
  };

  return (
    <>
      <Screen style={tailwind`flex-1 bg-white`}>
        <View style={styles.wrapper}>
          <View style={tailwind`justify-center items-center`}>
            <View style={tailwind`rounded-full overflow-hidden w-48 h-48 mt-4`}>
              {photo && (
                <Image source={{ uri: photo }} style={tailwind`w-48 h-48`} />
              )}
            </View>
            <TouchableOpacity onPress={() => openCamera()}>
              <Text style={styles.wellcomeTo}>Tire uma Foto{"\n"} ou </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pickImage()}>
              <Text style={styles.brand}>Carregue sua Foto</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.containertest}>
              <TextInput
                style={styles.input}
                placeholder="Primeiro Nome"
                autoCapitalize={"none"}
                onChangeText={(text) => setFirst_name(text)}
                value={first_name}
                onSubmitEditing={Keyboard.dismiss}
              />
              <TextInput
                style={styles.input}
                placeholder="Ultimo Nome"
                onChangeText={(text) => setLast_name(text)}
                value={last_name}
                autoCapitalize={"none"}
                onSubmitEditing={Keyboard.dismiss}
              />
              <TextInput
                style={styles.input}
                placeholder="Número de Telefone"
                autoCompleteType="off"
                value={phone}
                onChangeText={(text) => setPhone(text)}
                autoCapitalize={"none"}
                onSubmitEditing={Keyboard.dismiss}
              />

              <TextInput
                style={styles.input}
                placeholder="Seu Endereço"
                autoCompleteType="off"
                value={address}
                onChangeText={(text) => setAddress(text)}
                autoCapitalize={"none"}
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>

            <TouchableOpacity
              style={styles.containerbot}
              onPress={() => userUpdate()}
            >
              <Text style={styles.vamosJuntos}>Atualize seu Perfil</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    justifyContent: "center",
  },
  wrapper: {
    paddingHorizontal: 20,
  },
  logo: {
    height: 160,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 30,
  },
  wellcomeTo: {
    fontSize: 23,
    fontWeight: "700",
    color: colors.secondary,
    marginTop: 20,
    textAlign: "center",
  },
  brand: {
    fontSize: 23,
    color: colors.primary,
    textAlign: "center",
    fontWeight: "500",
  },
  form: {
    marginTop: 10,
  },
  join: {
    marginTop: 10,
    textAlign: "center",
    color: colors.black,
  },
  or: {
    color: colors.gray,
    textAlign: "center",
    marginVertical: 20,
  },
  containertest: {
    position: "relative",
  },
  input: {
    borderColor: colors.medium,
    backgroundColor: colors.light,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  inputError: {
    borderColor: colors.denger,
  },
  icon: {
    position: "absolute",
    right: 15,
    top: 32,
  },
  button: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 15,
    marginVertical: 5,
    marginTop: 15,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    // textTransform: 'uppercase',
    fontWeight: "700",
  },

  containerbot: {
    backgroundColor: "rgba(0,74,173,1)",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 15,
    marginVertical: 5,
    marginTop: 15,
  },
  containertext: {
    width: 159,
    height: 32,
  },
  vamosJuntos: {
    color: colors.white,
    fontSize: 18,
    // textTransform: 'uppercase',
    fontWeight: "700",
  },
});

export default UserProfile;
