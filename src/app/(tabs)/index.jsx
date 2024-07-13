import React, { useState } from "react";
import { View, TextInput, Pressable, Text, ToastAndroid, StyleSheet } from "react-native";

export const showToast = (message, duration = ToastAndroid.LONG) => {
  ToastAndroid.show(message, duration);
};

const Home = () => {
  const [title, setTitle] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!key || !description || !title) return showToast("All needed");
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, title, desc: description }),
      };
      setLoader(true);
      const res = await fetch(
        `https://1ob.vercel.app/api/todo/${key}`,
        requestOptions
      );
      const { message } = await res.json();
      showToast(message);
      setDescription('');
      setTitle('');
    } catch (error) {
      console.log(error);
      showToast("Failed to fetch");
    } finally {
      setLoader(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Key"
        value={key}
        onChangeText={setKey}
        style={styles.input}
      />
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={[styles.input, styles.marginVertical]}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        numberOfLines={4}
        multiline
        style={[styles.input, styles.marginVertical]}
      />
      <Pressable
        onPress={handleSubmit}
        style={[
          styles.button,
          loader ? styles.buttonDisabled : styles.buttonEnabled,
        ]}
      >
        <Text style={styles.buttonText}>
          {loader ? "Saving...." : "Save"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    padding: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  marginVertical: {
    marginTop: 14,
    marginBottom: 2,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 10,
    borderRadius: 8,
  },
  buttonEnabled: {
    backgroundColor: 'black',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
  },
});

export default Home;
