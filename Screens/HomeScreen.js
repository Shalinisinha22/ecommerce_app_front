import { View, Text, Dimensions, Image, ImageBackground,  Animated,RefreshControl} from 'react-native';
import React, { useRef,useState,useEffect } from 'react';
import Section1 from '../Components/Section1';
import Section2 from '../Components/Section2';
import Section3 from '../Components/Section3';
import Section4 from '../Components/Section4';
import Section5 from '../Components/Section5';
import { imgUrl } from '../Components/Image/ImageUrl';
import Section8 from '../Components/Section8';
import Section7 from '../Components/Section7';
import Section6 from '../Components/Section6';
import axios from 'axios';
import Header from '../Components/Header';

const HomeScreen = ({ navigation }) => {
  const width = Dimensions.get('screen').width;


  const scrollY = useRef(new Animated.Value(0)).current;

  const searchBarHeight = scrollY.interpolate({
    inputRange: [0, 80], // Adjust the input range as needed
    outputRange: [80, 0], // Adjust the output range according to your SearchBar height
    extrapolate: 'clamp',
  });

  const searchBarOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const [refreshing, setRefreshing] = useState(false); 

  const handleRefresh = async () => {
     setRefreshing(true);
  
     setRefreshing(false);
   };
 


  return (
    <ImageBackground style={{ width: width, flex: 1, backgroundColor: "#fff", opacity: 1 }}>
<Header navigation={navigation}></Header>

      <Animated.ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false } // Keep false for height and opacity
        )}
        scrollEventThrottle={16}
      >
        <Section1 navigation={navigation} />
        <Section2 navigation={navigation}/>
        <Section4 navigation={navigation} />
        <Section3 navigation={navigation} />
        <Section5 navigation={navigation} />
        <Section6 navigation={navigation} />
        <Section7 navigation={navigation} />
        <Section8 navigation={navigation} />
      </Animated.ScrollView>
    </ImageBackground>
  );
};


export default HomeScreen;
