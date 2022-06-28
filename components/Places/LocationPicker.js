import { StyleSheet, View, Alert, Image, Text } from 'react-native'
import { Colors } from '../../constants/colors';
import { useState, useEffect } from 'react';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import OutlinedButton from '../UI/OutlinedButton';
import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from 'expo-location'
import { getAddress, getMapPreview } from '../../util/location';

function LocationPicker({onPickLocation}){
    const navigation = useNavigation();
    const route = useRoute();
    const[pickedLocation, setPickedLocation] = useState()
    const isFocused = useIsFocused(); //AddPlace에서 올때는 false인데 Map에서 올때는 true // 유데미ReactNative 206강의
    const[locationPermissionInformation, requestPermission] = useForegroundPermissions();

    useEffect(() => {
        if(isFocused && route.params){
            const mapPickedLocation = {lat: route.params.pickedLat, lng: route.params.pickedLng}
            setPickedLocation(mapPickedLocation)
        }
    },[route, isFocused])

    useEffect(() => {
        async function handleLocation(){
            if(pickedLocation){
                const address = await getAddress(pickedLocation.lat, pickedLocation.lng)
                onPickLocation({...pickedLocation, address: address})
            }
        } 

        handleLocation()
    },[pickedLocation, onPickLocation])

    async function verifyPermission(){
        if(locationPermissionInformation.status === PermissionStatus.UNDETERMINED){
            const permissionResponse = await requestPermission();
            return permissionResponse.granted
        }

        if(locationPermissionInformation.status === PermissionStatus.DENIED){
            Alert.alert('권한이 없습니다', '해당 기능을 사용하기 위해서는 권한을 허용하셔야 합니다.')
            return false
        }

        return true
    }

    async function getLocationHandler(){
        const hasPermission = await verifyPermission();
        if(hasPermission===false){
            return;
        }

        const location = await getCurrentPositionAsync()
        setPickedLocation({
            lat: location.coords.latitude,
            lng: location.coords.longitude
        })
    }

    function pickOnMapHandler(){
        navigation.navigate('Map')
    }

    let locationPreview = <Text>No Location picked yet</Text>
    if(pickedLocation){
        locationPreview = <Image style={styles.mapPreviewImage} source={{uri: getMapPreview(pickedLocation.lat, pickedLocation.lng)}}/>
    }

    return(
        <View>
            <View style={styles.mapPreview}>
                {locationPreview}
            </View>
            <View style={styles.actions}>
                <OutlinedButton icon={'location'} onPress={getLocationHandler}>Locate User</OutlinedButton>
                <OutlinedButton icon={'map'} onPress={pickOnMapHandler}>Pick on Map</OutlinedButton>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mapPreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4,
        overflow: 'hidden'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    mapPreviewImage: {
        width: '100%',
        height: '100%'
    }
})

export default LocationPicker;