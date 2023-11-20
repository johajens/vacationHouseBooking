import { Timestamp } from "firebase/firestore";

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
    input.forEach(element => console.log(element))
    return input.some(element => !element || !element.trim().length)
  } else {
    return !input || !input.trim().length;
  }
}
