import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, where, query } from "firebase/firestore";
import { database } from "boot/firebaseConfig";
import { getReadableTimestamp } from "src/service/utility.js";

const collectionName = 'repairs'

export async function createRepair(repair){
  const currentTime = getReadableTimestamp()
  try {
    const repairDocRef = await addDoc(collection(database, collectionName), {
      created: currentTime,
      updated: currentTime,
      finished: "",
      houseId: repair.houseId,
      userId: repair.userId,
      name: repair.name,
      description: repair.description,
      responsibleId: repair.responsibleId,
      done: repair.done
    })
    return repairDocRef.id
  } catch (e){
    throw new Error (`Failed to add repair with name: ${repair.name}\n${e.stack}`)
  }
}

export async function readRepairById(repairId){
  try{
    const repair = await getDoc(doc(database, collectionName, repairId))
    const repairData = repair.data()
    return { id: repair.id, ...repairData }
  } catch (e){
    throw new Error(`Failed to retrieve repair by repairId: ${repairId}\n${e.stack}`)
  }
}

async function readAllRepairs(){
  const retrievedRepairs = []
  try{
    const dbRepairsSnapshot = await getDocs(collection(database, collectionName))
    dbRepairsSnapshot.forEach((doc) => {
      retrievedRepairs.push({ id: doc.id, ...doc.data() })
    })
    return retrievedRepairs
  } catch (e){
    throw new Error(`Failed to retrieve repairs database snapshot\n${e.stack}`)
  }
}

export async function readAllRepairsByHouseId(houseId){
  const retrievedRepairs = []
  try{
    const q = query(collection(database, collectionName), where("houseId", "==", houseId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      retrievedRepairs.push({ id: doc.id, ...doc.data() })
    });
    return retrievedRepairs
  }catch (e){
    throw new Error(`Failed to retrieve repairs from database \n${e.stack}`)
  }
}

export async function updateRepairById(repair){
  try{
    await updateDoc(doc(database, collectionName, repair.id), {
      updated: getReadableTimestamp(),
      finished: repair.finished,
      houseId: repair.houseId,
      userId: repair.userId,
      name: repair.name,
      description: repair.description,
      responsibleId: repair.responsibleId,
      done: repair.done
    })
  } catch (e){
    throw new Error(`Failed to update repair with repairId: ${repair.id}\n${e.stack}`)
  }
}

export async function deleteRepairById(repairId){
  try{
    await deleteDoc(doc(database, collectionName, repairId))
  } catch (e) {
    throw new Error(`Failed to delete repair with repairId: ${repairId}\n${e.stack}`)
  }
}
