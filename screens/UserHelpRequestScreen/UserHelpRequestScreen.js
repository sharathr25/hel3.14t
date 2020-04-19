// @flow
import React from 'react';
import { UserHelpRequest } from '../../components/oraganisms';

const UserHelpRequestScreen = ({ route } : { route:Object }) => {
    const { params } = route;
    const { data } = params;
    return (
        <UserHelpRequest keyOfHelpRequest={data} />
    );
}

export default UserHelpRequestScreen;
