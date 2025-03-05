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
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from 'react-redux';
import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";

const height = Dimensions.get("screen").height;
const width = Dimensions.get('screen').width;

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [hidePass, setHidePass] = useState(true);

  const [error, setErr] = useState("");

  const [isMobileFocused, setIsMobileFocused] = useState(false);

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);



  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      mobile: '',  
      password: '',
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
  
    // Validate input fields
    if (!data.mobile || !data.password) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }
  
    try {
      // Make a GET request with query parameters
      const response = await axios.get("https://mahilamediplex.com/mediplex/userlogin", {
        params: { mobile: data.mobile, password: data.password },
      });
  
      // Check the response status
      if (response.status === 200) {
        const userData = response.data;
        Alert.alert("Success", `Welcome, ${userData.client_entry_name}`);
        dispatch({ type: "SET_USER_INFO", payload: userData });
      } else if (response.status === 404) {
        Alert.alert("Error", "User not found.");
      } else {
        Alert.alert("Error", "Login failed.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "An error occurred. Please try again later.");
    }
  };
  


  const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
    setErr(errors)
    return console.log(errors)
  }

  return (
    <View style={{ backgroundColor: "white" }}>
      <ImageBackground source={require("../assets/b6.jpg")} style={{ width: width, height: height, alignItems: "center", paddingTop: 20 }}>
        <ScrollView>
          <View style={{ marginTop: 10, width: width, alignItems: "center" }}>
            <Image style={styles.img} source={require("../assets/logo.png")} />
          </View>

          <KeyboardAvoidingView>
            <View style={{ alignItems: "center" }}>
              <Text allowFontScaling={false} style={styles.heading}>Login to your Account</Text>
              {error.message && <Text allowFontScaling={false} style={{ color: "red", marginTop: 10 }}>{error.message}</Text>}
            </View>

            <View style={{ width: width, alignItems: "center" }}>
              <View style={{ marginTop: 20 }}>
                 <View style={[styles.inputBoxCont, isMobileFocused && styles.inputBoxFocused]}>
                                <Ionicons name="call-outline" size={20} color="#C93393" style={styles.icon} />
                                <Controller
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                      <TextInput
                                      placeholder="Mobile Number"
                                      placeholderTextColor="#333"
                                      keyboardType="numeric"
                                      style={{
                                        color: "black",
                                        width: 300,
                                        fontSize: 14,
                                        marginVertical: 2,
                                      }} 
                                      onFocus={() => setIsMobileFocused(true)}
                                      onBlur={() => setIsMobileFocused(false)}                          onChangeText={value => onChange(value)}
                          value={value}
                          maxLength={10} // Limit input to 10 digits
                        />
                      )}
                      name="mobile"
                      rules={{
                        required: "Mobile number is required",
                                  pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: "Invalid mobile number",
                        },
                      }}
                    />
                                </View>
              
                                {errors.mobile?.message && <Text allowFontScaling={false} style={{ color: "red" }}>{errors.mobile?.message}</Text>}
                                </View>
            

              <View>
                <View style={[styles.inputBoxCont, isPasswordFocused && styles.inputBoxFocused]}>
                  {
                    hidePass ? <Entypo name="eye-with-line" onPress={() => setHidePass(!hidePass)} size={20} color="#C93393" style={{ marginLeft: 8 }} />
                      : <Entypo name="eye" onPress={() => setHidePass(!hidePass)} size={20} color="#C93393" style={{ marginLeft: 8 }} />
                  }

                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        placeholder="Password"
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        secureTextEntry={hidePass ? true : false}
                        style={{
                          color: "black",
                          marginVertical: 2,
                          width: 300,
                          fontSize: 14,
                        }}
                        onChangeText={value => onChange(value)}
                        value={value}
                      />
                    )}

                    name="password"
                    rules={{
                      required: "Password is required",
                      
                      message: "Enter your password"
                    }}
                  />

                </View>
                {errors.password?.message && <Text allowFontScaling={false} style={{ color: "red" }}>{errors.password?.message}</Text>}
              </View>

              </View>

              <View style={{ marginTop: 40 }} />

              <TouchableOpacity style={styles.button}
                onPress={handleSubmit(onSubmit)}
              >
                <Text allowFontScaling={false}
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

              <TouchableOpacity
                onPress={() => navigation.navigate("RegisterScreen")}
                style={{ marginTop: 15 }}
              >
                <Text allowFontScaling={false} style={{ textAlign: "center", color: "black", fontSize: 12, fontWeight: 800 }}>
                  Don't have an account? Sign Up
                </Text>
              </TouchableOpacity>
        
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
    paddingHorizontal: 10,
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
