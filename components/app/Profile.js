import { View,Text, TouchableOpacity, Image } from "react-native";
import {useNavigation} from "@react-navigation/core"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {useState} from "react"

import { styles } from "../../styles/styles";
import {
    signOut,
    auth,
    getUsername,
    getStats
} from "../../firebase"
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

    const [username, setUsername] = useState("")
    const [stats, setStats] = useState({})
    const [getting,setGetting] = useState(true)

    getUsername(auth.currentUser?.email).then(res=>{
        let aux = res[0].data().username
        setUsername(aux)
    })
    if(getting){
        getStats(auth.currentUser?.email).then(res=>{
            if(stats!=res){setStats(res)}
        })
        setGetting(false)
    }
    return (
        <View style={[styles.container,{justifyContent:"flex-start"}]}>
            <Spacer height={20}/>
            <View style={styles.profileHeader}>

                <Text style={styles.profileName}>{username}</Text>

                <TouchableOpacity
                    style={{padding:10}}
                    onPress={()=>{navigation.navigate("Settings")}}
                >
                    <Image source={require("../../styles/images/settings.png")}  style={styles.profileSettingsBtn}/>
                </TouchableOpacity>

            </View>

            <Spacer height={40}/>

            <View>
                <Text>Books read: {stats.booksReadTotal}</Text>
                <Text>Pages read: {stats.pagesReadTotal}</Text>
                <Text>Current strike: {stats.currentStrike}</Text>
                <Text>Max strike: {stats.maxStrike}</Text>
            </View>
            
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