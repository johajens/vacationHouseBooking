import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, where, query } from "firebase/firestore";
import { database } from "boot/firebaseConfig";
import { getReadableTimestamp } from "src/service/utility.js";

const collectionName = 'bookings'

export async function createBooking(booking){
  const currentTime = getReadableTimestamp()
  try {
    const bookingDocRef = await addDoc(collection(database, collectionName), {
      created: currentTime,
      updated: currentTime,
      houseId: booking.houseId,
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      name: booking.name,
      notes: booking.notes,
      isPlanning: booking.isPlanning,
      diary: booking.diary
    })
    return bookingDocRef.id
  } catch (e){
    throw new Error (`Failed to add booking with name: ${booking.name}\n${e.stack}`)
  }
}

export async function readBookingById(bookingId){
  try{
    const booking = await getDoc(doc(database, collectionName, bookingId))
    const bookingData = booking.data()
    return { id: booking.id, ...bookingData }
  } catch (e){
    throw new Error(`Failed to retrieve booking by bookingId: ${bookingId}\n${e.stack}`)
  }
}

async function readAllBookings(){
  const retrievedBookings = []
  try{
    const dbBookingsSnapshot = await getDocs(collection(database, collectionName))
    dbBookingsSnapshot.forEach((doc) => {
      retrievedBookings.push({ id: doc.id, ...doc.data() })
    })
    return retrievedBookings
  } catch (e){
    throw new Error(`Failed to retrieve bookings database snapshot\n${e.stack}`)
  }
}

export async function readAllBookingsByHouseId(houseId){
  const retrievedBookings = []
  try{
    const q = query(collection(database, collectionName), where("houseId", "==", houseId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      retrievedBookings.push({ id: doc.id, ...doc.data() })
    });
    return retrievedBookings
  }catch (e){
    throw new Error(`Failed to retrieve bookings from database \n${e.stack}`)
  }
}

export async function updateBookingById(booking){
  try{
    await updateDoc(doc(database, collectionName, booking.id), {
      updated: getReadableTimestamp(),
      name: booking.name,
      houseId: booking.houseId,
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      notes: booking.notes,
      isPlanning: booking.isPlanning,
      diary: booking.diary
    })
  } catch (e){
    throw new Error(`Failed to update booking with bookingId: ${booking.id}\n${e.stack}`)
  }
}

export async function deleteBookingById(bookingId){
  try{
    await deleteDoc(doc(database, collectionName, bookingId))
  } catch (e) {
    throw new Error(`Failed to delete booking with bookingId: ${bookingId}\n${e.stack}`)
  }
}
