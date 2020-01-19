import { useEffect, useState, useReducer, useRef } from 'react';
import { firebaseOnEventListner, firebaseOnEventListnerTurnOff } from '../fireBase/database';
import geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Alert } from "react-native";

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
        dispatch({ type: 'ADD', payload: data });
    }

    const removeFromItems = (data) => {
        dispatch({ type: 'ROMOVE', payload: data });
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
        firebaseOnEventListner(ref.current, 'value', (data) => {
            if (data.val() !== value) {
                setValue(data.val())
            }
        });

        return (() => {
            firebaseOnEventListnerTurnOff(ref.current)
        })
    }, []);

    return value;
}

export function useLocation() {
    const [state, setState] = useState({ latitude: null, longitude: null, locationProviderAvailable: false, locationErrorMessage: "" });

    setLocation = (position) => {
        const { coords } = position;
        const { latitude, longitude } = coords;
        setState({ latitude, longitude, locationProviderAvailable: true, locationErrorMessage: "" });
    }

    setLocationError = (error) => {
        console.log(error.code, error.message);
        let locationErrorMessage;
        switch (error.code) {
            case 1: locationErrorMessage = "Please grant permission to access location"; break;
            case 2: locationErrorMessage = "Please turn on GPS"; break;
            case 3: locationErrorMessage = "Location request timed out"; break;
            case 4: locationErrorMessage = "Google play service is not installed or has an older version"; break;
            case 5: locationErrorMessage = "Location service is not enabled or location mode is not appropriate for the current request"; break;
        }
        setState({ latitude: null, longitude: null, locationProviderAvailable: false, locationErrorMessage });
    }

    watchPosition = () => {
        geolocation.watchPosition(
            (position) => setLocation(position),
            (error) => setLocationError(error),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    getPosition = () => {
        geolocation.getCurrentPosition(
            (position) => setLocation(position),
            (error) => setLocationError(error),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    useEffect(() => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(() => {
                getPosition();
                watchPosition();
            })
            .catch((err) => Alert.alert("GPS can't be accessed"));
    }, []);

    const { latitude, longitude, locationProviderAvailable, locationErrorMessage } = state;
    return { latitude, longitude, locationProviderAvailable, locationErrorMessage };
}