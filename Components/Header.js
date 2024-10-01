import { View, Text, Dimensions, Image, ImageBackground, TouchableOpacity, ScrollView, Animated,StyleSheet, Pressable} from 'react-native';
import React, {useState,useEffect } from 'react';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import SearchBar from './SearchBar'
import { imgUrl } from './Image/ImageUrl';

import axios from 'axios';

const Header = ({navigation}) => {



 const width = Dimensions.get('screen').width;
  const height = Dimensions.get('screen').height;

  const [profileImg,setProfileImg]= useState(null)
  const cart = useSelector((state) => state.cart.cart);

  const user=useSelector((state)=>state.user.userInfo?state.user.userInfo:null)
  const userImg= useSelector((state)=> state.user.userImg?state.user.userImg:null)


const getProfileImg= async()=>{
  try{
    const res = await axios.get("https://mahilamediplex.com/mediplex/clientDetails", {
      params: {
        client_id: user.client_id,
      },
    });
    const data= res.data[0]
    // console.log(data)
    setProfileImg(data.photo)
  }
  catch(err){
    console.log(err.message)
  }
}
useEffect(()=>{
  getProfileImg()
},[userImg])

  return (

  <ImageBackground source={require("../assets/bg5.png")} style={{ width: width, backgroundColor: "#d8f3dc", opacity: 0.9 }}>
        <View style={{ backgroundColor: "#fffffc", borderRadius: 0, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderBottomWidth: 5, borderColor: "#fff" ,flexWrap:"wrap"}}>
          <View style={{ width: width, borderRadius: 30, borderWidth: 0, borderColor: "#a11463", flexDirection: "row", paddingTop: 10, justifyContent: "space-around" }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ paddingTop: 7}}>
              {profileImg?<Image  style={{width:50,height:50,resizeMode:"contain"}}   source={{ uri: `${imgUrl}/photo/${profileImg}`}}></Image>:user.user_image ?<Image  style={{width:50,height:50,resizeMode:"contain"}}   source={{ uri: `${imgUrl}/photo/${user.user_image}`}}></Image>
:  <Entypo name="menu" size={40} color="#155d27" />}
              {/* */}
            </TouchableOpacity>

            <View style={{justifyContent:"center"}}>
             {user.first_name &&  <Text allowFontScaling={false} style={{fontSize:10,fontWeight:"bold"}}>{user.first_name}</Text>} 
             {user.client_id &&  <Text allowFontScaling={false} style={{fontSize:8}}>{user.client_id}</Text> }
             
            </View>
            
          
            <View style={{ flexDirection:"row", alignItems:"center" }}>
              <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-around", borderWidth: 1, borderColor: "gray", height: 35, borderRadius: 15, paddingHorizontal: 15, alignItems: "center" }} onPress={() => navigation.navigate("wallet")}>
                <FontAwesome5 name="wallet" size={20} color="#0a7736" />
                <Text numberOfLines={2} allowFontScaling={false}style={{ color: "#a11463", fontSize: 10, fontWeight: '700' }}>  Rs {user.mani_wallet?user.mani_wallet:"0"}</Text>
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