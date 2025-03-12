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
  Animated
} from "react-native";
import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { Entypo } from "@expo/vector-icons";
// import DateTimePicker from "@react-native-community/datetimepicker";
import moment from 'moment-timezone';
import { EvilIcons } from "@expo/vector-icons";
// import CountryPicker from 'react-native-country-picker-modal';
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from 'react-native-picker-select';
import { Keyboard } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
// import { Select } from "native-base";
const ProfileScreen = ({ navigation }) => {




const dispatch= useDispatch()

  const [countryCode, setCountryCode] = useState('');
  const [editableFullName, setEditableFullName] = useState("");
  const [editableFatherName, setEditableFatherName] = useState("");
  const [editableCity, setEditableCity] = useState("");
  const [editableState, setEditableState] = useState("");
  const [editableDistrict, setEditableDistrict] = useState("");
  const [editableSubDivision, setEditableSubDivision] = useState("");
  const [editableBlock,setEditableBlock]= useState("")
  const [editablePanchayat,setEditablePanchayat]= useState("")
  const [editableCountry, setEditableCountry] = useState("");
  const [editableEmail, setEditableEmail] = useState("");
  const [editablePincode, setEditablePincode] = useState("");
  const [editableMobile, setEditableMobile] = useState("");
  const [editableWhatsapp, setEditableWhatsapp] = useState("");
  const [editableDob, setEditableDob] = useState("");
  const [editableAddress, setEditableAddress] = useState("");
  const [editableProfileImage, setEditableProfileImage] = useState("")




  
  const [profileData, setProfile] = useState(null);
  const [dob, setDob] = useState(new Date())
  const [countryName, setCountryName] = useState("")
  const [imageDetail, setImageDetail] = useState(null)
  const [imageName, setImage] = useState("");
  const [photo, setPhoto] = useState(null);

  let userData = useSelector(state => state.user.userInfo ? state.user.userInfo : null);



  const userInfo = useSelector(state => state.user.userInfo ? state.user.userInfo.client_id : null);

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();




  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uriParts = result.assets[0].uri.split('/');
      const imageName = uriParts[uriParts.length - 1];
      setImageDetail(result.assets[0])
      setPhoto(result.assets[0].uri);
      // setEditableProfileImage()
      setImage(imageName);

    }

  };

  const getProfileData = async () => {


    try {
      const res = await axios.get("https://mahilamediplex.com/mediplex/clientDetails", {
        params: {
          client_id: userInfo,
        },
      });

      // console.log(res.data[0])

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
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name:imageName
    });


    try {
      const response = await axios.post('https://mahilamediplex.com/mediplex/uploadImage', formData, {
        headers: {
           'Content-Type': 'multipart/form-data',
        },
        params: {
          imgName: "photo",
        }, });
     

      // console.log('Upload success:', response.data);
      setImage(`Img${userInfo}.jpg`)
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleProfileUpdate = () => {
    // Dismiss the keyboard first
    // console.log("Button Pressed - Preparing to dismiss keyboard");
    Keyboard.dismiss();
    // console.log("called")

    // Add a small delay before calling handleSubmit to ensure keyboard is fully closed
    setTimeout(() => {
        handleSubmit(onSubmit)();
    }, 100); // 100ms delay should be enough to handle this
};

  const onSubmit = async (data) => {

  

    if (photo) {
      await uploadImage(photo)
    }




    const res = await axios.post("https://mahilamediplex.com/mediplex/updateProfile", {

      first_name: data.fullname ? data.fullname : editableFullName,
      m_address: data.address ? data.address : editableAddress,
      m_mobile: data.phone ? data.phone : editableMobile,
      m_email: data.email ? data.email : editableEmail,
      photo: imageName ? imageName : editableProfileImage,
      client_id: userInfo

    });

    if (res.data.message === "Updation successful") {
     await getProfileData();
    //  console.log(imageName,editableProfileImage)
    }

  //   if(editableBankName){
  // userData.bank_name= editableBankName
  // dispatch({ type: 'SET_USER_INFO', payload: userData})

  //   }
  //   if(editableIFSC){
  //     userData.bank_ifsc_code= editableIFSC
  //     dispatch({ type: 'SET_USER_INFO', payload: userData})
  //   }

  //   if(editableBankAccountNumber){
  //     userData.bank_ac_no= editableBankAccountNumber
  //     dispatch({ type: 'SET_USER_INFO', payload: userData})
  //   }

    if(editableProfileImage){
      // console.log(userData)
      // console.log(imageName,editableProfileImage)
      userData.image= editableProfileImage
      dispatch({ type: 'SET_USER_IMAGE', payload:editableProfileImage });
      dispatch({ type: 'SET_USER_INFO', payload: userData})

    }

    showToast();
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
                              keyboardShouldPersistTaps='handled' contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>

        <Text
        allowFontScaling={false}
        style={{
          height: 1,
          borderColor: "whitesmoke",
          borderWidth: 2,
          marginBottom:0
        }}
      />
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ paddingTop: 0,paddingLeft:0}}>
<Entypo name="menu" size={40} color="#155d27" />
   
            </TouchableOpacity>

            <View style={{ alignItems: "center", marginTop: 0 }}>
              <Text allowFontScaling={false} style={{ color: "#9e0059", fontSize: 15,letterSpacing:2 }}>
               EDIT DETAILS
              </Text>
            </View>

            <Pressable onPress={()=>navigation.navigate("Home")}>
              <Image source={require("../assets/logo.png")} style={{ height: 80, width: 80, resizeMode: "contain" }} />
            </Pressable> 
            </View>
{/*        
        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
     
                        </View> */}
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
            <Text allowFontScaling={false} style={{ letterSpacing: 2, fontSize: 18, fontWeight: 800 }}>PERSONAL DETAILS</Text>

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

