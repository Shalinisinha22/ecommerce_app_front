import { View, Text,Dimensions,TouchableOpacity,Image, ScrollView,StyleSheet,Pressable,RefreshControl, Alert, Keyboard } from 'react-native'
import React, {useState,useEffect} from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { TextInput } from 'react-native-gesture-handler'
import { useForm, Controller } from "react-hook-form";
import { Entypo } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
const width = Dimensions.get('screen').width
const WithdrawalScreen = ({navigation}) => {

  const [amt,setAmt]= useState(0)
  const { control, handleSubmit, setValue, formState: { errors } } = useForm();
  const user= useSelector((state)=>state.user.userInfo?state.user.userInfo:null)
  console.log(user,"withdraw")
  const [error,setError]= useState("")
  const [withdrawData,setWithdrawData]= useState([])

  console.log("userwithdraw",user.mani_wallet)

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Your profile is updated.",
    });
  };


  const onSubmit= async()=>{
    Keyboard.dismiss()
    const pendingRequest = withdrawData.find(item => item.status === 9);
    if (pendingRequest) {
      Alert.alert(
        "Pending Withdrawal Request",
        "Your previous withdrawal request is still pending. Please wait for it to be processed before making a new request.",
        [
          { text: "OK" }
        ]
      );
      return;
    }
      if(amt==0){
        setError("Enter amount")
        setTimeout(() => {
          setError("")
        }, 2000);
        return;
      }
     if(user.bank_name && user.bank_ac_no && user.bank_ifsc_code){
         setError("")

         if(amt <= user.mani_wallet){
          

          try{
            const res= await axios.post("https://mahilamediplex.com/mediplex/addWithdrawDetails",{
              user_id:user.client_id,
              total:amt
            })

            console.log(res.status)

            if(res.status==200){
              console.log("updated",res.data.result)
              setAmt("")
              showToast()
             getWithdrawData()

            }
          }
          catch(err){
            console.log(err.message)
            Alert.alert("","Network Issue")
          }
      
         }
         else{
         
          setError("Invalid Amount")
         }

     }
     else{

      setError("Please update your bank Details")
     }
  }

  const getWithdrawData= async()=>{

   
    try{
      const withdrawRes= await axios.get("https://mahilamediplex.com/mediplex/getWithdrawData",{
        params:{
          client_id:user.client_id
        }
      })
      console.log(withdrawRes.data)
      setWithdrawData(withdrawRes.data)
    }
    catch(err){
      console.log(err.message)
    }
  }

  useEffect(()=>{
    getWithdrawData()
  },[])


  const [wallet, setWallet] = useState(user?.mani_wallet);

  const getWallet = async () => {
    if (user?.mani_wallet) {
      setWallet(user.mani_wallet);
    }
  };

  useEffect(() => {
    getWallet();
  }, [user]);



 

  const [refreshing, setRefreshing] = useState(false); 

  const handleRefresh = async () => {
    setRefreshing(true);
    getWallet()
    setRefreshing(false);
  };

 
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
    <Text
      allowFontScaling={false}
      style={{
        height: 1,
        borderColor: "whitesmoke",
        borderWidth: 2,
        marginBottom: 10
      }}
    />
     <View style={{alignItems:"center",width:width,marginTop:0,flexDirection:"row"}}>

<TouchableOpacity onPress={() => navigation.openDrawer()} style={{ paddingTop: 7,paddingLeft:30}}>
<Entypo name="menu" size={40} color="#155d27" />

         </TouchableOpacity>
         <Pressable onPress={()=>navigation.navigate("Home")}>
            <Image  source={require("../assets/logo.png")} style={{height:80,width:80,resizemode:"contain",marginLeft:75}}></Image>

            </Pressable>
 </View>   
    <View style={{ alignItems: "center", marginTop: 10 }}>
      <Text allowFontScaling={false} style={{ color: "#9e0059", fontSize: 15, letterSpacing: 2 }}>
        WITHDRAW AMOUNT
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

