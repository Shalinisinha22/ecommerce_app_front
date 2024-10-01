import { View, Text,StyleSheet } from 'react-native'
import React,{useState,useEffect} from 'react'
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'react-native';

const ShopModal = () => {

    const [modalVisible, setModalVisible] = useState(true);
    const [selectedShopType, setSelectedShopType] = useState('');
  
    const dispatch = useDispatch();
  
    useEffect(() => {
     
        const shop = useSelector(state => state.user.shop ? state.user.shop : null);
console.log(shop)
      if (shop) {
        setModalVisible(false);
      }
    }, []);
  
    const handleSelectShopType = () => {
      if (selectedShopType) {
        dispatch(setShopType(selectedShopType));
        setModalVisible(false);
      }
    };
  return (
    <View style={{flex:1,alignItems:"center"}}>
    <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                // Prevent modal from closing without selection
              }}>
              <View style={styles.modalView}>
                <Text allowFontScaling={false} style={styles.modalText}>Select Business Type</Text>
                <Picker
                  selectedValue={selectedShopType}
                  style={{ height: 50, width: 250 }}
                  onValueChange={(itemValue) => setSelectedShopType(itemValue)}>
                  <Picker.Item label="Select a business type..." value="" />
                  <Picker.Item label="Type 1" value="type1" />
                  <Picker.Item label="Type 2" value="type2" />
                  <Picker.Item label="Type 3" value="type3" />
                </Picker>
                <Button title="Confirm" onPress={handleSelectShopType} />
              </View>
            </Modal>
    </View>
  )
}



const styles = StyleSheet.create({
  
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
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 18,
    },
  });

export default ShopModal