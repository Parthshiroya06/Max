import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import LoginScreen from './LoginScreen'; // Ensure this path is correct
import HomeScreen from './HomeScreen'; // Import HomeScreen
import SetupScreen from './SetupScreen';
import CollectScreen from './CollectScreen';
import CollectData from './CollectData';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Define the bottom tab navigator (MainTabs)
const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home" // Set the initial route for the tab navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon;
          if (route.name === 'Home') {
            icon = <Text style={{ color, fontSize: size }}>🏠</Text>;
          } else if (route.name === 'Setup') {
            icon = <Text style={{ color, fontSize: size }}>⚙️</Text>;
          } else if (route.name === 'Collect') {
            icon = <Text style={{ color, fontSize: size }}>📦</Text>;
          } else if (route.name === 'Map') {
            icon = <Text style={{ color, fontSize: size }}>🗺️</Text>;
          }
          return icon;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Setup" component={SetupScreen} />
      <Tab.Screen name="Collect" component={CollectScreen} />
      
    </Tab.Navigator>
  );
};

// Main Navigation (Stack + Tabs)
export default function NavigationScreen() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="CollectDataScreen" component={CollectData} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
