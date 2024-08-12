import { View, Text, Dimensions, Image, ImageBackground, TouchableOpacity, ScrollView, Animated } from 'react-native';
import React, { useRef } from 'react';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import SearchBar from '../Components/SearchBar';
import Section1 from '../Components/Section1';
import Section2 from '../Components/Section2';
import Section3 from '../Components/Section3';
import Section4 from '../Components/Section4';
import Section5 from '../Components/Section5';

const HomeScreen = ({ navigation }) => {
  const width = Dimensions.get('screen').width;
  const height = Dimensions.get('screen').height;

  const scrollY = useRef(new Animated.Value(0)).current;

  const searchBarHeight = scrollY.interpolate({
    inputRange: [0, 80], // Adjust the input range as needed
    outputRange: [80, 0], // Adjust the output range according to your SearchBar height
    extrapolate: 'clamp',
  });

  const searchBarOpacity = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <ImageBackground style={{ width: width, flex: 1, backgroundColor: "#fff", opacity: 1 }}>
      <ImageBackground source={require("../assets/bg5.png")} style={{ width: width, backgroundColor: "#d8f3dc", opacity: 0.9 }}>
        <View style={{ backgroundColor: "#fffffc", borderRadius: 0, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, borderBottomWidth: 5, borderColor: "#fff" }}>
          <View style={{ width: width, borderRadius: 30, borderWidth: 0, borderColor: "#a11463", flexDirection: "row", paddingTop: 10, justifyContent: "space-evenly" }}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ paddingTop: 5 }}>
              <Entypo name="menu" size={44} color="#155d27" />
            </TouchableOpacity>
            <View>
              <Image source={require("../assets/logo.png")} style={{ height: 65, width: 110, resizeMode: "contain" }} />
            </View>
            <View style={{ flexDirection: "row", marginLeft: 10 }}>
              <TouchableOpacity style={{ flexDirection: "row", justifyContent: "space-around", borderWidth: 1, borderColor: "gray", height: 35, borderRadius: 15, paddingHorizontal: 15, alignItems: "center" }} onPress={() => navigation.navigate("wallet")}>
                <FontAwesome5 name="wallet" size={22} color="#0a7736" />
                <Text style={{ color: "#a11463", fontSize: 15, fontWeight: '700' }}>  Rs 100.00</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: "center", marginLeft: 10, marginTop: 5 }} onPress={() => navigation.navigate("cart")}>
                <FontAwesome5 name="shopping-cart" size={28} color="#b6306d" />
                <Text style={{ color: "#0a7736", position: "absolute", top: -10, fontWeight: '700' }}>0</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Animated.View style={{ height: searchBarHeight, opacity: searchBarOpacity }}>
            <SearchBar navigation={navigation} />
          </Animated.View>
        </View>
      </ImageBackground>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } // Use false for layout properties like height
        )}
        scrollEventThrottle={16}
      >
        <Section1 navigation={navigation} />
        <Section2 navigation={navigation}/>
        <Section4 navigation={navigation} />
        <Section3 navigation={navigation} />
        <Section5 navigation={navigation} />
      </Animated.ScrollView>
    </ImageBackground>
  );
};

export default HomeScreen;
