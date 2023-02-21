import { View,Text, TouchableOpacity, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"

import Spacer from "./Spacer"
import { CompletionBar } from "./CompletionBar"
import { styles } from "../../styles/styles"

export default function Reading({title,imageLink,pagesTotal,pagesRead,subtitle,authors,bookId,userStatsId}){
    
    const navigator = useNavigation()

    return(
        <TouchableOpacity 
            onPress={()=>navigator.navigate("BookPage",{
                title:title,
                subtitle:subtitle,
                authors:authors,
                pagesTotal:pagesTotal,
                pagesRead:pagesRead,
                imageLink:imageLink,
                bookId:bookId,
                userStatsId:userStatsId
            })}
            style={styles.readingBookContainer}>
            <Image style={{height:60,width:40}} source={{uri:imageLink}}/>
            <View style={styles.bookInfo}>
                <Text style={{fontWeight:"bold"}}>{title}</Text>
                <Spacer height={5}/>
                <View style={{width:"65%"}}>
                    <CompletionBar total={pagesTotal} completed={pagesRead}/>
                </View>
                
            </View>
        </TouchableOpacity>
    )
}