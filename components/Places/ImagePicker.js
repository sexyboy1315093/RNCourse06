import { StyleSheet, View, Text, Alert, Image } from 'react-native'
import { launchCameraAsync, useCameraPermissions, PermissionStatus } from 'expo-image-picker';
import { useState } from 'react'
import { Colors } from '../../constants/colors';
import OutlinedButton from '../UI/OutlinedButton';

function ImagePicker({onTakeImage}){
    const[pickedImage, setPickedImage] = useState()

    const[cameraPermissionInfomation, requestPermission] = useCameraPermissions();
    async function verifyPermission(){
        //UNDETERMINED는 권한을 허용했는지 안했는지 모를 경우
        if(cameraPermissionInfomation.status === PermissionStatus.UNDETERMINED){
            const permissionResponse = await requestPermission()

            return permissionResponse.granted;
        }

        if(cameraPermissionInfomation.status === PermissionStatus.DENIED){
            Alert.alert('권한이 없습니다', '해당 기능을 사용하기 위해서는 권한을 허용하셔야 합니다.')
            return false
        }

        return true
    }

    async function takeImageHandler(){
        const hasPermission = await verifyPermission()
        if(hasPermission === false){
            return;
        }

        const image = await launchCameraAsync({
            allowsEditing: true,
            aspect: [16,9],
            quality: 0.5
        })

        setPickedImage(image.uri);
        onTakeImage(image.uri)
    }

    let imagePreview = <Text>No Image</Text>
    if(pickedImage){
        imagePreview = <Image style={styles.image} source={{uri: pickedImage}}/>
    }

    return(
        <View>
            <View style={styles.imagePreview}>
               {imagePreview}
            </View>
            <OutlinedButton onPress={takeImageHandler} icon={'camera'}>Take Image</OutlinedButton>
        </View>
    )
}

const styles = StyleSheet.create({
    imagePreview: {
        width: '100%',
        height: 200,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary100,
        borderRadius: 4
    },
    image: {
        width: '100%',
        height: '100%'
    }
})

export default ImagePicker;