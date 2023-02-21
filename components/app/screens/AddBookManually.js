import { View,Text,ScrollView,TextInput,TouchableOpacity,Keyboard } from "react-native"
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"

import { styles } from "../../../styles/styles"
import Spacer from "../../helpers/Spacer"
import Header from "../../helpers/Header"

import { 
    addBookForUser, 
    auth
} from "../../../firebase"

export default function AddBookManually({route}){

    const navigator = useNavigation()

    const [title, setTitle] = useState("")
    const [subtitle, setSubtitle] = useState("")
    //const [authors, setAuthors] = useState([])
    const [singleAuthor,setSingleAuthor] = useState("")
    const [pagesTotal, setPagesTotal] = useState(0)
    const [imageLink, setImageLink] = useState("https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3xlbnwwfHwwfHw%3D&w=1000&q=80")

    return(
        <View style={{backgroundColor:"#5c5654",height:"100%"}}>
            <Header dest="AddBook"/>
            <Spacer height={10}/>
            <ScrollView contentContainerStyle={styles.bookPageContainer}>
                <View style={styles.bookPageDescription}>

                    <Spacer height={20}/>

                    <Text style={[styles.bookCardCategory, {fontSize:30}]}>Title:</Text>
                    <TextInput
                        value={title}
                        placeholder={"  Complete with book title"}
                        style={styles.addBookManualyInput}
                        onChangeText={text=>{setTitle(text)}}

                    />
                    
                    <Spacer height={10}/>
                    
                    <Text style={[styles.bookCardCategory, {fontSize:30}]}>Subtitle:</Text>
                    <TextInput
                        value={subtitle}
                        placeholder={"  Complete with book subtite or leave blank"}
                        style={styles.addBookManualyInput}
                        onChangeText={text=>{setSubtitle(text)}}
                    />    
                    
                    <Spacer height={10}/>

                    <Text style={[styles.bookCardCategory, {fontSize:30}]}>Author:</Text>
                    <TextInput
                        value={singleAuthor}
                        placeholder={"  Complete with book author or leave blank"}
                        style={styles.addBookManualyInput}
                        onChangeText={text=>{
                            setSingleAuthor(text)
                        }}
                    />

                    <Spacer height={20}/>

                    <View style={{width:"100%", flexDirection:"row"}}>
                        <Text style={[styles.bookCardCategory, {fontSize:20}]}>Total page number:</Text>
                        <View style={{width:10}}></View>
                        <TextInput
                            value={pagesTotal}
                            keyboardType="numeric"
                            placeholder={"  Pages"}
                            style={[styles.inputBookAdding,{width:100,borderRadius:10,borderBottomWidth:0}]}
                            onChangeText={text=>setPagesTotal(Number(text))}
                        />
                    </View>
                    <Spacer height={10}/>

                    {/* <View style={{width:"100%", alignItems:"center"}}>
                        <Image style={{height:300,width:200}} source={{uri:imageLink}}/>
                    </View> */}

                    <TouchableOpacity
                        style={styles.entryPageButton}
                        onPress={()=>{
                            Keyboard.dismiss()
                            if(title !=0 && pagesTotal!=0){
                                let ok = false
                                for(let i=0;i<route.params.currReading.length;i+=1){
                                    if(route.params.currReading[i].title == title){ok=true}
                                }
                                if(ok != true){
                                    if(subtitle==undefined){setSubtitle("")}
                                    //if(authors==undefined){setAuthors([])}
                                    addBookForUser(
                                        auth.currentUser?.email,
                                        title,
                                        subtitle,
                                        [singleAuthor],
                                        imageLink,
                                        pagesTotal
                                    )
                                    navigator.navigate("HomeScreen")
                                    alert("Enjoy your reading!")
                                }else{alert("You read this book already or you are reading it at the moment!")}
                            }else{alert("You can't leave the title and/or total pages input blank!")}
                        }}
                    >
                        <Text style={[styles.entryPageText,{color:"black"}]}>Start to read!</Text>
                    </TouchableOpacity> 
                    
                </View>
            </ScrollView>
        </View>
    )
}