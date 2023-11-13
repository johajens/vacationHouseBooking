import { Timestamp } from "firebase/firestore";

export function getReadableTimestamp(){
  const timestamp = Timestamp.now();
  let newTimestamp = timestamp.toDate().toLocaleString('en-GB');
  return newTimestamp;
}
