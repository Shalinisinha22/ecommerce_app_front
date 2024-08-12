import React, { useState } from "react";
import { StyleSheet, TextInput, View, Keyboard, Button, TouchableOpacity, Text } from "react-native";
import { Feather, Entypo } from "@expo/vector-icons";

export default function SearchBar({navigation})  {
    const [clicked, setClicked] = useState(false);
    const [searchPhrase, setSearchPhrase] = useState("");

    return (
        <View style={styles.container}>
            <View style={styles.searchBar__unclicked}>

                <Feather name="search" size={20} color="#b6306d" style={{ marginLeft: 1 }} />

                <TextInput
                    style={styles.input}
                    placeholder="Search"
                    onPress={()=>navigation.navigate("Search")}
                    value={searchPhrase}
                  
                />

         
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
        width: "95%",
        backgroundColor: "#fff",
        borderRadius: 15,
        alignItems: "center",
          borderWidth:2,
        borderColor:"gray"
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
        fontSize: 18,
        marginLeft: 10,
        width: "90%",
        backgroundColor: "#fff",
    },
});



