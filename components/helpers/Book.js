import { View,Text,Image,TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"


import Spacer from "./Spacer"
import { styles } from "../../styles/styles"
import { 
    auth,
    addBookForUser 
} from "../../firebase"



export default function Book({title,subtitle,authors,pageCount,imageLink,currReading}){

    const navigator = useNavigation()

    return(
        <View style={styles.bookCard}>
            <View style={styles.bookDescription}>
                <View style={styles.bookDetails}>

                    <Text style={styles.bookCardCategory}>Title:</Text>
                    {
                        title?
                        <Text style={styles.bookText}>{title}</Text>:
                        <Text style={[styles.bookText,{color:"gray"}]}>No title</Text>
                    }
                    <Spacer height={10}/>

                    <Text style={styles.bookCardCategory}>Subtitle:</Text>
                    {
                        subtitle?
                        <Text style={styles.bookText}>{subtitle}</Text>:
                        <Text style={[styles.bookText,{color:"gray"}]}>No subtitle</Text>
                    }
                    <Spacer height={10}/>

                    <Text style={styles.bookCardCategory}>Author(s):</Text>
                    <View style={{flexDirection:"column"}}>
                    {
                        authors?
                        authors.map(author=>{return(
                            <Text style={styles.bookAuthor}>-{author}</Text>
                        )}):
                        <Text style={{color:"gray"}}>No authors</Text>  
                    }
                    </View>
                    <Spacer height={10}/>

                    <View style={{flexDirection:"row"}}>
                        <Text style={styles.bookCardCategory}>Page Number: </Text>
                        <Text>{pageCount}</Text>
                    </View>
                </View>
                <View>
                    <Image style={styles.bookCardImage} source={{uri:imageLink}}/>
                </View>
            </View>

            <Spacer height={10}/>
            
            <TouchableOpacity
                style={styles.entryPageButton}
                onPress={()=>{
                    let ok = false
                    for(let i=0;i<currReading.length;i+=1){
                        if(currReading[i].title == title){ok=true}
                    }
                    if(ok != true){
                        if(imageLink==undefined){imageLink="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3xlbnwwfHwwfHw%3D&w=1000&q=80"}
                        if(subtitle==undefined){subtitle=""}
                        if(authors==undefined){authors=[]}
                        addBookForUser(
                            auth.currentUser?.email,
                            title,
                            subtitle,
                            authors,
                            imageLink,
                            pageCount 
                        )
                        alert("Enjoy your reading!")
                        navigator.pop()
                    }else{alert("You read this book already or you are reading it at the moment!")}
                }}
            >
                <Text style={[styles.entryPageText,{color:"black"}]}>Start to read!</Text>
            </TouchableOpacity>
            <Spacer height={20}/>
        </View>
    )
}