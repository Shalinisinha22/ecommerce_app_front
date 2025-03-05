import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Pressable, Image, Dimensions } from 'react-native';
import axios from 'axios';
import { Entypo, FontAwesome, MaterialIcons,Feather } from '@expo/vector-icons';
import * as Clipboard from "expo-clipboard"; 

const width = Dimensions.get('screen').width;

const Coupons = ({ navigation }) => {
  const [allCoupons, setAllCoupons] = useState([]);

  const getCoupons = async () => {
    try {
      const res = await axios.get("https://mahilamediplex.com/mediplex/coupons");
      setAllCoupons(res.data);
    } catch (err) {
      console.error("Error fetching coupons:", err.message);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);
  const copyToClipboard = (couponCode) => {
    Clipboard.setStringAsync(couponCode).then(() => {
      Alert.alert("Copied!", `Coupon code "${couponCode}" has been copied to the clipboard.`);
    });
  };

  const renderCoupon = ({ item }) => (
    <View style={styles.couponCard}>
      <View style={styles.row}>
        <FontAwesome name="ticket" size={20} color="#9e0059" />
        <Text style={[styles.couponCode, { color: "#9e0059" }]}> Code: {item.coupon_code}</Text>
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => copyToClipboard(item.coupon_code)}
        >
          <Text style={{ color: "#1E88E5" }}>
          <Feather name="copy" size={24} color="black" />
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <MaterialIcons name="category" size={20} color="#1E88E5" />
        <Text style={[styles.couponType, { color: "#1E88E5" }]}> Type: {item.type}</Text>
      </View>
      <View style={styles.row}>
        <Entypo name="price-tag" size={20} color="#007BFF" />
        <Text style={[styles.discount, { color: "#007BFF" }]}>
          Discount: {item.discount_value} {item.coupon_type === 'percentage' ? '%' : '₹'}
        </Text>
      </View>
      <View style={styles.row}>
        <FontAwesome name="cart-plus" size={20} color="#4CAF50" />
        <Text style={[styles.minimumCartValue, { color: "#4CAF50" }]}>
          Minimum Cart Value: ₹{item.minimum_cart_value}
        </Text>
      </View>
      <View style={styles.row}>
        <MaterialIcons
          name="check-circle"
          size={20}
          color={item.status === 'active' ? '#28A745' : '#FF5722'}
        />
        <Text style={[styles.status, { color: item.status === 'active' ? '#28A745' : '#FF5722' }]}>
          Status: {item.status}
        </Text>
      </View>
      <View style={styles.row}>
        <Entypo name="calendar" size={20} color="#FF9800" />
        <Text style={[styles.validity, { color: "#FF9800" }]}>
          Valid: {item.start_date} to {item.end_date}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuIcon}>
          <Entypo name="menu" size={40} color="#155d27" />
        </TouchableOpacity>
        <Text style={styles.headerText}>AVAILABLE COUPONS</Text>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
        </Pressable>
      </View>
      <Text style={styles.separator} />
      {allCoupons.length > 0 ? (
        <FlatList
          data={allCoupons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCoupon}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noCoupons}>No coupons available</Text>
      )}
    </View>
  );
};



export default Coupons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 10,
  },
  menuIcon: {
    padding: 0,
  },
  headerText: {
    color: "#9e0059",
    fontSize: 15,
    letterSpacing: 2,
  },
  logo: {
    height: 80,
    width: 80,
    resizeMode: "contain",
  },
  separator: {
    height: 1,
    borderColor: "whitesmoke",
    borderWidth: 2,
    marginVertical: 15,
    width: width,
  },
  list: {
    paddingBottom: 16,
  },
  couponCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  couponType: {
    fontSize: 14,
    marginLeft: 8,
  },
  discount: {
    fontSize: 14,
    marginLeft: 8,
  },
  minimumCartValue: {
    fontSize: 14,
    marginLeft: 8,
  },
  status: {
    fontSize: 14,
    marginLeft: 8,
  },
  validity: {
    fontSize: 12,
    marginLeft: 8,
  },
  noCoupons: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
});
