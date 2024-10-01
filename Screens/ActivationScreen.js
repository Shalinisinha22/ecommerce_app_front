import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useForm, Controller } from "react-hook-form";
import Header from '../Components/Header';
import { useSelector,useDispatch } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
const width = Dimensions.get('screen').width
const ActivationScreen = ({ navigation }) => {
   const dispatch = useDispatch()
  const userInfo = useSelector((state) => state.user.userInfo ? state.user.userInfo : null)
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();
  const mainWallet = !userInfo.mani_wallet ? 0 : userInfo.mani_wallet
  const [userId, setUserId] = useState(null)
  const [plan, setPlan] = useState(null)
  const [allPlans, setAllPlans] = useState([])
  const [walletBalance, setWalletBalance] = useState(0)
  const [userName, setUserName] = useState("");
  const [validUsers, setValidUsers] = useState([])
  const [isValidUser, setIsValidUser] = useState(false);
  const [parentId,setParentId]= useState(null)

  const getValidUsers = async () => {
    try {
      const res = await axios.get("https://mahilamediplex.com/mediplex/activeUser")
      setValidUsers(res.data)
    }
    catch (err) {
      console.log(err.message)
    }
  }
  useEffect(() => {
    getValidUsers()
  }, [])

  useEffect(() => {
    setWalletBalance(mainWallet)
  }, [userInfo])




  const getAllPlans = async () => {
    try {
      const res = await axios.get("https://mahilamediplex.com/mediplex/plans", {
        params: {
          balance: mainWallet
        }
      })

      // console.log("32", res.data)
      if (res.data.length != 0) {
        setAllPlans(res.data)
      }
    }
    catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    getAllPlans()
  }, [])

  const validateUserId = (value) => {
    const user = validUsers.find((user) => user.client_id === value);
    if (user) {
      setUserName(user.client_name);
      setIsValidUser(true);
    } else {
      setUserName("");
      setIsValidUser(false);
    }
  };


  const onSubmit = async () => {
    try {
      await updateMainWallet()
      await UpdateMainWalletLog()
      await updateClientProfileAccount()
      await updateClientPayout()
    }
    catch (err) {
      console.log(err.message)
    }
  }

  const updateMainWallet = async () => {
    try {
      const res = await axios.get("https://mahilamediplex.com/mediplex/updateMainWallet", {
        params:{
          newBalance: mainWallet - plan.price,
          client_id: userInfo.client_id
        }
       
      })
      console.log(res.data,"94")
      if(res.data){
         
         dispatch({ type: 'SET_USER_INFO', payload: res.data });
      }
    }
    catch (err) {
      console.log(err.message)
    }
  }


  const UpdateMainWalletLog = async()=>{
    try{
       const res = await axios.post("https://mahilamediplex.com/mediplex/mainWalletLog",{
         client_id:userInfo.client_id,
         user_id:userId,
         amount:plan.price
           
       })
       console.log(res.data)
    }
    catch(err){
      console.log(err.message)
    }
  }

  const updateClientProfileAccount= async()=>{
    try{
        const res= await axios.post("https://mahilamediplex.com/mediplex/updateClientProfileAccount",{
          shopping_wallet:plan.shopping_wallet_cashback,
          activate_package_id:plan.package_id,
          client_id:userInfo.client_id
        })

        if(res.data.message="log inserted successfully"){

        }

    }
    catch(err){
      console.log(err.message)
    }
  }


  const getParentId= async()=>{
     try{
        const res= await axios.get("https://mahilamediplex.com/mediplex/getParentId",{
          params:{
            userId:userId
          }
        })
        console.log(res.data)
        setParentId(res.data[0].parent_id)
        return res.data[0].parent_id;
     }
     catch(err){
      console.log(err.message)
     }
  }

  const updateClientPayout= async()=>{
     const pid= await getParentId()
    try{
        const res= await axios.post("https://mahilamediplex.com/mediplex/client_payout",{
          income_type:'sponsor',
          user_id:pid,
          ref_user_id:userId,
          total_amt:plan.price,
          total_commission:plan.sponsor,
          tds_charges: plan.sponsor * 5/100,
          admin_charges: plan.sponsor * 5/100,
          payable_income: plan.sponsor - (plan.sponsor * 5/100 + plan.sponsor * 5/100),
          pay_status:0
        })

        if(res.data.message="Payout inserted successfully"){
           console.log("updated client payout")
        }

    }
    catch(err){
      console.log(err.message)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* <Header navigation={navigation}></Header> */}
      <View style={{}}>
       
       <Text
     allowFontScaling={false}
     style={{
       height: 1,
       borderColor: "whitesmoke",
       borderWidth: 2,
       marginBottm:10
     }}
   />
         <View style={{ alignItems: "center", marginTop: 10 }}>
           <Text allowFontScaling={false} style={{ color: "#9e0059", fontSize: 15,letterSpacing:2 }}>
         ACTIVATE USER
           </Text>
         </View>
         <Text
     allowFontScaling={false}
     style={{
       height: 1,
       borderColor: "whitesmoke",
       borderWidth: 2,
       marginTop: 15,
     }}
   />
 
</View>
      <View style={{ marginTop: 40, padding: 15 }}>
        <View style={{ marginTop: 0 }}>
          <Text allowFontScaling={false}>Main Wallet Balance</Text>
          <View style={styles.inputBoxCont}>
            <Controller
              control={control}
              name="mainWallet"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  allowFontScaling={false}
                  cursorColor={"white"}
                  autoFocus={true}
                  style={{
                    color: "white",
                    marginVertical: 5,
                    width: 300,
                    fontSize: 16,
                  }}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    setWalletBalance(text);
                  }}
                  editable={false}
                  value={walletBalance}
                />
              )}
            />
          </View>
        </View>


        <View style={{ marginTop: 10 }}>
          <Text allowFontScaling={false}>User Id</Text>
          <View style={styles.inputBoxCont}>
            <Controller
              control={control}
              editable
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  allowFontScaling={false}
                  cursorColor={"white"}
                  autoFocus={true}
                  style={{
                    color: "white",
                    marginVertical: 5,
                    width: 300,
                    fontSize: 16,
                  }}
                  onBlur={onBlur}
                  onChangeText={(value) => {
                    setUserId(value);
                    onChange(value);
                    validateUserId(value);
                  }}
                  value={userId}
                />
              )}
              name="userId"
            />
          </View>
          {isValidUser ? (
            <Text allowFontScaling={false} style={{ color: "green", marginTop: 5, marginBottom: 5 }}>{`${userName}`}</Text>
          ) : (
            userId && <Text allowFontScaling={false} style={{ color: "red", marginTop: 10 }}>User is not valid</Text>
          )}

        </View>

        {console.log("168", plan)}
        <View style={styles.inputCont}>
          <Text allowFontScaling={false} style={{ fontWeight: '500', fontSize: 16 }}>Select Plan</Text>
          <RNPickerSelect
            style={{
              inputIOS: { backgroundColor: "#17842b", color: "white", fontSize: 18 },
              inputAndroid: { backgroundColor: "#17842b", color: "white", fontSize: 18 },
            }}
            placeholder={{
              label: "Select a Plan",
              value: null,
              color: "#9EA0A4",
            }}
            value={plan}
            onValueChange={(itemValue, id) => {
              console.log(itemValue, id)
              setPlan(itemValue)
            }
            }
            items={allPlans.map((item) => ({
              label: item.name,
              value: item,
              key: item.package_id,
            }))}
          />
        </View>




      </View>
      <View style={{ width: width, alignItems: "center", marginBottom: 20, marginTop: 50 }}>
        <TouchableOpacity

          style={{
            backgroundColor: "#9e0059",
            paddingVertical: 15,
            paddingHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 1,
            borderRadius: 6,
            marginTop: 5,
            width: 300


          }}
          onPress={() => onSubmit()}
        >
          <Text allowFontScaling={false}
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 13,
              fontWeight: "bold",
              letterSpacing: 2
            }}
          > Submit
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
    marginTop: 15,
    padding: 15
  },
  inputBoxCont: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#17842b",
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 12,
    paddingLeft: 10,
  },
  button: {
    width: 350,
    backgroundColor: "#9e0059",
    borderRadius: 6,
    marginLeft: "auto",
    marginRight: "auto",
    padding: 15,
    marginBottom: 40,
  },
  inputCont: {
    marginTop: 10,

  },

})
export default ActivationScreen