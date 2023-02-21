import { View,Image,Text,ScrollView,TouchableOpacity,Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"

import { styles } from "../../../styles/styles"
import Spacer from "../../helpers/Spacer"
import { CompletionBar } from "../../helpers/CompletionBar"
import Header from "../../helpers/Header"

import { 
    auth,
    updateTotalPagesStatsLess,
    updateTotalPages,
    updateTotalPagesStats,
    deleteBook,
    updateReadPages,
    getReadDays,
    updateReadingDays 
} from "../../../firebase"

export default function BookPage({route}){

    const navigator = useNavigation()

    const [readingId, setReadingId] = useState("")
    const [todayRead, setTodayRead] = useState(false)

    getReadDays(auth.currentUser?.email)
    .then(res=>{
        console.log(res[0].data().id)
        setReadingId(res[0].data().id)
        res[0].data().readDays.map(day=>{
            if(day == today){
                setTodayRead(true)
            }
        })
    })

    return(
        <View style={{backgroundColor:"#5c5654"}}>
            <Header dest="HomeScreen"/>
            <Spacer height={10}/>
            <ScrollView contentContainerStyle={styles.bookPageContainer}>
                <View style={styles.bookPageDescription}>

                <View style={{width:"100%", alignItems:"center"}}>
                    <Image style={{height:300,width:200}} source={{uri:route.params.imageLink}}/>
                    <Spacer height={40}/>
                    <View style={{width:200}}>
                        <CompletionBar total={Number(route.params.pagesTotal)} completed={Number(route.params.pagesRead)}/>
                    </View>
                    <Spacer height={20}/>
                    <TouchableOpacity 
                        style={styles.completeBookBtn}
                        onPress={()=>{
                            Alert.alert(
                                "Finished the book?",
                                "If you are sure you finished the book just press Yes",
                                [
                                    {
                                        text:"Cancel",
                                        style:"cancel",
                                    },
                                    {
                                        text:"Yes",
                                        onPress:()=>{
                                            updateTotalPagesStats(route.params.userStatsId,route.params.pagesTotal-route.params.pagesRead)
                                            updateReadPages(route.params.bookId,route.params.pagesTotal)
                                            
                                            const d = new Date()
                                            let day = parseInt(d.getDate() / 10) == 0 ? "0"+String(d.getDate()) : String(d.getDate())
                                            let month = parseInt((d.getMonth()+1) / 10) == 0 ? "0"+String(d.getMonth()+1) : String(d.getMonth()+1)
                                            let year = String(d.getFullYear())
                                            let today = day+"_"+month+"_"+year

                                            if(!todayRead){
                                                updateReadingDays(today,readingId)
                                            }

                                            alert("Congrats! You've finished "+route.params.title)
                                            navigator.navigate("HomeScreen")
                                            
                                        },
                                        style:"default"
                                    }
                                ]
                            )
                        }}    
                    >
                        <Image source={require("../../../styles/images/complete.png")} style={{height:35,width:35}}/>
                        <View style={{width:10}}></View>
                        <Text style={styles.completeBookText}>Complete</Text>
                    </TouchableOpacity>
                </View>

                <Spacer height={20}/>

                <Text style={[styles.bookCardCategory, {fontSize:30}]}>Title:</Text>
                <Text style={styles.bookPageText}>{route.params.title}</Text>
                <Spacer height={10}/>
                
                <Text style={[styles.bookCardCategory, {fontSize:30}]}>Subtitle:</Text>
                {
                    route.params.subtitle?
                    <Text style={styles.bookPageText}>{ route.params.subtitle}</Text>:
                    <Text style={[styles.bookPageText, {color:"gray"}]}>No subtitle</Text>
                }
                <Spacer height={10}/>

                <Text style={[styles.bookCardCategory, {fontSize:30}]}>Author(s):</Text>
                {
                    route.params.authors?
                    <View>
                        {route.params.authors.map(author=>{
                            return(
                                <Text style={styles.bookPageText}>-{author}</Text>
                            )
                        })}
                    </View>:
                    <Text style={[styles.bookPageText, {color:"gray"}]}>No spcified author</Text>
                }
                <Spacer height={20}/>

                <View style={{width:"100%", flexDirection:"row"}}>
                    <Text style={[styles.bookCardCategory, {fontSize:20}]}>Total page number:</Text>
                    <Text style={styles.bookPageText}>  {route.params.pagesTotal}</Text>
                </View>
                <Spacer height={10}/>
                
                <View style={{width:"100%", flexDirection:"row"}}>
                    <Text style={[styles.bookCardCategory, {fontSize:20}]}>Pages read:</Text>
                    <Text style={styles.bookPageText}>  {route.params.pagesRead}</Text>
                </View>
                <Spacer height={30}/> 
                </View>
                <TouchableOpacity>
                <Text 
                    style={{
                        fontSize:16,
                        fontWeight:"bold",
                        color:"#db493b"
                    }}
                    onPress={
                        ()=>{
                            Alert.alert(
                                "Stop reading?",
                                "By pressing YES the book will no longer be in your library and all your progress will be lost",
                                [
                                    {
                                        text:"NO",
                                        style:'cancel'
                                    },
                                    {
                                        text:"YES",
                                        style:"destructive",
                                        onPress:()=>{
                                            updateTotalPagesStatsLess(route.params.userStatsId,route.params.pagesRead)
                                            deleteBook(route.params.bookId)
                                            navigator.navigate("HomeScreen")
                                            alert("You stoped reading "+route.params.title+"! :( ")
                                        }
                                    }
                                ]
                            )
                        }
                    }
                >Stop reading</Text>
                </TouchableOpacity>
                <Spacer height={20}/>
                <TouchableOpacity>
                <Text 
                    style={{
                        fontSize:16,
                        fontWeight:"bold"
                    }}
                    onPress={
                        ()=>{
                            Alert.prompt(
                                "Edit",
                                "Current total pages is "+route.params.pagesTotal+". Would you like to modify it?",
                                [
                                    {
                                        text:"Cancel",
                                        style:"cancel",
                                    },
                                    {
                                        text:"Edit",
                                        onPress:(text)=>{
                                            updateTotalPages(route.params.bookId,text)
                                            
                                            navigator.navigate("HomeScreen")
                                            alert("Total pages of "+route.params.title+" edited with succes!")
                                        },
                                        style:"destructive"
                                    }
                                ],
                                'plain-text',
                                "",
                                "numeric"
                            )
                        }
                    }
                >Edit</Text>
                </TouchableOpacity>
                <Text style={{
                    fontStyle:"italic",
                    color:"gray",
                    fontSize:14
                }}>
                    *The total page number doesn't always corespond with the edition you might have so feel free to modify it.
                </Text>
                <Spacer height={100}/>
            </ScrollView>
        </View>
    )
}