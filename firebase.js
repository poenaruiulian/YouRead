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
  collection
} from "firebase/firestore"

//firebaseConfig goes here:



const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const firestore = getFirestore()

const usersCollection = collection(firestore,"users")

async function addNewUser(username,email){
  const newUser = await addDoc(usersCollection,{
    username:username,
    email:email
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
    addNewUser
}