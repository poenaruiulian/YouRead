import { View, Text,TouchableOpacity, ActivityIndicator, ScrollView, Keyboard,TextInput } from "react-native"
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"

import Spacer from "../../helpers/Spacer"
import { styles } from "../../../styles/styles"
import Book from "../../helpers/Book"
import Header from "../../helpers/Header"

export function searchBook(value,books,setBooks,setIsFetching){
    
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

export default function AddBook({route}){

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
                                <Book key={book.title} title={book.title} subtitle={book.subtitle} authors={book.authors} pageCount={book.pageCount} imageLink={book.imageLink} currReading={route.params.currReading}/>)
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
