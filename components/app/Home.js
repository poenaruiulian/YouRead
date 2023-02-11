import { View,Text, TouchableOpacity, TextInput, ActivityIndicator, ScrollView,Image } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import {useState} from "react"

import { styles } from "../../styles/styles";
import Spacer from "../helpers/Spacer";
import { 
    auth,
    addBookForUser,
    getUsersBooks
} from "../../firebase";

const Stack = createNativeStackNavigator()

function searchBook(value,books,setBooks,setIsFetching){
    
    value = String(value.split(" ").join("%20"))
    let link = "https://www.googleapis.com/books/v1/volumes?q=intitle:%22"+value+"%22&orderBy=relevance"

    console.log(link)
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

            console.log(newBook)
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

    getUsersBooks(auth.currentUser?.email).then(res=>{
        res.map(obj=>{
            let newBook = obj.data()
            let ok = false
            for(let i=0;i<books.length;i+=1){
                if(books[i].title==newBook.title){ok=true}
            }
            if(!ok){
                setBooks([...books,newBook])
            }
        })
    })

    return (
        <View style={[styles.container,{justifyContent:"flex-start",}]}>
            <TouchableOpacity
                onPress={()=>{
                    navigator.navigate("AddBook", {currReading:books})}}
                style={[styles.entryPageButton,{marginTop:10}]}
            >
                <Text style={styles.entryPageText}>Add book</Text>
            </TouchableOpacity>
            
            <Spacer height={40}/>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                {console.log(books)}
                {books.map(book=>{
                    return(
                        <View style={{width:"100%",alignItems:"center"}}>
                            <Reading 
                                title={book.title} 
                                imageLink={book.imageLink} 
                                pagesTotal={book.pagesTotal} 
                                pagesRead={book.pagesRead}
                                subtitle={book.subtitle}
                                authors={book.author}/>
                            <Spacer height={20}/>
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    )
}

export function AddBook({route}){

    const [isFetching, setIsFetching] = useState(false)
    const [books, setBooks] = useState([])
    const [title, setTitle] = useState("")


    return(
        <View style={[styles.container,{justifyContent:"flex-start",}]}>
            <View style={styles.headerAddBook}>
                <TextInput
                    style={[styles.input]}
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
                    }}
                >
                    <Text>Search</Text>
                </TouchableOpacity>
            </View>

            {
                isFetching ?
                <ActivityIndicator size="large"/> :
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                    {console.log(route.params.currReading)}
                    {books.map(book=>{
                        return(
                        <Book title={book.title} subtitle={book.subtitle} authors={book.authors} pageCount={book.pageCount} imageLink={book.imageLink} currReading={route.params.currReading}/>)
                    })}
                </ScrollView>
            }

        </View>
    )

}

export function Book({title,subtitle,authors,pageCount,imageLink,currReading}){
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
                    if(!ok){
                        if(imageLink==undefined){imageLink="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Ym9va3xlbnwwfHwwfHw%3D&w=1000&q=80"}
                        addBookForUser(
                            auth.currentUser?.email,
                            title,
                            subtitle,
                            authors,
                            imageLink,
                            pageCount 
                        )
                        alert("Enjoy your reading!")
                    }else{alert("You read this book already or you are reading it at the moment!")}
                }}
            >
                <Text style={[styles.entryPageText,{color:"black"}]}>Start to read!</Text>
            </TouchableOpacity>
            <Spacer height={20}/>
        </View>
    )
}

export function Reading({title,imageLink,pagesTotal,pagesRead,subtitle,authors}){
    
    const navigator = useNavigation()

    return(
        <TouchableOpacity 
            onPress={()=>navigator.navigate("BookPage",{
                title:title,
                subtitle:subtitle,
                authors:authors,
                pagesTotal:pagesTotal,
                pagesRead:pagesRead,
                imageLink:imageLink
            })}
            style={styles.readingBookContainer}>
            <Image style={{height:60,width:40}} source={{uri:imageLink}}/>
            <View style={styles.bookInfo}>
                <Text style={{fontWeight:"bold"}}>{title}</Text>
                <Spacer height={5}/>
                <View style={{width:200}}>
                    <CompletionBar total={pagesTotal} completed={pagesRead}/>
                </View>
                
            </View>
        </TouchableOpacity>
    )
}

export function CompletionBar({total,completed}){
    let percentCompleted = Number(completed)/Number(total)*100
    let percent = String(parseFloat(percentCompleted).toFixed(2))
    return(
        <View style={{
            backgroundColor:"#f7603e",
            width:"100%",
            borderRadius:10
        }}>
            {
                Number(percent)!=0?
                    <View style={{
                        backgroundColor: "#ed8c66",
                        width:percent+"%",
                        borderRadius:10
                    }}>
                        <Text>  {percent+"%"}</Text>
                    </View>:
                
                <Text>  {percent+"%"}</Text>
            }
        </View>
    )
}

export function BookPage({route}){
    return(
        <ScrollView contentContainerStyle={styles.bookPageContainer}>
            <Spacer height={40}/>
            <View style={styles.bookPageDescription}>

            <View style={{width:"100%", alignItems:"center"}}>
                <Image style={{height:300,width:200}} source={{uri:route.params.imageLink}}/>
            </View>

            <Spacer height={40}/>

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
            <Text style={{
                fontSize:16,
                fontWeight:"bold"
            }}>Edit</Text>
            </TouchableOpacity>
            <Text style={{
                fontStyle:"italic",
                color:"gray",
                fontSize:14
            }}>
                *The total page number doesn't always corespond with the edition you might have so feel free to modify it.
            </Text>
            <Spacer height={10}/>
        </ScrollView>
    )
}

export default function HomeScreen(){
    return(
        <Stack.Navigator>
            <Stack.Screen options={{headerShown:false}} name="Home" component={Home}/>
            <Stack.Screen options={{headerShown:false}} name="AddBook" component={AddBook}/>
            <Stack.Screen options={{headerShown:false}} name="BookPage" component={BookPage}/>
        </Stack.Navigator>
    )
}