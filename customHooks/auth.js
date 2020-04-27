// @flow
import { useEffect, useState } from 'react';
import { Hub, Auth } from 'aws-amplify';

type state = {
  initializing: boolean, 
  user: Object
}

export default function useAuth() {
    const [state, setState] = useState<state>({ initializing: true, user: null, token: "" });

    useEffect(() => {
      checkUser();  
      Hub.listen('auth', listener);
    }, [])

    const checkUser = () => {
      if(state.user) return;
      Auth.currentAuthenticatedUser({
        bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
      })
      .then(user => {
        if (user) {
          const { signInUserSession } = user;
          const { accessToken } = signInUserSession;
          const { jwtToken } = accessToken;
          setState({initializing: !user, user: { username: user.username, attributes: user.attributes, uid: user.attributes.sub }, token: jwtToken })
        }
      })
      .catch(err => {console.log(err); setState({initializing: false})});
    }

    const listener = (data) => {
    if (data.payload.event === "signIn") {
      checkUser();
    }
  }

  return state
}