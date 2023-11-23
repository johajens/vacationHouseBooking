import { readUserById } from "src/api/user"
import { useRouter } from "vue-router"


export function isLoggedIn(){
  const userId = localStorage.getItem("userId")
  return userId !== null
}

export async function getUserAndRouteFrontpageIfNotFound() {
  const router = useRouter()
  const userId = localStorage.getItem("userId")
  if (userId !== null) {
    return await readUserById(userId)
  }
  await router.push("/")
}

export async function routeFrontPage(){
  const router = useRouter()
  await router.push("/")
}
