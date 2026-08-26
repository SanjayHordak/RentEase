import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';

import HomeScreen from '../screens/HomeScreen';
import PropertiesScreen from '../screens/PropertiesScreen';
import ActivityScreen from '../screens/ActivityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Colors } from '../theme/colors';

export type BottomTabParamList = {
  Home: undefined;
  Properties: undefined;
  Activity: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        headerShown: false,

        tabBarIcon: ({focused, color, size}) => {
          let iconName:
            | 'home'
            | 'home-outline'
            | 'business'
            | 'business-outline'
            | 'notifications'
            | 'notifications-outline'
            | 'person'
            | 'person-outline';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;

            case 'Properties':
              iconName = focused
                ? 'business'
                : 'business-outline';
              break;

            case 'Activity':
              iconName = focused
                ? 'notifications'
                : 'notifications-outline';
              break;

            case 'Profile':
              iconName = focused
                ? 'person'
                : 'person-outline';
              break;
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },

        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: '#8A8F98',

        tabBarStyle: {
          height: 68,
          paddingTop: 6,
          paddingBottom: 8,
          backgroundColor: '#101820',
          borderTopWidth: 1,
          borderTopColor: '#2A3038',
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        tabBarHideOnKeyboard: true,
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Properties"
        component={PropertiesScreen}
      />

      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}