import { View,Text, TouchableOpacity } from "react-native";
import {useNavigation} from "@react-navigation/core"

import { styles } from "../../styles/styles";
import {signOut,auth} from "../../firebase"

export default function Profile(){
    
    const navigation = useNavigation()

    const handleSignOut = () => {
        signOut(auth)
        .then(() => {
            console.log("Logged of" )
            navigation.replace("EntryScreen")
        })
        .catch(err => alert(err))
    }

    return (
        <View style={styles.container}>
            <Text>Profile</Text>
            <TouchableOpacity
                style={styles.entryPageButton}
                onPress={handleSignOut}
            >
                <Text style={styles.entryPageText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    )
}