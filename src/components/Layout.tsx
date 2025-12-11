import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import React from 'react';
import { Box } from '@gluestack-ui/themed';
import { ScrollView } from '@gluestack-ui/themed';

export default function Layout({
	style,
	children,
}: {
	style?: StyleProp<ViewStyle>;
	children: React.ReactNode;
}) {
	return (
		<ScrollView flex={1} style={style} height={'100%'}>
			<Box px={'$5'} flex={1} py={'$5'}>
				{children}
			</Box>
		</ScrollView>
	);
}
