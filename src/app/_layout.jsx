import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';

export default function RootLayout() {
  useEffect(() => {
    async function checkAndRequestPermission() {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Permission for notifications not granted. Please enable it in the settings.');
        return;
      }

      await scheduleNightlyNotification();
    }

    async function scheduleNightlyNotification() {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Nightly Reminder",
          body: "Have a great sleep Nigga!",
          data: { task: 'work work work' },
        },
        trigger: {
          hour: 21,
          minute: 3,
          repeats: true,
        },
      });
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    checkAndRequestPermission();
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
