import { View, Text, ScrollView,TextInput,TouchableOpacity, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Node from '../Components/Node'; // Corrected import
import { useSelector } from 'react-redux';
import { useForm, Controller } from "react-hook-form";
const GenealogyScreen = () => {
  const [clients, setClients] = useState(null); // Changed to `null` to handle the initial state
const [rootNode,setRootNode]=useState(null)
const [rootNodeName,setRootNodeName]=useState("")
const { control, handleSubmit, setValue, formState: { errors } } = useForm();
const [userRootnode,setUserRootNode]= useState("")
const [userRootnodeName,setUserRootNodeName]= useState("")

const userInfo = useSelector((state) => (state.user.userInfo ? state.user.userInfo : null));


  const getClients = async () => {
    try {
      const res = await axios.get('https://mahilamediplex.com/mediplex/clientAccountLog');
      const network = JSON.parse(res.data[0].network);
      console.log(network,"13");


   
      const children = new Set();
      
      // Add all left and right children to the set
      for (let key in network) {
        if (network[key].left) {
          children.add(network[key].left);
        }
        if (network[key].right) {
          children.add(network[key].right);
        }
      }
      
      // Find the root node (the one that is not in the children set)
      let rootNode = null;
      for (let key in network) {
        if (!children.has(key)) {
          rootNode = key
          break; // Exit the loop after finding the first root node
        }
      }
      
      console.log("First Root Node:", rootNode);
      // setRootNode(rootNode)
      // getClientName(rootNode)
      setRootNode(userInfo.client_id)
      getClientName(userInfo.client_id)
      setClients(network); // `network` is now set directly
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getClients();
  }, []);


const getClientName= async(name)=>{

  console.log(name,"name")

try{
    const res= await axios.get("https://mahilamediplex.com/mediplex/clientName",{
        params:{
            root:name,
            leftChild:"",
            rightChild:""
        }
    })
    console.log(res.data,"68")
setRootNodeName(res.data.length!=0?res.data[0].first_name:"")
}
catch(err){
    console.log(err.message)
}
}

const onSubmit= async()=>{
  if(userRootnode==""){
    getClientName(rootNode)
  }
  else{
    setRootNode(userRootnode)
    getClientName(userRootnode)
  }

}

  return (
    <View style={{ flex: 1,backgroundColor:"#fff" }}>
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
        MY TREE
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
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
 
      <View style={{ marginTop: 0,paddingTop:40 }}>
              <Text allowFontScaling={false}>  Enter USER ID</Text>
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
                borderRadius:10,
                }}>
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
                        setUserRootNode(value);
                        onChange(value);
                      }}
                      value={userRootnode}
                    />
                  )}
                  name="userRoot"
                />
              </View>
            </View>

            <TouchableOpacity
              style={{  width: 100,
                backgroundColor: "#9e0059",
                borderRadius: 6,
                marginLeft: "auto",
                marginRight: "auto",
                padding: 8,
                marginBottom: 40,}}
              onPress={handleSubmit(onSubmit)}


            >
              <Text allowFontScaling={false}

                style={{
                  textAlign: "center",
                  color: "white",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>

            <Text
     allowFontScaling={false}
     style={{
       height: 1,
       borderColor: "whitesmoke",
       borderWidth: 2,
       marginTop: 8,
       width:Dimensions.get('screen').width
     }}
   />
   {console.log("rootnodename",rootNodeName)}

        {clients && (
          <Node node={rootNode} data={clients} name={rootNodeName!=""?rootNodeName:""} type={"root"} /> // Pass both node key and data
        )}
      </ScrollView>
    </View>
  );
};

export default GenealogyScreen;
