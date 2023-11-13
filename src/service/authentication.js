import { readUserById } from "src/api/user";
import { readHouseById } from "src/api/house";
import { useRouter } from "vue-router";


export function isLoggedIn(){
  const userId = localStorage.getItem("userId");
  return userId !== null;
}

export async function getUser() {
  const router = useRouter();
  const userId = localStorage.getItem("userId");
  if (userId !== null) {
    return await readUserById(userId);
  }
  await router.push("/");
}

export async function routeFrontPage(){
  const router = useRouter();
  await router.push("/");
}
