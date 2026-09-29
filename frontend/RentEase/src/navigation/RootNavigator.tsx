import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/AuthScreen';
import BottomTabNavigator from './BottomTabNavigator';
import AddPropertyScreen from '../components/AddPropertyScreen';


export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  MainTabs: undefined;
  AddProperty: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: {backgroundColor: '#0A0A0A'},
        }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen
          name="AddProperty"
          component={AddPropertyScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
