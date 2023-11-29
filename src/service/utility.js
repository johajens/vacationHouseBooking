import {Timestamp} from "firebase/firestore"
import {readAllUsers} from "src/api/user"

export function getReadableTimestamp(){
  const timestamp = Timestamp.now()
  return timestamp.toDate().toLocaleString('en-GB')
}

export function getDateFromTimestamp(date){
  return date.split(",")
}

//Takes either an array of strings or a single string and returns true if any of the inputs are empty
export function isInputInvalid(input){
  if (Array.isArray(input)){
    return input.some(element => !element || !element.trim().length)
  } else {
    return !input || !input.trim().length
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

export async function getLeftDrawerLinks(user) {
  const leftDrawerLinks = [
    { to: "/houseFrontpage", label: "Forside" },
    { to: "/bookingPage", label: "Booking" },
    { to: "/repairPage", label: "Reparation (Not implemented)" },
    { to: "/informationPage", label: "Information (Not implemented)" },
    { to: "/documentPage", label: "Dokumenter (Not implemented)" },
    { to: "/galleryPage", label: "Galleri (Not implemented)" },
  ]
  if (user.isAdmin) {
    leftDrawerLinks.push({ to: "administerUsersPage", label: "Administrér brugere" },)
  }
  return leftDrawerLinks
}

export async function userDataValid(input, email){
  let validInfo = false
  let notificationMessage = ""
  let type = "error"
  if (isInputInvalid(input)){
    notificationMessage = "Ingen felter må være tomme"
  }else if(email !== input[0]){
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

export function toggleDialog(dialogsObject, dialogName){
  Object.keys(dialogsObject).forEach(key => {
    if (key !== dialogName){
      dialogsObject[key] = false
    }
  })
  dialogsObject[dialogName] = !dialogsObject[dialogName]
}

export function getFirstName(fullName){
  return fullName.split(" ").at(0)
}

export function getFirstNameWithPossessive(fullName){
  const firstName = getFirstName(fullName)
  if (firstName.endsWith("s") || firstName.endsWith("z") || firstName.endsWith("x")){
    return `${firstName}'`
  } else {
    return `${firstName}s`
  }
}

export function getStringProperCased(text, isName){
  if (!isName){
    return  (text.substring(0, 1).toUpperCase() + text.substring(1)).trim()
  }
  else{
    return text.replace(/(?:^|\s|-)\S/g, function(match) {
      return match.toUpperCase()
    }).trim()
  }
}

export function hasInputChanged(inputs){
  let inputHasChanged = false
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i][0] !== inputs[i][1]){
      inputHasChanged = true
    }
  }
  return inputHasChanged
}


export function dateDataValid(data){
  data.forEach(date => {
    const dateSplittet = date.split("-")
    if(dateSplittet[0].length !== 4)
      return false
    if(dateSplittet[1].length !== 2)
      return false
    if(dateSplittet[2].length !== 2)
      return false
  })
  return true
}
