import React, { Component } from "react";
import { Alert, TouchableOpacity, StyleSheet, Text, TextInput } from "react-native";
import firebase from "react-native-firebase";
import { FLAG_COLOR_WHITE, FLAG_COLOR_ORANGE } from "../../../constants/styleConstants";
import ImagePicker from 'react-native-image-picker';
import uuid from 'uuid/v4';
import { 
    pushToFirebaseWithURL, 
    firebaseOnEventListner, 
    firebaseOnEventListnerTurnOff 
} from '../../../fireBase/database';

export default class PostButton extends Component {
    constructor(props){
        super(props);
        this.uid = firebase.auth().currentUser.uid;
        this.key = this.props.keyOfHelpRequest;
        this.state = {
            imgSource:"",
            imageUri:"",
            uploading: false,
            message:""
        }
    }

    updateState = (data) => {
        this.setState( { [data.key]: data.val() })
    }

    componentDidMount() {
        firebaseOnEventListner(`helps/${this.key}`,"child_changed",this.updateState);
    }

<<<<<<< HEAD
    componentWillUnmount(){
        firebaseOnEventListnerTurnOff(`helps/${this.key}`);
=======
    componentWillUnmount() {
        firebaseOnEventListnerTurnOff(`helps/${this.key}`);   
>>>>>>> 3ace4e1cb692856743f3a9aa7a0d93df860ceef0
    }

    options = {
        title: 'Select Image',
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
    };

    pickImage = () => {
        ImagePicker.showImagePicker(this.options, response => {
            if (response.didCancel) {
                alert('You cancelled image picker 😟');
            } else if (response.error) {
                alert('And error occured: ', response.error);
            } else {
                const source = { uri: response.uri };
                this.setState({
                    imgSource: source,
                    imageUri: response.uri
                });
                this.uploadImage();
            }
        });
    };

    uploadImage = () => {
    const ext = this.state.imageUri.split('.').pop(); // Extract image extension
    const filename = `${uuid()}.${ext}`; // Generate unique name
    this.setState({ uploading: true });
    firebase
        .storage()
        .ref(`images/${filename}`)
        .putFile(this.state.imageUri)
        .on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        async snapshot => {
            if (snapshot.state === firebase.storage.TaskState.SUCCESS && this.state.uploading) {
            await pushToFirebaseWithURL(`helped/${this.key}/posts`,{
                image: filename,
                timeStamp: new Date().getTime(),
                message:this.state.message,//need to take this from user
                type:'BY_REQUESTER'
            });
            await pushToFirebaseWithURL(`helped/${this.key}/usersWhoPosted`,this.uid);
            }
            state = {
                uploading: false,
                imgSource: '',
                imageUri: '',
                message:""
            };
            this.setState(state);
        },
        error => {
            alert('Sorry, Try again.');
        }
        );
    };

    handlePost = () => {
        this.setState({ showMessageInput: true});
    }
    
    handleSelectImage = () => {
        if(this.state.message === '') {
            Alert.alert('message can\'t be empty');
            return;
        }
        this.setState({ showMessageInput: false});
        this.pickImage();
    }

    render(){
      return (
        <>
            { this.state.showMessageInput 
                ?   <>
                        <TextInput placeholder="Enter message..." onChangeText={(value) => {this.setState({message:value})}}/>
                        <TouchableOpacity style={styles.container} onPress={this.handleSelectImage}>
                            <Text style={styles.done}>Select Image</Text><Text style={styles.text}></Text>
                        </TouchableOpacity>
                    </>
                :   <TouchableOpacity style={styles.container} onPress={this.handlePost}>
                        <Text style={styles.done}>Post</Text><Text style={styles.text}></Text>
                    </TouchableOpacity>}
        </>
      );
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: FLAG_COLOR_WHITE,
      borderWidth: 1,
      borderColor: FLAG_COLOR_ORANGE,
      margin: 10,
      borderRadius: 5,
      padding: 5
    },
    done:{
        fontSize: 20,
        color:FLAG_COLOR_ORANGE
    },
    text:{
        fontSize: 20
    }
  });