import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Feather } from "@expo/vector-icons";
import { useAppTheme } from "../hooks/useAppTheme";

import AddTaskScreen from "../screens/AddTaskScreen";
import DetailsScreen from "../screens/DetailsScreen";
import ExploreScreen from "../screens/ExploreScreen";
import HomeScreen from "../screens/HomeScreen";

export type RootStackParamList = {
  MainTabs: undefined;
  Details: {
    taskId: string;
  };
  AddTask: {
    editTaskId?: string;
  } | undefined;
};

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <Feather name="check-square" size={20} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: "Categories",
          tabBarIcon: ({ color, size }) => (
            <Feather name="grid" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { colors } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 17,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          title: "Task Details",
        }}
      />

      <Stack.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={({ route }) => ({
          title: route.params?.editTaskId ? "Edit Task" : "Add Task",
        })}
      />
    </Stack.Navigator>
  );
}
