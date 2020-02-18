import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
import { WrongButton, RightButton } from "../../atoms";
import { ORANGE } from "../../../styles/colors";

const UPDATE_HELP = gql`
    mutation UpdateHelp($id:String!, $key:String!,$value:Any, $type:String!, $operation:String!){
        updateHelp(id:$id, key:$key, value:$value, type:$type, operation:$operation){
            _id
        }
    }
`;

const stars = [0, 1, 2, 3, 4];

const Stars = (props) => {
    const { uidOfUser, keyOfHelpRequest } = props;
    const [starsGivenByUser, setStarsGivenByUser] = useState(0);
    const [updateHelp] = useMutation(UPDATE_HELP);

    handleGiveStars = () => {
        updateHelp({
            variables: {
                id: keyOfHelpRequest,
                key: "usersAccepted",
                value: { [uidOfUser]: { stars: starsGivenByUser } },
                type: "array",
                operation: "update"
            }
        })
    }

    handleResetStars = () => {
        setStarsGivenByUser(0);
    }

    getStars = () => {
        return stars.map((number) => {
            return (
                <TouchableOpacity onPress={() => setStarsGivenByUser(number + 1)} key={number}>
                    <Icon name={starsGivenByUser > number ? "star" : "star-o"} size={20} color={ORANGE} />
                </TouchableOpacity>
            );
        })
    }

    const { container, starsStyle, text, feedBack, buttons } = styles;

    return (
        <View style={container}>
            <View style={feedBack}>
                <Text style={text}>Give feedback</Text>
                <View style={starsStyle}>
                    {getStars()}
                </View>
            </View>
            <View style={buttons}>
                <WrongButton onPress={handleResetStars} />
                <RightButton onPress={handleGiveStars} />
            </View>
        </View>
    )
}

export default Stars;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    feedBack: {
        flex: 4
    },
    help: {
        width: 50,
        fontSize: 20,
        color: ORANGE
    },
    text: {

    },
    starsStyle: {
        display: 'flex',
        flexDirection: "row",
    },
    buttons: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});