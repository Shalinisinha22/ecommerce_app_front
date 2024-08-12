import { View, Text, Image, StyleSheet, Pressable, SafeAreaView } from 'react-native'
import React from 'react';
import { useNavigation } from "@react-navigation/native";

const CartScreen = () => {
    const navigation=useNavigation();
  return (
    <SafeAreaView style={{alignItems:"center",paddingTop:70,flex:1,backgroundColor:"#fff"}}>
     <Image source={require("../assets/cart.png")} style={{width:200,height:150,resizeMode:"contain"}}></Image>
     <Text style={{fontWeight:500,fontSize:20}}>Your cart is empty</Text>
     <Text style={{fontSize:12}}>Lets add some product</Text>
          <Pressable  
          style={styles.button}
          onPress={()=>navigation.navigate("Home")}
        >
          <Text
          allowFontScaling={false}
            style={{
              textAlign: "center",
              color: "#0a7736",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Explore Products
          </Text>
          </Pressable>
    </SafeAreaView>
  )
}

const styles=StyleSheet.create({
    button: {
        width: 200,
        color: "#FEBE10",
        borderRadius: 6,
        marginLeft: "auto",
        marginRight: "auto",
        padding: 15,
        borderColor:"#dfe6e9",
      borderWidth:2,
      marginTop:15
    
      },
})

export default CartScreen