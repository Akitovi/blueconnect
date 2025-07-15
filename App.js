import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/login';
import RegisterTabs from './RegisterTabs';
import Tabs from "./Tabs"
const Stack = createNativeStackNavigator();

const App = () => {
  return (
     <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="RegisterTabs"
            component={RegisterTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Tabs"
            component={Tabs}
            options={{ headerShown: false,gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    )
};
export default App