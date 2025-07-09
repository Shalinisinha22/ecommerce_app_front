import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Pressable,
  Dimensions,
  Image,
  Button,
  RefreshControl,
  Animated,
} from "react-native";
import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { Entypo } from "@expo/vector-icons";
import moment from "moment-timezone";
import { EvilIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Keyboard } from "react-native";
import { TouchableWithoutFeedback } from "react-native";

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [countryCode, setCountryCode] = useState("");
  const [editableFullName, setEditableFullName] = useState("");
  const [editableFatherName, setEditableFatherName] = useState("");
  const [editableCity, setEditableCity] = useState("");
  const [editableState, setEditableState] = useState("");
  const [editableDistrict, setEditableDistrict] = useState("");
  const [editableSubDivision, setEditableSubDivision] = useState("");
  const [editableBlock, setEditableBlock] = useState("");
  const [editablePanchayat, setEditablePanchayat] = useState("");
  const [editableCountry, setEditableCountry] = useState("");
  const [editableEmail, setEditableEmail] = useState("");
  const [editablePincode, setEditablePincode] = useState("");
  const [editableMobile, setEditableMobile] = useState("");
  const [editableWhatsapp, setEditableWhatsapp] = useState("");
  const [editableDob, setEditableDob] = useState("");
  const [editableAddress, setEditableAddress] = useState("");
  const [editableProfileImage, setEditableProfileImage] = useState("");
  const [profileData, setProfile] = useState(null);
  const [dob, setDob] = useState(new Date());
  const [countryName, setCountryName] = useState("");
  const [imageDetail, setImageDetail] = useState(null);
  const [imageName, setImage] = useState("");
  const [photo, setPhoto] = useState(null);
  let userData = useSelector((state) =>
    state.user.userInfo ? state.user.userInfo : null
  );
  const userInfo = useSelector((state) =>
    state.user.userInfo ? state.user.userInfo.client_id : null
  );
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uriParts = result.assets[0].uri.split("/");
      const imageName = uriParts[uriParts.length - 1];
      setImageDetail(result.assets[0]);
      setPhoto(result.assets[0].uri);
      setImage(imageName);
    }
  };

  const getProfileData = async () => {
    try {
      const res = await axios.get(
        "https://mahilamediplex.com/mediplex/clientDetails",
        {
          params: {
            client_id: userInfo,
          },
        }
      );

      if (res.data) {
        const initialProfile = res.data[0];
        setProfile(initialProfile);
        setEditableFullName(initialProfile.client_entry_name || "");
        setEditableMobile(initialProfile.mobile || "");
        setEditableEmail(initialProfile.email || "");
        setEditableProfileImage(initialProfile.image || "");
        setEditableAddress(initialProfile.address || "");
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  const scrollY = useRef(new Animated.Value(0)).current;
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await getProfileData();
    setRefreshing(false);
  };

  const uploadImage = async (imageUri) => {
    const formData = new FormData();
    const newImageUri = imageUri.startsWith("file://")
      ? imageUri
      : `file://${imageUri}`;
    const mimeType = imageName.endsWith(".png") ? "image/png" : "image/jpeg";
    formData.append("image", {
      uri: newImageUri,
      type: mimeType,
      name: imageName || `Img${userInfo}.jpg`,
    });

    try {
      const response = await axios.post(
        "https://mahilamediplex.com/mediplex/uploadImage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            imgName: "photo",
          },
        }
      );
      console.log("Image upload response:", response.data);
      return response.data.imageName || `Img${userInfo}.jpg`;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  const handleProfileUpdate = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      handleSubmit(onSubmit)();
    }, 100);
  };

  const onSubmit = async (data) => {
    let finalImageName = imageName || editableProfileImage;

    try {
      if (photo) {
        const uploadedImage = await uploadImage(photo);
        if (uploadedImage) {
          finalImageName = uploadedImage;
        }
      }

      const profileData = {
        first_name: data.fullname || editableFullName,
        m_address: data.address || editableAddress,
        m_mobile: data.phone || editableMobile,
        m_email: data.email || editableEmail,
        photo: finalImageName,
        client_id: userInfo,
      };

      const res = await axios.post(
        "https://mahilamediplex.com/mediplex/updateProfile",
        profileData
      );

      console.log("Update profile response:", res.data);

      // Handle both possible success messages
      if (
        res.data.message === "Updation successful" ||
        res.data.message === "Profile updated successfully" ||
        res.data === "Profile updated successfully"
      ) {
        await getProfileData();

        const updatedUserData = {
          ...userData,
          client_entry_name: profileData.first_name,
          mobile: profileData.m_mobile,
          email: profileData.m_email,
          address: profileData.m_address,
          image: finalImageName,
        };

        dispatch({ type: "SET_USER_INFO", payload: updatedUserData });
        dispatch({ type: "SET_USER_IMAGE", payload: finalImageName });

        showToast();
        navigation.navigate("Home");
      } else {
        console.error("Unexpected response:", res.data);
        Alert.alert("Error", "Profile update failed. Please try again.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      Alert.alert("Error", "Failed to update profile. Check network and try again.");
    }
  };

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Your profile is updated.",
    });
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
            <Animated.ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
              }
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollViewContent}
            >
              <View style={styles.container}>
                <Text
                  allowFontScaling={false}
                  style={{
                    height: 1,
                    borderColor: "whitesmoke",
                    borderWidth: 2,
                    marginBottom: 0,
                  }}
                />
                <View style={styles.header}>
                  <TouchableOpacity
                    onPress={() => navigation.openDrawer()}
                    style={{ paddingTop: 0, paddingLeft: 0 }}
                  >
                    <Entypo name="menu" size={40} color="#155d27" />
                  </TouchableOpacity>
                  <View style={{ alignItems: "center", marginTop: 0 }}>
                    <Text
                      allowFontScaling={false}
                      style={{ color: "#9e0059", fontSize: 15, letterSpacing: 2 }}
                    >
                      EDIT DETAILS
                    </Text>
                  </View>
                  <Pressable onPress={() => navigation.navigate("Home")}>
                    <Image
                      source={require("../assets/logo.png")}
                      style={{ height: 80, width: 80, resizeMode: "contain" }}
                    />
                  </Pressable>
                </View>
                <Text
                  allowFontScaling={false}
                  style={{
                    height: 1,
                    borderColor: "whitesmoke",
                    borderWidth: 2,
                    marginTop: 0,
                  }}
                />
                <View style={{ marginTop: 20 }}></View>
                <Text
                  allowFontScaling={false}
                  style={{ letterSpacing: 2, fontSize: 18, fontWeight: 800 }}
                >
                  PERSONAL DETAILS
                </Text>
                <View style={{ marginTop: 20 }}></View>
                <View style={{ marginTop: 0 }}>
                  <Text allowFontScaling={false}>FullName</Text>
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
                            setEditableFullName(value);
                            onChange(value);
                          }}
                          value={editableFullName}
                        />
                      )}
                      name="fullname"
                    />
                  </View>
                </View>
                <View style={styles.inputCont}>
                  <Text allowFontScaling={false}>Mobile Number</Text>
                  <View style={styles.inputBoxCont}>
                    <Controller
                      control={control}
                      rules={{
                        minLength: {
                          value: 10,
                          message: "Mobile number must be 10 digits long",
                        },
                        maxLength: {
                          value: 10,
                          message: "Mobile number must be 10 digits long",
                        },
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "Mobile number can only contain digits",
                        },
                      }}
                      render={({
                        field: { onChange, onBlur, value },
                        fieldState: { error },
                      }) => (
                        <>
                          <TextInput
                            allowFontScaling={false}
                            cursorColor={"white"}
                            keyboardType="numeric"
                            maxLength={10}
                            style={{
                              color: "white",
                              marginVertical: 5,
                              width: 300,
                              fontSize: 16,
                            }}
                            onBlur={onBlur}
                            onChangeText={(value) => {
                              if (/^\d*$/.test(value)) {
                                setEditableMobile(value);
                                onChange(value);
                              }
                            }}
                            value={editableMobile}
                          />
                        </>
                      )}
                      name="phone"
                    />
                  </View>
                </View>
                <View style={styles.inputCont}>
                  <Text allowFontScaling={false}>Email</Text>
                  <View style={styles.inputBoxCont}>
                    <Controller
                      control={control}
                      rules={{
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Enter a valid email address",
                        },
                      }}
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
                            setEditableEmail(value);
                            onChange(value);
                          }}
                          value={editableEmail}
                        />
                      )}
                      name="email"
                    />
                  </View>
                </View>
                <View style={styles.inputCont}>
                  <Text allowFontScaling={false}>Received Address</Text>
                  <View style={styles.addressInputContainer}>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          allowFontScaling={false}
                          multiline
                          numberOfLines={4}
                          cursorColor={"white"}
                          autoFocus={true}
                          style={{
                            color: "white",
                            marginVertical: 5,
                            width: 300,
                            fontSize: 16,
                            textAlign: "justify",
                          }}
                          onBlur={onBlur}
                          onChangeText={(value) => {
                            setEditableAddress(value);
                            onChange(value);
                          }}
                          value={editableAddress}
                        />
                      )}
                      name="address"
                    />
                    <Image
                      source={require("../assets/delivery.png")}
                      style={{ width: 35, height: 45, resizeMode: "contain" }}
                    />
                  </View>
                </View>
                <View style={styles.inputCont}>
                  <Text allowFontScaling={false}>Upload Photo</Text>
                  <View style={[styles.inputBoxCont, { backgroundColor: "white" }]}>
                    {photo ? (
                      <Image
                        source={{ uri: photo }}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 100,
                          marginRight: 20,
                        }}
                      />
                    ) : editableProfileImage ? (
                      <Image
                        source={{
                          uri: `https://mahilamediplex.com/upload/photo/${editableProfileImage}?${new Date().getTime()}`,
                        }}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 100,
                          marginRight: 20,
                        }}
                      />
                    ) : null}
                    <Button title="Choose File" color="#9e0059" onPress={pickImage} />
                  </View>
                </View>
                <View style={{ marginTop: 30 }} />
                <TouchableOpacity style={styles.button} onPress={handleProfileUpdate}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Update Profile
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
      <Toast position="bottom" bottomOffset={150} />
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollViewContent: {},
  container: {
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  inputBoxCont: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#17842b",
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 12,
    paddingLeft: 10,
  },
  button: {
    width: 350,
    backgroundColor: "#9e0059",
    borderRadius: 6,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 15,
    marginBottom: 40,
  },
  inputCont: {
    marginTop: 10,
  },
  addressInputContainer: {
    flexDirection: "row",
    backgroundColor: "#17842b",
    width: Dimensions.get("screen").width * 0.9,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 2,
    paddingLeft: 10,
  },
  errorText: {
    color: "red",
  },
});

export default ProfileScreen;
// working