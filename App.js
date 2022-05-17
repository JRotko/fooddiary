import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Input, Button } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DatePicker from 'react-native-datepicker'
import * as SQLite from'expo-sqlite';
import Home from './components/Home'
import Search from './components/Search'
import SaveFood from './components/SaveFood'
import Cam from './components/Cam'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={Home}></Stack.Screen>
        <Stack.Screen name='Search' component={Search}></Stack.Screen>
        <Stack.Screen name='SaveFood' component={SaveFood}></Stack.Screen>
        <Stack.Screen name='Cam' component={Cam}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
