import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  TouchableOpacity,
  Alert,
  RefreshControl,

} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Entypo,Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { imgUrl } from "../Components/Image/ImageUrl";
import Toast from "react-native-toast-message";
import { useRoute } from "@react-navigation/native";

const width = Dimensions.get("screen").width;

const OrderDetails = ({ navigation }) => {
  const route = useRoute();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);

  const userInfo = useSelector((state) =>
    state.user.userInfo ? state.user.userInfo : null
  );

  const delivery_status = route.params?.deliveryStatus

  const getOrders = async () => {
    try {
      const res = await axios.get(
        "https://mahilamediplex.com/mediplex/allProductDetails",
        {
          params: {
            uid: userInfo.client_id,
            order_id: route.params.order_id,
          },
        }

      );

      // const filteredOrders = res.data.filter((item) => item.status === 1);
      setOrders(res.data);

      return res.data
      // console.log(filteredOrders)
      // return filteredOrders
    } catch (err) {
      console.error("Error fetching orders:", err.message);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);



  const updateShoppingWalletLog = async (item) => {


    try {
      const res = await axios.post("https://mahilamediplex.com/mediplex/shopping-wallet-log", {
        params: {
          user_id: userInfo?.client_id,
          order_id: item?.order_id,
          product_id: item?.pid,
          shopping_wallet: item?.price * item?.qty,
          reason: "Cancel Product",
          status: "Credit"

        }

      })


      if (res.data.message == "Data inserted successfully") {
        return true;
      }



    }
    catch (err) {
      console.log(err.message)
      return false;
    }
  }


  const cancelOrders = async (item) => {

    const updateWalletLog = await updateShoppingWalletLog(item)
    console.log("update", updateWalletLog)
    if (updateWalletLog) {
      try {
        const res = await axios.post(
          "https://mahilamediplex.com/mediplex/cancelOrder",
          {
            user_id: userInfo?.client_id,
            order_id: item?.order_id,
            pid: item?.pid,
            price: item?.price * item?.qty,
            type: "User"
          }
        );

        console.log(res.data)
        if (res.status === 200) {
          const { added_main_wallet, added_shopping_wallet } = res.data;

          if (added_shopping_wallet) {
            userInfo.shopping_wallet = added_shopping_wallet;
            dispatch({ type: "SET_USER_INFO", payload: userInfo });
          }
          if (added_main_wallet) {
            userInfo.mani_wallet = added_main_wallet;
            dispatch({ type: "SET_USER_INFO", payload: userInfo });
          }



          const updatedOrder = await getOrders();

          console.log(updatedOrder, "updated")
          if (updatedOrder.length == 0) {
            const res1 = await axios.post("https://mahilamediplex.com/mediplex/updateOrderDetails", {
              user_id: userInfo.client_id,
              order_id: item.order_id
            })
            console.log(res1.data)
            if (res1.data) {
              Toast.show({
                type: "success",
                text1: "Order cancelled successfully!",
                text2: "Your amount will reflect in your wallet shortly.",
              });
              navigation.navigate("pending")
            }
          }

          Toast.show({
            type: "success",
            text1: "Order cancelled successfully!",
            text2: "Your amount will reflect in your wallet shortly.",
          });
        }
      } catch (err) {
        Alert.alert(
          "",
          err.response?.data?.error || "Failed to cancel order. Try again later."
        );
      }
    }

  };



  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.qty}</Text>
      <Text style={styles.cell}>₹{Math.round(item.price * item.qty)}</Text>

      {/* Status Display */}
      {item.status == 2 ? (
        <Text style={[styles.cell, { color: "red" }]}>Cancelled</Text>
      ) : (
        <Text style={[styles.cell, { color: delivery_status != 2 ? "green" : "red" }]}>
          {delivery_status === 1
            ? "Pending"
            : delivery_status === 2
              ? "Cancelled"
              : delivery_status === 3
                ? "Processing"
                : delivery_status === 4
                  ? "Delivered"
                  : "Pending"}
        </Text>
      )}

      {/* Cancel Button Logic */}
      <View style={styles.actionCell}>
        {item.status == 2 || delivery_status === 2 || delivery_status === 3 || delivery_status === 4 ? (
          // Disabled Cancel Button
          <TouchableOpacity style={[styles.cancelButton, { backgroundColor: "#D0D0D0" }]} disabled>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        ) : (
          // Enabled Cancel Button
          <TouchableOpacity onPress={() => cancelOrders(item)} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Entypo name="menu" size={40} color="#155d27" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ORDER DETAILS</Text>
        <Pressable onPress={() => navigation.navigate("Home")}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
          />
        </Pressable>
      </View>
    <TouchableOpacity style={{marginBottom:10,marginLeft:10}} onPress={()=>navigation.goBack()}>
<Ionicons name="arrow-back" size={24} color="black" />
</TouchableOpacity>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Name</Text>
        <Text style={styles.tableHeaderText}>Qty</Text>
        <Text style={styles.tableHeaderText}>Amount</Text>
        <Text style={styles.tableHeaderText}>Status</Text>
        <Text style={styles.tableHeaderText}>Action</Text>
      </View>

      {/* Table Rows */}
      <FlatList
        data={orders}
        renderItem={renderRow}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.noOrdersText}>No Orders</Text>}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => getOrders()}
          />
        }
      />
      <Toast position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
    letterSpacing: 1,
  },
  logo: {
    height: 60,
    width: 60,
    resizeMode: "contain",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    padding: 10,
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 5
  },
  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
  },
  actionCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 10,
  },
  noOrdersText: {
    textAlign: "center",
    marginVertical: 20,
    color: "gray",
  },
});

export default OrderDetails;
