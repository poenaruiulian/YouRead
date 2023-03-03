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
import Header from "../helpers/Header"


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
        <View style={[styles.container,{justifyContent:"flex-start",backgroundColor:"#2e2b2a"}]}>
            <Header/>
            <Spacer height={40}/>
            <TouchableOpacity
                style={styles.entryPageButton}
                onPress={handleSignOut}
            >
                <Text style={styles.entryPageText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    )
}

export default function Profile(){

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
        <View style={[styles.container,{justifyContent:"flex-start",backgroundColor:"#2e2b2a"}]}>
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

            <View style={styles.profilePicContainer}>
                <Image style={{height:100,width:100,borderRadius:50}} source={require("../../styles/images/user.png")}/>
            </View>

            <Spacer height={40}/>
            <View style={{width:"100%",alignItems:"left",padding:20}}>
                <Text style={styles.statsText}><Text style={{fontWeight:"bold", color:"#5c5654"}}>Books read:</Text> {stats.booksReadTotal}</Text>
                <Spacer height={20}/>
                <Text style={styles.statsText}><Text style={{fontWeight:"bold", color:"#5c5654"}}>Pages read:</Text> {stats.pagesReadTotal}</Text>
                <Spacer height={20}/>
                <Text style={styles.statsText}><Text style={{fontWeight:"bold", color:"#5c5654"}}>Current strike:</Text> {stats.currentStrike}</Text>
                <Spacer height={20}/>
                <Text style={styles.statsText}><Text style={{fontWeight:"bold", color:"#5c5654"}}>Max strike:</Text> {stats.maxStrike}</Text>
            </View>
            
        </View>
    )
}

// export default function ProfileScreen(){
//     return(
//         <Stack.Navigator>
//             <Stack.Screen options={{headerShown:false}} name="Profile" component={Profile}/>
//             <Stack.Screen options={{headerShown:false}} name="Settings" component={Settings}/>
//         </Stack.Navigator>
//     )
// }