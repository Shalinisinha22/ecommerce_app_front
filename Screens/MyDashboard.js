import { View, Text,Dimensions,TouchableOpacity,ScrollView,Image } from 'react-native'
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
        name:"Shopping Wallet",
        url:null,
        icon:<Fontisto name="shopping-bag" size={20} style={{textAlign:"center"}} color="white" />


    },

    {
        id:1,
        income:user.mani_wallet?user.mani_wallet:"0",
        name:"Main Wallet",
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
     MY DASHBOARD
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

        <ScrollView>
            <View style={{width:width,alignItems:"center",marginTop:20}}>

    {
        dashboard.map((item)=>(
<View key={item.id} style={{width:300,alignItems:"center",backgroundColor:"#9e0059",paddingHorizontal:20,borderRadius:8,paddingTop:15,marginTop:10,elevation:2}}>
  <View style={{width:300,alignItems:"center"}}>
    {/* {item.icon} */}
    <Image style={{height:60,width:60,resizeMode:"contain"}} source={require("../assets/bank.jpeg")}></Image>
  </View>
    
                    <View >
                     {item.income && <Text allowFontScaling={false} style={{textAlign:"center",fontSize:18,color:"#fff",fontWeight:"bold",marginBottom:8}}>{item.income}</Text>}   
                        <Text allowFontScaling={false} style={{textAlign:"center",fontSize:15,color:"#fff",letterSpacing:2}}>{item.name}</Text>
                    </View>
                    <View style={{marginTop:20,width:300,alignItems:"center",backgroundColor:"#0a7736",paddingVertical:12,borderWidth:1,borderColor:"#fff"}}>
                        <TouchableOpacity 
                        onPress={()=>{item.url ? navigation.navigate(item.url):null}} style={{alignItems:"center"}}><Text style={{color:"#fff",letterSpacing:1}}>More Info   <Entypo name="arrow-with-circle-right" size={20} color="white" /></Text></TouchableOpacity>
                    </View>
                </View>
        ))
    }

                

            </View>
        </ScrollView>
    </View>
  )
}

export default MyDashboard