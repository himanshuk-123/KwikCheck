import 'react-native-gesture-handler'; // OK if present in index.js too (no harm)
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import "react-native-gesture-handler";
import {
  StackNavigationOptions,
  createStackNavigator,
} from "@react-navigation/stack";
import { FullPageLoaderComponent } from "./src/Utils/FullpageLoader";
import { DrawerRoutes, ExcludeHeader, IRoutes, StackRoutes } from "./routes";
import { COLORS } from "@src/constants/Colors";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { AppStepListProvider, RefreshMyTaskPageProvider } from "@contexts"; // Path to the file
import { Logout } from "@src/components";
import CustomDrawer from "@src/components/CustomDrawer";
import ErrorBoundary from "@src/components/ErrorBoundary/ErrorBoundary";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

if (!__DEV__) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

const screenOptions: StackNavigationOptions = {
  headerShown: true,
  gestureEnabled: true,
  gestureDirection: "horizontal", // Allow horizontal swipe gesture
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
  transitionSpec: {
    open: {
      animation: "timing",
      config: {
        duration: 250, // Adjust the duration as needed
      },
    },
    close: {
      animation: "timing",
      config: {
        duration: 250, // Adjust the duration as needed
      },
    },
  },
};

function RoutesStack() {
  return (
    <>
      {
        <>
          <Stack.Navigator
            screenOptions={screenOptions}
            initialRouteName={"LandingPage"}
          >
            <Stack.Screen
              options={{ headerShown: false }}
              name="Homepage"
              component={DrawerMenu}
            />
            {StackRoutes.map((route) => (
              <Stack.Screen
                key={route.pathName}
                options={{
                  headerTitle: route.headerText || route.pathName,
                  headerShown: !ExcludeHeader.includes(route.pathName),
                  headerStyle: {
                    backgroundColor: "#1181B2",
                  },
                  headerTintColor: "white",
                  headerLeft: route.disableBack ? () => null : undefined,
                }}
                name={route.pathName}
                component={route.component}
              />
            ))}
          </Stack.Navigator>
        </>
      }
    </>
  );
}

const DrawerMenu = () => {
  const [visibleRoutes, setVisibleRoutes] = useState<IRoutes[]>(DrawerRoutes);

  useEffect(() => {
    const checkRouteVisibility = async () => {
      // Check visibility for each route
      const routeVisibilityPromises = DrawerRoutes.map(async (route) => {
        // If no shouldShow method, default to true
        if (!route.shouldShow) return route;

        try {
          const isVisible = await route.shouldShow();
          return isVisible ? route : null;
        } catch (error) {
          console.error(
            `Error checking visibility for ${route.pathName}`,
            error
          );
          return null;
        }
      });

      // Resolve all promises and filter out invisible routes
      const filteredRoutes = (
        await Promise.all(routeVisibilityPromises)
      ).filter((route): route is IRoutes => route !== null);

      setVisibleRoutes(filteredRoutes);
    };

    checkRouteVisibility();
  }, []);

  return (
    <>
      <Drawer.Navigator
       useLegacyImplementation={false}
        initialRouteName="DashBoard"
        screenOptions={{
          headerShown: true,
        }}

        drawerContent={(props) => <CustomDrawer {...props} />}
      >
        {visibleRoutes.map((route) => (
          <Drawer.Screen
            key={route.pathName}
            options={{
              headerTitle: route.notHeaderShown
                ? ""
                : route.headerText || route.pathName,
              headerStyle: { backgroundColor: COLORS.AppTheme.primaryBg },
              headerTitleStyle: { color: "white" },
              headerTintColor: "white",
            }}
            name={route.pathName}
            component={route.component}
          />
        ))}
      </Drawer.Navigator>
    </>
  );
};

export default function App() {
  return (
   <ErrorBoundary>
      <GluestackUIProvider config={config}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <AppStepListProvider>
              <RefreshMyTaskPageProvider>
                <NavigationContainer>
                  <RoutesStack />
                </NavigationContainer>
              </RefreshMyTaskPageProvider>
            </AppStepListProvider>
            <FullPageLoaderComponent />
          </View>
        </GestureHandlerRootView>
      </GluestackUIProvider>
    </ErrorBoundary>
  );
}