{/* <EvilIcons name="lock" size={30} color="white" /> */}
              </View>
            </View>

         

            <View style={styles.inputCont}>
  <Text allowFontScaling={false}>Mobile Number</Text>
  <View style={styles.inputBoxCont}>
    <Controller
      control={control}
      rules={{
        // required: "Mobile number is required", // Required field with message
        minLength: {
          value: 10,
          message: "Mobile number must be 10 digits long",
        },
        maxLength: {
          value: 10,
          message: "Mobile number must be 10 digits long",
        },
        pattern: {
          value: /^[0-9]+$/, // Only allow numbers
          message: "Mobile number can only contain digits",
        },
      }}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <>
          <TextInput
            allowFontScaling={false}
            cursorColor={"white"}
            keyboardType="numeric"
            maxLength={10} // Restrict input length to 10 digits
            style={{
              color: "white",
              marginVertical: 5,
              width: 300,
              fontSize: 16,
            }}
            onBlur={onBlur}
            onChangeText={(value) => {
              if (/^\d*$/.test(value)) { // Only allow numeric input
                setEditableMobile(value);
                onChange(value);
              }
            }}
            value={editableMobile}
          />
          {/* Display error message */}
        </>
      )}
      name="phone"
    />

{/* <EvilIcons name="lock" size={30} color="white" /> */}

  </View>
  {/* {errors.phone && <Text allowFontScaling={false} style={styles.errorText}>{errors.phone.message}</Text>} */}

</View>

  


           

            <View style={styles.inputCont}>
              <Text allowFontScaling={false}>Email</Text>
              <View style={styles.inputBoxCont}>
                <Controller
                  control={control}
                  rules={{
                    // required: "Email is required", // Email is required
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Regular expression for email validation
                      message: "Enter a valid email address", // Custom error message
                    },
                  }}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
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
                        setEditableEmail(value)
                        onChange(value)
                      }}
                      value={editableEmail}
                    />
                  )}
                  name="email"
                />

                {/* <Image source={require("../assets/mail.png")} style={{ width: 35, height: 45, resizeMode: "contain" }} /> */}
              </View>
              {/* {errors.email && <Text allowFontScaling={false} style={styles.errorText}>{errors.email.message}</Text>} */}

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
                        textAlign: "justify"
                      }}
                      onBlur={onBlur}
                      onChangeText={(value) => {
                        setEditableAddress(value)
                        onChange(value)
                      }}
                      value={editableAddress}
                    />
                  )}
                  name="address"
                />

