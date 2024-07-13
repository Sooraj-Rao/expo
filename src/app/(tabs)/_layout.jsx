import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: "black", tabBarShowLabel: false }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={26} color={color} name="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          headerTitle: "Tasks",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={26} color={color} name="tasks" />
          ),
        }}
      />
      <Tabs.Screen
        name="url"
        options={{
          headerTitle: "URL Shortner",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={26} color={color} name="link" />
          ),
        }}
      />
    </Tabs>
  );
}
