import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EntryScreen from "./components/entry/EntryScreen"
import Login from "./components/entry/Login";
import Register from "./components/entry/Register";
import AppNavigation from "./components/app/AppNavigation";

const Stack = createNativeStackNavigator()


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown:false,}} name="EntryScreen" component={EntryScreen}/>
        <Stack.Screen options={{headerShown:false}} name="Login" component={Login}/>
        <Stack.Screen options={{headerShown:false}} name="Register" component={Register}/>
        <Stack.Screen options={{headerShown:false,gestureEnabled: false}} name="AppNavigation" component={AppNavigation}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
