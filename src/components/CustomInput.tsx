import { StyleSheet, Text, TextInput, View } from 'react-native';
import React from 'react';
import { COLORS } from '@src/constants/Colors';

interface CustomInputProps {
	value: string;
	onChangeText: (text: string) => void;
	placeholder: string;
	isNumeric?: boolean;
	maxLength?: number;
}

export default function CustomInput({
	value,
	onChangeText,
	placeholder,
	isNumeric,
	maxLength,
}: CustomInputProps) {
	return (
		<View>
			<TextInput
				autoCorrect={false}
				keyboardType={isNumeric ? 'numeric' : 'default'}
				autoComplete={'off'}
				importantForAutofill='no'
				maxLength={maxLength}
				placeholder={placeholder}
				value={value}
				onChangeText={onChangeText}
				style={styles.inputText}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	inputText: {
		backgroundColor: COLORS.secondary,
		borderRadius: 5,
		padding: 10,
		fontWeight: '500',
		fontSize: 16,
		textTransform: 'uppercase',
	},
});
