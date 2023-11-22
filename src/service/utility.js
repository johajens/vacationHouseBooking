import { Timestamp } from "firebase/firestore";
import { readAllUsers, readUserById } from "src/api/user";

export function getReadableTimestamp(){
  const timestamp = Timestamp.now();
  let newTimestamp = timestamp.toDate().toLocaleString('en-GB');
  return newTimestamp;
}

export function getDateFromTimestamp(date){
  return date.split(",");
}

//Takes either an array of strings or a single string and returns true if any of the inputs are empty
export function isInputValid(input){
  if (Array.isArray(input)){
    return input.some(element => !element || !element.trim().length)
  } else {
    return !input || !input.trim().length;
  }
}

export async function isEmailInUse(emailToVerify){
  const users = await readAllUsers()
  return users.some(element => element.email.toLowerCase() === emailToVerify.toLowerCase())
}

export async function getDropdownLinks(user){
  if(user){
    return [
      { to: "/profilePage", label: "Profil" },
      { to: "/", label: "Log ud" }
    ]
  }
  return [
    { to: "/", label: "Log ind" }
  ]
}

export async function getLeftDrawerLinks(user){
  const leftDrawerLinks = [
    {to: "/", label: "Forside anonym (Slettes)"},
    {to: "houseFrontpage", label: "Forside"},
    {to: "bookingPage", label: "Booking (Not implemented)"},
    {to: "repairPage", label: "Reparation (Not implemented)"},
    {to: "informationPage", label: "Information (Not implemented)"},
    {to: "documentPage", label: "Dokumenter (Not implemented)"},
    {to: "galleryPage", label: "Galleri (Not implemented)"},
  ]
  if(user.isAdmin){
    leftDrawerLinks.push({to: "administerUsersPage", label: "Administrér brugere"},)
  }
  return leftDrawerLinks


}
