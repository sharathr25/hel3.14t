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
        bypassCache: true
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