import { addDoc, collection, doc, getDoc, getDocs, updateDoc, deleteDoc  } from "firebase/firestore";
import { database } from "boot/firebaseConfig";
import { getReadableTimestamp } from "src/service/general.js";
import { ref } from "vue";

const collectionName = "houses";

//Take a house object and creates a document in the database
export async function addHouse(house){
  const currentTimestamp = getReadableTimestamp()
  await addDoc(collection(database, collectionName), {
    name: house.name,
    description: house.description,
    created: currentTimestamp,
    updated: currentTimestamp
  })
}

//Returns a list of all the houses in the database
export async function getAllHouses(){
  const houses = ref([]);
  const querySnapshot = await getDocs(collection(database, collectionName));
  querySnapshot.forEach((doc) => {
    houses.value.push(doc.data());
  });

  return houses;
}

//Takes an ID and returns the full house object
export async function getHouseById(id){
  const docRef = doc(database, collectionName, id);
  const house = await getDoc(docRef);
  return house.data();
}

//Update a house object, and setting the updated with a new timestamp
export async function updateHouseById(house){
  await updateDoc(doc(database, collectionName, house.id), {
    name: house.name,
    description: house.description,
    updated: getReadableTimestamp()
  });
}

//Take an houseId and delete housedocument
export async function deleteHouseById(houseId){
  await deleteDoc(doc(database, collectionName, houseId));
}
