import { Timestamp } from "firebase/firestore";
import { readAllUsers} from "src/api/user";

export function getReadableTimestamp(){
  const timestamp = Timestamp.now();
  let newTimestamp = timestamp.toDate().toLocaleString('en-GB');
  return newTimestamp;
}

export function getDateFromTimestamp(date){
  return date.split(",");
}

//Takes either an array of strings or a single string and returns true if any of the inputs are empty
export function isInputInvalid(input){
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

export async function userDataValid(input, user){
  let validInfo = false
  let notificationMessage = ""
  let type = "error"
  if (isInputInvalid(input)){
    notificationMessage = "Ingen felter må være tomme"
  }else if(user.email !== input[0]){
    if (await isEmailInUse(input[0])) {
      notificationMessage = "Denne email er allerede i brug af en anden bruger"
    }else {
      validInfo = true
      type = "success"
    }
  }else {
    validInfo = true
    type = "success"
  }
  return   {
    validInfo,
    notificationMessage,
    type
  }
}
