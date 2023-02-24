import { View,Text, TouchableOpacity, TextInput, ScrollView, Image, Alert,Keyboard,RefreshControl } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import {useState} from "react"
import { 
    Dialog
} from "react-native-ui-lib";


import { styles } from "../../styles/styles";
import Spacer from "../helpers/Spacer";
import Reading from "../helpers/Reading"

import { 
    auth,
    getUsersBooks,
    deleteBook,
    getUserStatsId,
    updateTotalBooksRead
} from "../../firebase";

import Friends from "./Friends"
import ProfileScreen from "./Profile"
import CalendarComponent from "../helpers/CalendarComponent";

const Tab = createBottomTabNavigator()

export function Home(){

    const navigator = useNavigation()

    const [userStatsId, setUserStatsId] = useState("")

    const [books,setBooks] = useState([])

    const [currReading, setCurrReading] = useState(false)
    const [weeksReading, setWeeksReading] = useState(false)

    getUserStatsId(auth.currentUser?.email).then(res=>{
        let aux = res[0].data().id
        setUserStatsId(aux)
    })
    
    getUsersBooks(auth.currentUser?.email).then(res=>{
        let auxList = books
        res.map(obj=>{
            let newBook = obj.data()
            let ok = false
            for(let i=0;i<books.length;i+=1){
                if(books[i].title==newBook.title){ok=true}
            }
            if(!ok){
                    auxList=[...auxList,newBook]
            }
        })
        if(books!=auxList){setBooks(auxList)}
    })



   


    return (
        <View style={{height:"100%",width:"100%",backgroundColor:"#2e2b2a"}}>
            
            <ScrollView 
                refreshControl={
                    <RefreshControl onRefresh={()=>{
                        getUsersBooks(auth.currentUser?.email).then(res=>{
                            let auxList = []
                            res.map(obj=>{
                                let newBook = obj.data()
                                if(newBook.pagesTotal != newBook.pagesRead){
                                    auxList=[...auxList,newBook]
                                }else{
                                    updateTotalBooksRead(userStatsId)
                                    deleteBook(newBook.bookId)
                                }
                            })
                            setBooks(auxList)
                        })
                        getUserStatsId(auth.currentUser?.email).then(res=>{
                            let aux = res[0].data().id
                            setUserStatsId(aux)
                        })
                }}/>
                }
                contentContainerStyle={[styles.container,{justifyContent:"flex-start",backgroundColor:"#2e2b2a"}]}>
                
                <Spacer height={30}/>
                <Dialog
                    visible={weeksReading}
                    onDismiss={() => setWeeksReading(false)}
                    panDirection="DOWN"
                    overlayBackgroundColor="#f09b7d"
                    ViewStyle={{alignItems:"flex-start"}}
                    >
                    <Text style={{fontSize:20}}><Text style={{fontSize:24,fontWeight:"bold"}}>Information:</Text> The panel below shows you the days you read and the days you've not. If the day is colored then you've read in that day, else you haven't read and you should. The day that have the number colored is today.</Text>
                    <Spacer height={10}/>
                    <Text style={{fontStyle:"italic",color:"#636160"}}> *Click anywhere to exit the dialog.</Text> 
                </Dialog>

                <View style={{justifyContent:"flex-start",width:"100%",backgroundColor:"#5c5654",flexDirection:"row",alignItems:'center',paddingTop:10}}>
                    <Text style={{fontSize:20,fontWeight:"bold",paddingLeft:20,color:"white"}}>Week's reading:</Text>
                    <View style={{paddingLeft:10,color:"white"}}>
                        <TouchableOpacity onPress={()=>setWeeksReading(true)}>
                            <Image style={{height:20,width:20}} source={require("../../styles/images/information.png")}/>
                        </TouchableOpacity>
                    </View>
                </View>


                <CalendarComponent books={books} userStatsId={userStatsId}/>


                <Dialog
                    visible={currReading}
                    onDismiss={() => setCurrReading(false)}
                    panDirection="DOWN"
                    overlayBackgroundColor="#f09b7d"
                    ViewStyle={{alignItems:"flex-start"}}
                    >
                    <Text style={{fontSize:20}}><Text style={{fontSize:24,fontWeight:"bold"}}>Information:</Text> This is your library. Here you can see all you book that you are currently reading. By clicking on any of them it will show some info about the book. If you want to add more books in your library just press <Text style={{fontStyle:"italic"}}> Add Book </Text>.</Text>
                    <Spacer height={10}/>
                    <Text style={{fontStyle:"italic",color:"#636160"}}> *Click anywhere to exit the dialog.</Text> 
                </Dialog>

                <Spacer height={15}/>
                <View style={{justifyContent:"flex-start",width:"100%",backgroundColor:"#5c5654",flexDirection:"row",alignItems:'center',paddingTop:10}}>
                    <Text style={{fontSize:20,fontWeight:"bold",paddingLeft:20,color:"white"}}>Currently reading:</Text>
                    <View style={{paddingLeft:10,color:"white"}}>
                        <TouchableOpacity onPress={()=>setCurrReading(true)}>
                            <Image style={{height:20,width:20}} source={require("../../styles/images/information.png")}/>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{height:"20%",width:"100%",backgroundColor:"#5c5654"}}>
                    <ScrollView showsVerticalScrollIndicator={true} horizontal={true} style={[styles.scrollView,{backgroundColor:"#5c5654"}]} contentContainerStyle={styles.scrollViewContent}>
                        {books.map(book=>{
                            return(
                                <View key={book.bookId} style={{width:300,alignItems:"center"}}>
                                    <Spacer height={20}/>
                                    <Reading 
                                        title={book.title} 
                                        imageLink={book.imageLink} 
                                        pagesTotal={book.pagesTotal} 
                                        pagesRead={book.pagesRead}
                                        subtitle={book.subtitle}
                                        authors={book.author}
                                        bookId={book.bookId}
                                        userStatsId={userStatsId}
                                        />
                                    <Spacer height={20}/>
                                </View>
                            )
                        })}
                    </ScrollView>
                </View>

                <Spacer height={5} />

                <TouchableOpacity
                    onPress={()=>{
                        navigator.navigate("AddBook", {currReading:books})}}
                    style={[styles.entryPageButton,{marginTop:10}]}
                >
                    <Text style={styles.entryPageText}>Add book</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default function HomeScreen(){
    return(
        <Tab.Navigator>
            <Tab.Screen options={{headerShown:false}} name="Home" component={Home}/>
            <Tab.Screen options={{headerShown:false}} name="Friends" component={Friends}/>
            <Tab.Screen options={{headerShown:false}} name="ProfileScreen" component={ProfileScreen}/>
        </Tab.Navigator>
    )
}