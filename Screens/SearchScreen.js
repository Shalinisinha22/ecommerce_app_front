import React, { useState } from "react";
import { StyleSheet, TextInput, View, Keyboard, Button, TouchableOpacity, Text, Dimensions,Pressable,Image } from "react-native";
import { Feather, Entypo,FontAwesome5 } from "@expo/vector-icons";

const width= Dimensions.get("screen").width
export default function SearchBar({navigation})  {
    const [clicked, setClicked] = useState(false);
    const [searchPhrase, setSearchPhrase] = useState("");

    return (
        <View style={{flex:1,backgroundColor:"#fff"}}>
      <View style={styles.container}>
            <View style={ styles.searchBar__unclicked}>

                <Feather name="search" size={20} color="black" style={{ marginLeft: 1 }} />

                <TextInput
                    style={styles.input}
                    placeholder="Search"
                  
                    value={searchPhrase}
                    onChangeText={(text) => setSearchPhrase(text)}
                    onFocus={() => setClicked(true)}
                    onBlur={()=>setClicked(false)}
                />

                {clicked && (
                    <Entypo
                        name="cross"
                        size={20}
                        color="black"
                        style={{ padding: 1 }}
                        onPress={() => setSearchPhrase("")}
                    />
                )}
            </View>

            {/* {clicked && (
                <TouchableOpacity style={{paddingHorizontal:15,paddingVertical:10, backgroundColor:"#a11463",marginLeft:5,borderRadius:10}}  onPress={() => {
                    Keyboard.dismiss();
                    setClicked(false);
                    setSearchPhrase("");
                }}>
                    <Text style={{color:"#fff"}}>Cancel</Text>
                     
                </TouchableOpacity>
            )} */}
{/* 
            {clicked && (
                <View>
                    <Button
                        title="Cancel"
                        onPress={() => {
                            Keyboard.dismiss();
                            setClicked(false);
                            setSearchPhrase("");
                        }}
                    />
                </View>
            )} */}


<TouchableOpacity style={{alignItems:"center",marginLeft:10}} onPress={()=>navigation.navigate("wallet")}>
<FontAwesome5 name="shopping-cart" size={28} color="#b6306d"  />
<Text style={{color:"#0a7736",position:"absolute",top:-10,fontWeight:700,fontSize:15}}>0</Text>
</TouchableOpacity>

        </View>

<View style={{paddingLeft:20,marginTop:20}}>
<Text style={{letterSpacing:2,fontSize:15}}>Previously Viewed</Text>
</View>


<View style={{marginTop:20,padding:10}}>
<Pressable
              
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                 margin:5,
                  borderWidth:2,
                  borderRadius:20,
                  padding:10,
                  borderColor:"#D0D0D0",
                  width:200
                  
                }}
              >
                <Image
                  style={{ width: 150, height: 150, resizeMode: "contain" }}
                  source={require("../assets/product.jpg")}
                />
                <View>
                  <Text>Himalaya Baby Cream (Tube)</Text>
                  <Text  allowFontScaling={false} style={{ textAlign: "center",textDecorationLine:"line-through",color:"gray" }}>
                    Rs 200
                  </Text>
                  <Text  allowFontScaling={false} style={{ textAlign: "center",fontSize:15 }}>112</Text>
                </View>

               



                <View
                  style={{
                    backgroundColor: "#9e0059",
                    paddingVertical: 10,
                     paddingHorizontal:20,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 1,
                    borderRadius: 6,
                    marginTop:5,
                    // borderWidth:2,
                    // borderColor:"#006400"
                 
                  }}
                >
                  <Text allowFontScaling={false}
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontSize: 13,
                      fontWeight: "bold",
                    }}
                  >
                   ADD TO CART
                  </Text>
                </View>
              </Pressable>
</View>


        </View>
      
    );
};


const styles = StyleSheet.create({
    container: {
        margin: 15,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        width: "90%",
      
    },
    searchBar__unclicked: {
        padding: 8,
        flexDirection: "row",
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 15,
        alignItems: "center",
          borderWidth:1,
        borderColor:"gray",
        justifyContent: "space-evenly",
    },
    searchBar__clicked: {
        padding: 8,
        flexDirection: "row",
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "space-evenly",
        borderWidth:2,
        borderColor:"green"
    },
    input: {
        fontSize: 14,
        marginLeft: 10,
        width: "90%",
        backgroundColor: "#fff",
    },
});



