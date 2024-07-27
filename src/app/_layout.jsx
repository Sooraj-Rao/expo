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

      await scheduleDailyNotifications();
    }

    async function scheduleDailyNotifications() {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Good Morning!",
          body: "Start your day with a positive attitude!",
          data: { task: 'morning motivation' },
        },
        trigger: {
          hour: 8,
          minute: 0,
          repeats: true,
        },
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Good Afternoon!",
          body: "Take a break and recharge for the rest of the day!",
          data: { task: 'afternoon break' },
        },
        trigger: {
          hour: 12,
          minute: 0,
          repeats: true,
        },
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Good Night!",
          body: "Time to wind down and relax.",
          data: { task: 'nightly relaxation' },
        },
        trigger: {
          hour: 21,
          minute: 0,
          repeats: true,
        },
      });
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
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
