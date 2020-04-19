import React from "react";
import { Text, View, FlatList } from "react-native";
import { WHITE, GREEN, ORANGE, BLACK } from "../../styles/colors";
import { ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { FullScreenError, FullScreenLoader } from "../../components/atoms";

const colors = [undefined, "#ffd700", "#aaa9ad", "#b08d57"];
const TOP_HELPERS_QUERY = gql`
    query {
        topHelpers{
            username
            xp,
            stars
    }
  }
`

const RankDetails = ({rank, name, xp, rating}) => {
    const rankColor = colors[rank];
    return (
        <View style={{flex: 1, flexDirection: 'row' }}>
            {
                rankColor 
                    ? <Icon name="trophy-variant" color={rankColor} size={20} style={{flex: 1}} /> 
                    : <Text style={{flex: 1}}>{rank}</Text>
            }
            <Text style={{color: BLACK, flex: 6 }}>{name}</Text> 
            <View style={{flex: 2, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: ORANGE}}>{rating} </Text>
                <Icon name="star-circle-outline" color={ORANGE} size={20} />
            </View>
            <Text style={{flex: 2, color: GREEN}}>{xp} XP</Text>
        </View>
    )
}

const Helpers = () => {
    const { data, loading, error } = useQuery(TOP_HELPERS_QUERY);

    const getListItem = ({item, index}) => {
        const { username, xp, stars } = item;
        const rank = index + 1;
        return <ListItem 
            title={<RankDetails rank={rank} name={username} xp={xp} rating={stars} />} 
            bottomDivider 
        />
    }

    if(loading) return <FullScreenLoader />

    if(error) return <FullScreenError />

    const { topHelpers } = data;

    return (
        <FlatList 
            renderItem={getListItem}
            data={topHelpers}
            keyExtractor={(_, i) => i.toString()}
            style={{backgroundColor :WHITE}}
        />
    );
}

export default Helpers;