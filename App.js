import { Platform, SafeAreaView, StatusBar, StyleSheet, Text } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import FavoriteScreen from './screens/FavoriteScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetailScreen from './screens/DetailScreen';
import SettingScreen from './screens/SettingScreen';

function HomeStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

function FavoriteStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="FavoriteScreen" component={FavoriteScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

export default function App() {
  const Tab = createBottomTabNavigator();

  return (
    // <SafeAreaProvider>
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Tab.Navigator
          initialRouteName='home'
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === 'home') {
                iconName = 'home'
              } else if (route.name === 'favorite') {
                iconName = 'favorite'
              } else if (route.name === 'settings') {
                iconName = 'settings'
              };
              return <MaterialIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2563EB',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen name='home' component={HomeStack} options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeScreen';
            const isTabHidden = routeName === 'DetailScreen';

            return {
              headerShown: false, tabBarLabel: 'Home', tabBarStyle: isTabHidden ? { display: 'none' } : undefined,
            }
          }} />
          <Tab.Screen name='favorite' component={FavoriteStack} options={({ route }) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'FavoriteScreen';
            const isTabHidden = routeName === 'DetailScreen';

            return {
              headerShown: false, tabBarLabel: 'Favorite', tabBarStyle: isTabHidden ? { display: 'none' } : undefined,
            }
          }} />
          <Tab.Screen name='settings' component={SettingScreen} options={{ headerShown: false, tabBarLabel: 'Settings' }} />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
    // </SafeAreaProvider >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});
