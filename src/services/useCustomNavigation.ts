import { StackActions, useNavigation } from "@react-navigation/native";

export const useCustomNavigation = () => {
  const navigation = useNavigation();

  const pushNavigation = (path: string, params?: object) => {
    navigation.dispatch(StackActions.push(path, params));
  };

  const replaceNavigation = (path: string) => {
    navigation.dispatch(StackActions.replace(path));
  };

  const popNavigation = (popCount: number = 1) => {
    navigation.dispatch(StackActions.pop(popCount));
  };

  return {
    pushNavigation,
    replaceNavigation,
    popNavigation,
  };
};
