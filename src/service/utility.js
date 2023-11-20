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
export function isInputValid(input){
  if (Array.isArray(input)){
    return input.some(element => !element || !element.trim().length)
  } else {
    return !input || !input.trim().length;
  }
}

export async function isEmailInUse(emailToVerify){
  const users = await readAllUsers()
  users.forEach(user => {
    console.log(user)
  })
  return users.some(element => element.email.toLowerCase() === emailToVerify.toLowerCase())
}
