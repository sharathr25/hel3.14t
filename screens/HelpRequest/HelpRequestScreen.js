// @flow
import React from 'react';
import { HelpRequest } from '../../components/oraganisms';

const HelpRequestScreen = ({ route } : { route:Object }) => {
    const { params } = route;
    const { data } = params;
    return (
        <HelpRequest data={data} />
    );
}

export default HelpRequestScreen;
