import { View, Text,Dimensions,TouchableOpacity,ScrollView,Image,Pressable } from 'react-native'
import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux'
import { Entypo,Fontisto,AntDesign } from '@expo/vector-icons'

const width= Dimensions.get('screen').width
const MyDashboard = ({navigation}) => {


   

  const user= useSelector((state)=>state.user.userInfo?state.user.userInfo:null)
  console.log(user.shopping_wallet, user.mani_wallet)


  const dashboard=[
    {
        id:0,
        income:user.shopping_wallet? user.shopping_wallet:"0",
        // name:"Shopping Wallet",
        name:"Loan/credit Amount",
        url:null,
        icon:<Fontisto name="shopping-bag" size={20} style={{textAlign:"center"}} color="white" />


    },

    {
        id:1,
        income:user.mani_wallet?user.mani_wallet:"0",
        // name:"Main Wallet",
        name:"Fixed Amount",
        url:null,
        icon:<Entypo name="wallet" size={20} style={{textAlign:"center"}} color="white" />
    },

    {
        id:2,
        income:null,
        name:"Sponsor Income",
        url:"sponsorIncome",
        icon:<AntDesign name="linechart" size={20} style={{textAlign:"center"}} color="white" />
    },

    
    {
        id:3,
        income:null,
        name:"Daily Income",
        url:"dailyIncome",
        icon:<AntDesign name="linechart" size={20} style={{textAlign:"center"}} color="white" />
    },

]
  return (
    <View style={{flex:1,backgroundColor:"#fff"}}>

         {/* <Text
          allowFontScaling={false}
          style={{
            height: 1,
            borderColor: "whitesmoke",
            borderWidth: 2,
            marginTop: 15,
            width: width
          }}
        /> */}
        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-around"}}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ paddingTop: 0,paddingLeft:0}}>
<Entypo name="menu" size={40} color="#155d27" />
   
            </TouchableOpacity>
  <View style={{ alignItems: "center", marginTop: 0, marginLeft:0 }}>
          <Text allowFontScaling={false} style={{ color: "#0a7736", fontSize: 15, letterSpacing: 2 }}>
     MY DASHBOARD
          </Text>
        </View>
        <Pressable onPress={()=>navigation.navigate("Home")}>
              <Image source={require("../assets/logo.png")} style={{ height: 80, width: 70, resizeMode: "contain" }} />
            </Pressable> 
        </View>
       
        <Text
          allowFontScaling={false}
          style={{
            height: 1,
            borderColor: "whitesmoke",
            borderWidth: 2,
            marginTop: 2,
            width: width
          }}
        />

        <ScrollView>
            <View style={{width:width,alignItems:"center",marginTop:5}}>

    {
        dashboard.map((item)=>(
<View key={item.id} style={{width:300,alignItems:"center",backgroundColor:"#9e0059",paddingHorizontal:20,borderRadius:8,paddingTop:15,marginTop:10,elevation:2}}>
  <View style={{width:300,alignItems:"center"}}>
    {/* {item.icon} */}
    <Image style={{height:60,width:60,resizeMode:"contain"}} source={require("../assets/bank.jpeg")}></Image>
  </View>
    
                    <View >
                     {item.income && <Text allowFontScaling={false} style={{textAlign:"center",fontSize:18,color:"#fff",fontWeight:"bold",marginBottom:8}}>Rs {Math.round(item.income)}</Text>}   
                      {item.url && <Text allowFontScaling={false} style={{textAlign:"center",fontSize:15,color:"#fff",letterSpacing:2,marginBottom:20,}}>{item.name}</Text> }  
                    </View>
                    {item.url?
                                        <View style={{width:300,alignItems:"center",backgroundColor:"#0a7736",paddingVertical:12,borderWidth:1,borderColor:"#fff"}}>
                                        <TouchableOpacity 
                                        onPress={()=>{item.url ? navigation.navigate(item.url):null}} style={{alignItems:"center"}}><Text allowFontScaling={false} style={{color:"#fff",letterSpacing:1}}>More Info   <Entypo name="arrow-with-circle-right" size={20} color="white" /></Text></TouchableOpacity>
                                    </View>
                                    :

                                    <View style={{width:300,alignItems:"center",backgroundColor:"#0a7736",paddingVertical:12,borderWidth:1,borderColor:"#fff"}}>
                                    <TouchableOpacity 
                                    style={{alignItems:"center"}}><Text allowFontScaling={false} style={{color:"#fff",letterSpacing:1}}>{item.name}</Text></TouchableOpacity>
                                </View>

                    }

                </View>
        ))
    }

                

            </View>
        </ScrollView>
    </View>
  )
}

export default MyDashboard