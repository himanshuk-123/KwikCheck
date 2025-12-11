import { StyleProp, ViewStyle } from "react-native";

export interface ValuationDataCardProps {
  topLeftComponent: React.JSX.Element;
  topRightComponent: React.JSX.Element;
  bottomLeftComponent: React.JSX.Element;
  bottomRightComponent: React.JSX.Element;
  customStyle?: StyleProp<ViewStyle>;
}
