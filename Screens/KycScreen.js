import { View, Text, Dimensions, Button, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import axios from 'axios';
import { useSelector } from 'react-redux';

const width = Dimensions.get('screen').width;

const KycScreen = () => {
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharFrontName, setAadharFrontName] = useState(null);
  const [aadharFrontDetail,setAadharFrontDetail]= useState(null)
  const [aadharBack, setAadharBack] = useState(null);
  const [aadharBackName, setAadharBackName] = useState(null);
  const [aadharBackDetail,setAadharBackDetail]= useState(null)
  const [panCard, setPanCard] = useState(null);
  const [panCardName, setPanCardName] = useState(null);
  const [panCardDetail, setPanCardDetail] = useState(null);
  const [bankProof, setBankProof] = useState(null);
  const [bankProofName, setBankProofName] = useState(null);
  const [bankProofDetail, setBankProofDetail] = useState(null);
  const [af, setAf] = useState(null);
  const [ab, setAb] = useState(null);
  const [pan, setPan] = useState(null);
  const [bank, setBank] = useState(null);

  const userInfo = useSelector(state => state.user.userInfo ? state.user.userInfo.client_id : null);

  const pickImage = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (result && !result.canceled && result.assets && result.assets[0].uri) {
      const imageName = `${type}_${userInfo}.jpg`;

      switch (type) {
        case "aadhaarFront":
          setAadharFront(result.assets[0].uri);
          setAadharFrontName(type);
          setAadharFrontDetail(imageName)
          break;
        case "aadhaarBack":
          setAadharBack(result.assets[0].uri);
          setAadharBackName(type);
          setAadharBackDetail(imageName)
          break;
        case "pan":
          setPanCard(result.assets[0].uri);
          setPanCardName(type);
          setPanCardDetail(imageName)
          break;
        case "cheque":
          setBankProof(result.assets[0].uri);
          setBankProofName(type);
          setBankProofDetail(imageName)
          break;
        default:
          break;
      }
    } else {
      console.log('Image picking was canceled or failed.');
    }
  };

  const uploadImage = async (imageUri, imgName,imgDetail) => {
    if (!imageUri || !imgName || !imgDetail) {
      console.error('Image URI or name is missing.');
      return;
    }

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: imgDetail,
    });

    try {
      const response = await axios.post(
        'https://mahilamediplex.com/mediplex/uploadImage',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          params: {
            imgName: imgName,
          },
        }
      );
      

      console.log('Upload success:', response.data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleSubmit = async () => {
    if (aadharFront) await uploadImage(aadharFront, aadharFrontName,aadharFrontDetail);
    if (aadharBack) await uploadImage(aadharBack, aadharBackName,aadharBackDetail);
    if (panCard) await uploadImage(panCard, panCardName,panCardDetail);
    if (bankProof) await uploadImage(bankProof, bankProofName,bankProofDetail);

    // Update profile after all images have been uploaded
    updateProfile();
  };

  const updateProfile = async () => {
    try {
      console.log('Updating profile with:', {
        aadharFrontName,
        aadharBackName,
        panCardName,
        bankProofName,
      });

      const res = await axios.post("https://mahilamediplex.com/mediplex/updateKyc", {
        aadhar_front: aadharFrontDetail? aadharFrontDetail :af,
        aadhar_back: aadharBackDetail?aadharBackDetail:ab,
        pan_card:panCardDetail?panCardDetail:pan,
        bank_proof: bankProofDetail?bankProofDetail:bank,
        client_id: userInfo,
      });

      if (res.data.message === "Updation successful") {
        showToast();
        getKYCData();
      }
    } catch (err) {
      console.log('Profile update failed:', err.message);
    }
  };

  const getKYCData = async () => {
    console.log(userInfo);
    try {
      const res = await axios.get("https://mahilamediplex.com/mediplex/getKYCData", {
        params: { client_id: userInfo },
      });
      console.log(res.data);
      const data = res.data[0];
      setAf(data.adhaar_front_image);
      setAb(data.adhaar_back_image);
      setPan(data.pan_image);
      setBank(data.cheque_image);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getKYCData();
  }, []);

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Your KYC is updated.",
    });
  };

  return (
    <View style={{ width: width, alignItems: "center", flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
        <View style={{ alignItems: "center", marginTop: 15 }}>
          <Text allowFontScaling={false} style={{ color: "gray", fontSize: 15, letterSpacing: 2 }}>
            Edit KYC
          </Text>
        </View>
        <Text
          allowFontScaling={false}
          style={{
            height: 1,
            borderColor: "whitesmoke",
            borderWidth: 2,
            marginTop: 15,
            width: width
          }}
        />
        <View style={{ width: width, alignItems: "center" }}>
          {/* Aadhar proof front */}
          <View style={styles.inputCont}>
            <Text allowFontScaling={false}style={{ fontSize: 22, letterSpacing: 2 }}>AADHAR PROOF (front)</Text>
            <Text allowFontScaling={false}style={{ fontSize: 20, color: "gray", marginTop: 20 }}>
              <FontAwesome5 name="file-upload" size={24} color="#17842b" /> Upload Photo
            </Text>
            <View style={[styles.inputBoxCont, { backgroundColor: "white", alignItems: "center" }]}>
              {aadharFront ? (
                <Image source={{ uri: aadharFront }} style={{ width: 150, height: 150, resizeMode: "contain" }} />
              ) : af ? (
                <Image source={{ uri: `https://mahilamediplex.com/upload/aadhaar/front/${af}` }} style={{ width: 150, height: 150, resizeMode: "contain" }} />
              ) : (
                <Text allowFontScaling={false}>No image selected</Text>
              )}
              <Text allowFontScaling={false}style={{ marginTop: 10, marginBottom: 5 }}>{aadharFrontName}</Text>
              <Button style={{ marginTop: 10 }} title="Choose File" color="#9e0059" onPress={() => pickImage("aadhaarFront")} />
            </View>
          </View>

          {/* Aadhar proof back */}
          <View style={styles.inputCont}>
            <Text allowFontScaling={false}style={{ fontSize: 22, letterSpacing: 2 }}>AADHAR PROOF (back)</Text>
            <Text allowFontScaling={false}style={{ fontSize: 20, color: "gray", marginTop: 20 }} >
              <FontAwesome5 name="file-upload" size={24} color="#17842b" /> Upload Photo
            </Text>
            <View style={[styles.inputBoxCont, { backgroundColor: "white", alignItems: "center" }]}>
              {aadharBack ? (
                <Image source={{ uri: aadharBack }} style={{ width: 150, height: 150, resizeMode: "contain" }} />
              ) : ab ? (
                <Image source={{ uri: `https://mahilamediplex.com/upload/aadhaar/back/${ab}` }} style={{ width: 150, height: 150, resizeMode: "contain" }} />
              ) : (
                <Text allowFontScaling={false}>No image selected</Text>
              )}
              <Text allowFontScaling={false}style={{ marginTop: 10, marginBottom: 5 }}>{aadharBackName}</Text>
              <Button style={{ marginTop: 10 }} title="Choose File" color="#9e0059" onPress={() => pickImage("aadhaarBack")} />
            </View>
          </View>

          {/* PAN card proof */}
          <View style={styles.inputCont}>
            <Text allowFontScaling={false}style={{ fontSize: 22, letterSpacing: 2 }}>PAN Card Proof</Text>
            <Text allowFontScaling={false}style={{ fontSize: 20, color: "gray", marginTop: 20 }} >
              <FontAwesome5 name="file-upload" size={24} color="#17842b" /> Upload Photo
            </Text>
            <View style={[styles.inputBoxCont, { backgroundColor: "white", alignItems: "center" }]}>
              {panCard ? (
                <Image source={{ uri: panCard }} style={{ width: 150, height: 150, resizeMode: "contain" }} />
              ) : pan ? (
                <Image source={{ uri: `https://mahilamediplex.com/upload/pan/${pan}` }} style={{ width: 150, height: 150, resizeMode: "contain" }} />
              ) : (
                <Text allowFontScaling={false}>No image selected</Text>
              )}
              <Text allowFontScaling={false}style={{ marginTop: 10, marginBottom: 5 }}>{panCardName}</Text>
              <Button style={{ marginTop: 10 }} title="Choose File" color="#9e0059" onPress={() => pickImage("pan")} />
            </View>
          </View>

          {/* Bank proof */}
          <View style={styles.inputCont}>
            <Text allowFontScaling={false}style={{ fontSize: 22, letterSpacing: 2 }}>Bank Proof</Text>
            <Text allowFontScaling={false}style={{ fontSize: 20, color: "gray", marginTop: 20 }} >
              <FontAwesome5 name="file-upload" size={24} color="#17842b" /> Upload Photo
            </Text>
            <View style={[styles.inputBoxCont, { backgroundColor: "white", alignItems: "center" }]}>
              {bankProof ? (
                <Image source={{ uri: bankProof }} style={{ width: 150, height: 150, resizeMode: "contain" }} />
              ) : bank ? (
                <Image source={{ uri: `https://mahilamediplex.com/upload/cheque/${bank}` }} style={{ width: 150, height: 150, resizeMode: "contain" }} />
              ) : (
                <Text allowFontScaling={false}>No image selected</Text>
              )}
              <Text allowFontScaling={false}style={{ marginTop: 10, marginBottom: 5 }}>{bankProofName}</Text>
              <Button style={{ marginTop: 10 }} title="Choose File" color="#9e0059" onPress={() => pickImage("cheque")} />
            </View>
          </View>

          {/* Submit Button */}
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: "#9e0059", borderRadius: 5, padding: 15,paddingHorizontal:75 }}>
              <Text allowFontScaling={false}style={{ color: "white", fontSize: 18 }}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  inputCont: {
    marginTop: 30,
    padding: 10,
    width: "90%",
  },
  inputBoxCont: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
});

export default KycScreen;
