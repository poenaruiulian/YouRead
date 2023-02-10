import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        width:"100%"
    },
    entryScreenLogo:{
        height:150,
        width:150
    },
    entryPageButton:{
        backgroundColor:"orange",
        alignItems:"center",
        width:"60%",
        padding:15,
        borderRadius:10,
    },
    entryPageText:{
        color:'white',
        fontWeight:'700',
        fontSize:16,
    },
    outlineButton:{
        backgroundColor:"white",
        marginTop:5,
        borderColor:"orange",
        borderWidth:2
    },
    outlineText:{
        color:'orange',
        fontWeight:'700',
        fontSize:16,
    },
    inputContainer:{
        width:"80%",
        justifyContent:"center",
        alignItems:"center"
    },
    authInput:{
        backgroundColor:"white",
        width:"100%",
        paddingHorizontal:15,
        paddingVertical:10,
        borderRadius:10,
        marginTop:5,
    },
})

export {styles}