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
    Keyboard
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import { MaterialIcons } from "@expo/vector-icons";
  import { AntDesign } from "@expo/vector-icons";
  import { Ionicons, FontAwesome } from "@expo/vector-icons";
  import { Fontisto, Entypo } from '@expo/vector-icons';
  import { useDispatch } from 'react-redux';
  import { setUser } from "../redux/actions/userActions";
  import axios from "axios";
  import { useForm, Controller } from 'react-hook-form';


  const height = Dimensions.get("screen").height;
  const width = Dimensions.get('screen').width;
  
  const RegisterScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [hidePass, setHidePass] = useState(true);
    const [name, setName] = useState("");
    const [isNameFocused, setIsNameFocused] = useState(false);
    const [mobile,setMobile]= useState("")
    const [password, setPassword] = useState("");
    const [error, setErr] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const [user, setUser] = useState("");
    const [flag, setFlag] = useState(false);
  const [isMobileFocused, setIsMobileFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  
  
 
  
   
  
    const { control, handleSubmit, formState: { errors } } = useForm({
      defaultValues: {
        name: '',
        mobile: '',
        password: '',
      },
    });
    
    const onSubmit = async (data) => {


      if (!data.name || !data.mobile || !data.password) {
        Alert.alert("Validation Error", "All fields are required.");
        return;
      }

      try {
        const response = await axios.post("https://mahilamediplex.com/mediplex/register", {
          data
        });
     console.log(response.data.user,'68')
  
        if (response.status === 201) {
          Alert.alert("Success", "User registered successfully.");
          setName("");
          setMobile("");
          setPassword("");
          dispatch({ type: 'SET_USER_INFO', payload: response.data.user });

          if(response.data?.user){

          navigation.navigate("Login"); // Redirect to login screen
        }
      }} catch (error) {
        if (error.response?.status === 409) {
          Alert.alert("", "User already exists.");
        } else {
          Alert.alert("", "Failed to register. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
  

  const onError: SubmitErrorHandler<FormValues> = (errors, e) => {
    setErr(errors)
    return console.log(errors)
  }
    return (
      <View style={{ backgroundColor: "white" }}>
        <ImageBackground source={require("../assets/b6.jpg")} style={{ width: width, height: height, alignItems: "center", paddingTop: 10 }}>
            <View style={{ marginTop: 10, width: width, alignItems: "center" }}>
              <Image style={styles.img} source={require("../assets/logo.png")} />
            </View>
            <ScrollView keyboardShouldPersistTaps='handled'>

            <KeyboardAvoidingView>
              <View style={{ alignItems: "center" }}>
                <Text allowFontScaling={false}  style={styles.heading}>Register your Account</Text>
                {error.message && <Text allowFontScaling={false}  style={{ color: "red", marginTop: 10 }}>{error.message}</Text>}
              </View>
  
              <View style={{ width: width, alignItems: "center" }}>
                <View style={{ marginTop: 20 }}>
                  <View style={[styles.inputBoxCont, isNameFocused && styles.inputBoxFocused]}>
                  <Ionicons name="person-outline" size={20} color="#C93393" style={styles.icon} />
                                        <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                        placeholder="Name"
                        placeholderTextColor="#333"
                        style={{
                          color: "black",
                          width: 300,
                          fontSize: 14,
                          marginVertical: 2,
                        }} 
                        onFocus={() => setIsNameFocused(true)}
                        onBlur={() => setIsNameFocused(false)}
                          onChangeText={value => onChange(value)}
                          value={value}
                          minLength={6} // Minimum length of 6 characters

                        />
                      )}
                      name="name"
                      rules={{ required: true,message:"Enter your name" }}
                    />
                  </View>
                  {errors.name && <Text allowFontScaling={false} style={{color:"red"}}>Name is required</Text>}

                </View>


                <View>
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

                  {console.log(errors.mobile?.message)}
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
                        fontSize:14,
                      }}
                      onChangeText={value => onChange(value)}
                      value={value}
                      minLength={6} // Minimum length of 6 characters
                    />
                      )}
                
                  name="password"
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                    message:"Enter your password"
                  }}
                />
          
                  </View>
                  {errors.password?.message  && <Text allowFontScaling={false}  style={{ color: "red" }}>{errors.password?.message}</Text>}
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
                 SIGN UP
                  </Text>
                </TouchableOpacity>
  
                <TouchableOpacity
                  onPress={() => navigation.navigate("Login")}
                  style={{ marginTop: 15 }}
                >
                  <Text allowFontScaling={false}  style={{ textAlign: "center", color: "black", fontSize: 12, fontWeight: 800 }}>
                    Already have an account? Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
            </ScrollView>
       
        </ImageBackground>
      </View>
    );
  };
  
  export default RegisterScreen;
  
  const styles = StyleSheet.create({
    img: {
      width: 180,
      height: 150,
      resizeMode: "contain"
    },
    heading: {
      fontSize: 15,
      fontWeight: "bold",
      marginTop: 1,
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
  