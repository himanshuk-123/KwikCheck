import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS } from '@src/constants/Colors';

const HorizontalBreak = () => {
	return <View style={styles.container} />;
};

export default HorizontalBreak;

const styles = StyleSheet.create({
	container: {
		height: 2,
		width: '100%',
		backgroundColor: COLORS.secondary,
	},
});
