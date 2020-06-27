import React from "react";
import { FlatList } from "react-native";
import { WHITE, GREEN, ORANGE, BLACK } from "../../styles/colors";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
import { CustomModal } from "../../components/molecules";
import { getRatings } from "../../utils";
import { View, Text, StyleProvider, Container, Content, ListItem, List, Icon } from 'native-base';
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';

// const colors = [undefined, "#ffd700", "#aaa9ad", "#b08d57"];
const TOP_HELPERS_QUERY = gql`
    query {
        topHelpers{
            username
            xp,
            stars,
            totalRaters
    }
  }
`

const RankDetails = ({rank, name, xp, rating}) => {
    // const rankColor = colors[rank];
    return (
        <View style={{flex: 1, flexDirection: 'row' }}>
            <Text style={{flex: 1, color: BLACK, fontSize: 20 }}>{rank}</Text>
            <Text style={{color: BLACK, flex: 6, fontSize: 20 }}>{name}</Text> 
            <View style={{flex: 2, flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: ORANGE, fontSize: 20 }}>{rating} </Text>
                <Icon name="md-star" style={{ color: ORANGE }}/>
            </View>
            <Text style={{flex: 2, color: GREEN, fontSize: 20, fontSize: 20 }}>{xp} XP</Text>
        </View>
    )
}

const Helpers = () => {
    const { data, loading, error, refetch } = useQuery(TOP_HELPERS_QUERY);

    const getListItem = ({item, index}) => {
        const { username, xp, stars, totalRaters } = item;
        const rank = index + 1;
        const rating = getRatings(stars, totalRaters) 
        return (
            <ListItem noIndent>
                <RankDetails rank={rank} name={username} xp={xp} rating={rating} />
            </ListItem>
        );
    }

    if(loading) return <CustomModal variant="loading" />

    if(error) return <CustomModal variant="error" />

    const { topHelpers } = data;
    return (
        <StyleProvider style={getTheme(material)}>
            <Container>
                <Content>
                    <List>
                        <FlatList 
                            renderItem={getListItem}
                            data={topHelpers}
                            keyExtractor={(_, i) => i.toString()}
                            style={{backgroundColor :WHITE}}
                            onRefresh={refetch}
                            refreshing={loading}
                        />
                    </List> 
                </Content>
            </Container>
        </StyleProvider>
    );
}

export default Helpers;