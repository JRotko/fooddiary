import {StyleSheet} from 'react-native'

export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#EFEAD8',
    },
    list: {
      flex: 8,
      marginBottom: 70,
      width: "100%",
      //backgroundColor: 'yellow',
    },
    datePicker: {
      width: 200,
      backgroundColor: '#EFEAD8'
    },
    top: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#EFEAD8',
      width: "90%",
      flexDirection: 'row'
    },
    photo: {
        alignSelf: 'flex-start',
        
    },
    image: {
        width: 150,
        height: 300,
        resizeMode: 'stretch',
        borderRadius: 6
    },
    foodList: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    header: {
        alignItems: 'center',
        padding: 10,
        borderStyle: 'solid'
    },
    deleteButton: {
        backgroundColor: '#D0C9C0',
        borderRadius: 6,
        height: 30,
        width: 100
    },
    button: {
        backgroundColor: '#5F7161',
        borderRadius: 6,
    },
    searchOrientation: {
        flexDirection: 'row'
    },
    searchField: {
        width: "90%"
    },
    searchImage: {
        width: 50,
        height: 50,
        borderRadius: 6
    },
    searchButton: {
        backgroundColor: '#5F7161',
        borderRadius: 6,
        
    }

  });