import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, where, query } from "firebase/firestore";
import { database } from "boot/firebaseConfig";
import { getReadableTimestamp } from "src/service/utility.js";

const collectionName = 'users'

export async function createUser(user){
  const currentTime = getReadableTimestamp()
  try {
    const userDocRef = await addDoc(collection(database, collectionName), {
      created: currentTime,
      updated: currentTime,
      name: user.name,
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin,
      houseId: user.houseId
    })
    return userDocRef.id
  } catch (e){
    throw new Error (`Failed to add user with email: ${user.email}\n${e.stack}`)
  }
}

export async function readUserById(userId){
  try{
    const user = await getDoc(doc(database, collectionName, userId))
    const userData = user.data()
    return { id: user.id, ...userData }
  } catch (e){
    throw new Error(`Failed to retrieve user by userId: ${userId}\n${e.stack}`)
  }
}

export async function readAllUsers(){
  const retrievedUsers = []
  try{
    const dbUserSnapsnot = await getDocs(collection(database, collectionName))
    dbUserSnapsnot.forEach((doc) => {
      retrievedUsers.push({ id: doc.id, ...doc.data() })
    })
    return retrievedUsers
  } catch (e){
    throw new Error(`Failed to retrieve user database snapshot\n${e.stack}`)
  }
}

export async function readAllUsersByHouseId(houseId){
  const retrievedUsers = []
  try{
    const q = query(collection(database, collectionName), where("houseId", "==", houseId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      retrievedUsers.push({ id: doc.id, ...doc.data() })
    });
    return retrievedUsers
  }catch (e){
    throw new Error(`Failed to retrieve users from database \n${e.stack}`)
  }

}





export async function updateUserById(user){
  try{
    await updateDoc(doc(database, collectionName, user.id), {
      updated: getReadableTimestamp(),
      name: user.name,
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin
    })
  } catch (e){
    throw new Error(`Failed to update user with userId: ${user.id}\n${e.stack}`)
  }
}

export async function deleteUserById(userId){
  try{
    await deleteDoc(doc(database, collectionName, userId))
  } catch (e) {
    throw new Error(`Failed to delete user with userId: ${userId}\n${e.stack}`)
  }
}

export async function verifyAndLoginUser(userEmail, userPassword, localStorage) {
  try {
    const allUsers = await readAllUsers()
    const user = await allUsers.find(user => user.email.toLowerCase() === userEmail.toLowerCase() && user.password === userPassword)
    if (user) {
      localStorage.setItem("userId", user.id);
      return [`Du er nu logget ind som, ${user.name}`, 'notification'];
    } else{
      return [`Vi kunne ikke finde en bruger med den angivne mail og adgangskode`, 'error'];
    }
  } catch (e) {
    throw new Error(`Failed to verify and login user with email: ${userEmail}\n${e.stack}`);
  }
}
