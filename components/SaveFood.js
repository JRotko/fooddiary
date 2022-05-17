import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { Input, Button, Icon } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DatePicker from 'react-native-datepicker'
import * as SQLite from'expo-sqlite';
import {Picker} from '@react-native-picker/picker';


export default function SaveFood({route, navigation}) {
    const {foodName} = route.params
    const {day} = route.params
    const db = SQLite.openDatabase('meal.db');


    // hard coded for testing
    const [results, setResults] = useState({
      "carbs":100,
        "calories":100,
        "protein":100,
        "fat":100,
        "serving":100,
    })
    const [meal, setMeal] = useState('Breakfast')
    const [amount, setAmount] = useState(1)


    // api request for food item data
    sd = {
      "query": foodName
    }
    const searchUrl = 'https://trackapi.nutritionix.com/v2/natural/nutrients'
    const searchParams = {
      headers: {
        "Content-Type": "application/json",
        "x-app-id": "bdd3f028",
        "x-app-key": "3aaf3b89305186194aaae259a282589c"
      },
      body: JSON.stringify(sd),
      method:"POST"
      
    }
  
  
    // save food entry and return home
    const save = () => {
      db.transaction(tx => {
        tx.executeSql('INSERT INTO meals (day, food, meal, amount, carbs, protein, fat, calories) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
        [day, foodName, meal, amount, results.carbs * amount, results.protein * amount, results.fat * amount, results.calories * amount])
      }, console.log("error"), console.log("success"))

      navigation.navigate('Home')

    }


    return (
      <View>
        <Button buttonStyle={{width: 250}} rased icon={{name: 'save', color: 'white'}} onPress={save} title="Save" />
        <Text>{foodName}</Text>
        <Text>Serving size {results.serving} grams</Text>
        <Text>Calories: {results.calories}</Text>
        <Text>Carbs: {results.carbs}</Text>
        <Text>Protein: {results.protein}</Text>
        <Text>Fat: {results.fat}</Text>

        <Input onChangeText={amount => setAmount(amount)} placeholder="Amount" label="amount" keyboadType=""/>
        <Picker
          selectedValue={meal}
          onValueChange={(itemValue, itemIndex) =>
            setMeal(itemValue)}
          >
          <Picker.Item label="Breakfast" value="Breakfast" />
          <Picker.Item label="Lunch" value="Lunch" />
          <Picker.Item label="Dinner" value="Dinner" />
        </Picker>
      </View>
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