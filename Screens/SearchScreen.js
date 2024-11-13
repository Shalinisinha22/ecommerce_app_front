import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, View, TouchableOpacity, Text, Dimensions, Pressable, Image, ScrollView } from "react-native";
import { Feather, Entypo, FontAwesome5 } from "@expo/vector-icons";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, handleIncrement, handleDecrement } from '../redux/actions/userActions';
import { imgUrl } from "../Components/Image/ImageUrl";

const width = Dimensions.get("screen").width;

export default function SearchBar({ navigation }) {
    const [clicked, setClicked] = useState(false);
    const [searchPhrase, setSearchPhrase] = useState("");
    const [products, setProducts] = useState([]);
    const [previousSearches, setPreviousSearches] = useState([]);
    const [error, setError] = useState('');

    const lmcId = useSelector((state) => state.shop.shop ? state.shop.shop : null);

    useEffect(() => {
        getProductsId();
        loadPreviousSearches();
    }, [lmcId]);

    const getProductsId = async () => {
        const id= JSON.parse(await AsyncStorage.getItem('shopDetails'))
        console.log(id.client_id,"36",lmcId)
       
        try {
            const res = await axios.get("https://mahilamediplex.com/mediplex/getProductId", {
                params: { client_id: lmcId? lmcId.client_id:id.client_id }
            });
      
            if (res.data.length === 0) {
                getDefaultShop();
            } else {
                const pidArr = res.data.map(item => item.pid);
                console.log(pidArr)
                await getProducts(pidArr);
            }
        } catch (err) {
            setError("Searching....");
            console.log("Error fetching product IDs:", err.message);
        }
    }

    
    
    const getProducts = async (pidArr) => {
        try {
            const productPromises = pidArr.map(pid => 
                axios.get("https://mahilamediplex.com/mediplex/products", {
                    params: { product_id: pid }
                })
            );

            const responses = await Promise.all(productPromises);

            const productArr = responses.map(res => {
                const data = res.data;
                return data.map(item => {
                    if (item.sale_image) {
                        item.sale_image = JSON.parse(item.sale_image);
                    }
                    if (item.product_image) {
                        item.product_image = JSON.parse(item.product_image);
                    }
                    return item;
                });
            }).flat();

            setProducts(productArr);
            setError('');
        } catch (err) {
            setError("Error fetching products. Please try again.");
            console.log("Error fetching products:", err.message);
        }
    }

    const loadPreviousSearches = async () => {
        try {
            const storedSearches = await AsyncStorage.getItem('previousSearches');
            if (storedSearches) {
                setPreviousSearches(JSON.parse(storedSearches));
            }
        } catch (err) {
            console.log("Error loading previous searches:", err.message);
        }
    }

    const saveSearch = async (search) => {
        try {
            let searches = await AsyncStorage.getItem('previousSearches');
            searches = searches ? JSON.parse(searches) : [];
            if (!searches.includes(search)) {
                searches.push(search);
            }
            await AsyncStorage.setItem('previousSearches', JSON.stringify(searches));
            setPreviousSearches(searches);
        } catch (err) {
            console.log("Error saving search:", err.message);
        }
    }

    const handleSearch = (text) => {
        setSearchPhrase(text);
        if (text.length > 0) {
            saveSearch(text);
        }
    }

    const filteredProducts = searchPhrase.length > 0 
        ? products.filter(product => product.name.toLowerCase().includes(searchPhrase.toLowerCase()))
        : previousSearches.map(search => products.find(product => product.name.toLowerCase() === search.toLowerCase()));

    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cart);
    const isItemInCart = (id) => cart.find((product) => product.pcode === id);

    const getQty = (id) => {
        const product = cart.find((product) => product.pcode === id);
        return product ? product.qty : null;
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff",paddingTop:10 }}>
            <View style={styles.container}>
                <View style={styles.searchBar__unclicked}>
                    <Feather name="search" size={20} color="black" style={{ marginLeft: 1 }} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search"
                        value={searchPhrase}
                        onChangeText={handleSearch}
                        onFocus={() => setClicked(true)}
                        onBlur={() => setClicked(false)}
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
                <TouchableOpacity style={{ alignItems: "center", marginLeft: 10 }} onPress={() => navigation.navigate("cart")}>
                    <FontAwesome5 name="shopping-cart" size={28} color="#b6306d" />
                    <Text allowFontScaling={false} style={{ color: "#0a7736", position: "absolute", top: -15, fontWeight: 700, fontSize: 15 }}>{cart.length}</Text>
                </TouchableOpacity>
            </View>

            {error ? (
                <Text allowFontScaling={false} style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
            ) : (
                <>
                    <View style={{ paddingLeft: 20, marginTop: 20 }}>
                        {/* <Text style={{ letterSpacing: 2, fontSize: 15 }}>Previously searched products</Text> */}
                    </View>
                    <ScrollView  keyboardShouldPersistTaps='handled'  style={{ marginTop: 20, padding: 10 }}>
                        {filteredProducts.map((product, index) => (
                            product && (
                                
                                <Pressable key={index} onPress={() => navigation.navigate("productInner", { item: product })} style={styles.productContainer}>
                                   {/* {console.log(product,"search")} */}
                                    <Image
                                        style={{ width: 150, height: 130, resizeMode: "contain" }}
                                        source={{ uri: `${imgUrl}/eproduct/${product.sale_image?.[0] || product.product_image?.[0]}` }}
                                    />
                                    <View>
                                        <Text allowFontScaling={false} >{product.name}</Text>
                                        <Text allowFontScaling={false}  style={styles.strikeThrough}>Rs {product.mrp}</Text>
                                        <Text allowFontScaling={false} style={styles.price}>Rs {product.price}</Text>
                                    </View>
                                    {isItemInCart(product.pcode) ? (
                                        <View style={{ flexDirection: "row", width: 200, justifyContent: "space-between", marginTop: 10 }}>
                                            <TouchableOpacity onPress={() => dispatch(handleDecrement({ id: product.pcode }))} style={{ paddingVertical: 2, borderWidth: 1, borderColor: "#D0D0D0", paddingHorizontal: 15 }}>
                                                <Text allowFontScaling={false} style={{ fontSize: 15 }}>-</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ paddingVertical: 2, borderWidth: 1, borderColor: "#D0D0D0", paddingHorizontal: 35 }}>
                                                <Text allowFontScaling={false} >{getQty(product.pcode)}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => dispatch(handleIncrement({ id: product.pcode }))} style={{ paddingVertical: 2, borderWidth: 1, borderColor: "#D0D0D0", paddingHorizontal: 15 }}>
                                                <Text allowFontScaling={false} >+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => dispatch(addToCart({ item: product, id: product.pcode }))}
                                            style={{
                                                backgroundColor: "#9e0059",
                                                paddingVertical: 10,
                                                paddingHorizontal: 20,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                borderRadius: 6,
                                                marginTop: 5,
                                            }}
                                        >
                                            <Text allowFontScaling={false} style={{ textAlign: "center", color: "white", fontSize: 13, fontWeight: "bold" }}>
                                                <Entypo name="shopping-cart" size={20} color="white" /> ADD TO CART
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </Pressable>
                            )
                        ))}
                    </ScrollView>
                </>
            )}
        </View>
    );
}

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
        borderWidth: 1,
        borderColor: "gray",
        justifyContent: "space-evenly",
    },
    input: {
        fontSize: 14,
        marginLeft: 10,
        width: "90%",
        backgroundColor: "#fff",
    },
    productContainer: {
        alignItems: "center",
        justifyContent: "center",
        margin: 5,
        borderWidth: 2,
        borderRadius: 20,
        padding: 10,
        borderColor: "#D0D0D0",
        width: 250,
    },
    productImage: {
        width: 150,
        height: 150,
        resizeMode: "contain",
    },
    strikeThrough: {
        textAlign: "center",
        textDecorationLine: "line-through",
        color: "gray",
    },
    price: {
        textAlign: "center",
        fontSize: 15,
    },
    addToCartButton: {
        backgroundColor: "#b6306d",
        padding: 10,
        borderRadius: 20,
        alignItems: "center",
        marginTop: 10,
    },
    addToCartText: {
        color: "#fff",
    }
});
