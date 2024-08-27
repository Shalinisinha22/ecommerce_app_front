
import { StyleSheet, Text, View,StatusBar,Modal,Button, TouchableOpacity } from 'react-native';
import { AppNavigator } from './navigation/AppNavigator';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '././redux/store';
// import { NativeBaseProvider } from 'native-base';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {


const [shopType,setShopType]= useState(null)
const [modalVisible, setModalVisible] = useState(true);
const [selectedShopType, setSelectedShopType] = useState('');
const [selectedShopClientId,setselectedShopClientId]= useState('');
const getShop= async()=>{
  const res = JSON.parse(await AsyncStorage.getItem('shopDetails'));
  // console.log("Shop Details APP:", res);
  if(res.client_id){

  }
  else{
    try{
      const res= await axios.get("http://mahilamediplex.com/mediplex/defaultShops")
      const data= res.data
  
      // console.log(data[0].client_id,"27 app")
      await AsyncStorage.setItem("shopDetails",JSON.stringify(data[0]))
    }
    catch(err){
      console.log(err.message)
    }
  }



}
useEffect(()=>{
  getShop()
},[])


const handleSelectShopType = async() => {

  if (selectedShopType) {
// console.log("selectedshop",selectedShopType)
await AsyncStorage.setItem("shopDetails",JSON.stringify(selectedShopType))
    setModalVisible(false);
  }
};


  return (


<Provider store={store}>
        <PersistGate persistor={persistor}>
        <View style={styles.container}>


        {/* <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                // Prevent modal from closing without selection
              }}>
              <View style={styles.modalView}>
              <Text style={styles.modalText}>Select Shop Type</Text>
                <View style={{paddingHorizontal:20,borderWidth:1,borderColor:"#D0D0D0",borderRadius:20}}>
                <Picker
                  selectedValue={selectedShopType}
                  style={{ height: 50, width: 250 }}
                  onValueChange={(itemValue) => setSelectedShopType(itemValue)}>
                  <Picker.Item label="Select a Shop Type" value="" />
                  {shopType!=null && shopType.map((item,id)=>(<Picker.Item key={id}  label={item.business_name} value={item} />))}
              

                </Picker>
                </View>
<View style={{marginTop:20}}></View>

<TouchableOpacity style={{paddingHorizontal:40, backgroundColor: "#f01c8b",
    borderRadius: 10,paddingVertical:10}} onPress={handleSelectShopType} ><Text allowFontScaling={false} style={{color:"white",fontSize:15,letterSpacing:2}}>Confirm</Text></TouchableOpacity>
            
            
              </View>
            </Modal>
  

  {selectedShopType!="" && !modalVisible &&    <AppNavigator></AppNavigator> } */}
   <AppNavigator></AppNavigator>
   
      <StatusBar
        backgroundColor='white'
        barStyle={"dark-content"}
        translucent={false}
      />


    </View>
        </PersistGate>
        </Provider>



 
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop:200
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
});
