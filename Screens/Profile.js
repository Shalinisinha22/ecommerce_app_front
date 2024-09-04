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
// import DateTimePicker from "@react-native-community/datetimepicker";
import moment from 'moment-timezone';
import { EvilIcons } from "@expo/vector-icons";
// import CountryPicker from 'react-native-country-picker-modal';
import { Picker } from "@react-native-picker/picker";
import RNPickerSelect from 'react-native-picker-select';
// import { Select } from "native-base";
const ProfileScreen = ({ navigation }) => {


  const accountTypes= [{
    id:0,
    type:"Current"
  },
{id:1,
  type:"Saving"
}]

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

  const [state,setState]= useState(null)
  const [stateId,setStateId] = useState(null)
  const [districtValue,setDistrict]= useState(null)
  const [districtValueId,setDistrictId]= useState(null)
  const [subDivison,setSubDivision] = useState(null)
  const [subDivisonId,setSubDivisionId] = useState(null)
  const [block,setBlock]= useState(null)
  const [blockId,setBlockId]= useState(null)
  const [panchayat,setPanchayat]= useState(null)



  const [allStates,setAllStates] = useState([])
  const [allDistrict,setAllDistrict]= useState(null)
  const [allBlock,setAllBlock]= useState(null)
  const [allPanchayat,setAllPanchayat]= useState(null)




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
  const [selectedStateId, setSelectedStateId] = useState(null);

  const [stateIdNameMap, setStateIdNameMap] = useState({});

  const getAllState = async () => {
    try {
      const res = await axios.get("http://192.168.0.109:3002/mediplex/state");
      const data = res.data;
  
      // Create a mapping of state IDs to names
      const stateMap = {};
      data.forEach(state => {
        stateMap[state.id] = state.state;
      });
  
      setAllStates(data);
      setStateIdNameMap(stateMap);
    } catch (err) {
      console.log(err.message);
    }
  };

  const [allDistricts, setAllDistricts] = useState([]);
  const [districtIdNameMap, setDistrictIdNameMap] = useState({});
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);



   const getAllDistrict = async (id) => {
    // console.log(id,"124")
    
    try {
      const res = await axios.get("http://192.168.0.109:3002/mediplex/district", {
        params: {
          state_id: id
        },
      });
      const data = res.data;
      // console.log(data)
  
      // Create a mapping of district IDs to names
      const districtMap = {};
      data.forEach(district => {
        
        districtMap[district.district_code] = district.name;
      });
      //  console.log("141",districtIdNameMap[364])
      setAllDistricts(data);
      setDistrictIdNameMap(districtMap);
    } catch (err) {
      console.log(err.message);
    }
  };

//   useEffect(()=>{
// getAllDistrict(selectedStateId)
//   },[selectedStateId])



  const [allSubDivision, setAllSubDivision] = useState([]);
  const [subDivisonIdNameMap, setSubDivisionIdNameMap] = useState({});
  const [selectedSubDivisionId, setSelectedSubDivisionId] = useState(null);


  
   const getAllSubDivision = async (id) => {
    console.log(id,"163")
    
    try {
      const res = await axios.get("http://192.168.0.109:3002/mediplex/subDivision", {
        params: {
          district_id: id.district_code
        },
      });
      const data = res.data;
      console.log(data)
  
      // Create a mapping of district IDs to names
      const subDivisionMap = {};
      data.forEach(division => {
        
        subDivisionMap[district.district_code] = district.name;
      });
      //  console.log("141",districtIdNameMap[364])
      setAllSubDivision(data);
      setSubDivisionIdNameMap(subDivisionMap,"184");
    } catch (err) {
      console.log(err.message);
    }
  };

