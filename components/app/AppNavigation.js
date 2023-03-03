import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from "./Home"
import AddBook from "./screens/AddBook"
import BookPage from './screens/BookPage';
import AddBookManually from './screens/AddBookManually';
import { Settings } from './Profile';

const Stack = createNativeStackNavigator()

export default function AppNavigation(){

    return (
        <Stack.Navigator>
            <Stack.Screen options={{headerShown:false}} name="HomeScreen" component={HomeScreen}/>
            <Stack.Screen options={{headerShown:false}} name="AddBook" component={AddBook}/>
            <Stack.Screen options={{headerShown:false}} name="BookPage" component={BookPage}/>
            <Stack.Screen options={{headerShown:false}} name="AddBookManually" component={AddBookManually}/>
            <Stack.Screen options={{headerShown:false}} name="Settings" component={Settings}/>
        </Stack.Navigator>
    )

}