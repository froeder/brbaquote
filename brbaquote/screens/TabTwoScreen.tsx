import * as React from 'react';
import {  ActivityIndicator, StyleSheet,  Share } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Text, View } from '../components/Themed';

export default function TabTwoScreen() {
  const [data, setData] = React.useState({author: null, quote: null}); 
  const [loading, setLoading] = React.useState(false)

  const randleNew = async(): Promise<void> => {
    setLoading(true) ;
    try {
      let response = await fetch('https://breaking-bad-quotes.herokuapp.com/v1/quotes');
      let responseJson = await response.json();
      setLoading(false)
      setData(responseJson[0]) ;
    } catch (error) {
      console.error(error);
    }
  }

  const saveFavs = async(): Promise<void> => {
    let quotes = {author:data.author, quote: data.quote} ;
    try {
      await AsyncStorage.setItem('quotes', JSON.stringify(quotes));
    } catch (error) {
      // Error saving data
    }
  }

  const share = async(): Promise<void> => {
    try {
      const result = await Share.share({
        message: `${data.quote} , - ${data.author}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BrBa Frases</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        {loading ? (
          <ActivityIndicator color="#ec6" size={42}/>
        ) : (
          <View>
            {data.quote ? (
              <View>
                <View style={styles.content}>
                  <Text style={styles.quote}>{data.quote}</Text>
                </View>
                <View style={styles.authorContent}>
                  <Text style={styles.author}>{data.author}</Text>
                </View>
              </View>
            ) : (
              <></>
            )}
          </View>
        )}
        <View style={styles.buttons}>
          {/* <IconButton
            icon="star"
            color="#ec1"
            size={30}
            onPress={() => saveFavs()}
          /> */}
          <IconButton
            icon="shuffle"
            color="green"
            size={30}
            onPress={() => randleNew()}
          />
          <IconButton
            icon="share"
            color="blue"
            size={30}
            onPress={() => share()}
          />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  quote:{
    textAlign: 'left'
  },
  author: {
    textAlign: 'center'
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    padding:30
  },
  authorContent: {
    marginTop: -20,
    marginBottom: 20
  },
  buttons:{
    justifyContent: 'space-around',
    flexDirection: 'row'
  }
});
