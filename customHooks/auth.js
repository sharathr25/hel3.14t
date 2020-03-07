// @flow
import { useEffect, useState } from 'react';
import firebase from 'react-native-firebase'
import { Hub, Auth } from 'aws-amplify';

type state = {
  initializing: boolean, 
  user: Object
}

export default function useAuth() {
    const [state, setState] = useState<state>({ initializing: true, user: null });

    useEffect(() => {
      checkUser();
    }, [])

    const checkUser = () => {
      if(state.user) return;
      Auth.currentAuthenticatedUser({
            bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
            })
            .then(user => {
              if (user) {
                setState({initializing: !user, user: { username: user.username, attributes: user.attributes, uid: user.attributes.sub } })
            }
        })
        .catch(err => {console.log(err); setState({initializing: false})});
    }

    const listener = (data) => {
    if (data.payload.event === "signIn") {
      checkUser();
    }
  }

  Hub.listen('auth', listener);
  
  return state
}