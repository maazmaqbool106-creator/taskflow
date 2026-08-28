import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import AddTaskScreen from "../screens/AddTaskScreen";
import DetailsScreen from "../screens/DetailsScreen";
import ExploreScreen from "../screens/ExploreScreen";
import HomeScreen from "../screens/HomeScreen";

import { useAppTheme } from "../hooks/useAppTheme";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";
import ChangePasswordScreen from "../screens/auth/ChangePasswordScreen";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword:
    | {
        email?: string;
      }
    | undefined;
  ChangePassword: undefined;

  MainTabs: undefined;

  AddTask:
    | undefined
    | {
        editTaskId: string;
      };

  Details: {
    taskId: string;
  };
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
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size, focused }) => (
            <Feather
              name={focused ? "check-square" : "clipboard"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: "Categories",
          tabBarIcon: ({ color, size, focused }) => (
            <Feather
              name={focused ? "grid" : "folder"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Authentication */}

      <Stack.Screen name="Login" component={LoginScreen} />

      <Stack.Screen name="Signup" component={SignupScreen} />

      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />

      {/* Main App */}

      <Stack.Screen name="MainTabs" component={MainTabs} />

      <Stack.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={({ route }) => ({
          headerShown: false,
          title: route.params?.editTaskId ? "Edit Task" : "Add Task",
        })}
      />

      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          headerShown: true,
          title: "Task Details",
        }}
      />
    </Stack.Navigator>
  );
}