//   useEffect(()=>{
// getAllDistrict(selectedStateId)
//   },[editableState,state])


   useEffect(()=>{
    getAllSubDivision(selectedDistrictId)
      },[editableDistrict])


  

  const getAllRelation = async () => {
    try {
      const res = await axios.get("http://192.168.0.109:3002/mediplex/relation")
      const data = res.data
      setAllrelation(data)
    }
    catch (err) {
      console.log(err.message, "error")
    }
  }


  useEffect(() => {
    getAllState()
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

  const getProfileData = async () => {


    try {
      const res = await axios.get("http://192.168.0.109:3002/mediplex/clientDetails", {
        params: {
          client_id: userInfo,
        },
      });

      if (res.data) {
        const initialProfile = res.data[0];
        districtIdNameMap[initialProfile.district]
        // console.log(stateIdNameMap[initialProfile.m_state])
        setProfile(initialProfile);
        setEditableFullName(initialProfile.first_name || "");
        setEditableFatherName(initialProfile.m_father_name || "");
        setEditableMobile(initialProfile.m_mobile || "");
        setEditableWhatsapp(initialProfile.whatsapp || "");
        setEditableCity(initialProfile.m_city || "");
        setEditableState(stateIdNameMap[initialProfile.m_state]);
        setSelectedStateId(selectedStateId?selectedStateId:initialProfile.m_state || null);
        setEditableDistrict(districtIdNameMap[initialProfile.district] || "");
        setSelectedDistrictId(selectedDistrictId?selectedDistrictId:initialProfile.district || null);
        setEditableSubDivision(subDivisonIdNameMap[initialProfile.sub_division] || "");
        setSelectedSubDivisionId(initialProfile.sub_division || null);
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
  }, [stateIdNameMap,districtIdNameMap,subDivisonIdNameMap]);


  const handleStateChange = (itemValue,id) => {
    // Find the state ID based on the selected state name
    // console.log("goa id",id)
    const selectedId = allStates.find(state => state.state === itemValue)?.id;
    setSelectedStateId(id);
    setEditableState(itemValue);
    setState(itemValue)
    setStateId(id)
    if(selectedId){
      getAllDistrict(id)
    }
   
  };
  const uploadImage = async (imageUri) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name:imageName
    });


    try {
      const response = await axios.post('http://192.168.0.109:3002/mediplex/uploadImage', formData, {
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


  const onSubmit = async (data) => {
    // console.log(data, editableDob, editableCountry, photo)

    if (photo) {
      await uploadImage(photo)
    }



    console.log("299",selectedStateId,selectedDistrictId,state,stateId,data.bankName)

    const res = await axios.post("http://192.168.0.109:3002/mediplex/updateProfile", {

      first_name: data.fullname ? data.fullname : editableFullName,
      m_dob: dob ? moment(dob).format('YYYY-MM-DD') : moment(editableDob).format('YYYY-MM-DD'),
      m_father_name: data.fathername ? data.fathername : editableFatherName,
      m_address: data.address ? data.address : editableAddress,
      m_city: data.city ? data.city : editableCity,
      m_state: stateId ? stateId : selectedStateId,
      district:districtValueId?districtValueId:selectedDistrictId.district_code ,
      sub_division: selectedSubDivisionId.sub_div_id || editableSubDivision,
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
      bank_ac_holder: data.accountholderName ? data.accountHolderName : editableAccountHolderName,
      bank_branch: data.branchName? data.branchName: editableBranchName,
      bank_account_type: accountType? accountType: "",
      bank_ifsc_code: data.ifsc?data.ifsc:editableIFSC,
      bank_account_number:data.bankAccountNumber?data.bankAccountNumber:editableBankAccountNumber,
      bank_name: data.bankName? data.bankName: editableBankName,
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


  const handleDistrictChange =(itemValue) => {
   
       
    // Find the district ID based on the selected district name
    const selectedId =allDistricts.find(district => district.name == itemValue);
    setSelectedDistrictId(selectedId);
    setDistrictId(selectedId?.district_code)
    setDistrict(itemValue)
    setEditableDistrict(itemValue);

    // console.log(selectedDistrictId)
    getAllSubDivision(selectedDistrictId)
  };

  const handleSubDivisionChange =(itemValue) => {
   
       
    // Find the district ID based on the selected district name
    const selectedId =allSubDivision.find(division => division.name == itemValue);
    setSelectedSubDivisionId(selectedId);
    setEditableSubDivision(itemValue);
  };


  return (
    <SafeAreaView style={{ backgroundColor: "white", paddingBottom: 0 }}>
    
      <ScrollView>
        <View style={styles.safeArea}>
          <KeyboardAvoidingView>
          <Text
        allowFontScaling={false}
        style={{
          height: 1,
          borderColor: "whitesmoke",
          borderWidth: 2,
          marginBottm:10
        }}
      />
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <Text allowFontScaling={false} style={{ color: "#9e0059", fontSize: 15,letterSpacing:2 }}>
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


            {/* <View style={styles.inputCont}>
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
            </View> */}

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

            {/* state */}
            <View style={styles.inputCont}>
    <Text allowFontScaling={false} style={{ fontWeight: '500', fontSize: 16 }}>State</Text>
    <RNPickerSelect
      style={{
        inputIOS: { backgroundColor: "#17842b", color: "white", fontSize: 18 },
        inputAndroid: { backgroundColor: "#17842b", color: "white", fontSize: 18 },
      }}
      placeholder={{
        label: "Select a state",
        value: null,
        color: "#9EA0A4",
      }}
      value={state?state:editableState}
      onValueChange={(itemValue,id)=>handleStateChange(itemValue,id)}
      items={allStates.map((item) => ({
        label: item.state,
        value: item.state,
        key: item.id,
      }))}
    />
  </View>

  {/* district */}


   {allDistricts.length!=0 && 
  <View style={styles.inputCont}>
    <Text allowFontScaling={false} style={{ fontWeight: '500', fontSize: 16 }}>District </Text>
    <RNPickerSelect
      style={{
        inputIOS: { backgroundColor: "#17842b", color: "white", fontSize: 18 },
        inputAndroid: { backgroundColor: "#17842b", color: "white", fontSize: 18 },
      }}
      placeholder={{
        label: "Select a District",
        value: null,
        color: "#9EA0A4",
      }}
      value={districtValue?districtValue:editableDistrict}
      onValueChange={(itemValue)=>handleDistrictChange(itemValue)}
      items={allDistricts.map((item) => ({
        label: item.name,
        value: item.name,
        key: item.name,
      }))}
    />
  </View>} 


  {/* subDivision */}

  {allSubDivision.length!=0 && 
  <View style={styles.inputCont}>
    <Text style={{ fontWeight: '500', fontSize: 16 }}>SubDivision</Text>
    <RNPickerSelect
      style={{
        inputIOS: { backgroundColor: "#17842b", color: "white", fontSize: 18 },
        inputAndroid: { backgroundColor: "#17842b", color: "white", fontSize: 18 },
      }}
      placeholder={{
        label: "Select a SubDivision",
        value: null,
        color: "#9EA0A4",
      }}
      value={subdivsionValue?subdivsionValue:editableSubDivision}
      onValueChange={(itemValue)=>handleSubDivisionChange(itemValue)}
      items={allSubDivision.map((item) => ({
        label: item.name,
        value: item.name,
        key: item.name,
      }))}
    />
  </View>} 


 {/* {allBlock.length!=0 && 
  <View style={styles.inputCont}>
    <Text style={{ fontWeight: '500', fontSize: 16 }}>Block</Text>
    <RNPickerSelect
      style={{
        inputIOS: { backgroundColor: "#17842b", color: "white", fontSize: 18 },
        inputAndroid: { backgroundColor: "#17842b", color: "white", fontSize: 18 },
      }}
      placeholder={{
        label: "Select a Block",
        value: null,
        color: "#9EA0A4",
      }}
      value={editableBlock}
      onValueChange={(itemValue)=>setEditableBlock(itemValue)}
      items={allBlock.map((item) => ({
        label: item.name,
        value: item.name,
        key: item.name,
      }))}
    />
  </View>}   */}


            {/* <View style={styles.inputCont}>
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
            </View> */}

          {/* <View style={styles.inputCont}>
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

              {/* </TouchableOpacity>
            </View>  */} 



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
                {editableProfileImage ? <Image source={{ uri: `http://192.168.0.109:3002/upload/photo/${editableProfileImage}` }} style={{ width: 100, height: 100, borderRadius: 100, marginRight: 20 }} /> : photo && <Image source={{ uri: photo }} style={{ width: 100, height: 100, borderRadius: 100, marginRight: 20 }} />}
                <Button title="Choose File" color="#9e0059" onPress={pickImage} />
              </View>
            </View>

            <View style={{ marginTop: 20 }}></View>
            <Text allowFontScaling={false}  style={{ letterSpacing: 2, fontSize: 18, fontWeight: 800 }}>NOMINEE DETAILS</Text>

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
              <Text allowFontScaling={false} style={{ fontWeight: 500, fontSize: 16 }}>Relation </Text>
         <Picker
  style={{ backgroundColor: "#17842b", color: "white", fontSize: 18 }}
  selectedValue={editableNomineeRelation}
  onValueChange={(itemValue) => {
    setRelation(itemValue);
    setEditableNomineeRelation(itemValue);
  }}
>
  {allRelation != null && allRelation.map((item) => (
    <Picker.Item key={item.id} label={item.name} value={item.name} />
  ))}
</Picker>
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
            <Text allowFontScaling={false} style={{ letterSpacing: 2, fontSize: 18, fontWeight: 800 }}>BANK DETAILS</Text>

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
              <Text allowFontScaling={false} style={{ fontWeight: 500, fontSize: 16 }}>Account Type  </Text>
              <Picker  style={{ backgroundColor: "#17842b",color:"white",fontSize:18 }} selectedValue={editableAccountType} minWidth="200"  placeholder="Select Account Type" _selectedItem={{
                        bg: "#D0D0D0"
                        // endIcon: <CheckIcon size="5"/>
                    }} mt={1}
                     onValueChange={(itemValue) => 
                        {
                          //  console.log(itemValue)
                           setAccountType(itemValue);
                           setEditableAccountType(itemValue); 
                        }
                   }>

                    {
                      accountTypes.map((item)=>(
                        
                <Picker.Item key={item.id} label={item.type} value={item.type} />
                      ))
                    }

            


              </Picker>
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
