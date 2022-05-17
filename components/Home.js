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
import styles from './Style'


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

    // if query returns a non empty array, sets the url of first item as photo
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

    //if photo has been set, render photo, else render "add photo" button
    const Photo = (props) => {
      getPhoto(props.meal)
      if (props.meal === "Breakfast") {
        if (breakfastPhoto != '') {
          return (
            <Image 
            style={styles.image}
            source={{
              uri: breakfastPhoto
          }} />
          )
        } else {
          return (
            <Button buttonStyle={styles.button} title='Add photo' onPress={() => navigation.navigate('Cam', {meal: "Breakfast", day: date.toISOString()})} />
          )
        }
        }


      if (props.meal === "Lunch") {
        if (lunchPhoto != '') {
          return (
            <Image 
            style={styles.image}
            source={{
              uri: lunchPhoto
          }} />
          )
        } else {
          return (
            <Button buttonStyle={styles.button} title='Add photo' onPress={() => navigation.navigate('Cam', {meal: "Lunch", day: date.toISOString()})} />
          )
        }      
      }

      if (props.meal === "Dinner") {
        if (dinnerPhoto != '') {
          return (
            <Image 
            style={styles.image}
            source={{
              uri: dinnerPhoto
          }} />
          )
        } else {
          return (
            <Button buttonStyle={styles.button} title='Add photo' onPress={() => navigation.navigate('Cam', {meal: "Dinner", day: date.toISOString()})} />
          )
        }
        
      }
      
        

    }
    
    // to have all dates in same format
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


    // photos have to be set to blank every render. Otherwise photos do not change when switching date
    const resetPhotos = () => {
      setBreakfastPhoto('')
      setLunchPhoto('')
      setDinnerPhoto('')
    }

    // Returns header, photo and meals
    const FoodList = (props) => {
      return (
        <View>
          <View style={styles.header}>
            <Text style={{fontSize: 18, fontWeight: "bold"}}>{props.photo}</Text>
          </View>
          <View style={styles.foodList}>

            <View style={styles.photo}>
              <Photo style={styles.photo} meal={props.photo}/>
            </View>

            <View>
              {props.meal.map((item) => {
              return (
                <View>
                  <Text style={{fontSize: 18, fontWeight: "bold"}}>{item.amount} x {item.food}</Text>
                  <Text style={{fontSize: 12, fontWeight: "normal"}}>Calories {item.calories}</Text>      
                  <Text style={{fontSize: 12, fontWeight: "normal"}}>Carbs {item.carbs}</Text>                
                  <Text style={{fontSize: 12, fontWeight: "normal"}}>Protein {item.protein}</Text>                
                  <Text style={{fontSize: 12, fontWeight: "normal"}}>Fat {item.fat}</Text>
                  <Button buttonStyle={styles.deleteButton} title='Delete' titleStyle={{fontSize: 12}} onPress={() => deleteProduct(item.id)} />
                </View>
              );
              })}
            </View>
          
        </View>
       </View>
      )
    }

    return (
      <View style={styles.container}>
        <View style={styles.top}>
            <DateTimePicker
              style={styles.datePicker}
              mode="date" 
              value={date}
              onChange={(e, d) => setDate(new Date(d))}
            />
            <Button buttonStyle={styles.button} title='Add Food' onPress={() => navigation.navigate('Search', {day: date.toISOString()})} />

        </View>
        <View style={styles.list}>
          <ScrollView >
            <FoodList meal={breakfast} photo="Breakfast"/>
            <FoodList meal={lunch} photo="Lunch"/>
            <FoodList meal={dinner} photo="Dinner"/>
          </ScrollView>
        </View>
        
      </View>    
    )
}

