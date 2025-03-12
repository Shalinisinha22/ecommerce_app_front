
import { StyleSheet, Text, View,StatusBar,Modal,Button, TouchableOpacity, Alert } from 'react-native';
import { AppNavigator } from './navigation/AppNavigator';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '././redux/store';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { ShopProvider } from './Components/ShopContext';


export default function App() {

// AsyncStorage.clear()
const [shopType,setShopType]= useState(null)

const [selectedShopType, setSelectedShopType] = useState('');
const [selectedShopClientId,setselectedShopClientId]= useState('');

const getShop= async()=>{
  const res = JSON.parse(await AsyncStorage.getItem('shopDetails'));
  if(res){
    return;
  }
  else{
    try{
      const resp= await axios.get("https://mahilamediplex.com/mediplex/defaultShops")
     
      const data= resp.data
      
      await AsyncStorage.setItem("shopDetails",JSON.stringify(data[0]))
    }
    catch(err){
      console.log(err.message,"38")
    }
  }



}
useEffect(()=>{
  getShop()
},[])








  return (


<Provider store={store}>
        <PersistGate persistor={persistor}>
        <View style={styles.container}>
        <Toast ref={(ref) => Toast.setRef(ref)} />

<ShopProvider>
<AppNavigator></AppNavigator>
</ShopProvider>
     

   
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
