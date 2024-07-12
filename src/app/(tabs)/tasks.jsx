import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
  ActivityIndicator,
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
  const [key, setKey] = useState("");
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleGet = async (isRefreshing = false) => {
    try {
      if (!key) return showToast("Key required!");
      if (!isRefreshing) setLoader(true);
      const res = await fetch(`https://1ob.vercel.app/api/todo/${key}`);
      const { message, data: resData, error } = await res.json();
      if (error) {
        return showToast(message);
      }
      setData(resData);
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
      if (!key) return showToast("Key required!");
      const requestOptions = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      const res = await fetch(
        `https://1ob.vercel.app/api/todo/${key}?id=${id}`,
        requestOptions
      );
      const { message } = await res.json();
      showToast(message);
      handleGet();
    } catch (error) {
      console.log(error);
      showToast("Failed to fetch");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    handleGet(true);
  };

  const Item = ({ title, desc, date ,id}) => (
    <View style={{ backgroundColor: "#e0e0e0", marginVertical: 8, padding: 8 }}>
      <View className=" flex-row justify-between">
      <Text className=" text-base font-bold">{title}</Text>
      <AntDesign onPress={()=>handleDel(id)} name="delete" size={20} color="black" />
      </View>
      <Text className=" text-xs my-1">{Dateformatter(date)}</Text>
      <Text className=" text-sm border-t border-black/20">{desc}</Text>
    </View>
  );

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
          <View className=" flex-row items-center justify-center gap-10">
            <TextInput
              placeholder="Enter key"
              value={key}
              onChangeText={setKey}
              style={{
                padding: 8,
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 8,
              }}
            />
            <Pressable className=" bg-black  rounded-md" onPress={handleGet}>
              <Text className="text-white px-6 py-3  text-sm">
                {loader ? "Fetching...." : "Fetch"}
              </Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          loader && (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={{ marginVertical: 16 }}
            />
          )
        }
      />
    </View>
  );
}
