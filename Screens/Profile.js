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
  Button
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from 'moment-timezone';
import { EvilIcons } from "@expo/vector-icons";
import CountryPicker from 'react-native-country-picker-modal';
import { Select } from "native-base";
const ProfileScreen = ({ navigation }) => {

  const [countryCode, setCountryCode] = useState('');
  const [editableFullName, setEditableFullName] = useState("");
  const [editableFatherName, setEditableFatherName] = useState("");
  const [editableCity, setEditableCity] = useState("");
  const [editableState, setEditableState] = useState("");
  const [editableCountry, setEditableCountry] = useState("");
  const [editableEmail, setEditableEmail] = useState("");
  const [editablePincode, setEditablePincode] = useState("");
  const [editableMobile, setEditableMobile] = useState("");
  const [editableWhatsapp, setEditableWhatsapp] = useState("");
  const [editableDob, setEditableDob] = useState("");
  const [editableAddress, setEditableAddress] = useState("");
  const [editableProfileImage, setEditableProfileImage] = useState("")

  const [editableNomineeName, setEditableNomineeName] = useState("")
  const [editableNomineeAge, setEditableNomineeAge] = useState("")
  const [editableNomineeRelation, setEditableNomineeRelation] = useState("")
  const [editableNomineeMobile, setEditableNomineeMobile] = useState("")


  const [editableBankName, setEditableBankName] = useState("")
  const [editableAccountHolderName, setEditableAccountHolderName] = useState("")
  const [editableBranchName, setEditableBranchName] = useState("")
  const [editableBankAccountNumber, setEditableBankAccountNumber] = useState("")
  const [editableIFSC, setEditableIFSC] = useState("")
  const [editablePanNumber, setEditablePanNumber] = useState("")
  const [editableAadharNumber, setEditableAadharNumber] = useState("")
  const [editableAccountType, setEditableAccountType] = useState("")

  const [allRelation, setAllrelation] = useState(null)
  const [relation, setRelation] = useState(null)
  const [accountType, setAccountType] = useState(null)




  const [profileData, setProfile] = useState(null);
  const [dob, setDob] = useState(new Date())
  const [countryName, setCountryName] = useState("")
  const [imageDetail, setImageDetail] = useState(null)
  const [imageName, setImage] = useState("");
  const [photo, setPhoto] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const userInfo = useSelector(state => state.user.userInfo ? state.user.userInfo.client_id : null);

  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();


  const getAllRelation = async () => {
    try {
      const res = await axios.get("http://192.168.0.109:3000/relation")
      const data = res.data
      setAllrelation(data)
    }
    catch (err) {
      console.log(err.message, "error")
    }
  }
  useEffect(() => {
    getAllRelation()
  }, [])
  const showDatepicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDob(selectedDate);
      setEditableDob(selectedDate)
      setShowDatePicker(false);
    }
  };
  const handleCountryCodeChange = (country) => {
    setCountryCode(country.cca2);
    setEditableCountry(country.name);
  };

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
  console.log(userInfo)
  const getProfileData = async () => {
    try {
      const res = await axios.get("http://192.168.0.109:3000/clientDetails", {
        params: {
          client_id: userInfo,
        },
      });

      if (res.data) {
        const initialProfile = res.data[0];
        setProfile(initialProfile);
        setEditableFullName(initialProfile.first_name || "");
        setEditableFatherName(initialProfile.m_father_name || "");
        setEditableMobile(initialProfile.m_mobile || "");
        setEditableWhatsapp(initialProfile.whatsapp || "");
        setEditableCity(initialProfile.m_city || "");
        setEditableState(initialProfile.m_state || "");
        setEditableCountry(initialProfile.m_country || "");
        setEditableEmail(initialProfile.m_email || "");
        setEditablePincode(initialProfile.m_pin || "");
        setEditableProfileImage(initialProfile.photo || "");
        setEditableAddress(initialProfile.m_address || "");
        setEditableDob(initialProfile.m_dob || "")
        setEditableNomineeName(initialProfile.nominee_name || "")
        setEditableNomineeAge(initialProfile.nominee_age || "")
        setEditableNomineeRelation(initialProfile.nominee_relation || "")
        setRelation(initialProfile.nominee_relation || "")
        setEditableNomineeMobile(initialProfile.nominee_mobile || "")
        setEditableBankName(initialProfile.bank_name || "")
        setEditableBankAccountNumber(initialProfile.bank_ac_holder || "")
        setEditableBranchName(initialProfile.bank_branch || "")
        setAccountType(initialProfile.bank_account_type || "")
        setEditableAccountType(initialProfile.bank_account_type || "")
        setEditableIFSC(initialProfile.bank_ifsc_code || "")
        setEditablePanNumber(initialProfile.m_pan || "")
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);



  const uploadImage = async (imageUri) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: `Img${userInfo}.jpg`,
    });


    try {
      const response = await axios.post('http://192.168.0.109:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload success:', response.data);
      setImage(`Img${userInfo}.jpg`)
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };


  const onSubmit = async (data) => {
    console.log(data, editableDob, editableCountry, photo)

    if (photo) {
      await uploadImage(photo)
    }



    console.log(imageName)

    const res = await axios.post("http://192.168.0.109:3000/updateProfile", {

      first_name: data.fullname ? data.fullname : editableFullName,
      m_dob: dob ? moment(dob).format('YYYY-MM-DD') : moment(editableDob).format('YYYY-MM-DD'),
      m_father_name: data.fathername ? data.fathername : editableFatherName,
      m_address: data.address ? data.address : editableAddress,
      m_city: data.city ? data.city : editableCity,
      m_state: data.state ? data.state : editableState,
      m_pin: data.pincode ? data.pincode : editablePincode,
      m_country: countryName ? countryName : editableCountry,
      m_mobile: data.phone ? data.phone : editableMobile,
      m_email: data.email ? data.email : editableEmail,
      photo: imageName ? imageName : editableProfileImage,
      whatsapp: data.whatsapp ? data.whatsapp : editableWhatsapp,
      nominee_name:data.nomineeName? data.nomineeName : editableNomineeName,
      nominee_age:data.nomineeAge? data.nomineeAge: editableNomineeAge,
      nominee_relation: relation? relation : "",
      nominee_mobile: data.nomineePhone ? data.nomineePhone : editableNomineeMobile,
      bank_name: data.bankName? data.bankname: editableBankName,
      bank_ac_holder: data.accountholderName ? data.accountHolderName : editableAccountHolderName,
      bank_branch: data.branchName? data.branchName: editableBranchName,
      bank_account_type: accountType? accountType: "",
      bank_ifsc_code: data.ifsc?data.ifsc:editableIFSC,
      m_pan:data.pan?data.pan:editablePanNumber,
      client_id: userInfo

    });

    if (res.data.message === "Updation successful") {
      getProfileData();
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
    <SafeAreaView style={{ backgroundColor: "white", paddingBottom: 0 }}>
    
      <ScrollView>
        <View style={styles.safeArea}>
          <KeyboardAvoidingView>
            <View style={{ alignItems: "center", marginTop: 5 }}>
              <Text allowFontScaling={false} style={{ color: "gray", fontSize: 15,letterSpacing:2 }}>
               EDIT DETAILS
              </Text>
            </View>
            <Text
        allowFontScaling={false}
        style={{
          height: 1,
          borderColor: "whitesmoke",
          borderWidth: 2,
          marginTop: 15,
        }}
      />

            <View style={{ marginTop: 20 }}></View>
            <Text style={{ letterSpacing: 2, fontSize: 18, fontWeight: 800 }}>PERSONAL DETAILS</Text>

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

            <View style={{ marginTop: 0 }}>
              <Text allowFontScaling={false}>Father's Name</Text>
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
                        setEditableFatherName(value);
                        onChange(value);
                      }}
                      value={editableFatherName}
                    />
                  )}
                  name="fathername"
                />
              </View>
            </View>

            <View style={styles.inputCont}>
              <Text allowFontScaling={false}>Mobile Number</Text>
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
                        setEditableMobile(value)
                        onChange(value)
                      }}
                      value={editableMobile}
                    />
                  )}
                  name="phone"
                />
              </View>
            </View>

            <View style={styles.inputCont}>
              <Text allowFontScaling={false}>WhatsApp</Text>
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
                        setEditableWhatsapp(value)
                        onChange(value)
                      }}
                      value={editableWhatsapp}
                    />
                  )}
                  name="whatsapp"
                />
              </View>
            </View>

            <View style={styles.inputCont}>
              <Text allowFontScaling={false}>Email</Text>
              <View style={styles.inputBoxCont}>
                <Controller
                  control={control}
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
                        setEditableEmail(value)
                        onChange(value)
                      }}
                      value={editableEmail}
                    />
                  )}
                  name="email"
                />
              </View>
            </View>


            <View style={styles.inputCont}>
              <Text style={{ fontWeight: 500, fontSize: 16 }}>Date of birth</Text>
              <Pressable style={[styles.inputBoxCont, { padding: 20 }]} onPress={showDatepicker}>
                <Text style={{ margin: 10 }}>

                  <EvilIcons name="calendar" size={24} color="#fff" onPress={showDatepicker} />
                </Text>
                {showDatePicker && (
                  <DateTimePicker
                    value={dob}
                    mode="date"
                    // display="default"
                    onChange={onDateChange}
                  />
                )}

                <Text style={{ color: "#fff", fontSize: 16 }}>{editableDob ? moment(editableDob).format('YYYY-MM-DD') : dob ? moment(dob).format('YYYY-MM-DD') : null}</Text>
              </Pressable>
            </View>

            <View style={styles.inputCont}>
              <Text allowFontScaling={false}>Address</Text>
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
              </View>
            </View>

            <View style={styles.inputCont}>
              <Text allowFontScaling={false}>City</Text>
              <View style={styles.inputBoxCont}>
                <Controller
                  control={control}
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
                        setEditableCity(value)
                        onChange(value)
                      }}
                      value={editableCity}
                    />
                  )}
                  name="city"
                />
              </View>
            </View>

            <View style={styles.inputCont}>
              <Text allowFontScaling={false}>State</Text>
              <View style={styles.inputBoxCont}>
                <Controller
                  control={control}
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
                        setEditableState(value)
                        onChange(value)
                      }}
                      value={editableState}
                    />
                  )}
                  name="state"
                />
              </View>
            </View>

             <View style={styles.inputCont}>
              <Text allowFontScaling={false}>Country</Text>
              <TouchableOpacity onPress={() => setIsPickerVisible(true)} style={[styles.inputBoxCont, { paddingVertical: 15 }]}>
                {console.log(editableCountry)}
                <Text style={{ color: "white", fontSize: 16 }}>
                  {editableCountry ? editableCountry : "Select Country"}
                </Text>
                {
                  isPickerVisible &&
                  <CountryPicker
                    countryCode={countryCode}
                    withFilter
                    withAlphaFilter
                    withCallingCode
                    onSelect={handleCountryCodeChange}
                    visible={isPickerVisible}
                    onClose={() => setIsPickerVisible(false)}

                  />
                }

               {/* {<Text style={{ fontSize: 16 }}>{editableCountry ? editableCountry : ""}</Text> } */}
              </TouchableOpacity>
            </View>



            <View style={styles.inputCont}>
              <Text allowFontScaling={false}>Pincode</Text>
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
                        setEditablePincode(value)
                        onChange(value);
                      }}
                      value={editablePincode}
                    />
                  )}
                  name="pincode"
                />
              </View>
            </View>



            <View style={styles.inputCont}>
              <Text allowFontScaling={false}>Upload Photo</Text>
              <View style={[styles.inputBoxCont, { backgroundColor: "white" }]}>
                {editableProfileImage ? <Image source={{ uri: `http://192.168.0.109:3000/uploads/${editableProfileImage}` }} style={{ width: 100, height: 100, borderRadius: 100, marginRight: 20 }} /> : photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100, borderRadius: 100, marginRight: 20 }} />}
                <Button title="Choose File" color="#9e0059" onPress={pickImage} />
              </View>
            </View>

            <View style={{ marginTop: 20 }}></View>
            <Text style={{ letterSpacing: 2, fontSize: 18, fontWeight: 800 }}>NOMINEE DETAILS</Text>

            <View style={{ marginTop: 20 }}></View>

            {/* nominee name */}
            <View style={{ marginTop: 0 }}>
              <Text allowFontScaling={false}>Nominee Name</Text>
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
                        setEditableNomineeName(value);
                        onChange(value);
                      }}
                      value={editableNomineeName}
                    />
                  )}
                  name="nomineeName"
                />
              </View>
            </View>


            {/* age */}

            <View style={{ marginTop: 0 }}>
              <Text allowFontScaling={false}>Nominee Age</Text>
              <View style={styles.inputBoxCont}>
                <Controller
                  control={control}
                  editable
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
                        setEditableNomineeAge(value);
                        onChange(value);
                      }}
                      value={editableNomineeAge}
                    />
                  )}
                  name="nomineeAge"
                />
              </View>
            </View>
            {/* relation */}
       <View style={styles.inputCont}>
              <Text style={{ fontWeight: 500, fontSize: 16 }}>Relation </Text>
              <Select style={{ backgroundColor: "#17842b",color:"white",fontSize:18 }} selectedValue={editableNomineeRelation} minWidth="200" accessibilityLabel="Select Relation" placeholder="Select Relation" _selectedItem={{
                        bg: "#D0D0D0"
                        // endIcon: <CheckIcon size="5"/>
                    }} mt={1} onValueChange={(itemValue) => 
                        {
                           setRelation(itemValue)
                           setEditableNomineeRelation(itemValue)
                        }
                   }>

                {allRelation != null && allRelation.map((item) => (
                  <Select.Item key={item.id} label={item.name} value={item.name} />
                ))}


              </Select>
            </View>


            {/* mobile */}
            <View style={styles.inputCont}>
              <Text allowFontScaling={false}>Nominee Mobile</Text>
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
                        setEditableNomineeMobile(value)
                        onChange(value)
                      }}
                      value={editableNomineeMobile}
                    />
                  )}
                  name="nomineePhone"
                />
              </View>
            </View>


            <View style={{ marginTop: 20 }}></View>
            <Text style={{ letterSpacing: 2, fontSize: 18, fontWeight: 800 }}>BANK DETAILS</Text>

            <View style={{ marginTop: 20 }}></View>
            {/* bank name */}
            <View style={{ marginTop: 0 }}>
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
            </View>
            {/* account holder name */}
            <View style={{ marginTop: 0 }}>
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
            </View>

            {/* branch name */}

            <View style={{ marginTop: 0 }}>
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
            </View>

            {/* bank account number */}
            <View style={styles.inputCont}>
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
            </View>

            {/* IFSC code */}

            <View style={{ marginTop: 0 }}>
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
            </View>

            {/* Pan number */}

            <View style={{ marginTop: 0 }}>
              <Text allowFontScaling={false}>PAN Number</Text>
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
                        setEditablePanNumber(value);
                        onChange(value);
                      }}
                      value={editablePanNumber}
                    />
                  )}
                  name="pan"
                />
              </View>
            </View>


            {/* Account Type */}
            <View style={styles.inputCont}>
              <Text style={{ fontWeight: 500, fontSize: 16 }}>Account Type </Text>
              <Select style={{ backgroundColor: "#17842b",color:"white",fontSize:18 }} selectedValue={editableAccountType ?editableAccountType:accountType} minWidth="200"  placeholder="Select Account Type" _selectedItem={{
                        bg: "#D0D0D0"
                        // endIcon: <CheckIcon size="5"/>
                    }} mt={1}
                     onValueChange={(itemValue) => 
                        {
                           console.log(itemValue)
                           setAccountType(itemValue)
                           setEditableAccountType(itemValue)
                        }
                   }>
                <Select.Item label="Current" value="Current" />
                <Select.Item label="Saving" value="Saving" />


              </Select>
            </View>


            <View style={{ marginTop: 30 }} />



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
                Update Profile
              </Text>
            </TouchableOpacity>

            <Toast
              position='bottom'
              bottomOffset={80}
            />
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};


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
})



export default ProfileScreen;
