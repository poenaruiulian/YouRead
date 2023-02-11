import { View,Text, TouchableOpacity, Image } from "react-native";
import {useNavigation} from "@react-navigation/core"
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { styles } from "../../styles/styles";
import {signOut,auth} from "../../firebase"
import Spacer from "../helpers/Spacer";

const Stack = createNativeStackNavigator()

export function Settings(){

    const navigation = useNavigation()

    const handleSignOut = () => {
        signOut(auth)
        .then(() => {
            console.log("Logged of" )
            navigation.replace("EntryScreen")
        })
        .catch(err => alert(err))
    }

    return(
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.entryPageButton}
                onPress={handleSignOut}
            >
                <Text style={styles.entryPageText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    )
}

export function Profile(){

    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={()=>{navigation.navigate("Settings")}}
            >
                <Image source={require("../../styles/images/settings.png")}  style={styles.imageIcons}/>
            </TouchableOpacity>
            <Spacer height={50}/>
            <Text>{auth.currentUser?.email}</Text>
        </View>
    )
}

export default function ProfileScreen(){
    return(
        <Stack.Navigator>
            <Stack.Screen options={{headerShown:false}} name="Profile" component={Profile}/>
            <Stack.Screen options={{headerShown:false}} name="Settings" component={Settings}/>
        </Stack.Navigator>
    )
}