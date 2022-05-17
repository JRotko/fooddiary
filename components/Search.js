import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Input, Button } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DatePicker from 'react-native-datepicker'
import * as SQLite from'expo-sqlite';


export default function Search({ route, navigation}) {
  const {day} = route.params
  //const jsDay = new Date(day)
  
  
  // followingDay = new Date(jsDay.getTime() + 86400000)
  // previousDay = new Date(jsDay.getTime() - 86400000)

  const [keyword, setKeyword] = useState('')
  const [instantresults, setInstantresults] = useState('')
  
  useEffect(() => {
    getResults()
  }, [keyword])

    // delete whole db (for dev)
  const deleteDB = () => {
    db.transaction(tx => {
      tx.executeSql('DROP TABLE meals;'), null, null
    })
  }


  

  const instantUrl = 'https://trackapi.nutritionix.com/v2/search/instant?&query='
  const instantParams = {
    headers: {
      "x-app-id": "bdd3f028",
      "x-app-key": "3aaf3b89305186194aaae259a282589c"
    },
    method:"GET"
  }

  const getResults = () => {
    fetch(instantUrl + keyword, instantParams)
    .then(response => response.json())
    .then(responseJson => setInstantresults(responseJson.common))
    .catch(error => { 
      Alert.alert('Error', error); 
    })
  }

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


  return (
    <View style={styles.container}>
      <Input onChangeText={keyword => setKeyword(keyword)} placeholder="Search..." value={keyword} />

      <FlatList 
          style={{marginLeft : "5%"}}
          keyExtractor={(item, index) => index.toString()} 
          renderItem={({item}) => 
            <View>
              <Text style={{fontSize: 18, fontWeight: "bold"}}>{item.food_name}</Text>
              <Image source={{uri:item.photo.thumb}} style = {{ width: 30, height: 30 }}/>
              <Button buttonStyle={{width: 30}} rased icon={{name: 'add', color: 'white'}} onPress={() => navigation.navigate('SaveFood', {foodName: item.food_name, day: day})} title="add" />
            </View>}
          data={instantresults}
          ItemSeparatorComponent={listSeparator} /> 
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});