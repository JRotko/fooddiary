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
import styles from './Style'




export default function SaveFood({route, navigation}) {
    const {foodName} = route.params
    const {day} = route.params
    const db = SQLite.openDatabase('meal.db');
    const [results, setResults] = useState({})
    const [meal, setMeal] = useState('Breakfast')
    const [amount, setAmount] = useState(1)

    useEffect(() => {
      getResults()
    }, [])


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
  
    const getResults = () => {
      fetch(searchUrl, searchParams)
      .then(response => response.json())
      .then(responseJson => setResults({
        "carbs":responseJson.foods[0].nf_total_carbohydrate,
        "calories":responseJson.foods[0].nf_calories,
        "protein":responseJson.foods[0].nf_protein,
        "fat":responseJson.foods[0].nf_total_fat,
        "serving":responseJson.foods[0].serving_weight_grams,
      }))
      .catch(error => { 
        Alert.alert('Error', error); 
      })
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
      <View style={styles.container}>
        <Button buttonStyle={styles.button} rased icon={{name: 'save', color: 'white'}} onPress={save} title="Save" />
        <Text style={{fontSize: 18, fontWeight: "bold"}}>{foodName}</Text>
        <Text>Serving size {results.serving} grams</Text>
        <Text>Calories: {results.calories}</Text>
        <Text>Carbs: {results.carbs}</Text>
        <Text>Protein: {results.protein}</Text>
        <Text>Fat: {results.fat}</Text>

        <Input onChangeText={amount => setAmount(amount)} placeholder="Amount" label="amount" keyboadType=""/>
        <Picker
          style={{width: 300}}
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

