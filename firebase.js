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
  getDocs
} from "firebase/firestore"

//firebaseConfig goes here:



const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const firestore = getFirestore()

const usersCollection = collection(firestore,"users")
const booksForUsers = collection(firestore,"booksForUsers")

async function addNewUser(username,email){
  const newUser = await addDoc(usersCollection,{
    username:username,
    email:email
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
    imageLink:imageLink
  })
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
    getUsersBooks
}