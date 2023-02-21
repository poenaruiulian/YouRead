import { initializeApp } from "firebase/app";

//authentification methods and functions
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "firebase/auth"

//firestore -- database methods and functions
import {
  getFirestore,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  arrayUnion,
  increment
} from "firebase/firestore"

//firebaseConfig goes here:
const firebaseConfig = {
  apiKey: "AIzaSyDeKHn0eeMP_UA9KcPbMmQwMI9rYPqhFHg",
  authDomain: "youread-41080.firebaseapp.com",
  projectId: "youread-41080",
  storageBucket: "youread-41080.appspot.com",
  messagingSenderId: "305131822318",
  appId: "1:305131822318:web:1a20c7ec6bc6e5b46fa7ff"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const firestore = getFirestore()

const usersCollection = collection(firestore,"users")
const booksForUsers = collection(firestore,"booksForUsers")
const readingDays = collection(firestore,"readDaysForUsers")
const usesrStatsColection = collection(firestore,"usersStats")

async function addNewUser(username,email){
  const newUser = await addDoc(usersCollection,{
    username:username,
    email:email
  })
}
async function addBookId(mail,bookTitle,bookSubtitle,bookAuthor,pageNumber,imageLink,bookId){

  await updateDoc(doc(firestore,"booksForUsers",bookId),{
    mail:mail,
    title:bookTitle,
    subtitle:bookSubtitle,
    author:bookAuthor,
    pagesTotal:pageNumber,
    pagesRead:0,
    imageLink:imageLink,
    bookId:bookId
  })
}
async function addBookForUser(mail,bookTitle,bookSubtitle,bookAuthor,imageLink,pageNumber){
  const newBook = await addDoc(booksForUsers,{
    mail:mail,
    title:bookTitle,
    subtitle:bookSubtitle,
    author:bookAuthor,
    pagesTotal:pageNumber,
    pagesRead:0,
    imageLink:imageLink,
    id:""
  }).then(res=>addBookId(mail,bookTitle,bookSubtitle,bookAuthor,pageNumber,imageLink,res.id))
  
}
async function getUsersBooks(mail){
  const getBooks = query(
    collection(firestore,"booksForUsers"),
    where('mail','==',mail),
    where("pagesRead","!=","pagesTotal")
  )

  const querySnapshot = await getDocs(getBooks)
  const allDocs = querySnapshot.docs
  return allDocs
}
async function updateTotalPages(bookId,text){
  await updateDoc(doc(firestore,"booksForUsers",bookId),{
    pagesTotal:Number(text)
  })
}
async function deleteBook(bookId){
  await deleteDoc(doc(firestore,"booksForUsers",bookId))
}
async function addId(id){
  await updateDoc(doc(firestore,"readDaysForUsers",id),{
    id:id
  })
}
async function addReadingDays(email){
  await addDoc(readingDays,{
  email:email,
  readDays:[],
  id:""
  }).then(res=>addId(res.id))
}
async function updateReadingDays(day,id){
  console.log(id)
  id = id.split(" ").join("")

  await updateDoc(doc(firestore,"readDaysForUsers",id),{
    readDays:arrayUnion(day)
  })
}
async function getReadDays(mail){
  const getDays = query(
    collection(firestore,"readDaysForUsers"),
    where('email','==',mail)
  )

  const querySnapshot = await getDocs(getDays)
  const allDocs = querySnapshot.docs
  return allDocs
}
async function updateReadPages(bookId, text){

  await updateDoc(doc(firestore,"booksForUsers",bookId),{
    pagesRead:increment(Number(text))
  })
}
async function getUsername(email){
  const getUsrnm = query(
    collection(firestore,"users"),
    where("email","==",email)
  )

  const querySnapshot = await getDocs(getUsrnm)
  const allDocs = querySnapshot.docs
  return allDocs
}
async function updateIdOfStats(id){
  await updateDoc(doc(firestore,"usersStats",id),{
    id:id
  })
}
async function addUserStats(email){
  await addDoc(usesrStatsColection,{
    email:email,
    booksReadTotal:0,
    pagesReadTotal:0,
    currentStrike:0,
    maxStrike:0,
    id:""
  }).then(res=>updateIdOfStats(res.id))
}
async function getUserStatsId(email){
  const userStatsId = query(
    collection(firestore,"usersStats"),
    where("email","==",email)
  )
  const querySnapshot = await getDocs(userStatsId)
  const allDocs = querySnapshot.docs
  return allDocs
}
async function updateTotalPagesStats(statsId,text){
  
  statsId = statsId.split(" ").join("")

  await updateDoc(doc(firestore,"usersStats",statsId),{
    pagesReadTotal:increment(Number(text))
  })
}
async function updateTotalPagesStatsLess(statsId,text){

  statsId = statsId.split(" ").join("")

  await updateDoc(doc(firestore,"usersStats",statsId),{
    pagesReadTotal:increment((-1)*Number(text))
  })
}
async function updateTotalBooksRead(statsId){
  statsId = statsId.split(" ").join("")

  await updateDoc(doc(firestore,"usersStats",statsId),{
    booksReadTotal:increment(1)
  })
}

export {
    //authentification methods and functions
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,

    //firestore methods and functions
    addNewUser,
    addBookForUser,
    getUsersBooks,
    updateTotalPages,
    deleteBook,
    addReadingDays,
    updateReadingDays,
    getReadDays,
    updateReadPages,
    getUsername,
    addUserStats,
    getUserStatsId,
    updateTotalPagesStats,
    updateTotalPagesStatsLess,
    updateTotalBooksRead

}