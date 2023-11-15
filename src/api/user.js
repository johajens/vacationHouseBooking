import { addDoc, collection, getDoc, doc, getDocs, updateDoc, deleteDoc } from "firebase/firestore"
import { database } from "boot/firebaseConfig"
import { getReadableTimestamp } from "src/service/utility.js";
import {ref} from "vue";

const collectionName = 'users'

async function createUser(user){
  const currentTime = getReadableTimestamp()
  try {
    await addDoc(collection(database, collectionName), {
      created: currentTime,
      updated: currentTime,
      name: user.name,
      email: user.email,
      password: user.password,
      isAdmin: user.isAdmin,
      houseId: user.houseId
    })
  } catch (e){
    throw new Error (`Failed to add user with email: ${user.email}\n${e.stack}`)
  }
}

async function readUserById(userId){
  try{
    return (await getDoc(doc(database, collectionName, userId))).data()
  } catch (e){
    throw new Error(`Failed to retrieve user by userId: ${userId}\n${e.stack}`)
  }
}

async function readAllUsers(){
  const retrievedUsers = ref([])
  try{
    const dbUserSnapsnot = await getDocs(collection(database, collectionName))
    dbUserSnapsnot.forEach((user) => {
      retrievedUsers.value.push(user.data())
    })
    return retrievedUsers
  } catch (e){
    throw new Error(`Failed to retrieve user database snapshot\n${e.stack}`)
  }
}

async function updateUserById(user){
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

async function deleteUserById(userId){
  try{
    await deleteDoc(doc(database, collectionName, userId))
  } catch (e) {
    throw new Error(`Failed to delete user with userId: ${userId}\n${e.stack}`)
  }
}
