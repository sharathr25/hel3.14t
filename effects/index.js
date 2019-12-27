import { useEffect, useState } from 'react';
import { firebaseOnEventListner, firebaseOnEventListnerTurnOff } from '../fireBase/database';

export function useQueue(db) {
    const [items, setItems] = useState([]);

    const addToItems = (data) => {
        setItems(prevState => prevState.concat({key:data.key, data:data.val()}));
    }
    
    const removeFromItems = (data) => {
        setItems(prevState => prevState.filter((datum) => datum.key !== data.key));
    }

    useEffect(() => {
        firebaseOnEventListner(db,"child_added", addToItems);
        firebaseOnEventListner(db,"child_removed", removeFromItems);
        return(() => {
            firebaseOnEventListnerTurnOff(db);
        });
    }, [db]);

    return items;
}

export function useVal(db) {
    const [value, setValue] = useState(null);

    useEffect(() => {
        firebaseOnEventListner(db,'value',(data) => setValue(data.val()));
        return(() => firebaseOnEventListnerTurnOff(db));
    },[db]);

    console.log(value);

    return value;
}