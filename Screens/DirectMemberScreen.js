import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DirectMemberScreen = () => {
  const [leftUserArray, setLeftUserArray] = useState([]);
  const [rightUserArray, setRightUserArray] = useState([]);
  const [leftSearch, setLeftSearch] = useState('');
  const [rightSearch, setRightSearch] = useState('');

  const userInfo = useSelector((state) => (state.user.userInfo ? state.user.userInfo : null));

  const getDirectMemberData = async () => {
    try {
      const res = await axios.get('https://mahilamediplex.com/mediplex/clientAccountLog');
      const network = JSON.parse(res.data[0].network);
      const res1 = await axios.get('https://mahilamediplex.com/mediplex/directMemberData', {
        params: {
          parent_id: userInfo.client_id,
        },
      });

      const activeUserArray = res1.data;

      const leftArray = [];
      const rightArray = [];

      activeUserArray.forEach((user) => {
        const parentNode = network[user.parent_id];
        if (parentNode) {
          if (parentNode.left === user.client_id) {
            leftArray.push(user);
          } else if (parentNode.right === user.client_id) {
            rightArray.push(user);
          }
        }
      });


      console.log(rightArray,leftArray)
      setLeftUserArray(leftArray);
      setRightUserArray(rightArray);
    } catch (err) {
      console.log(err.message);
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
    return (
      <View style={{ marginBottom: 20, marginTop: 30 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginLeft: 10 }}>{title}</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={`Search USER ID`}
          value={searchValue}
          onChangeText={setSearchValue}
        />
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'gray' }}>
          <Text style={styles.columnHeader}>Client ID</Text>
          <Text style={styles.columnHeader}>Name</Text>
          <Text style={styles.columnHeader}>Package</Text>
          <Text style={styles.columnHeader}>Reg Date</Text>
          <Text style={styles.columnHeader}>Act Date</Text>
          <Text style={styles.columnHeader}>Status</Text>
        </View>
        {data.length != 0 ? data.map((item, index) => (
          <View key={item.client_id} style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'lightgray' }}>
            <Text style={styles.columnData}>{item.client_id}</Text>
            <Text style={styles.columnData}>{item.client_name}</Text>
            <Text style={styles.columnData}>{item.package_name}</Text>
            <Text style={styles.columnData}>{item.join_date}</Text>
            <Text style={styles.columnData}>{item.activation_date}</Text>
            {item.activation_status == 1 ?
              <Pressable style={[styles.statusButton, { backgroundColor: "green" }]}>
                <Text style={styles.statusText}>Active</Text>
              </Pressable> :
              <Pressable style={[styles.statusButton, { backgroundColor: "red" }]}>
                <Text style={styles.statusText}>De-Active</Text>
              </Pressable>}
          </View>
        )) : <Text style={{ textAlign: "center" }}>No Data Available In Table</Text>}
      </View>
    );
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{}}>
        <Text
          allowFontScaling={false}
          style={{
            height: 1,
            borderColor: "whitesmoke",
            borderWidth: 2,
            marginBottm: 10
          }}
        />
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Text allowFontScaling={false} style={{ color: "#9e0059", fontSize: 15, letterSpacing: 2 }}>
            DIRECT MEMBER
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

      {/* <View style={{ margin: 20 }}>
        <Text style={{ marginBottom: 10, fontWeight: "bold", letterSpacing: 2 }}>Total Active: 0</Text>
        <Text style={{ marginBottom: 10, fontWeight: "bold", letterSpacing: 2 }}>Total De-Active: 0</Text>
      </View>
      <Text
        allowFontScaling={false}
        style={{
          height: 1,
          borderColor: "whitesmoke",
          borderWidth: 2,
          marginTop: 10,
        }}
      /> */}

      {renderTable(filteredLeftUsers, 'Left', leftSearch, setLeftSearch)}
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

export default DirectMemberScreen;
