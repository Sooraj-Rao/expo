import React, { useState } from "react";

import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import { showToast } from ".";
import { AntDesign } from '@expo/vector-icons';

const Dateformatter = (isoDateString) => {
  const date = new Date(isoDateString);

  const formattedDate = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return `${formattedDate} ${formattedTime}`;
};

export default function TaskList() {
  let key = process.env.EXPO_PUBLIC_API_KEY
  let Server = process.env.EXPO_PUBLIC_API_URL

  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleGet = async () => {
    try {
      setLoader(true);
      const res = await fetch(`${Server}/api/todo/${key}`);
      const { message, data: resData, error } = await res.json();
      if (error) {
        return showToast(message);
      }
      setData(resData?.reverse());
    } catch (error) {
      console.log(error);
      showToast("Failed to fetch");
    } finally {
      setLoader(false);
      setRefreshing(false);
    }
  };
  const handleDel = async (id) => {
    try {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this task?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: async () => {
              try {
                setLoader(true);
                const requestOptions = {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                };
                const res = await fetch(
                  `${Server}/api/todo/${key}?id=${id}`,
                  requestOptions
                );
                const { message } = await res.json();
                showToast(message);
                handleGet();
              } catch (error) {
                showToast('Failed to delete');
                console.log(error);
              }
            },
          },
        ],
        { cancelable: false }
      );

    } catch (error) {
      console.log(error);
      showToast("Failed to fetch");
    } finally {
      setLoader(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    handleGet();
  };

  const Item = ({ title, desc, date, id }) => {
    return (
      <View style={{ backgroundColor: "#e0e0e0", marginVertical: 8, padding: 8 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>{title}</Text>
          <AntDesign onPress={() => handleDel(id)} name="delete" size={20} color="black" />
        </View>
        <Text style={{ fontSize: 10, marginVertical: 4 }}>{Dateformatter(date)}</Text>
        <Text style={{ fontSize: 14, borderTopWidth: 1, borderTopColor: "rgba(0, 0, 0, 0.2)" }}>{desc}</Text>
      </View>
    )
  }

  return (
    <View style={{ margin: 16 }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({ item }) => (
          <Item title={item?.title} desc={item?.desc} date={item?.date} id={item?._id} />
        )}
        keyExtractor={(item) => item._id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }}>

            <Pressable style={{ backgroundColor: "black", borderRadius: 8 }} onPress={handleGet}>
              <Text style={{ color: "white", paddingHorizontal: 24, paddingVertical: 12, fontSize: 14 }}>
                {loader ? "Fetching...." : "Fetch"}
              </Text>
            </Pressable>
          </View>
        }

      />
    </View>
  );
}
