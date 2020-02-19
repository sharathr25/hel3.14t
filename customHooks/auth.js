// @flow
import { useEffect, useState } from 'react';
import firebase from 'react-native-firebase'

type state = {
  initializing: boolean, 
  user: Object
}

export default function useAuth() {
    const [state, setState] = useState<state>(() => { const user = firebase.auth().currentUser; return { initializing: !user, user, } })
    function onChange(user) {
      if(!state.user) {
        setState({ initializing: false, user });
      }
    }
  
    useEffect(() => {
      // listen for auth state changes
      const unsubscribe = firebase.auth().onAuthStateChanged(onChange)
      // unsubscribe to the listener when unmounting
      return () => unsubscribe()
    }, [])
  
    return state
}