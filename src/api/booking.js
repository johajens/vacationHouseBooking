import { addDoc, collection } from "firebase/firestore"
import { database } from "boot/firebaseConfig"

export async function addBooking(booking){
  await addDoc(collection(database, "booking"), {
    name: booking.name,
    arrivalDate: booking.arrivalDate,
    departureDate: booking.departureDate,
    summary: booking.summary
  })
}
