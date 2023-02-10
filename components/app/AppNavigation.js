import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from "./Home"
import Friends from "./Friends"
import Profile from "./Profile"

const Tab = createBottomTabNavigator()

export default function AppNavigation(){

    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home}/>
            <Tab.Screen name="Friends" component={Friends}/>
            <Tab.Screen name="Profile" component={Profile}/>
        </Tab.Navigator>
    )

}