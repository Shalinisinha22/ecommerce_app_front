import { View, Text,Dimensions,StyleSheet,FlatList,Image,Pressable } from 'react-native'
import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { imgUrl } from '../Components/Image/ImageUrl'
import moment from 'moment-timezone'

const width= Dimensions.get('screen').width

const OrderHistory = () => {

  const [orders,setOrders]= useState([])

  const userInfo= useSelector((state)=>state.user.userInfo?state.user.userInfo:null)

  const getOrders= async()=>{
    try{
        const res= await axios.get("https://mahilamediplex.com/mediplex/orderHistory",{
          params:{
            uid: userInfo.client_id
          }
        })


        let newArr= res.data

        for(let i=0;i<newArr.length;i++){
          if(newArr[i].product_image){
         
            newArr[i].product_image = JSON.parse(newArr[i].product_image);
          }
          if(newArr[i].sale_image){
 
              newArr[i].sale_image = JSON.parse(newArr[i].sale_image);
             }
          
        }
        
       
        
    


        console.log(newArr)

        setOrders(newArr)
    }
    catch(err){
      console.log(err.message)
    }
  }

  useEffect(()=>{
    getOrders()
  },[])


  const renderRow = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.cdate}</Text>
      <Image
        source={{ uri: `${imgUrl}/eproduct/${item.product_image[0]}` }} // Replace with your actual image URL
        style={styles.image}
      />
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.qty}</Text>
      <Text style={styles.cell}>RS {Math.round(item.price * item.qty)}</Text>
      {/* {item.status == 1 ?
              <Pressable style={[styles.statusButton, { backgroundColor: "green" }]}>
                <Text allowFontScaling={false} style={styles.statusText}>Confirm</Text>
              </Pressable> :
              <Pressable style={[styles.statusButton, { backgroundColor: "red" }]}>
                <Text allowFontScaling={false} style={styles.statusText}>Pending</Text>
              </Pressable>} */}
    </View>
  );
  return (
    <View style={{flex:1, backgroundColor:"white"}}>

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
  <View style={{ alignItems: "center", marginTop: 15 }}>
          <Text allowFontScaling={false} style={{ color: "gray", fontSize: 15, letterSpacing: 2 }}>
   ORDER HISTORY
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


<View style={styles.container}>
      <View style={styles.headerRow}>
        <Text allowFontScaling={false} style={styles.headerCell}>Date</Text>
        <Text allowFontScaling={false} style={styles.headerCell}>Image</Text>
        <Text allowFontScaling={false} style={styles.headerCell}>Name</Text>
        <Text allowFontScaling={false} style={styles.headerCell}>Qty</Text>
        <Text allowFontScaling={false} style={styles.headerCell}>Amount</Text>
        {/* <Text allowFontScaling={false} style={styles.headerCell}>Status</Text> */}
      </View>
      <FlatList
        data={orders}
        renderItem={renderRow}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
 
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    padding: 10
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize:10
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd'
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize:10,
    letterSpacing:0.5
  },
  image: {
    width: 70,
    height: 70,
    resizeMode:"contain"
  },
  statusButton: {
    paddingVertical: 5,
    paddingHorizontal: 18,
    borderRadius: 5,
    marginHorizontal: 2,
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 8
  },
  statusText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 8
  },
});


export default OrderHistory