import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { database } from "boot/firebaseConfig";

const collectionName = 'colors'

export async function createColor(color) {
  try {
    const colorDocRef = await addDoc(collection(database,collectionName), {
      hexValue: color.hexValue,
      name: color.name
    })
    return colorDocRef.id
  } catch (e) {
    throw new Error(`Failed to add color with hex value: ${color.hexValue}\n${e.stack}`)
  }
}

export async function readColorById(colorId){
  try {
    const color = await getDoc(doc(database, collectionName, colorId))
    const colorData = color.data()
    return {id: color.id, ...colorData}
  } catch (e) {
    throw new Error(`Failed to retrieve color with id: ${colorId}\n${e.stack}`)
  }
}

export async function readAllColors(){
  const retrievedColors = []
  try {
    const dbColorSnapshot = await getDocs(collection(database, collectionName))
    dbColorSnapshot.forEach((doc) => {
      retrievedColors.push({id: doc.id, ...doc.data()})
    })
    return retrievedColors
  } catch (e) {
    throw new Error(`Failed to retrieve database snapshot of colors with error:\n${e.stack}`)
  }
}

export async function updateColorById(color){
  try {
    await updateDoc(doc(database, collectionName, color.id), {
      hexValue: color.hexValue,
      name: color.name
    })
  } catch (e) {
    throw new Error(`Failed to update color with id: ${color.id}\n${e.stack}`)
  }
}

export async function deleteColorById(colorId){
  try {
    await deleteDoc(doc(database, collectionName, colorId))
  } catch (e) {
    throw new Error(`Failed to delete color with id: ${colorId}\n${e.stack}`)
  }
}
