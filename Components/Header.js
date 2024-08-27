import { View, Text,Dimensions,TouchableOpacity,FlatList,Pressable,Image, ScrollView,StyleSheet,TextInput} from 'react-native'
import React from 'react'
import { Entypo,FontAwesome5,Ionicons,Foundation ,Feather} from '@expo/vector-icons'
import SearchBar from './SearchBar'
import { useSelector } from 'react-redux'

const width = Dimensions.get('screen').width

const Header = ({navigation}) => {

  const cart = useSelector((state) => state.cart.cart);
  return (
<View style={{width:width ,flexDirection:"row",borderColor:"gray",justifyContent:"space-around",alignItems:"center",marginTop:15,gap:10}}>
<TouchableOpacity onPress={() => navigation.openDrawer()} style={{ paddingTop: 5 }}>
              <Entypo name="menu" size={40} color="#155d27" />
</TouchableOpacity>

<View style={{flexDirection:"row",justifyContent:"space-around"}}>
    {/* <TouchableOpacity onPress={()=>navigation.navigate("Search")}>
    <Ionicons name="search-circle-outline"  size={40} color="gray" />
    </TouchableOpacity> */}

<View style={styles.searchBar__unclicked}>

<Feather name="search" size={20} color="#0a7736" style={{ marginLeft: 1 }} />

<TextInput
    style={styles.input}
    placeholder="Search"
    onPress={()=>navigation.navigate("Search")}

  
/>


</View>

<TouchableOpacity style={{ alignItems: "center", marginTop: 8 }} onPress={() => navigation.navigate("cart")}>
    <FontAwesome5 name="shopping-cart" size={25} color="#b6306d" />
    <Text style={{ color: "#0a7736", position: "absolute", top: -12, fontWeight: '700' }}>{cart.length}</Text>
  </TouchableOpacity>
</View>

</View>
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