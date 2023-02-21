import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from "./Home"
import AddBook from "./screens/AddBook"
import BookPage from './screens/BookPage';
import AddBookManually from './screens/AddBookManually';

const Stack = createNativeStackNavigator()

export default function AppNavigation(){

    return (
        <Stack.Navigator>
            <Stack.Screen options={{headerShown:false,gestureEnabled: false}} name="HomeScreen" component={HomeScreen}/>
            <Stack.Screen options={{headerShown:false,gestureEnabled: false}} name="AddBook" component={AddBook}/>
            <Stack.Screen options={{headerShown:false,gestureEnabled: false}} name="BookPage" component={BookPage}/>
            <Stack.Screen options={{headerShown:false,gestureEnabled: false}} name="AddBookManually" component={AddBookManually}/>
        </Stack.Navigator>
    )

}