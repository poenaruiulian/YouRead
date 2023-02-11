import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from "./Home"
import Friends from "./Friends"
import ProfileScreen from "./Profile"

const Tab = createBottomTabNavigator()

export default function AppNavigation(){

    return (
        <Tab.Navigator>
            <Tab.Screen name="HomeScreen" component={HomeScreen}/>
            <Tab.Screen name="Friends" component={Friends}/>
            <Tab.Screen name="ProfileScreen" component={ProfileScreen}/>
        </Tab.Navigator>
    )

}