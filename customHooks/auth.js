// @flow
import { useEffect, useState } from 'react';
import firebase from 'react-native-firebase'
import { Hub, Auth } from 'aws-amplify';

type state = {
  initializing: boolean, 
  user: Object
}

export default function useAuth() {
    const [state, setState] = useState<state>({ initializing: false, user: null });

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
                console.log(user);
                setState({initializing: !user, user })
            }
        })
        .catch(err => console.log(err));
    }

    const listener = (data) => {
    if (data.payload.event === "signIn") {
      checkUser();
    }
  }

  Hub.listen('auth', listener);
  
  return state
}