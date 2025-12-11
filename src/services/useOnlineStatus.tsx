import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

const useOnlineStatus = () => {
	const [isOnline, setIsOnline] = useState<Boolean | null>(null); // Initial state can be null or false

	useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state) => {
			setIsOnline(state.isConnected);
		});

		return unsubscribe;
	}, []);

	return isOnline;
};

export default useOnlineStatus;
