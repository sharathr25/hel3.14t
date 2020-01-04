import { useEffect, useState, useReducer, useRef } from 'react';
import { firebaseOnEventListner, firebaseOnEventListnerTurnOff } from '../fireBase/database';

const queueReducer = (state, action) => {
    const { type, payload } = action;
    switch (type) {
        case 'ADD': return state.concat({ key: payload.key, data: payload.val() });
        case 'ROMOVE': return state.filter((datum) => datum.key !== payload.key);
        default: return state;
    }
}

export function useQueue(db) {
    const [items, dispatch] = useReducer(queueReducer, []);

    const addToItems = (data) => {
        dispatch({ type:'ADD', payload:data});
    }

    const removeFromItems = (data) => {
        dispatch({ type:'ROMOVE', payload:data});
    }

    useEffect(() => {
        firebaseOnEventListner(db, "child_added", addToItems);
        firebaseOnEventListner(db, "child_removed", removeFromItems);
        return (() => {
            firebaseOnEventListnerTurnOff(db);
        });
    }, []);

    return items;
}

export function useVal(db, initialValue) {
    const [value, setValue] = useState(initialValue);
    const ref = useRef(db);

    useEffect(() => {
        let isMounted = true;
        firebaseOnEventListner(ref.current, 'value', (data) => {
            if(data.val() !== value && isMounted) setValue(data.val()) 
        });
        return (() => isMounted = false);
    });

    useEffect(() => {
        firebaseOnEventListnerTurnOff(ref.current)
    },[ref.current])
    
    return value;
}