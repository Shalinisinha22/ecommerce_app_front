import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions,Button,Alert,Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { imgUrl } from '../Components/Image/ImageUrl'
import { useRoute } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { TextInput } from 'react-native-gesture-handler'
import * as ImagePicker from 'expo-image-picker';
import { Entypo } from '@expo/vector-icons'

const width = Dimensions.get('screen').width

const FundRequestScreen = ({navigation}) => {



    const userInfo = useSelector((state) => state.user.userInfo ? state.user.userInfo : null)
   

    console.log(userInfo)
    const [bankDetails, setBankDetails] = useState(null)
    const [transaction_id, setTransaction_id] = useState("")
    const [paymentSlip, setPaymentSlip] = useState(null)
    const [paymentSlipName,setPaymentSlipName] = useState(null)
    const [amt,setAmt]= useState("")
    const [err,setErr]= useState("")
    const getBankDetails = async () => {
        try {
            const res = await axios.get("https://mahilamediplex.com/mediplex/bankDetails")
            const data = res.data

            // console.log(data)
            setBankDetails(data)

        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getBankDetails()
    }, [])


    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            const uriParts = result.assets[0].uri.split('/');
            const imageName = uriParts[uriParts.length - 1];
            setPaymentSlipName(imageName);
            setPaymentSlip(result.assets[0].uri);
        }
        else {
            Alert.alert('You did not select any image.');
        }

    };

    const uploadImage = async (imageUri) => {
        const formData = new FormData();
        formData.append('image', {
          uri: imageUri,
          type: 'image/jpeg',
          name:paymentSlipName
        });
    
    
        try {
          const response = await axios.post('https://mahilamediplex.com/mediplex/uploadImage', formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
            params: {
              imgName: "slip",
            }, });
         
    
         
        } catch (error) {
          console.error('Upload failed:', error);
        }
    };

    const handleSubmit = async (event) => {
     
        let errors = {};
    
        if (transaction_id === "" && paymentSlip === null) {
            if (transaction_id === "") {
                errors.transaction_id = "This field is required";
            } else if (paymentSlip === null) {
                errors.paymentSlip = "This field is required";
            }
    
            setErr(errors);
            setTimeout(() => {
                setErr("");
            }, 3000);
        } else {
            await uploadImage(paymentSlip);


            console.log("110",amt)
    
            try {
                const res = await axios.post("https://mahilamediplex.com/mediplex/fund-request", {
                    name: userInfo.first_name,
                    mobile_no: userInfo.mobile,
                    client_id: userInfo.client_id,
                    user_id: userInfo.id,
                    slip: paymentSlipName,
                    paid_amt: amt,
                    txt_no: transaction_id,
                    package: "",
                });


                console.log(res.data)
    
                if (res.data.message === "Data inserted successfully") {
                    Alert.alert("Success");
                    setPaymentSlip(null)
                    setTransaction_id("")
                    setAmt(null)
                }
            } catch (err) {
                console.log(err.message);
            }
        }
    };
    
    

    
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            
<View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ paddingTop: 0,paddingLeft:0}}>
<Entypo name="menu" size={40} color="#155d27" />
   
            </TouchableOpacity>

         <View style={{ alignItems: "center", marginTop: 10 }}>
           <Text allowFontScaling={false} style={{ color: "#9e0059", fontSize: 15,letterSpacing:2 }}>
        FUND REQUEST
           </Text>
         </View>
         <Pressable onPress={()=>navigation.navigate("Home")}>
              <Image source={require("../assets/logo.png")} style={{ height: 80, width: 80, resizeMode: "contain" }} />
            </Pressable> 
                     </View>
         {/* <Text
     allowFontScaling={false}
     style={{
       height: 1,
       borderColor: "whitesmoke",
       borderWidth: 2,
       marginTop: 10,
     }}
   /> */}
            {/* <Text
                allowFontScaling={false}
                style={{
                    height: 1,
                    borderColor: "whitesmoke",
                    borderWidth: 2,
                    marginBottm: 10
                }}
            /> */}
            {bankDetails != null &&

                <View style={{ alignItems: "center", marginTop: 2 }}>
                    <Image source={{ uri: `${imgUrl}/wlogo/${bankDetails[0]?.bank_logo}` }} style={{ height: 60, width: 80, resizeMode: "contain" }} ></Image>
                </View>
            }





            <Text
                allowFontScaling={false}
                style={{
                    height: 1,
                    borderColor: "whitesmoke",
                    borderWidth: 2,
                    marginTop: 15,
                }}
            />

            <ScrollView  keyboardShouldPersistTaps='handled' >
                <View style={{ width: width, marginTop: 20, padding: 10 }}>
                    {
                        bankDetails != null &&
                        <>
                            <View style={{ width: width * 0.95, backgroundColor: "#D0D0D0", paddingVertical: 14, paddingHorizontal: 5, flexDirection: "row", gap: 15 }}>
                                <Text allowFontScaling={false} style={{ color: "gray" }}>Wallet Name :</Text>
                                <Text allowFontScaling={false} style={{ fontWeight: 'bold' }}>{bankDetails[0].bank_name}</Text>
                            </View>

                            <View style={{ width: width * 0.95, backgroundColor: "#f0f0f0", paddingVertical: 14, paddingHorizontal: 5, flexDirection: "row", gap: 15, marginTop: 0 }}>
                                <Text allowFontScaling={false} style={{ color: "gray" }}>Wallet Holder :</Text>
                                <Text allowFontScaling={false} style={{ fontWeight: 'bold' }}>{bankDetails[0].bank_acc_holder}</Text>
                            </View>


                            <View style={{ width: width * 0.95, backgroundColor: "#D0D0D0", paddingVertical: 14, paddingHorizontal: 5, flexDirection: "row", gap: 15 }}>
                                <Text allowFontScaling={false} style={{ color: "gray" }}>Wallet No. :</Text>
                                <Text allowFontScaling={false} style={{ fontWeight: 'bold' }}>{bankDetails[0].bank_ac_no}</Text>
                            </View>




                        </>
                    }

                </View>

                {bankDetails != null &&
                    <>
                        <View style={{ width: width, marginTop: 10, alignItems: "center" }}>
                            <Text allowFontScaling={false} style={{ fontWeight: "bold", marginBottom: 10 }}>QR Code</Text>

                            <Image source={{ uri: `${imgUrl}/wqrcode/${bankDetails[0]?.bank_qr_code}` }} style={{ height: 280, width: 350, resizeMode: "contain" }} ></Image>


                        </View>

                        <View style={{ width: width, marginTop: 10, padding: 10 }}>
                            <View style={{ width: width * 0.95, backgroundColor: "#f0f0f0", paddingVertical: 14, paddingHorizontal: 5, flexDirection: "row", gap: 15 }}>
                                <Text allowFontScaling={false} style={{ color: "gray" }}>UPI :</Text>
                                <Text allowFontScaling={false} style={{ fontWeight: 'bold' }}>{bankDetails[0].bank_upi_id}</Text>
                            </View>
                        </View>


                    </>
                }

                {userInfo != null &&
                    <View style={{ width: width, marginTop: 0, padding: 10 }}>
                        <View style={{ width: width * 0.95, backgroundColor: "#D0D0D0", paddingVertical: 14, paddingHorizontal: 5, flexDirection: "row", gap: 15 }}>
                            <Text allowFontScaling={false} style={{ color: "gray" }}>Full Name :</Text>
                            <Text allowFontScaling={false} style={{ fontWeight: 'bold' }}>{userInfo.first_name}</Text>
                        </View>

                        <View style={{ width: width * 0.95, backgroundColor: "#f0f0f0", paddingVertical: 14, paddingHorizontal: 5, flexDirection: "row", gap: 15, marginTop: 0 }}>
                            <Text allowFontScaling={false} style={{ color: "gray" }}>Mobile :</Text>
                            <Text allowFontScaling={false} style={{ fontWeight: 'bold' }}>{userInfo.mobile}</Text>
                        </View>

                        <View style={{ width: width * 0.95, backgroundColor: "#D0D0D0", paddingVertical: 14, paddingHorizontal: 5, flexDirection: "row", gap: 15 }}>
                            <Text allowFontScaling={false} style={{ color: "gray" }}>Client_id :</Text>
                            <Text allowFontScaling={false} style={{ fontWeight: 'bold' }}>{userInfo.client_id}</Text>
                        </View>

                        <View style={{ width: width * 0.95, backgroundColor: "#f0f0f0", paddingVertical: 14, paddingHorizontal: 5, flexDirection: "row", gap: 15, marginTop: 0,alignItems:"center" }}>
                            <Text allowFontScaling={false} style={{ color: "gray" }}>Paid Amt. :</Text>
                            <TextInput keyboardType='numeric' style={{
                                marginVertical: 5,
                                width: 150,
                                fontSize: 18,
                                fontWeight:"bold"
                            }} value={amt} onChangeText={(text) => setAmt(text)} ></TextInput>
                        </View>

                        <View style={{ width: width * 0.95, backgroundColor: "#D0D0D0", paddingVertical: 14, paddingHorizontal: 5, flexDirection: "row", gap: 15, alignItems: "center",flexWrap:"wrap" }}>
                            <Text allowFontScaling={false} style={{ color: "gray" }}>Transaction_id :</Text>
                            <TextInput style={{
                                marginVertical: 5,
                                width: 150,
                                fontSize: 18,
                                fontWeight:"bold"
                            }} value={transaction_id} onChangeText={(text) => setTransaction_id(text)} ></TextInput>
                        </View>
                        {err.transaction_id && <Text allowFontScaling={false} style={{color:"red",fontSize:10,marginBottom:5}}>{err.transaction_id}</Text>}
                        <View style={{ width: width * 0.95, backgroundColor: "#f0f0f0", paddingVertical: 14, paddingHorizontal: 5, flexDirection: "row", gap: 15, alignItems: "center",flexWrap:"wrap" }}>
                            <Text allowFontScaling={false} style={{ color: "gray" }}>Payment Slip :</Text>
                        
                            <View>
                                {paymentSlip && <Image source={{ uri: paymentSlip }} style={{ width: 200, height: 200 }} />}
                                <Button title="Choose File" color="#155d27" onPress={pickImage} />
                            </View>
                        </View>
                        {err.paymentSlip && <Text allowFontScaling={false} style={{color:"red",fontSize:10,marginBottom:5}}>{err.paymentSlip}</Text>}

                    </View>
                }
                <View style={{width:width,alignItems:"center",marginBottom:20}}>
                <TouchableOpacity

style={{
backgroundColor: "#9e0059",
paddingVertical: 15,
paddingHorizontal:20,
justifyContent: "center",
alignItems: "center",
marginTop: 1,
borderRadius: 6,
marginTop:5,
width:300


}}
onPress={()=>handleSubmit()}
>
<Text allowFontScaling={false}
style={{
textAlign: "center",
color: "white",
fontSize: 13,
fontWeight: "bold",
}}
> Submit
</Text>
</TouchableOpacity>
                </View>

            </ScrollView>

        </View>
    )
}

export default FundRequestScreen