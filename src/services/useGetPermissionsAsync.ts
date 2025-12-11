import { useEffect, useState } from "react";
import { Camera } from "expo-camera";
import * as Location from 'expo-location';
import { AppState } from "react-native";

const useGetPermissionsAsync = () => {
    const [hasAllPermissions, setHasAllPermissions] = useState<boolean | null>(null);

    try {
        const checkPermissions = async () => {
            const cameraPermission = await Camera.requestCameraPermissionsAsync();
            // const audioPermission = await AV.Video.();
            const locationPermission = await Location.requestForegroundPermissionsAsync();

            const allPermissionsGranted =
                cameraPermission.status === 'granted' &&
                // audioPermission.status === 'granted' &&
                locationPermission.status === 'granted';

            setHasAllPermissions(allPermissionsGranted);
        }

        const handleAppStateChange = (nextAppState: any) => {
            if (nextAppState === 'active') {
                checkPermissions();
            }
        };
        useEffect(() => {
            checkPermissions();
            const subscription = AppState.addEventListener('change', handleAppStateChange);
            return () => subscription.remove();
        }, []);

    } catch (error) {
        console.log(error);
        return
    }

    return hasAllPermissions;
};

export default useGetPermissionsAsync;