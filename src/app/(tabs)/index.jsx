import React, { useState } from "react";
import { View, TextInput, Pressable, Text, ToastAndroid } from "react-native";

export const showToast = (message, duration = ToastAndroid.LONG) => {
  ToastAndroid.show(message, duration);
};

const Home = () => {
  const [title, setTitle] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [loader, setloader] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!key || !description || !title) return showToast("All needed");
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, title, desc: description }),
      };
      setloader(true);
      const res = await fetch(
        `https://1ob.vercel.app/api/todo/${key}`,
        requestOptions
      );
      const { message } = await res.json();
      showToast(message);
      setDescription('')
      setTitle('')
    } catch (error) {
      console.log(error);
      showToast("Failed to fetch");
    } finally {
      setloader(false);
    }
  };
  return (
    <View className="container p-3">
      <TextInput
        placeholder="key"
        value={key}
        onChangeText={setKey}
        className="p-2  border-black/20 border rounded-lg"
      />
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        className="p-2 mt-14 mb-2 border-black/20 border rounded-lg"
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        numberOfLines={4}
        multiline
        className="p-2 mb-2 mt-2 border-black/20 border rounded-lg"
      />
      <Pressable
        onPress={handleSubmit}
        className={` py-3 px-6 mt-10 rounded-lg
        ${!loader ? "bg-black" : "bg-black/40"}
        `}
      >
        <Text className="text-center text-white">
          {loader ? "Saving...." : "Save"}
        </Text>
      </Pressable>
    </View>
  );
};

export default Home;
