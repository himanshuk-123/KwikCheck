// FullPageLoader.tsx

import { Spinner } from '@gluestack-ui/themed';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface Payload {
	label: string;
}

type Callback = (input: any) => void;

enum Events {
	Update,
	Dismiss,
}

/**
 * This is our event manager to emit custom event
 */
const EventManager = {
	eventList: new Map(),

	on: function (event: Events, callback: Callback) {
		this.eventList.set(event, callback);
		return this;
	},

	off: function (event: Events) {
		this.eventList.delete(event);
	},

	emit: function (event: Events, payload?: Payload) {
		if (this.eventList.has(event)) {
			console.log(`Event emitted: ${Events[event]}`, payload); // Debugging log
			this.eventList.get(event)?.(payload);
		}
	},
};

/**
 * This is the main component which keeps watching of different events
 * And show hide itself or update
 */
export const FullPageLoaderComponent: React.FC = () => {
	const [state, setMyState] = useState<{ show: boolean; label: string }>({
		show: false,
		label: '',
	});

	const setState = (newObj: { show?: boolean; label?: string }) => {
		setMyState((prev) => ({ ...prev, ...newObj }));
	};

	useEffect(() => {
		EventManager.on(Events.Update, (data) => {
			console.log('Update event received', data); // Debugging log
			setState({ label: data?.label, show: true });
		});
		EventManager.on(Events.Dismiss, () => {
			console.log('Dismiss event received'); // Debugging log
			setState({ show: false });
		});
	}, []);

	return (
		<>
			{state.show ? (
				<View style={styles.loaderContainer}>
					<View style={styles.bottomContainer}>
						<Spinner size={'large'} color='$fuchsia600' />
						<Text style={styles.text}>{state.label}</Text>
					</View>
				</View>
			) : null}
		</>
	);
};

/**
 * These are exposed functions to deal with loader from outside of the component
 */
export const FullPageLoader = {
	open: function (payload?: Payload) {
		EventManager.emit(Events.Update, payload);
	},
	close: function () {
		EventManager.emit(Events.Dismiss);
	},
};

const styles = StyleSheet.create({
	loaderContainer: {
		flex: 1,
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.75)',
		display: 'flex',
		position: 'absolute',
		width: '100%',
		height: '100%',
	},
	text: {
		color: 'white',
	},
	bottomContainer: {
		bottom: 90,
		position: 'absolute',
		display: 'flex',
		gap: 20,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
