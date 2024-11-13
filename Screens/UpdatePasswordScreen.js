import { View, Text, Dimensions, TouchableOpacity,Image, ScrollView, StyleSheet, TextInput, Alert,Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from "react-hook-form";
import { useSelector } from 'react-redux';
import Toast from "react-native-toast-message";
import { Entypo } from '@expo/vector-icons';
const width = Dimensions.get('screen').width

import axios from 'axios';


const UpdatePasswordScreen = ({navigation}) => {
  const { control, handleSubmit, setValue, formState: { errors }, reset } = useForm();

  const [oldPass, setOldPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [rTypePass, setRtypePass] = useState("")
  const [error, setErr] = useState("")
  const [updateErr, setUpdateErr] = useState("")

  const userInfo = useSelector(state => state.user.userInfo ? state.user.userInfo.client_id : null);


  const onSubmit = async (data) => {
    console.log(data)
    let err = {}



    if (data.newPass == data.rTypePass) {
      try {
        const res = await axios.post("https://mahilamediplex.com/mediplex/change-password",
          { oldPassword: oldPass, newPassword: newPass, client_id: userInfo })

        console.log(res.status)
     
         if (res.status == 200) {
           reset()
           setOldPass("")
           setNewPass("")
           setRtypePass("")
          showToast()
        }


        else {
     
          reset()
          Alert.alert("Something went wrong!!")
        }
      }
      catch (err) {
        console.log(err.message)
        err.updateErr = "You have entered wrong password"
        setErr(err)
        setTimeout(() => {
          setErr("")
        }, 3000);
      }
    }
    else {
      err.notMatch = "Password not match"
      setErr(err)
      reset()
   
      setTimeout(() => {
        setErr("")
      }, 3000);
    }


  }



  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Your password is updated.",
    });
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>

      <ScrollView  keyboardShouldPersistTaps='handled' >



      <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ paddingTop: 0,paddingLeft:0}}>
<Entypo name="menu" size={40} color="#155d27" />
   
            </TouchableOpacity>


        <View style={{ alignItems: "center", marginTop: 0 }}>
          <Text allowFontScaling={false} style={{ color: "gray", fontSize: 15, letterSpacing: 2 }}>
            Update Login Password
          </Text>
        </View>

        <Pressable onPress={()=>navigation.navigate("Home")}>
              <Image source={require("../assets/logo.png")} style={{ height: 80, width: 80, resizeMode: "contain" }} />
            </Pressable> 
        </View>
        <Text
          allowFontScaling={false}
          style={{
            height: 1,
            borderColor: "whitesmoke",
            borderWidth: 2,
            marginTop: 10,
            width: width
          }}
        />

        <View style={{ width: width, marginTop: 40, alignItems: "center" }}>
          <View style={{ marginTop: 0 }}>
            <Text allowFontScaling={false}>Old Password</Text>
            <View style={styles.inputBoxCont}>
              <Controller
                control={control}
                editable
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    allowFontScaling={false}
                    cursorColor={"white"}
                    autoFocus={true}
                    style={{
                      color: "white",
                      marginVertical: 5,
                      width: 300,
                      fontSize: 16,
                    }}
                    onBlur={onBlur}
                    onChangeText={(value) => {
                      setOldPass(value)
                      onChange(value);
                    }}
                    value={oldPass}
                  />
                )}
                name="oldPass"
                rules={{
                  required: {
                    value: true,
                    message: "This field is Required",
                  },
                }}
              />
            </View>

            {errors.oldPass && (
              <Text allowFontScaling={false} style={{ color: "red" }}>
                {errors.oldPass.message}
              </Text>
            )}
          </View>

          <View style={{ marginTop: 10 }}>
            <Text allowFontScaling={false}>New Password</Text>
            <View style={styles.inputBoxCont}>
              <Controller
                control={control}
                editable
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    allowFontScaling={false}
                    cursorColor={"white"}
                    autoFocus={true}
                    style={{
                      color: "white",
                      marginVertical: 5,
                      width: 300,
                      fontSize: 16,
                    }}
                    onBlur={onBlur}
                    onChangeText={(value) => {
                      setNewPass(value)
                      onChange(value);
                    }}
                    value={newPass}
                  />
                )}
                name="newPass"
                rules={{
                  required: {
                    value: true,
                    message: "This field is Required",
                  },
                }}
              />
            </View>

            {errors.newPass && (
              <Text allowFontScaling={false} style={{ color: "red" }}>
                {errors.newPass.message}
              </Text>
            )}
          </View>

          <View style={{ marginTop: 10 }}>
            <Text allowFontScaling={false}>Re-Type New Password</Text>
            <View style={styles.inputBoxCont}>
              <Controller
                control={control}
                editable
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    allowFontScaling={false}
                    cursorColor={"white"}
                    autoFocus={true}
                    style={{
                      color: "white",
                      marginVertical: 5,
                      width: 300,
                      fontSize: 16,
                    }}
                    onBlur={onBlur}
                    onChangeText={(value) => {
                      setRtypePass(value)
                      onChange(value);
                    }}
                    value={rTypePass}
                  />
                )}
                name="rTypePass"
                rules={{
                  required: {
                    value: true,
                    message: "This field is Required",
                  },
                }}
              />
            </View>

            {errors.rTypePass && (
              <Text allowFontScaling={false} style={{ color: "red" }}>
                {errors.rTypePass.message}
              </Text>
            )}
            {error.notMatch != "" && (
              <Text allowFontScaling={false} style={{ color: "red" }}>
                {error.notMatch}
              </Text>
            )}
          </View>
        </View>


        <View style={{ marginTop: 40,width:width,alignItems:"center" }}>
          {error.updateErr != "" && (
            <Text allowFontScaling={false} style={{ color: "red",alignItems:"center",marginBottom:10 }}>
              {error.updateErr}
            </Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit(onSubmit)}


          >
            <Text allowFontScaling={false}

              style={{
                textAlign: "center",
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>

          <Toast
            position='bottom'
            bottomOffset={80}
          />
        </View>



      </ScrollView>

    </View>
  )
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 15,
    padding: 15
  },
  inputBoxCont: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#17842b",
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 0,
    paddingLeft: 10,
  },
  button: {
    width: 250,
    backgroundColor: "#9e0059",
    borderRadius: 6,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 15,
    marginBottom: 40,
  },


})

export default UpdatePasswordScreen