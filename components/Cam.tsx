import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Camera } from 'expo-camera';
import * as SQLite from'expo-sqlite';
import { NavigationContainer, useIsFocused } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as FileSystem from 'expo-file-system';


let camera: Camera

// sources:
// https://daniellujan.com/how-to-save-camera-images-to-device/
// https://www.freecodecamp.org/news/how-to-create-a-camera-app-with-expo-and-react-native/

export default function Cam({route, navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [previewVisible, setPreviewVisible] = React.useState(false)
  const [capturedImage, setCapturedImage] = React.useState<any>(null)
  const db = SQLite.openDatabase('meal.db');
  const {meal} = route.params
  const {day} = route.params

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const __takePicture = async () => {
    const photo: any = await camera.takePictureAsync()
    console.log(photo)
    setPreviewVisible(true)
    setCapturedImage(photo)
  }

  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    //__startCamera()
  }

  const __savePhoto = async () => {
    
    // 1. Check if "photos" directory exists, if not, create it
    const USER_PHOTO_DIR = FileSystem.documentDirectory + 'photos';
    const folderInfo = await FileSystem.getInfoAsync(USER_PHOTO_DIR);
      if (!folderInfo.exists) {
        await FileSystem.makeDirectoryAsync(USER_PHOTO_DIR);
      }

    // 2. Rename the image and define its new uri
    const imageName = `${Date.now()}.jpg`;
    const NEW_PHOTO_URI = `${USER_PHOTO_DIR}/${imageName}`;

    // 3. Copy image to new location
    await FileSystem.copyAsync({
      from: capturedImage.uri,
      to: NEW_PHOTO_URI
    })
    .then(() => {
      console.log(`File ${capturedImage.uri} was saved as ${NEW_PHOTO_URI}`)
    })
    .catch(error => {console.error(error)})

    db.transaction(tx => {
      tx.executeSql('INSERT INTO photos (day, meal, photo) VALUES (?, ?, ?);', [day, meal, NEW_PHOTO_URI])
    }, null, null)

    navigation.navigate('Home')
  }
  
  
  const CameraPreview = ({photo, retakePicture, savePhoto}: any) => {
    console.log(photo)
    return (
      <View
        style={{
          backgroundColor: 'transparent',
          flex: 1,
          width: '100%',
          height: '100%'
        }}
      >
        <ImageBackground
          source={{uri: photo && photo.uri}}
          style={{
            flex: 1
          }}
        >
          <TouchableOpacity
              onPress={retakePicture}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                Re-take
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={savePhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20
                }}
              >
                save photo
              </Text>
            </TouchableOpacity>
        </ImageBackground>
      </View>
    )
  }

  return (
    <View style={styles.container}>
        {previewVisible && capturedImage ? (
            <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
          ) : (
      <Camera style={styles.camera} type={type} ref={(r) => {camera = r}}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={__takePicture}>
            <Text style={styles.text}> Take Photo </Text>
          </TouchableOpacity>
        </View>
      </Camera>
          )}
    </View>
  );


  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

