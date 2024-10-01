import { View, Text, ScrollView, Dimensions, StyleSheet, FlatList, Pressable, Image, Modal, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
const width = Dimensions.get('screen').width;
import { imgUrl } from '../Components/Image/ImageUrl';

const FundRequestStatus = () => {
  const [allFundsRequest, setAllFundsRequest] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const userInfo = useSelector((state) => state.user.userInfo ? state.user.userInfo : null);

  const getAllFundRequests = async () => {
    try {
      const res = await axios.get("https://mahilamediplex.com/mediplex/fund-request-status", {
        params: {
          client_id: userInfo.client_id
        }
      });

      console.log("17", res.data);
      setAllFundsRequest(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getAllFundRequests();
  }, []);

  const handleViewImage = (slip) => {
    setSelectedImage(`${imgUrl}/slip/${slip}`);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text allowFontScaling={false} style={[styles.cell, styles.dateCell]}>{item.created_at}</Text>
      <Text allowFontScaling={false} style={[styles.cell, { fontWeight: "bold" }]}>Rs {item.paid_amt}</Text>

      {/* Button to View Image */}
      <Pressable style={styles.imageButton} onPress={() => handleViewImage(item.slip)}>
        <Text allowFontScaling={false} style={styles.buttonText}>View Image</Text>
      </Pressable>

      {/* Button for Status */}
      {item.status === "Pending" ? (
        <Pressable style={[styles.statusButton, { backgroundColor: "#ffb703" }]}>
          <Text allowFontScaling={false} style={styles.statusText}>Pending</Text>
        </Pressable>
      ) : item.status === "Approved" ? (
        <Pressable style={[styles.statusButton, { backgroundColor: "green" }]}>
          <Text allowFontScaling={false} style={styles.statusText}>Approved</Text>
        </Pressable>
      ) : (
        <Pressable style={[styles.statusButton, { backgroundColor: "red" }]}>
          <Text allowFontScaling={false} style={styles.statusText}>Rejected</Text>
        </Pressable>
      )}

      <Text allowFontScaling={false} style={[styles.cell, styles.remarksCell]}>{item.remarks}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <View>
          <Text allowFontScaling={false} style={styles.title}>FUND REQUEST STATUS</Text>
          <Text allowFontScaling={false} style={styles.separator} />
        </View>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.header}>
            <Text allowFontScaling={false} style={[styles.headerCell, styles.dateCell]}>Date</Text>
            <Text allowFontScaling={false} style={styles.headerCell}>Amount</Text>
            <Text allowFontScaling={false} style={styles.headerCell}>Slip</Text>
            <Text allowFontScaling={false} style={styles.headerCell}>Status</Text>
            <Text allowFontScaling={false} style={[styles.headerCell, styles.remarksCell]}>Remarks</Text>
          </View>

          {/* Table Rows */}
          {allFundsRequest.length !== 0 ? (
            <FlatList
              data={allFundsRequest}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.tableContent}
            />
          ) : (
            <Text allowFontScaling={false} style={styles.noDataText}>No Data Available</Text>
          )}
        </View>

        {/* Image Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedImage && (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.modalImage}
                />
              )}
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <Text allowFontScaling={false} style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dateCell: {
    width: width * 0.25,
  },
  remarksCell: {
    width: width * 0.3,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: "center",
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    padding: 2,
    fontSize: 10,
  },
  imageButton: {
    backgroundColor: '#007bff',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 10,
  },
  statusButton: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  statusText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    height: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalImage: {
    width: '100%',
    height: '65%',
    resizeMode: 'contain',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#a11463',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  title: {
    color: "#9e0059",
    fontSize: 15,
    letterSpacing: 2,
    textAlign: "center",
    marginVertical: 10,
  },
  separator: {
    height: 1,
    borderColor: "whitesmoke",
    borderWidth: 2,
    marginVertical: 10,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
  },
});

export default FundRequestStatus;
