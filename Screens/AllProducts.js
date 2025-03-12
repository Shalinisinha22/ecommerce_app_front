import { View, Text, Dimensions, TouchableOpacity, FlatList, Pressable, Image, ScrollView, RefreshControl, StyleSheet, BackHandler } from 'react-native';
import React, { useState } from 'react';
import { Entypo,Ionicons } from '@expo/vector-icons';
import Header from '../Components/Header';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, handleIncrement, handleDecrement } from '../redux/actions/userActions';
import { imgUrl } from '../Components/Image/ImageUrl';

const width = Dimensions.get('screen').width;
import { useRoute } from '@react-navigation/native'
const AllProducts = ({ navigation }) => {
  const route = useRoute()
  const products = route.params?.products

  const [currPage, setCurrPage] = useState(0)

  const page_size = 10;
  const no_of_pages = Math.ceil(products.length / page_size);
  const start = currPage * 10;
  const end = start + page_size;


  const goToNext = async () => {
    if (currPage < no_of_pages - 1) {

      setCurrPage((prev) => prev + 1)
    }
  }
  const goToPrev = async () => {
    if (currPage !== 0) {

      setCurrPage((prev) => prev - 1)
    }
  }
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();

  const isItemInCart = (id) => {
    return cart.some((product) => product.pcode === id);
  };

  const getQty = (id) => {
    const product = cart.find((product) => product.pcode === id);
    return product ? product.qty : 0;
  };

  const handleCart = (item, id) => {
    dispatch(addToCart({ item, id }));
  };

  const handleIncrementProduct = (id) => {
    dispatch(handleIncrement({ id }));
  };

  const handleDecrementProduct = (id) => {
    dispatch(handleDecrement({ id }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 0 }}>
      <Header navigation={navigation}></Header>


      <ScrollView>
      <TouchableOpacity style={{marginBottom:10,marginLeft:10}} onPress={()=>navigation.goBack()}>
<Ionicons name="arrow-back" size={24} color="black" />
</TouchableOpacity>
        {products.length !== 0 ? (
          <>

            <FlatList
              data={products.slice(start, end)}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.columnWrapper}
              renderItem={({ item }) => (
                <Pressable
                  key={item.id}
                  style={styles.productCard}
                  onPress={() => navigation.navigate("productInner", { item, screen: "products" })}
                >

                  <TouchableOpacity style={{
                    position: "absolute",
                    left: 5,
                    top: 0,
                    backgroundColor: "#111",
                    borderRadius: 20,
                    paddingHorizontal: 10,
                    zIndex: 1000
                  }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "#fff",

                      }}
                    >
                      {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
                    </Text>
                  </TouchableOpacity>


                  <Image
                    style={styles.productImage}
                    source={{
                      uri: `${imgUrl}/eproduct/${item.sale_image?.[0] || item.product_image[0]}`,
                    }}
                  />
                  {/* {console.log(item.category_name)} */}
                  <View style={{ marginTop: 8 }}>
                    <Text allowFontScaling={false} style={styles.productName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text allowFontScaling={false} style={styles.productBrand}>
                      Manufactured by {item.brand_name}
                    </Text>
                    <Text allowFontScaling={false} style={styles.productMRP}>
                      Rs {item.mrp}
                    </Text>
                    <Text allowFontScaling={false} style={styles.productPrice}>
                      Rs {item.price}
                    </Text>
                  </View>

                  {isItemInCart(item.pcode) ? (
                    <View style={styles.cartButtons}>
                      <TouchableOpacity onPress={() => handleDecrementProduct(item.pcode)} style={styles.qtyButton}>
                        <Text allowFontScaling={false} style={{ fontSize: 18 }}>-</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.qtyCount}>
                        <Text allowFontScaling={false}>{getQty(item.pcode)}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleIncrementProduct(item.pcode)} style={styles.qtyButton}>
                        <Text style={{ fontSize: 18 }} allowFontScaling={false}>+</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => handleCart(item, item.pcode)}
                      style={styles.addToCartButton}
                    >
                      <Text allowFontScaling={false} style={styles.addToCartText}>
                        <Entypo name="shopping-cart" size={20} color="white" /> ADD TO CART
                      </Text>
                    </TouchableOpacity>
                  )}
                </Pressable>
              )}
            />

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: width,marginTop:5 }}>
              <TouchableOpacity onPress={() => goToPrev()} style={[styles.paginationButton, { backgroundColor: currPage == 0 ? "#D0D0D0" : "#228B22" }]}><Text style={{ color: "white" }}>Prev</Text></TouchableOpacity>
              <Pressable style={styles.currPageButton}><Text style={{ color: "white", fontWeight: "bold" }}>{currPage + 1}</Text></Pressable>
              <TouchableOpacity onPress={() => goToNext()} style={[styles.paginationButton, { backgroundColor: currPage == no_of_pages - 1 ? "#D0D0D0" : "#228B22" }]}><Text style={{ color: "white" }}>Next</Text></TouchableOpacity>

            </View>
          </>
        ) : (
          <Text allowFontScaling={false} style={styles.noProductsText}>
            No Products
          </Text>
        )}

      </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({

  productsContainer: {
    width: "100%",
    marginTop: 20,
    paddingBottom: 10,
    alignItems: "center",
  },

  columnWrapper: {
    flex: 1,
    justifyContent: "space-around",
    gap: 5,
  },
  productCard: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    borderColor: "#D0D0D0",
    marginTop: 10,
    width: width * 0.45,
  },
  productImage: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
  },
  productName: {
    fontWeight: "600",
    textAlign: "center",
    fontSize: 10,
  },
  productBrand: {
    fontWeight: "300",
    fontSize: 10,
    textAlign: "center",
  },
  productMRP: {
    fontSize: 10,
    fontWeight: "bold",
    textDecorationLine: "line-through",
    textAlign: "center",
    color: "#800000",
  },
  productPrice: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    color: "#228B22",
  },
  cartButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 2,
    paddingVertical: 5,
    marginTop: 10,
    width: "100%",
  },
  qtyButton: {
    paddingHorizontal: 5,
  },
  qtyCount: {
    paddingHorizontal: 5,
  },
  addToCartButton: {
    borderRadius: 10,
    backgroundColor: "#228B22",
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  addToCartText: {
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  noProductsText: {
    textAlign: "center",
    fontSize: 14,
    color: "#800000",
    marginTop: 20,
  },
  paginationButton: {
    backgroundColor: "#0a7736",
    padding: 8,
    margin: 5,
    paddingHorizontal: 30,
    borderRadius: 15
  },
  currPageButton: {
    backgroundColor: "#b6306d",
    padding: 8,
    margin: 5,
    paddingHorizontal: 25,
    // borderRadius:15
  }
});

export default AllProducts