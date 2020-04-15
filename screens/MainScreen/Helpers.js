import React from "react";
import { Text, View, FlatList } from "react-native";
import { WHITE, GREEN, ORANGE } from "../../styles/colors";
import { ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const dummtData = [
    {
        name: "Sharath",
        xp: 100,
        rating: 90
    },
    {
        name: "Trisha",
        xp: 90,
        rating: 90
    },
    {
        name: "Pradeep",
        xp: 80,
        rating: 90
    },
    {
        name: "Sathish",
        xp: 70,
        rating: 90
    }
];

const colors = [undefined, "#ffd700", "#aaa9ad", "#b08d57"];

const RankDetails = ({rank, name, xp, rating}) => {
    const rankColor = colors[rank];
    return (
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <Text style={{flex: 1}}>{rank}</Text>
            <View style={{flex: 5, flexDirection: 'row', alignItems: 'center'}}>
                <Text >{name}</Text> 
                {rankColor && <Icon name="trophy-variant" color={rankColor} size={20} />}
            </View>
            <View style={{flex: 2, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: ORANGE}}>{rating}</Text>
                <Icon name="star-circle-outline" color={ORANGE} size={20} />
            </View>
            <Text style={{flex: 2, color: GREEN}}>{xp} XP</Text>
        </View>
    )
}

const Helpers = () => {
    const getListItem = ({item, index}) => {
        const { name, xp, rating } = item;
        const rank = index + 1;
        return <ListItem 
            title={<RankDetails rank={rank} name={name} xp={xp} rating={rating} />} 
            bottomDivider 
        />
    }
    return (
        <FlatList 
            renderItem={getListItem}
            data={dummtData}
            keyExtractor={(_, i) => i.toString()}
            style={{backgroundColor :WHITE}}
        />
    );
}

export default Helpers;