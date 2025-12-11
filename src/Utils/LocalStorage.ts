import AsyncStorage from '@react-native-async-storage/async-storage';

export class LocalStorage {
    static async set(key: string, value: any) {
        try {
            if (value === null) {
                return;
            }

            if (typeof value != 'string') {
                value = JSON.stringify(value);
            }
            return await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.log(error);
        }
    }

    static async get(key: string) {
        try {
            const value = await AsyncStorage.getItem(key);

            if (value !== null) {
                return JSON.parse(value);
            }

            return {}
        } catch (error) {
            console.log(error);
        }
    }

    static async remove(key: string) {
        try {
            return await AsyncStorage.removeItem(key);
        } catch (error) {
            console.log(error);
        }
    }

    static async clear() {
        try {
            return await AsyncStorage.clear();
        } catch (error) {
            console.log(error);
        }
    }
}