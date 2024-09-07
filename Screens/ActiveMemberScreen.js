import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ActiveMemberScreen = () => {
  const [leftUserArray, setLeftUserArray] = useState([]);
  const [rightUserArray, setRightUserArray] = useState([]);
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');

  const userInfo = useSelector((state) => state.user.userInfo || null);

  const getDirectMemberData = async () => {
    try {
      const res = await axios.get('https://mahilamediplex.com/mediplex/clientAccountLog');
      const treeData = JSON.parse(res.data[0].network);
  
      const leftArray = [];
      const rightArray = [];
      
      function traverseLeft(nodeId) {
        const node = treeData[nodeId];
        if (node && node.left) {
          leftArray.push(node.left);
          traverseLeft(node.left);
        }
      }
      
      function traverseRight(nodeId) {
        const node = treeData[nodeId];
        if (node && node.right) {
          rightArray.push(node.right);
          traverseRight(node.right);
        }
      }
      
      const startNode = userInfo.client_id;
      traverseLeft(startNode);
      traverseRight(startNode);
  
      console.log("Left Array:", leftArray);
      console.log("Right Array:", rightArray);
  
      // Fetch data for left users
      const leftUserPromises = leftArray.map(item => 
        axios.get("https://mahilamediplex.com/mediplex/downlineList", {
          params: { client_id:item }
        })
        .then(response => {
          console.log(`Response for left user ${item}:`, response.data);
          return response.data[0];
        })
        .catch(error => {
          console.error(`Error fetching left user ${item}:`, error.message);
          return null;
        })
      );
      const leftUserResponses = await Promise.all(leftUserPromises);
      const leftUsers = leftUserResponses.filter(Boolean);
      const nLeftUsers= leftUsers.filter((item)=>item.activation_status==1)
      console.log("left User Array:", nLeftUsers);
      setLeftUserArray(nLeftUsers);
      // console.log("Left User Array:", leftUsers);
  
      // Fetch data for right users
      const rightUserPromises = rightArray.map(item => 
        axios.get("https://mahilamediplex.com/mediplex/downlineList", {
          params: { client_id: item }
        })
        .then(response => {
          console.log(`Response for right user ${item}:`, response.data);
          return response.data[0];
        })
        .catch(error => {
          console.error(`Error fetching right user ${item}:`, error.message);
          return null;
        })
      );
      const rightUserResponses = await Promise.all(rightUserPromises);
      const rightUsers = rightUserResponses.filter(Boolean);
      const nRightUsers= rightUsers.filter((item)=>item.activation_status==1)
      setRightUserArray(nRightUsers);
      console.log("Right User Array:", nRightUsers);
  
    } catch (err) {
      console.log('Error fetching direct member data:', err.message);
    }
  };
  

  useEffect(() => {
    getDirectMemberData();
  }, []);

  const filteredLeftUsers = leftUserArray.filter(user =>
    user.client_id.toLowerCase().includes(leftSearch.toLowerCase())
  );

  const filteredRightUsers = rightUserArray.filter(user =>
    user.client_id.toLowerCase().includes(rightSearch.toLowerCase())
  );

  const renderTable = (data, title, searchValue, setSearchValue) => {
    console.log("Rendering", title, "Table with data:", data);
    return (
      <View style={{ marginBottom: 20, marginTop: 30 }}>
        <Text allowFontScaling={false} style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginLeft: 10 }}>{title}</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={`Search USER ID`}
          value={searchValue}
          onChangeText={setSearchValue}
        />
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'gray' }}>
          <Text allowFontScaling={false} style={styles.columnHeader}>Client ID</Text>
          <Text allowFontScaling={false} style={styles.columnHeader}>Name</Text>
          <Text allowFontScaling={false} style={styles.columnHeader}>Package</Text>
          <Text allowFontScaling={false} style={styles.columnHeader}>Reg Date</Text>
          <Text allowFontScaling={false} style={styles.columnHeader}>Act Date</Text>
          <Text allowFontScaling={false} style={styles.columnHeader}>Status</Text>
        </View>
        {data.length > 0 ? (
          data.map((item, index) => (

        
              

              <View key={item.client_id} style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'lightgray' }}>
              <Text allowFontScaling={false} style={styles.columnData}>{item.client_id}</Text>
              <Text allowFontScaling={false} style={styles.columnData}>{item.client_name}</Text>
              <Text allowFontScaling={false} style={styles.columnData}>{item.package_name}</Text>
              <Text allowFontScaling={false} style={styles.columnData}>{item.join_date}</Text>
              <Text allowFontScaling={false} style={styles.columnData}>{item.activation_date}</Text>
              {item.activation_status == 1 ?
                <Pressable style={[styles.statusButton, { backgroundColor: "green" }]}>
                  <Text allowFontScaling={false} style={styles.statusText}>Active</Text>
                </Pressable> :
                <Pressable style={[styles.statusButton, { backgroundColor: "red" }]}>
                  <Text allowFontScaling={false} style={styles.statusText}>De-Active</Text>
                </Pressable>}
            </View>
    
        
          ))
        ) : (
          <Text allowFontScaling={false} style={{ textAlign: "center" }}>No Data Available In Table</Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View>
        <Text
          allowFontScaling={false}
          style={{
            height: 1,
            borderColor: "whitesmoke",
            borderWidth: 2,
            marginBottom: 10
          }}
        />
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Text allowFontScaling={false} style={{ color: "#9e0059", fontSize: 15, letterSpacing: 2 }}>
            ACTIVE MEMBER
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

      {renderTable(filteredLeftUsers, 'Left', leftSearch, setLeftSearch)}
      <Text
        allowFontScaling={false}
        style={{
          height: 1,
          borderColor: "whitesmoke",
          borderWidth: 2,
          marginTop: 15,
        }}
      />
      {renderTable(filteredRightUsers, 'Right', rightSearch, setRightSearch)}
    </ScrollView>
  );
};

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

export default ActiveMemberScreen;
