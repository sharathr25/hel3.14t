// @flow
import React, { useState } from "react";
import { Alert, TouchableOpacity, StyleSheet, Text, TextInput } from "react-native";
import firebase from "react-native-firebase";
import { WHITE, ORANGE } from "../../../styles/colors";
import ImagePicker from 'react-native-image-picker';
import uuid from 'uuid/v4';
import { 
    pushToFirebaseWithURL, 
    firebaseOnEventListner, 
    firebaseOnEventListnerTurnOff 
} from '../../../fireBase/database';

const PostButton = () => {
    const [state, setState] = useState({ 
        imgSource:"",
        imageUri:"",
        uploading: false,
        message:""
    });

    const options = {
        title: 'Select Image',
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
    }

    const pickImage = () => {
        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
                alert('You cancelled image picker 😟');
            } else if (response.error) {
                alert('And error occured: '+ response.error);
            } else {
                const source = { uri: response.uri };
                setState({
                    ...state,
                    imgSource: source,
                    imageUri: response.uri
                });
                uploadImage();
            }
        });
    };

    const uploadImage = () => {
        const ext = state.imageUri.split('.').pop(); // Extract image extension
        const filename = `${uuid()}.${ext}`; // Generate unique name
        setState({ ...state,uploading: true });
    }

    const handlePost = () => {
        setState({ ...state,showMessageInput: true});
    }
    
    const handleSelectImage = () => {
        if(state.message === '') {
            Alert.alert('message can\'t be empty');
            return;
        }
        setState({ ...state, showMessageInput: false});
        pickImage();
    }

    return (
        <>
            { state.showMessageInput 
                ?   <>
                        <TextInput placeholder="Enter message..." onChangeText={(value) => {setState({...state, message:value})}}/>
                        <TouchableOpacity style={styles.container} onPress={handleSelectImage}>
                            <Text style={styles.done}>Select Image</Text><Text style={styles.text}></Text>
                        </TouchableOpacity>
                    </>
                :   <TouchableOpacity style={styles.container} onPress={handlePost}>
                        <Text style={styles.done}>Post</Text><Text style={styles.text}></Text>
                    </TouchableOpacity>}
        </>
    );
}

export default PostButton;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: WHITE,
      borderWidth: 1,
      borderColor: ORANGE,
      margin: 10,
      borderRadius: 5,
      padding: 5
    },
    done:{
        fontSize: 20,
        color:ORANGE
    },
    text:{
        fontSize: 20
    }
  });