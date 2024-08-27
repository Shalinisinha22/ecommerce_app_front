import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  ScrollView,
  ImageBackground,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Fontisto, Entypo } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { setUser } from "../redux/actions/userActions";
import axios from "axios";

const height = Dimensions.get("screen").height;
const width = Dimensions.get('screen').width;

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [hidePass, setHidePass] = useState(true);
  const [id, setId] = useState("");
  const [isIdFocused, setIsIdFocused] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setErr] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [user, setUser] = useState("");
  const [flag, setFlag] = useState(false);

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  useEffect(() => {
    validateForm();
  }, [password, id]);

  const validateForm = async () => {
    let errors = {};

    if (id == '') {
      errors.id = "Enter ID";
    }

    if (password == '') {
      errors.password = "Enter password";
    }

    setErr(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const verifyUser = async () => {
    let errors = {};

    const res = await axios.get("https://mahilamediplex.com/mediplex/login", {
      params: {
        userId: id,
        password: password
      }
    }).then(response => {
      console.log("131", response.data);
      if (response.data) {
        dispatch({ type: 'SET_USER_INFO', payload: response.data });
  
      }
    }).catch(error => {
      console.error(error);
      if (error.response && error.response.status === 404) {
        errors.message = 'You have entered wrong credentials!';
      }
      errors.message = 'You have entered wrong credentials!';
    });

    setErr(errors);
  };

  const handleSubmit = async () => {
    console.log(isFormValid, "formvalid");

    if (isFormValid) {
      await verifyUser();
    } else {
      setFlag(true);
    }
  };

  return (
    <View style={{ backgroundColor: "white" }}>
      <ImageBackground source={require("../assets/b6.jpg")} style={{ width: width, height: height, alignItems: "center", paddingTop: 20 }}>
        <ScrollView>
          <View style={{ marginTop: 10, width: width, alignItems: "center" }}>
            <Image style={styles.img} source={require("../assets/logo.png")} />
          </View>

          <KeyboardAvoidingView>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.heading}>Login to your Account</Text>
              {error.message && <Text style={{ color: "red", marginTop: 10 }}>{error.message}</Text>}
            </View>

            <View style={{ width: width, alignItems: "center" }}>
              <View style={{ marginTop: 20 }}>
                <View style={[styles.inputBoxCont, isIdFocused && styles.inputBoxFocused]}>
                <FontAwesome name="id-card" size={24} color="black" style={{ marginLeft: 8 }}  />
                  <TextInput
                    value={id}
                    onChangeText={(text) => setId(text)}
                    onFocus={() => setIsIdFocused(true)}
                    onBlur={() => setIsIdFocused(false)}
                    style={{
                      color: "black",
                      marginVertical: 10,
                      width: 300,
                      fontSize: 18,
                    }}
                    placeholder="Enter your ID"
                  />
                </View>
                {error.id && flag && <Text style={{ color: "red" }}>{error.id}</Text>}
              </View>

              <View>
                <View style={[styles.inputBoxCont, isPasswordFocused && styles.inputBoxFocused]}>
                  {
                    hidePass ? <Entypo name="eye-with-line" onPress={() => setHidePass(!hidePass)} size={24} color="black" style={{ marginLeft: 8 }} />
                      : <Entypo name="eye" onPress={() => setHidePass(!hidePass)} size={24} color="black" style={{ marginLeft: 8 }} />
                  }
                  <TextInput
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    secureTextEntry={hidePass ? true : false}
                    style={{
                      color: "black",
                      marginVertical: 10,
                      width: 300,
                      fontSize:18,
                    }}
                    placeholder="enter your Password"
                    
                  />
                </View>
                {error.password && flag && <Text style={{ color: "red" }}>{error.password}</Text>}
              </View>

            

              <View style={{ marginTop: 40 }} />

              <TouchableOpacity style={styles.button}
                onPress={handleSubmit}
               >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                onPress={() => navigation.navigate("RegisterScreen")}
                style={{ marginTop: 15 }}
              >
                <Text style={{ textAlign: "center", color: "black", fontSize: 16, fontWeight: 800 }}>
                  Don't have an account? Sign Up
                </Text>
              </TouchableOpacity> */}
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  img: {
    width: 180,
    height: 150,
    resizeMode: "contain"
  },
  heading: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 10,
    color: "#041E42",
  },
  inputBoxCont: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#8ac926",
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 20,
  },
  inputBoxFocused: {
    borderColor: "#008000",
    borderWidth: 2,
  },
  forgotCont: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    width: 200,
    backgroundColor: "#f01c8b",
    borderRadius: 6,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 15,
  },
});
