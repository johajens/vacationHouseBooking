import { addDoc, collection, doc, getDoc, getDocs, updateDoc, deleteDoc  } from "firebase/firestore";
import { database } from "boot/firebaseConfig";
import { getReadableTimestamp } from "src/service/utility.js";
import { ref } from "vue";

const collectionName = "houses";

//Take a house object and creates a document in the database
export async function createHouse(house){
  const currentTimestamp = getReadableTimestamp()
  try {
    await addDoc(collection(database, collectionName), {
      name: house.name,
      description: house.description,
      created: currentTimestamp,
      updated: currentTimestamp
    })
  }catch (e){
    throw new Error(`Failed to add house with name: ${house.name}\n${e.stack}`)
  }
}

//Returns a list of all the houses in the database
export async function readAllHouses(){
  const houses = ref([]);
  try{
    const querySnapshot = await getDocs(collection(database, collectionName));
    querySnapshot.forEach((doc) => {
      houses.value.push(doc.data());
    });
  }
  catch (e){
    throw new Error(`Failed to retrieve all houses.\n${e.stack}`)
  }


  return houses;
}

//Takes an ID and returns the full house object
export async function readHouseById(id){
  const docRef = doc(database, collectionName, id);
  try{
    const house = await getDoc(docRef);
    return house.data();
  }catch (e) {
    throw new Error(`Failed to retrieve house with id: ${id}\n${e.stack}`)
  }

}

//Update a house object, and setting the updated with a new timestamp
export async function updateHouseById(house){
  try{
    await updateDoc(doc(database, collectionName, house.id), {
      name: house.name,
      description: house.description,
      updated: getReadableTimestamp()
    });
  }catch (e) {
    throw new Error(`Failed to update house with id: ${house.id}\n${e.stack}`)
  }
}

//Take an houseId and delete house document
export async function deleteHouseById(houseId){
  try{
  await deleteDoc(doc(database, collectionName, houseId));
  }catch (e) {
    throw new Error(`Failed to delete house with id: ${houseId}\n${e.stack}`)
  }
}
