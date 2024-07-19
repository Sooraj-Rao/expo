import React, { useState, useEffect } from 'react';
import { View, TextInput, Pressable, Text, ToastAndroid, StyleSheet, BackHandler, Keyboard } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export const showToast = (message, duration = ToastAndroid.LONG) => {
    ToastAndroid.show(message, duration);
};

const Url = () => {
    const Server = (process.env.EXPO_PUBLIC_API_URL).replace('todo.', '');
    const [loader, setLoader] = useState(false);
    const [custom, setCustom] = useState('');
    const [long, setLong] = useState('');
    const [key] = useState(process.env.EXPO_PUBLIC_API_KEY);
    const [short, setShort] = useState('');

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => backHandler.remove();
    }, []);

    const handleBackPress = () => {
        BackHandler.exitApp();
        return true;
    };

    const handleSubmit = async () => {
        try {
            Keyboard.dismiss();
            if (!long) return showToast("Long URL is required");
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ custom, long, key }),
            };

            setLoader(true);
            const res = await fetch(`${Server}/add`, requestOptions);
            const { short, success, message } = await res.json();

            if (!success) {
                showToast(message);
            } else {
                const newUrl = Server + '/' + short;
                setShort(newUrl);
                await Clipboard.setStringAsync(newUrl);
                showToast("Copied to clipboard");
                handleBackPress();
            }

            setCustom('');
            setLong('');
        } catch (error) {
            console.log(error);
            showToast("Failed to shorten URL");
        } finally {
            setLoader(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Custom URL"
                value={custom}
                onChangeText={setCustom}
                style={styles.input}
            />
            <TextInput
                placeholder="Long URL"
                value={long}
                onChangeText={setLong}
                style={[styles.input, styles.marginVertical]}
            />
            <Pressable
                onPress={handleSubmit}
                style={[
                    styles.button,
                    styles.marginVertical,
                    loader ? styles.buttonDisabled : styles.buttonEnabled,
                ]}
            >
                <Text style={styles.buttonText}>
                    {loader ? "Shortening..." : "Shorten"}
                </Text>
            </Pressable>
            {short ? (
                <View style={styles.shortUrlContainer}>
                    <Text style={styles.shortUrlLabel}>Short URL:</Text>
                    <Text style={styles.shortUrl}>{short}</Text>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        width: '100%',
        padding: 12,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
    },
    marginVertical: {
        marginVertical: 10,
    },
    button: {
        backgroundColor: 'black',
        width: '100%',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonEnabled: {
        opacity: 1,
    },
    buttonDisabled: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    shortUrlContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    shortUrlLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    shortUrl: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default Url;