<Image source={require("../assets/delivery.png")} style={{ width: 35, height: 45, resizeMode: "contain" }} />

              </View>
            </View>

    
            <View style={styles.inputCont}>
              <Text allowFontScaling={false}>Upload Photo</Text>
              <View style={[styles.inputBoxCont, { backgroundColor: "white" }]}>
                { photo ? <Image source={{ uri: photo }} style={{ width: 100, height: 100, borderRadius: 100, marginRight: 20 }} />:editableProfileImage && <Image source={{ uri: `https://mahilamediplex.com/upload/photo/${editableProfileImage}` }} style={{ width: 100, height: 100, borderRadius: 100, marginRight: 20 }} /> }
                <Button title="Choose File" color="#9e0059" onPress={pickImage} />
              </View>
            </View>

       
            {/* <View style={{ marginTop: 20 }}></View>
            <Text allowFontScaling={false} style={{ letterSpacing: 2, fontSize: 18, fontWeight: 800 }}>BANK DETAILS</Text>
            <View style={{ marginTop: 20 }}></View> */}
            {/* bank name */}
            {/* <View style={{ marginTop: 0 }}>
              <Text allowFontScaling={false}>Bank Name</Text>
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
                        setEditableBankName(value);
                        onChange(value);
                      }}
                      value={editableBankName}
                    />
                  )}
                  name="bankName"
                />
              </View>
            </View> */}
            {/* account holder name */}
            {/* <View style={{ marginTop: 0 }}>
              <Text allowFontScaling={false}>Account Holder Name</Text>
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
                        setEditableAccountHolderName(value);
                        onChange(value);
                      }}
                      value={editableAccountHolderName}
                    />
                  )}
                  name="accountHolderName"
                />
              </View>
            </View> */}
            {/* branch name */}
            {/* <View style={{ marginTop: 0 }}>
              <Text allowFontScaling={false}>Branch Name</Text>
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
                        setEditableBranchName(value);
                        onChange(value);
                      }}
                      value={editableBranchName}
                    />
                  )}
                  name="branchName"
                />
              </View>
            </View> */}
            {/* bank account number */}
            {/* <View style={styles.inputCont}>
              <Text allowFontScaling={false}>Bank Account Number</Text>
              <View style={styles.inputBoxCont}>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      allowFontScaling={false}
                      cursorColor={"white"}
                      keyboardType="numeric"
                      autoFocus={true}
                      style={{
                        color: "white",
                        marginVertical: 5,
                        width: 300,
                        fontSize: 16,
                      }}
                      onBlur={onBlur}
                      onChangeText={(value) => {
                        setEditableBankAccountNumber(value)
                        onChange(value)
                      }}
                      value={editableBankAccountNumber}
                    />
                  )}
                  name="bankAccountNumber"
                />
              </View>
            </View> */}
            {/* IFSC code */}
            {/* <View style={{ marginTop: 0 }}>
              <Text allowFontScaling={false}>IFSC Code</Text>
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
                        setEditableIFSC(value);
                        onChange(value);
                      }}
                      value={editableIFSC}
                    />
                  )}
                  name="ifsc"
                />
              </View>
            </View> */}
            {/* Pan number */}
            {/* <View style={{ marginTop: 0 }}>
              <Text allowFontScaling={false}>PAN Number</Text>
              <View style={styles.inputBoxCont}>
                <Controller
                  control={control}
                  rules={{
                    // required: "Mobile number is required", // Required field with message
                  
                    maxLength: {
                      value: 10,
                      message: "Enter valid Pan number",
                    },
                  
                  }}

                  editable
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
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
                        setEditablePanNumber(value);
                        onChange(value);
                      }}
                      value={editablePanNumber}
                    />
                  )}
                  name="pan"
                />
              </View>

              {errors.pan && <Text allowFontScaling={false} style={styles.errorText}>{errors.pan.message}</Text>}

            </View> */}
            {/* Account Type */}
            {/* <View style={styles.inputCont}>
      <Text allowFontScaling={false} style={{ fontWeight: '500', fontSize: 16 }}>
        Account Type 
      </Text>
   
        <Picker
          style={{ backgroundColor: "#17842b", color: "white", fontSize: 18 }}
          selectedValue={editableAccountType} // Use the state variable
          onValueChange={(itemValue) => {
            console.log(itemValue, "Selected Account Type");
            setEditableAccountType(itemValue); // Update editable account type
            setAccountType(itemValue); // Sync with accountType
          }}
        >
          {accountTypes.map((item) => (
            <Picker.Item key={item.id} label={item.type} value={item.type} />
          ))}
        </Picker>
   
    </View> */}

            <View style={{ marginTop: 30 }} />

            

            <TouchableOpacity
              style={styles.button}
              onPress={handleProfileUpdate}>

              <Text allowFontScaling={false}

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
          <Toast
          position='bottom'
          bottomOffset={150}
        />
    
         </>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollViewContent: {
    // flexGrow: 1,
    // paddingBottom: 40,
  },
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
    width: Dimensions.get('screen').width * 0.9,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 2,
    paddingLeft: 10,
  },
  errorText:{
   color:"red"
  }
})



export default ProfileScreen;
