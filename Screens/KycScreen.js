import { View, Text,Dimensions, Button,StyleSheet, ScrollView,Image,TouchableOpacity,Alert } from 'react-native'
import React, {useState,useEffect} from 'react'
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import axios from 'axios';
const width= Dimensions.get('screen').width
import { useSelector } from 'react-redux';


const KycScreen = () => {

    const [imageDetail, setImageDetail] = useState(null)
    const [imageName, setImage] = useState("");
    const [photo, setPhoto] = useState(null);
    const [editableProfileImage, setEditableProfileImage] = useState("")

    const [aadharFront,setAadharFront]= useState(null)
    const [aadharFrontName,setAadharFrontName]= useState(null)
    const [aadharBack,setAadharBack]= useState(null)
    const [aadharBackName,setAadharBackName]= useState(null)

    const [panCard,setPanCard]= useState(null)
    const [panCardName,setPanCardName]= useState(null)

    const [bankProof,setBankProof]= useState(null)
    const [bankProofName,setBankProofName]= useState(null)

    const [imageArray,setImageArray]= useState(null)

    const userInfo = useSelector(state => state.user.userInfo ? state.user.userInfo.client_id : null);





    const pickImage = async (type) => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
        //   aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {

          const uriParts = result.assets[0].uri.split('/');
          const imageName = uriParts[uriParts.length - 1];
          let imageArray=[]

          if(type=="aadharFront"){
            setAadharFront(result.assets[0].uri)
            setAadharFrontName(imageName)
            imageArray.push(result.assets[0].uri)


          }
          else if(type=="aadharBack"){
            setAadharBack(result.assets[0].uri)
            setAadharBackName(imageName)
            imageArray.push(result.assets[0].uri)
          }
          else if(type=="pan"){
            setPanCard(result.assets[0].uri)
            setPanCardName(imageName)
            imageArray.push(result.assets[0].uri)
          }
          else if(type=="bank"){
            setBankProof(result.assets[0].uri)
            setBankProofName(imageName)
            imageArray.push(result.assets[0].uri)
          }
        
    
           setImageArray(imageArray)
        }
    
      };


      const uploadImage = async (imageUri,imgName) => {
        const formData = new FormData();
        formData.append('image', {
          uri: imageUri,
          type: 'image/jpeg',
          name: `${imgName}${userInfo}.jpg`,
        });
    
    
        try {
          const response = await axios.post('http://192.168.0.109:3000/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          console.log('Upload success:', response.data);


          if(imgName=="aadharFront"){
            setAadharFrontName(`${imgName}${userInfo}.jpg`)
          }
          else if(imgName="aadharBack"){
            setAadharBackName(`${imgName}${userInfo}.jpg`)
          }
          else if(imgName="panCard"){
            setPanCardName(`${imgName}${userInfo}.jpg`)
          }
          else if(imgName="bankProof"){
            setBankProofName(`${imgName}${userInfo}.jpg`)
          }


          updateProfile()
        
        } catch (error) {
          console.error('Upload failed:', error);
        }
      };
    

      const handleSubmit = async () => {
         if(aadharFront){
          uploadImage(aadharFront,"aadharFront")
         }
         if(aadharBack){
          uploadImage(aadharBack,"aadharBack")
         }
         if(panCard){
          uploadImage(panCard,"panCard")
         }
         if(bankProof){
          uploadImage(bankProof,"bankProof")
         }
      };
      

      const updateProfile= async()=>{
        try{

          const res= await axios.post("http://192.168.0.109:3000/updateKyc",{
            aadhar_front:aadharFrontName,
            aadhar_back:aadharBackName,
            pan_card:panCardName,
            bank_proof:bankProofName,
            client_id:userInfo

          })

          if (res.data.message === "Updation successful") {
            showToast()
          }



        }
        catch(err){
          console.log(err.message)
        }
      }

      const showToast = () => {
        Toast.show({
          type: "success",
          text1: "Your KYC is updated.",
        });
      };
    

  return (
    <View style={{width:width,alignItems:"center",flex:1,backgroundColor:"#fff"}}>
    <ScrollView>

  <View style={{ alignItems: "center", marginTop: 15 }}>
              <Text allowFontScaling={false} style={{ color: "gray", fontSize: 15,letterSpacing:2 }}>
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
          width:width
        }}
      />
      <View style={{width:width,alignItems:"center"}}>

        {/* Aadhar proof front */}

            <View style={styles.inputCont}>
    <Text style={{fontSize:22,letterSpacing:2}}>AADHAR PROOF (front)</Text>
              <Text style={{fontSize:20,color:"gray",marginTop:20}} allowFontScaling={false}><FontAwesome5 name="file-upload" size={24} color="#17842b" /> Upload Photo</Text>
              <View style={[styles.inputBoxCont, { backgroundColor: "white",alignItems:"center" }]}>
                { aadharFront && <Image source={{ uri: aadharFront }} style={{ width: 100, height: 100,resizeMode:"contain"}} />}
                <Text style={{marginTop:10,marginBottom:5}}>{aadharFrontName}</Text>
                <Button style={{marginTop:10}} title="Choose File" color="#9e0059" onPress={()=>pickImage("aadharFront")} />
              </View>
            </View>

