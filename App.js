import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AllPlaces from './screens/AllPlaces';
import AddPlace from './screens/AddPlace'
import Map from './screens/Map';
import PlaceDetails from './screens/PlaceDetails';

import IconButton from './components/UI/IconButton';
import { Colors } from './constants/colors'
import { useEffect, useState } from 'react';
import { init } from './util/database';
import AppLoading from 'expo-app-loading';

const Stack = createNativeStackNavigator();

export default function App() {
  const[dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    init().then(() => {
      setDbInitialized(true)
    }).catch(err => {
      console.log(err)
    })
  },[])

  if(!dbInitialized){
    return(
      <AppLoading/>
    )
  }

  return (
    <>
    <StatusBar style='dark'/>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle: {backgroundColor: Colors.primary700},
        headerTintColor: Colors.gray700,
        contentStyle: {backgroundColor: Colors.gray700}
      }}>
        <Stack.Screen name='AllPlaces' component={AllPlaces} options={({navigation}) => ({
          title: 'Your Favorite Places',
          headerRight: () => {
            return(
              <IconButton icon={'add'} size={24} color={'black'} onPress={() => navigation.navigate('AddPlace')}/> 
            )
          }
        })}/>
        <Stack.Screen name='AddPlace' component={AddPlace} options={{
          title: 'Add a new Place'
        }}/>
        <Stack.Screen name='Map' component={Map} options={{
          title: 'GoogleMap'
        }}/>
        <Stack.Screen name='PlaceDetails' component={PlaceDetails} options={{
          title: 'Loading Place...'
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({

});
