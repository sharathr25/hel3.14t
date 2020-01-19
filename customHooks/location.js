import { useEffect, useState } from 'react';
import geolocation from 'react-native-geolocation-service';

export default function useLocation() {
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
        getPosition();
        watchPosition();
    }, []);

    const { latitude, longitude, locationProviderAvailable, locationErrorMessage } = state;
    return { latitude, longitude, locationProviderAvailable, locationErrorMessage };
}