import { useEffect, useState } from 'react';
import { firebaseOnEventListner, firebaseOnEventListnerTurnOff } from './database';

export function useQueue(db) {
    const [items, setItems] = useState([]);

    const addToNotifications = (data) => {
        setItems(prevState => prevState.concat({key:data.key, data:data.val()}));
    }
    
    const removeFromNotifications = (data) => {
        setItems(prevState => prevState.filter((datum) => datum.key !== data.key));
    }

    useEffect(() => {
        firebaseOnEventListner(db,"child_added", addToNotifications);
        firebaseOnEventListner(db,"child_removed", removeFromNotifications);
        return(() => {
            firebaseOnEventListnerTurnOff(db);
        });
    }, [db]);

    return items;
}