import { View, Text,Dimensions,TouchableOpacity, ScrollView,Image,StyleSheet,Pressable,RefreshControl } from 'react-native'
import React, {useState,useEffect} from 'react'
import axios from 'axios'
import { FontAwesome5,Entypo } from "@expo/vector-icons";
import { useSelector } from 'react-redux'
import { TextInput } from 'react-native-gesture-handler'
import { useForm, Controller } from "react-hook-form";
const width = Dimensions.get('screen').width
const Wallet = ({navigation}) => {


  const user= useSelector((state)=>state.user.userInfo?state.user.userInfo:null)
 

  console.log("userwallet",user.mani_wallet)


  const [wallet, setWallet] = useState(user?.mani_wallet);
  const [shoppingWallet, setShoppingWallet] = useState(user?.shopping_wallet);
  const [totalAmt,setTotalAmt]= useState(user?.mani_wallet + user?.shopping_wallet)


  const getWallet = async () => {
    if (user?.mani_wallet) {
      setWallet(user.mani_wallet);
    }
   if(user?.shopping_wallet){
      setShoppingWallet(user.shopping_wallet);
    }
  };

  useEffect(() => {
    getWallet();
  }, [user]);



 

  const [refreshing, setRefreshing] = useState(false); 

  const handleRefresh = async () => {
    setRefreshing(true);
    getWallet()
    setRefreshing(false);
  };
 

  return (
    <View  style={{ flex: 1, backgroundColor: "#fff" }}>
   <View style={{alignItems:"center",width:width,marginTop:20,flexDirection:"row"}}>

   <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ paddingTop: 7,paddingLeft:30}}>
<Entypo name="menu" size={40} color="#155d27" />
   
            </TouchableOpacity>
            <Pressable onPress={()=>navigation.navigate("Home")}>
            <Image  source={require("../assets/logo.png")} style={{height:80,width:80,resizemode:"contain",marginLeft:75}}></Image>
            </Pressable>

    </View>   
    

    <Text
      allowFontScaling={false}
      style={{
        height: 1,
        borderColor: "whitesmoke",
        borderWidth: 2,
        marginBottom: 10
      }}
    />
    <View style={{ alignItems: "center", marginTop: 10 }}>
      <Text allowFontScaling={false} style={{ color: "#9e0059", fontSize: 18, letterSpacing: 2 }}>
      YOUR WALLET
      </Text>
      {/* <FontAwesome5 name="wallet" size={40} color="#9e0059" style={{marginTop:5}} /> */}
    </View>
    {/* <Text
      allowFontScaling={false}
      style={{
        height: 1,
        borderColor: "whitesmoke",
        borderWidth: 2,
        marginTop: 15,
      }}
    /> */}

    <ScrollView refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
    }>
      <View style={{ width: width, alignItems: "center", marginTop: 30 }}>
       
      <Text
      allowFontScaling={false}
      style={{
        height: 1,
        borderColor: "whitesmoke",
        borderWidth: 2,
        marginBottom: 12,
        width:width
      }}
    />
                <TouchableOpacity  style={{width:width * 0.7,paddingVertical:10,backgroundColor:"#006400",borderRadius:15,marginTop:12,elevation:5,borderWidth:2,borderColor:"#9e0059"}}>

<View style={{flexDirection:"row",gap:5,alignItems:"center"}}>
  <Image source={require("../assets/mediplex/wallet.png")} style={{height:40,width:75,resizeMode:"contain"}}></Image>
<View>
                 <Text allowFontScaling={false} style={{textAlign:"center",fontSize:15,color:"#fff",fontWeight:"bold",marginBottom:8}}>Rs {user?Math.round(user?.shopping_wallet):"0"}</Text>
                    <Text allowFontScaling={false} style={{textAlign:"center",fontSize:18,color:"#fff",letterSpacing:2}}>Shopping wallet</Text>
                </View>
</View>
             
               

            </TouchableOpacity>

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
         <TouchableOpacity  style={{width:width * 0.7,paddingVertical:10,backgroundColor:"#006400",borderRadius:15,marginTop:12,elevation:5,borderWidth:2,borderColor:"#9e0059"}}>

<View style={{flexDirection:"row",gap:5,alignItems:"center"}}>
  <Image source={require("../assets/mediplex/bank.png")} style={{height:50,width:75,resizeMode:"contain"}}></Image>
                   <View >
                 <Text allowFontScaling={false} style={{textAlign:"center",fontSize:15,color:"#fff",fontWeight:"bold",marginBottom:8}}>Rs {user?Math.round(user?.mani_wallet):"0"}</Text>
                    <Text allowFontScaling={false} style={{textAlign:"center",fontSize:18,color:"#fff",letterSpacing:2}}>Main wallet</Text>
                </View>
</View>
             
               

            </TouchableOpacity>

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

<TouchableOpacity  style={{width:width * 0.7,paddingHorizontal:0,paddingVertical:10,backgroundColor:"#006400",borderRadius:15,marginTop:10,elevation:5,borderWidth:2,borderColor:"#9e0059"}}>

<View style={{flexDirection:"row",gap:5,alignItems:"center"}}>
  <Image source={require("../assets/mediplex/total.png")} style={{height:50,width:75,resizeMode:"contain"}}></Image>
<View >
                 <Text allowFontScaling={false} style={{textAlign:"center",fontSize:15,color:"#fff",fontWeight:"bold",marginBottom:8}}>  Rs {Math.round(user?.mani_wallet) + Math.round(user?.shopping_wallet)}
                 </Text>
                    <Text allowFontScaling={false} style={{textAlign:"center",fontSize:18,color:"#fff",letterSpacing:2}}>Total Amount</Text>
                </View>
</View>
             
               

            </TouchableOpacity>

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
                <TouchableOpacity onPress={()=>navigation.navigate("fundRequestScreen")}  style={{width:width * 0.7,paddingHorizontal:0,paddingVertical:10,backgroundColor:"#006400",borderRadius:15,marginTop:12,elevation:5,borderWidth:2,borderColor:"#9e0059"}}>

<View style={{flexDirection:"row",gap:5,alignItems:"center"}}>
  <Image source={require("../assets/mediplex/recharge.png")} style={{height:50,width:75,resizeMode:"contain"}}></Image>
                   <View >
                    <Text allowFontScaling={false} style={{textAlign:"center",fontSize:18,color:"#fff",letterSpacing:2}}>Recharge</Text>
                </View>
</View>
             
               

            </TouchableOpacity>

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
      </View>

    </ScrollView>
  </View>
);
}


const styles = StyleSheet.create({
  columnHeader: {
    flex: 1,
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
  },
  columnData: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: "bold"
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
  searchInput: {
    marginBottom: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    fontSize: 14,
    marginHorizontal: 10,
  }
});
export default Wallet;