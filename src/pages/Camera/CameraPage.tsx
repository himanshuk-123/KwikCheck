import React from 'react';
import CustomCamera from '../../components/CustomCamera';

type Props = {};

const CameraPage = ({ route }: { route: any }) => {
	const id = route.params.id;
	const side = route.params.side;
	const vehicleType = route.params.vehicleType;

	return <CustomCamera id={id} side={side} vehicleType={vehicleType} />;
};

export default CameraPage;