{/* Aadhar proof back */}
<View style={styles.inputCont}>
    <Text style={{fontSize:22,letterSpacing:2}}>AADHAR PROOF (back)</Text>
              <Text style={{fontSize:20,color:"gray",marginTop:20}} allowFontScaling={false}><FontAwesome5 name="file-upload" size={24} color="#17842b" /> Upload Photo</Text>
              <View style={[styles.inputBoxCont, { backgroundColor: "white" ,alignItems:"center"}]}>
                {aadharBack && <Image source={{ uri: aadharBack }} style={{ width: 100, height: 100,resizeMode:"contain"}}  />}
                <Text style={{marginTop:10,marginBottom:5}}>{aadharBackName}</Text>
                <Button style={{marginTop:10}} title="Choose File" color="#9e0059" onPress={()=>pickImage("aadharBack")} />
              </View>
            </View>

            {/* pan card proof */}
            <View style={styles.inputCont}>
    <Text style={{fontSize:22,letterSpacing:2}}>PAN Card Proof</Text>
              <Text style={{fontSize:20,color:"gray",marginTop:20}} allowFontScaling={false}><FontAwesome5 name="file-upload" size={24} color="#17842b" /> Upload Photo</Text>
              <View style={[styles.inputBoxCont, { backgroundColor: "white",alignItems:"center" }]}>
                { panCard && <Image source={{ uri: panCard}} style={{ width: 100, height: 100,resizeMode:"contain"}}  />}
                <Text style={{marginTop:10,marginBottom:5}}>{panCardName}</Text>
                <Button style={{marginTop:10}} title="Choose File" color="#9e0059" onPress={()=>pickImage("pan")} />
              </View>
            </View>


            {/* bank proof */}

            <View style={styles.inputCont}>
    <Text style={{fontSize:22,letterSpacing:2}}>BANK PROOF</Text>
              <Text style={{fontSize:20,color:"gray",marginTop:20}} allowFontScaling={false}><FontAwesome5 name="file-upload" size={24} color="#17842b" /> Upload Photo</Text>
              <View style={[styles.inputBoxCont, { backgroundColor: "white",alignItems:"center" }]}>
{bankProof && <Image source={{ uri: bankProof }} style={{ width: 150, height: 150,resizeMode:"contain"}}  />}
<Text style={{marginTop:10,marginBottom:5}}>{bankProofName}</Text>
                <Button style={{marginTop:10}} title="Choose File" color="#9e0059" onPress={()=>pickImage("bank")} />
              </View>
            </View>
      </View>




      <View style={{ marginTop: 30 }} />



<TouchableOpacity
  style={styles.button}
  onPress={()=>handleSubmit()}
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

<Toast
  position='bottom'
  bottomOffset={80}
/>

    </ScrollView>
    </View>
   
  )
}
const styles = StyleSheet.create({
  
    

    inputCont: {
      marginTop: 10,
      paddingVertical:20,
      borderColor:"#D0D0D0",
      borderWidth:2,
      borderRadius:10,
      alignItems:"center",
      width:width * 0.80
  
    },
    button: {
        width: 350,
        backgroundColor: "#17842b",
        borderRadius: 6,
        marginLeft: "auto",
        marginRight: "auto",
        padding: 15,
        marginBottom: 40,
      },
   
  })
  
  
export default KycScreen