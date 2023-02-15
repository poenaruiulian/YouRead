import { View,Text,TextInput, TouchableOpacity } from "react-native";
import {useState,useEffect} from "react"
import {useNavigation} from "@react-navigation/core"

import { styles } from "../../styles/styles";

import {
    auth,
    createUserWithEmailAndPassword,
    addNewUser,
    onAuthStateChanged,
    addReadingDays
} from "../../firebase"
import Spacer from "../helpers/Spacer";

export default function Register(){

    const navigation = useNavigation()

    useEffect(()=>{
        onAuthStateChanged(auth, user=>{
            if(user){
                navigation.navigate("AppNavigation")
            }
        })
    })

    const [username,setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleRegistration = () =>{
        createUserWithEmailAndPassword(auth,email,password)
        .then((userCredentials) => {
            const user = userCredentials.user;
            console.log("Registered with "+user.email)
            addNewUser(username,email)
            addReadingDays(email)
            setEmail("")
            setPassword("")
            setUsername("")
        }).catch(err => alert(err))
    }

    return(
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.authInput}
                    placeholder="Username"
                    value={username}
                    onChangeText={text=>setUsername(text)}
                />
                <TextInput
                    style={styles.authInput}
                    placeholder="Mail"
                    value={email}
                    onChangeText={text=>setEmail(text)}
                />
                <TextInput
                    style={styles.authInput}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={text=>setPassword(text)}
                /> 
            </View>
            <Spacer height={50} />
            <TouchableOpacity 
                style={[styles.entryPageButton,styles.outlineButton]}
                onPress={handleRegistration}
            >
                    <Text style={[styles.entryPageText,styles.outlineText]}>Register</Text>
            </TouchableOpacity>   
        </View>
    )
}