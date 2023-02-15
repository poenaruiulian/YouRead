import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from "./Home"
import { AddBook } from './Home';
import { BookPage } from './Home';
import {AddBookManually} from "./Home"

const Stack = createNativeStackNavigator()

export default function AppNavigation(){

    return (
        <Stack.Navigator>
            <Stack.Screen options={{headerShown:false,gestureEnabled: false,detachInactiveScreens:true}} name="HomeScreen" component={HomeScreen}/>
            <Stack.Screen options={{headerShown:false,gestureEnabled: false,detachInactiveScreens:true}} name="AddBook" component={AddBook}/>
            <Stack.Screen options={{headerShown:false,gestureEnabled: false,detachInactiveScreens:true}} name="BookPage" component={BookPage}/>
            <Stack.Screen options={{headerShown:false,detachInactiveScreens:true}} name="AddBookManually" component={AddBookManually}/>
        </Stack.Navigator>
    )

}