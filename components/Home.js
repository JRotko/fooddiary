import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input, Button, Icon } from 'react-native-elements'
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import { NavigationContainer, useIsFocused } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SQLite from'expo-sqlite';
import { StyleSheet, Text, View, FlatList, Image, ScrollView } from 'react-native';
import * as FileSystem from 'expo-file-system';


export default function Home({navigation}) {
    const [date, setDate] = useState(new Date())
    const [meals, setMeals] = useState([])
    const [breakfast, setBreakfast] = useState([])
    const [lunch, setLunch] = useState([])
    const [dinner, setDinner] = useState([])
    const db = SQLite.openDatabase('meal.db');
    const isFocused = useIsFocused()
    const [uri, setUri] = useState('')
    const [breakfastPhoto, setBreakfastPhoto] = useState('')
    const [lunchPhoto, setLunchPhoto] = useState('')
    const [dinnerPhoto, setDinnerPhoto] = useState('')

    const createPhotoDb = () => {
      db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS photos (id INTEGER PRIMARY KEY NOT null, day TEXT, meal TEXT, photo TEXT);')
      })
    }

    const createDb = () => {
      db.transaction(tx => {
        tx.executeSql('create table if not exists meals (id integer primary key not null, day text, food text, meal text, amount text, carbs float, protein float, fat float, calories float);'); 
      }, null, null);
    }

    const updateBreakfast = () => {
      db.transaction(tx => {
       tx.executeSql('select * from meals where day = ? and meal = "Breakfast";', [date.toISOString()], (_, { rows }) => 
         setBreakfast([...rows._array]),
       )
     }, null, null) }

    const updateLunch = () => {
    db.transaction(tx => {
      tx.executeSql('select * from meals where day = ? and meal = "Lunch";', [date.toISOString()], (_, { rows }) => 
        setLunch([...rows._array]),
      )
    }, null, null) }

    const updateDinner = () => {
    db.transaction(tx => {
      tx.executeSql('select * from meals where day = ? and meal = "Dinner";', [date.toISOString()], (_, { rows }) => 
        setDinner([...rows._array]),
      )
    }, null, null) }

    const deleteProduct = (id) => {
      db.transaction(
        tx => {tx.executeSql('delete from meals where id = ?;', [id])}, null, null
      )
      refresh()
    }


    const getPhoto = (m) => {
        db.transaction(tx => {
          tx.executeSql('SELECT photo FROM photos WHERE day = ? AND meal = ?;', [date.toISOString(), m],
          (_, {rows}) => {
            if (rows._array.length > 0) {
              if (m === "Breakfast") {
                setBreakfastPhoto(rows._array[0].photo)
              }
              if (m === "Lunch") {
                setLunchPhoto(rows._array[0].photo)
              }
              if (m === "Dinner") {
                setDinnerPhoto(rows._array[0].photo)
              }
            }
          },
          (_, error) => (console.log(error))  
          )
        }) 
    }

    
    const Photo = (props) => {
      getPhoto(props.meal)
      if (props.meal === "Breakfast") {
        if (breakfastPhoto != '') {
          return (
            <Image 
            style={{
              width: 50,
              height: 200,
              resizeMode: 'stretch',
            }}
            source={{
              uri: breakfastPhoto
          }} />
          )
        } else {
          return (
            <Button title='Add photo' onPress={() => navigation.navigate('Cam', {meal: "Breakfast", day: date.toISOString()})} />
          )
        }
        }


      if (props.meal === "Lunch") {
        if (lunchPhoto != '') {
          return (
            <Image 
            style={{
              width: 50,
              height: 200,
              resizeMode: 'stretch',
            }}
            source={{
              uri: lunchPhoto
          }} />
          )
        } else {
          return (
            <Button title='Add photo' onPress={() => navigation.navigate('Cam', {meal: "Lunch", day: date.toISOString()})} />
          )
        }      
      }

      if (props.meal === "Dinner") {
        if (dinnerPhoto != '') {
          return (
            <Image 
            style={{
              width: 50,
              height: 200,
              resizeMode: 'stretch',
            }}
            source={{
              uri: dinnerPhoto
          }} />
          )
        } else {
          return (
            <Button title='Add photo' onPress={() => navigation.navigate('Cam', {meal: "Dinner", day: date.toISOString()})} />
          )
        }
        
      }
      
        

    }
    

    const resetHours = () => {
      date.setHours(0,0,0,0)
    }

    const refresh = () => {
      createDb()
      createPhotoDb()
      resetHours()
      updateDinner()
      updateBreakfast()
      updateLunch()
      resetPhotos()
    }

    useEffect(() => {
      refresh()
    }, [date, isFocused])

    const listSeparator = () => {
      return (
        <View
          style={{
            height: 1,
            width: "80%",
            backgroundColor: "#CED0CE",
            marginLeft: "10%"
          }}
        />
      );
    };

    // console.log(breakfast)
    // console.log(lunch)
    // console.log(dinner)

    // const logg = async () => {
    //   console.log(await FileSystem.readDirectoryAsync(FileSystem.documentDirectory + 'photos'))
    // }
    // logg()

    const resetPhotos = () => {
      setBreakfastPhoto('')
      setLunchPhoto('')
      setDinnerPhoto('')
    }

    const FoodList = (props) => {
      return (
        <View>
        <Text>{props.photo}</Text>
        <Photo meal={props.photo}/>
        <FlatList 
              style={{marginLeft : "5%"}}
              keyExtractor={(item, index) => index.toString()} 
              renderItem={({item}) => 
                <View>
                  <Text style={{fontSize: 18, fontWeight: "bold"}}>{item.food}</Text>
                  <Text style={{fontSize: 18, fontWeight: "bold"}}>Amount {item.amount}</Text>
                  <Text style={{fontSize: 12, fontWeight: "normal"}}>Calories {item.calories}</Text>      
                  <Text style={{fontSize: 12, fontWeight: "normal"}}>Carbs {item.carbs}</Text>                
                  <Text style={{fontSize: 12, fontWeight: "normal"}}>Protein {item.protein}</Text>                
                  <Text style={{fontSize: 12, fontWeight: "normal"}}>Fat {item.fat}</Text>
                  <Icon type="material" color="red" name="delete" onPress={() => deleteProduct(item.id)}/>
                </View>}
              data={props.meal}
              ItemSeparatorComponent={listSeparator} /> 
        </View>
      )
    }

    return (
      <View>
        <Button title='Add Food' onPress={() => navigation.navigate('Search', {day: date.toISOString()})} />

        <DateTimePicker 
          mode="date" 
          value={date}
          onChange={(e, d) => setDate(new Date(d))}
        />
        <ScrollView>
          <FoodList meal={breakfast} photo="Breakfast"/>
          <FoodList meal={lunch} photo="Lunch"/>
          <FoodList meal={dinner} photo="Dinner"/>
        </ScrollView>
      </View>
    )
  }

