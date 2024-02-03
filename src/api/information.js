import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, where, query } from "firebase/firestore";
import { database } from "boot/firebaseConfig";
import { getReadableTimestamp } from "src/service/utility.js";

const collectionName = 'informations'

export async function createInformation(information){
  const currentTime = getReadableTimestamp()
  try {
    const informationDocRef = await addDoc(collection(database, collectionName), {
      created: currentTime,
      updated: currentTime,
      houseId: information.houseId,
      name: information.name,
      description: information.description
    })
    return informationDocRef.id
  } catch (e){
    throw new Error (`Failed to add information with name: ${information.name}\n${e.stack}`)
  }
}

export async function readInformationById(informationId){
  try{
    const information = await getDoc(doc(database, collectionName, informationId))
    const informationData = information.data()
    return { id: information.id, ...informationData }
  } catch (e){
    throw new Error(`Failed to retrieve information by informationId: ${informationId}\n${e.stack}`)
  }
}

async function readAllInformations(){
  const retrievedInformations = []
  try{
    const dbInformationsSnapshot = await getDocs(collection(database, collectionName))
    dbInformationsSnapshot.forEach((doc) => {
      retrievedInformations.push({ id: doc.id, ...doc.data() })
    })
    return retrievedInformations
  } catch (e){
    throw new Error(`Failed to retrieve informations database snapshot\n${e.stack}`)
  }
}

export async function readAllInformationsByHouseId(houseId){
  const retrievedInformations = []
  try{
    const q = query(collection(database, collectionName), where("houseId", "==", houseId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      retrievedInformations.push({ id: doc.id, ...doc.data() })
    });
    return retrievedInformations
  }catch (e){
    throw new Error(`Failed to retrieve informations from database \n${e.stack}`)
  }
}

export async function updateInformationById(information){
  try{
    await updateDoc(doc(database, collectionName, information.id), {
      updated: getReadableTimestamp(),
      houseId: information.houseId,
      name: information.name,
      description: information.description,
    })
  } catch (e){
    throw new Error(`Failed to update information with informationId: ${information.id}\n${e.stack}`)
  }
}

export async function deleteInformationById(informationId){
  try{
    await deleteDoc(doc(database, collectionName, informationId))
  } catch (e) {
    throw new Error(`Failed to delete information with informationId: ${informationId}\n${e.stack}`)
  }
}
