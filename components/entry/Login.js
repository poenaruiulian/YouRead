import { View,Text,TextInput, TouchableOpacity } from "react-native";
import { useState,useEffect } from "react";
import {useNavigation} from "@react-navigation/core"

import { styles } from "../../styles/styles";

import Spacer from "../helpers/Spacer";
import { 
    auth,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "../../firebase";

export default function Login(){

    const navigation = useNavigation()

    useEffect(()=>{
        onAuthStateChanged(auth, user=>{
            if(user){
                navigation.navigate("AppNavigation")
            }
        })
    })

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    const handleLoginIn = ()=>{
        signInWithEmailAndPassword(auth,email,password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log("Logged in with "+user.email);
        })
        .catch(error => alert(error.message))
    }

    return(
        <View style={[styles.container,{backgroundColor:"#2e2b2a"}]}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.authInput}
                    placeholder="Email"
                    value={email}
                    onChangeText={text=>setEmail(text)}
                />
                <TextInput
                    style={styles.authInput}
                    placeholder="Password"
                    value={password}
                    secureTextEntry
                    onChangeText={text=>setPassword(text)}
                /> 
            </View>
            <Spacer height={50} />
            <TouchableOpacity 
                style={styles.entryPageButton}
                onPress={handleLoginIn}
                >
                    <Text style={styles.entryPageText}>Login</Text>
            </TouchableOpacity>   
        </View>
    )
}