import { View,Text, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Image, Alert,Keyboard,RefreshControl } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import {useEffect, useState} from "react"
import { 
    Dialog
} from "react-native-ui-lib";


import { styles } from "../../styles/styles";
import Spacer from "../helpers/Spacer";
import { CompletionBar } from "../helpers/CompletionBar";
import { 
    auth,
    addBookForUser,
    getUsersBooks,
    updateTotalPages,
    deleteBook
} from "../../firebase";

import Friends from "./Friends"
import ProfileScreen from "./Profile"
import Header from "../helpers/Header";
import CalendarComponent from "../helpers/CalendarComponent";
const Tab = createBottomTabNavigator()

function searchBook(value,books,setBooks,setIsFetching){
    
    value = String(value.split(" ").join("%20"))
    let link = "https://www.googleapis.com/books/v1/volumes?q=intitle:%22"+value+"%22&orderBy=relevance"

    //console.log(link)
    setIsFetching(true)
    fetch(link)
    .then(res => res.json())
    .then(data=>{
        let newBook = {
            title:"",
            subtitle:"",
            authors:[],
            pageCount:"",
            imageLink:""
        }
        let bookList = []
        try{
            data.items.map( book =>{

            try{
                newBook.title = book.volumeInfo.title
            }catch{newBook.title = undefined}

            try{
                newBook.subtitle = book.volumeInfo.subtitle
            }catch{newBook.subtitle = undefined}

            try{
                newBook.authors = book.volumeInfo.authors
            }catch{newBook.authors = undefined}

            try{
                newBook.pageCount = book.volumeInfo.pageCount
            }catch{newBook.pageCount = undefined}

            try{
                newBook.imageLink = book.volumeInfo.imageLinks.thumbnail
            }catch{newBook.imageLink = undefined}

            //console.log(newBook)
            bookList = [...bookList,newBook]
            newBook = {
                title:"",
                subtitle:"",
                authors:[],
                pageCount:"",
                imageLink:""
            }
        })
        }catch{alert("No book found!")}
        setBooks(bookList)
        setIsFetching(false)
        
    })
}

export function Home(){

    const navigator = useNavigation()

    const [books,setBooks] = useState([])

    const [currReading, setCurrReading] = useState(false)
    const [weeksReading, setWeeksReading] = useState(false)

    
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
        setBooks(auxList)
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
                                auxList=[...auxList,newBook]
                            })
                            setBooks(auxList)
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
                <CalendarComponent books={books}/>

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
                                        bookId={book.bookId}/>
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

export function AddBook({route}){

    const navigator = useNavigation()

    const [isFetching, setIsFetching] = useState(false)
    const [books, setBooks] = useState([])
    const [title, setTitle] = useState("")


    return(
        <View style={[styles.container,{justifyContent:"flex-start",backgroundColor:"#2e2b2a"}]}>
            <Header dest="HomeScreen"/>
            <Spacer height={10}/>
            <View style={styles.headerAddBook}>
                <TextInput
                    style={[styles.input,{backgroundColor:"gray"}]}
                    placeholder="   Search for a new book..."
                    value={title}
                    onChangeText={text=>setTitle(text)}
                />
                <TouchableOpacity
                    style={styles.smallButton}
                    onPress={()=>{
                        setBooks([])
                        searchBook(title,books,setBooks,setIsFetching)
                        setTitle("")
                        Keyboard.dismiss()
                    }}
                >
                    <Text>Search</Text>
                </TouchableOpacity>
            </View>

            {
                isFetching ?
                <ActivityIndicator size="large"/> :
                
                
                    books.length > 0 ?
                        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                            {books.map(book=>{
                                return(
                                <Book title={book.title} subtitle={book.subtitle} authors={book.authors} pageCount={book.pageCount} imageLink={book.imageLink} currReading={route.params.currReading}/>)
                            })}
                        </ScrollView> :
                        <View style={{alignItems:"center"}}>
                            <Spacer height={30}/>
                            <TouchableOpacity
                                onPress = {()=>{navigator.navigate("AddBookManually",{currReading:route.params.currReading})}}
                            >
                                <Text style={{fontSize:17,fontWeight:"bold"}}>Add book manually</Text>
                            </TouchableOpacity>
                            <Spacer height={10}/>
                            <Text style={{fontStyle:"italic",color:"gray"}}>*If you can't find a book try adding manually.</Text>
                        </View>
            }
        </View>
    )

}

export function Book({title,subtitle,authors,pageCount,imageLink,currReading}){

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

export function Reading({title,imageLink,pagesTotal,pagesRead,subtitle,authors,bookId}){
    
    const navigator = useNavigation()

    return(
        <TouchableOpacity 
            onPress={()=>navigator.push("BookPage",{
                title:title,
                subtitle:subtitle,
                authors:authors,
                pagesTotal:pagesTotal,
                pagesRead:pagesRead,
                imageLink:imageLink,
                bookId:bookId
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

export function BookPage({route}){

    const navigator = useNavigation()

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
                                            deleteBook(route.params.bookId)
                                            navigator.replace("HomeScreen")
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
                                            navigator.replace("HomeScreen")
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

export function AddBookManually({route}){

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
                                    navigator.pop("HomeScreen")
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

export default function HomeScreen(){
    return(
        <Tab.Navigator>
            <Tab.Screen options={{headerShown:false}} name="Home" component={Home}/>
            <Tab.Screen options={{headerShown:false}} name="Friends" component={Friends}/>
            <Tab.Screen options={{headerShown:false}} name="ProfileScreen" component={ProfileScreen}/>
        </Tab.Navigator>
    )
}