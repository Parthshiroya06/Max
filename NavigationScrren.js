import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LoginScreen from './LoginScreen'; 
import HomeScreen from './HomeScreen'; 
import SetupScreen from './SetupScreen';
import CollectScreen from './CollectScreen';
import CollectData from './CollectData';
import MapScreen from './MapsScreen';
import HabitatPicturesScreen from './HabitatPicture';
import VialPicture from './VialPicture';
import SetupDetail from './SetupDetail';
import ProjectDetails from './ProjectDetails';
import UploadedData from './UploadedDataScreen';
import VialPictureUplaoded from './VialPictureUplaoded';
import HabitatPictureUploaded from './HabitatPictureUploaded';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Define the bottom tab navigator (MainTabs)
const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70, 
          paddingBottom: 10, 
          backgroundColor: '#ACCAC8',
        },
        tabBarIcon: ({ color, size }) => {

          if (route.name === 'Home') {
            // Use Entypo for Home icon
            return <Entypo name="home" size={size + 10} color={color} />;
          }else if (route.name === 'Setup') {
            // Use Entypo for Home icon
            return <MaterialCommunityIcons name="plus-box-multiple" size={size + 10} color={color} />;
          }else if (route.name === 'Collect') {
            // Use Entypo for Home icon
            return <MaterialCommunityIcons name="clipboard-text" size={size + 10} color={color} />;
          }else if (route.name === 'Map') {
            // Use Entypo for Home icon
            return <Entypo name="location-pin" size={size + 10} color={color} />;
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#48938F',
        tabBarInactiveTintColor: 'black',
      })}     
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabelStyle: {
            fontWeight: 'bold', 
            fontSize: 14, 
          },
        }}
      />
      <Tab.Screen
        name="Setup"
        component={SetupScreen}
        options={{
          tabBarLabelStyle: {
            fontWeight: 'bold', 
            fontSize: 14, 
          },
        }}
      />
      <Tab.Screen
        name="Collect"
        component={CollectScreen}
        options={{
          tabBarLabelStyle: {
            fontWeight: 'bold', 
            fontSize: 14, 
          },
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabelStyle: {
            fontWeight: 'bold',
            fontSize: 14, 
          },
        }}
      />
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
        <Stack.Screen name="CollectDataScreen" component={ProjectDetails} options={{ headerShown: false }} />
        <Stack.Screen name="CollectScreen" component={CollectData} options={{ headerShown: false }} />
        <Stack.Screen name="ProjectDetails" component={ProjectDetails} options={{ headerShown: false }} />
        <Stack.Screen name="Project" component={CollectScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VialPicture" component={VialPicture} options={{ headerShown: false }}/>
        <Stack.Screen name="HabitatPicture" component={HabitatPicturesScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SetupDetail" component={SetupDetail} options={{ headerShown: false }}/>
        <Stack.Screen name="SetupScreen2" component={SetupScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Home2" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="SetupScreen" component={SetupScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="CollectScreen2" component={CollectScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UploadedNoteScreen" component={UploadedData} options={{ headerShown: false }} />
        <Stack.Screen name="VialPictureUploaded" component={VialPictureUplaoded} options={{ headerShown: false }} />
        <Stack.Screen name="HabitaPictureUploaded" component={HabitatPictureUploaded} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
