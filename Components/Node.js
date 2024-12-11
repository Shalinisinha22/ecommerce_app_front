import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { max } from 'moment-timezone';

const Node = ({ node, data, level = 0, maxLevel = 2, type,name }) => {


  // console.log(name,"name")

  const [rootName, setRootName] = useState("No Node");
  const [leftChildName, setLeftChildName] = useState("No Node");
  const [rightChildName, setRightChildName] = useState("No Node");

  const [isRootActive,setIsRootActive]=useState(false)
  const [isLeftActive,setIsLeftActive]=useState(false)
  const [isRightActive,setIsRightActive]=useState(false)
  

  useEffect(() => {
    const fetchClientNames = async () => {
      try {
        const res = await axios.get("https://mahilamediplex.com/mediplex/clientName", {
          params: {
            root: node,
            left: data[node]?.left || null,
            right: data[node]?.right || null,
          }
        });

        const names = res.data.reduce((acc, item) => {
          acc[item.client_id] = item;
          return acc;
        }, {});


        console.log(names,"37")

        setRootName(names[node]?.first_name || '');
        setLeftChildName(names[data[node]?.left]?.first_name || 'No Node');
        setRightChildName(names[data[node]?.right]?.first_name || 'No Node');

        // Set activation status
        setIsRootActive(names[node]?.active === '1');
        setIsLeftActive(names[data[node]?.left]?.active === '1');
        setIsRightActive(names[data[node]?.right]?.active === '1');


        // Additional logging for debugging
        console.log('Fetched Names:', names);
      } catch (error) {
        console.error('Error fetching client names:', error.message);
      }
    };

    if (node && data[node]) {
      fetchClientNames();
    } else {
      console.log('Node or Data is undefined:', { node, data });
    }
  }, [node, data]);

  const leftChild = data[node]?.left || "No Node";
  const rightChild = data[node]?.right || "No Node";

  // Additional logging to verify children
  console.log('Rendering Node:', { node, level, leftChild, rightChild });

  return (
    <View style={styles.treeContainer}>
      {/* Render the current node */}
      <View style={styles.row}>
        <View style={styles.cell}>
          {isRootActive ? (
            <Image source={require("../assets/green.png")} style={styles.image} />
          ) : (
            <Image source={require("../assets/red.png")} style={styles.image} />
          )}
          <Text allowFontScaling={false} style={styles.nodeText}>{node}</Text>
          <Text allowFontScaling={false} style={styles.nameText}>{name}</Text>

        {level!= maxLevel &&  <Image source={require("../assets/line.gif")} style={{height:10,width:120,resizeMode:"contain"}}></Image>} 
        </View>
      </View>

      {/* Render children nodes recursively */}
      {level < maxLevel && (
        <View style={styles.row}>
          <View style={styles.cell}>
            {leftChild !== "No Node" ? (
              <Node
                node={leftChild}
                data={data}
                level={level + 1}
                type="left"
                maxLevel={maxLevel}
                name={leftChildName}
              />
            ) : (
              <View style={styles.cell}>
                <Image source={require("../assets/no_node.png")} style={[styles.image,{marginTop:20}]} />
                <Text allowFontScaling={false} style={[styles.nodeText,{paddingHorizontal:15}]}>No Node</Text>
              </View>
            )}
          </View>
          <View style={styles.cell}>
            {rightChild !== "No Node" ? (
              <Node
                node={rightChild}
                data={data}
                level={level + 1}
                type="right"
                maxLevel={maxLevel}
                name={rightChildName}
              />
            ) : (
              <View style={styles.cell}>
                <Image source={require("../assets/no_node.png")} style={[styles.image,{marginTop:20}]} />
                <Text allowFontScaling={false} style={[styles.nodeText,{paddingHorizontal:15}]}>No Node</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  treeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop:20
  
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  nodeText: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: '#155d27',
    borderRadius: 5,
    textAlign: 'center',
    marginBottom: 8,
    color: "#fff",
    marginTop: 0,
    fontSize: 6,
  },
  nameText: {
    letterSpacing: 0.2,
    fontWeight: 'bold',
    fontSize: 9,
  },
  image: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
});

export default Node;