<ScrollView  keyboardShouldPersistTaps='handled' refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
    }>
      <View style={{ width: width, alignItems: "center", marginTop: 40 }}>
        <Text allowFontScaling={false} style={{ fontWeight: "bold", fontSize: 18, letterSpacing: 1.2 }}>Available Amount:</Text>
        <Text allowFontScaling={false} style={{ fontSize: 18, marginTop: 5 }}>Rs {user.mani_wallet?Math.round(user.mani_wallet):"0"}</Text>

        <View style={{ marginTop: 0, paddingTop: 20 }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            backgroundColor: "#155d27",
            paddingVertical: 5,
            borderRadius: 5,
            marginTop: 8,
            marginBottom: 12,
            paddingLeft: 10,
            borderRadius: 10,
          }}>
            <Controller
              control={control}
              editable
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  keyboardType='numeric'
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
                    setAmt(value);
                  }}
                  value={amt}
                />
              )}
              name="amt"
            />
          </View>
        </View>
        {error != "" && <Text allowFontScaling={false} style={{ color: "red" }}>{error}</Text>}

        <TouchableOpacity
          style={{
            width: 100,
            backgroundColor: "#9e0059",
            borderRadius: 6,
            marginLeft: "auto",
            marginRight: "auto",
            padding: 8,
            marginBottom: 40,
          }}
          onPress={handleSubmit(onSubmit)}
        >
          <Text allowFontScaling={false}
            style={{
              textAlign: "center",
              color: "white",
              fontSize: 12,
              fontWeight: "bold",
              letterSpacing: 2
            }}
          >
            Withdraw
          </Text>
        </TouchableOpacity>

        <Text
          allowFontScaling={false}
          style={{
            height: 1,
            borderColor: "whitesmoke",
            borderWidth: 2,
            marginTop: 8,
            width: Dimensions.get('screen').width
          }}
        />
      </View>

      {/* Withdrawal Table */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'gray' }}>
          <Text allowFontScaling={false} style={styles.columnHeader}>Request Date</Text>
          <Text allowFontScaling={false}style={styles.columnHeader}>Paid/Cancelled Date</Text>
          <Text allowFontScaling={false}style={styles.columnHeader}>Amount</Text>
          <Text allowFontScaling={false}style={styles.columnHeader}>Status</Text>
        </View>
        {withdrawData.length > 0 ? (
          withdrawData.map((item, index) => (
            <View key={item.id} style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'lightgray' }}>
              <Text allowFontScaling={false}style={styles.columnData}>{item.cdate}</Text>
              <Text allowFontScaling={false}style={styles.columnData}>{item.updated_date}</Text>
              <Text allowFontScaling={false}style={styles.columnData}>Rs {item.total}</Text>
       
           
              {item.status == 1 ?
                <Pressable style={[styles.statusButton, { backgroundColor: "green" }]}>
                  <Text allowFontScaling={false} style={styles.statusText}>Paid</Text>
                </Pressable> :

item.status == 9 ?
                <Pressable style={[styles.statusButton, { backgroundColor: "#ffb703" }]}>
                  <Text allowFontScaling={false} style={styles.statusText}>Pending</Text>
                </Pressable>:

<Pressable style={[styles.statusButton, { backgroundColor: "red" }]}>
<Text allowFontScaling={false} style={styles.statusText}>Cancelled</Text>
</Pressable>
                }
            </View>
          ))
        ) : (
          <Text allowFontScaling={false} style={{ textAlign: "center" }}>No Data Available In Table</Text>
        )}

    </ScrollView>
    <Toast
          position='bottom'
          bottomOffset={150}
        />
  </View>
);
}


const styles = StyleSheet.create({
  columnHeader: {
    flex: 1,
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
  },
  columnData: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    fontSize: 9,
    fontWeight: "bold"
  },
  statusButton: {
    paddingVertical: 5,
    paddingHorizontal: 18,
    borderRadius: 5,
    marginHorizontal: 2,
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 8
  },
  statusText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 8
  },
  searchInput: {
    marginBottom: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    fontSize: 14,
    marginHorizontal: 10,
  }
});
export default WithdrawalScreen;