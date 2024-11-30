import { View, Text, Dimensions, Image, ImageBackground, TouchableOpacity, ScrollView, Animated,StyleSheet, Pressable} from 'react-native';
import React, {useState,useEffect } from 'react';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from './SearchBar'
import { imgUrl } from './Image/ImageUrl';

import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const Header = ({navigation}) => {

const route= useRoute()
  const [wallet,setWallet]= useState(null)

  // console.log(route.params?.wallet,"headerparams")


const dispatch=useDispatch()

 const width = Dimensions.get('screen').width;
  const height = Dimensions.get('screen').height;

  const [profileImg,setProfileImg]= useState(null)
  const cart = useSelector((state) => state.cart.cart);

  let user=useSelector((state)=>state.user.userInfo?state.user.userInfo:null)



  const userImg= useSelector((state)=> state.user.userImg?state.user.userImg:null)


 const getWallet = async()=>{
  try{
  const res= await axios.get("https://mahilamediplex.com/mediplex/wallet_amt",{
    params:{
      client_id:user.client_id
    }
  })

  const data = res.data
  if(data[0].mani_wallet || data[0].shopping_wallet){
    console.log(data[0],"wallet")
    setWallet(data[0].mani_wallet + data[0].shopping_wallet)
    user.mani_wallet= data[0].mani_wallet
    dispatch({ type: 'SET_USER_INFO', payload: user});

  }
  }
  catch(err){
    console.log(err.message,"headerwalleterr")
  }
 }

const getProfileImg= async()=>{
  try{
    const res = await axios.get("https://mahilamediplex.com/mediplex/clientDetails", {
      params: {
        client_id: user.client_id,
      },
    });
    const data= res.data[0]
    setProfileImg(data.photo)
  }
  catch(err){
    console.log(err.message,"header64")
  }
}
useEffect(()=>{
  getProfileImg()
},[userImg])
useEffect(()=>{
  getWallet()
},[user])

  return (


  <ImageBackground source={require("../assets/bg5.png")} style={{ width: width, backgroundColor: "#d8f3dc", opacity: 0.9 }}>
        <View style={{ backgroundColor: "#fffffc", borderRadius: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottomWidth: 5, borderColor: "#fff" ,flexWrap:"wrap"}}>
          <View style={{ width: width, borderRadius: 30, borderWidth: 0, borderColor: "#a11463", flexDirection: "row", paddingTop: 10, justifyContent: "space-around" }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ paddingTop: 7}}>
              {profileImg!==null?<Image  style={{width:50,height:50,resizeMode:"contain"}}   source={{ uri: `${imgUrl}/photo/${profileImg}`}}></Image>:user?.user_image?<Image  style={{width:50,height:50,resizeMode:"contain"}}   source={{ uri: `${imgUrl}/photo/${user.user_image}`}}></Image>
:  <Entypo name="menu" size={40} color="#155d27" />}
              {/* */}
            </TouchableOpacity>
            {/* {console.log(profileImg,"proflrimg")} */}
            <View style={{justifyContent:"center"}}>
             {user &&  <Text allowFontScaling={false} style={{fontSize:10,fontWeight:"bold"}}>{user.first_name}</Text>} 
             {user &&  <Text allowFontScaling={false} style={{fontSize:8}}>{user.client_id}</Text> }
            </View>
            
          
            <View style={{ flexDirection:"row", alignItems:"center" }}>
              <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-around", borderWidth: 1, borderColor: "gray", height: 35, borderRadius: 15, paddingHorizontal: 15, alignItems: "center" }} onPress={() => navigation.navigate("wallet")}>
                <FontAwesome5 name="wallet" size={20} color="#0a7736" />
                <Text numberOfLines={2} allowFontScaling={false}style={{ color: "#a11463", fontSize: 10, fontWeight: '700' }}>  Rs {user?Math.round(user.mani_wallet) + Math.round(user.shopping_wallet):"0"}</Text>
              </TouchableOpacity>
           
            </View>
            <View style={{justifyContent:"center"}}>
            <TouchableOpacity style={{ alignItems: "center", marginLeft: 8, marginTop: 5 }} onPress={() => navigation.navigate("cart")}>
                <FontAwesome5 name="shopping-cart" size={25} color="#b6306d" />
                <Text allowFontScaling={false}style={{ color: "#0a7736", position: "absolute", top: -12, fontWeight: '700' }}>{cart.length}</Text>
              </TouchableOpacity>
            </View>
           
            <Pressable onPress={()=>navigation.navigate("Home")}>
              <Image source={require("../assets/logo.png")} style={{ height: 65, width: 70, resizeMode: "contain" }} />
            </Pressable>
            
          </View>

          {/* <Animated.View style={{ height: searchBarHeight, opacity: searchBarOpacity }}> */}
            <SearchBar navigation={navigation} />
          {/* </Animated.View> */}
        </View>
      </ImageBackground>

  )
}



const styles = StyleSheet.create({

    searchBar__unclicked: {
        padding: 5,
        flexDirection: "row",
        width: "75%",
        backgroundColor: "#fff",
        borderRadius: 15,
        alignItems: "center",
          borderWidth:2,
        borderColor:"gray",
     
    },
   
    input: {
        fontSize: 18,
        marginLeft: 10,
        width: "40%",
        backgroundColor: "#fff",
    },
});
export default Header




{/* <View style={{width:width ,flexDirection:"row",borderColor:"gray",justifyContent:"space-around",alignItems:"center",marginTop:15,gap:0}}>
{/* <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ paddingTop: 5 }}>
              <Entypo name="menu" size={40} color="#155d27" />
</TouchableOpacity> */}

{/* <View style={{flexDirection:"row",justifyContent:"space-around"}}> */}
    {/* <TouchableOpacity onPress={()=>navigation.navigate("Search")}>
    <Ionicons name="search-circle-outline"  size={40} color="gray" />
    </TouchableOpacity> */}

{/* <View  style={styles.searchBar__unclicked}>

<Feather name="search" size={20} color="#0a7736" style={{ marginLeft: 1 }} />

<TextInput
    style={styles.input}
    placeholder="Search"
    onPress={()=>navigation.navigate("Search")}

  
/>


</View> */}
  {/* <SearchBar navigation={navigation} />

<TouchableOpacity style={{ alignItems: "center", marginTop: 8 }} onPress={() => navigation.navigate("cart")}>
    <FontAwesome5 name="shopping-cart" size={25} color="#b6306d" />
    <Text style={{ color: "#0a7736", position: "absolute", top: -12, fontWeight: '700' }}>{cart.length}</Text>
  </TouchableOpacity>
</View>

</View> */}
  // ) */}