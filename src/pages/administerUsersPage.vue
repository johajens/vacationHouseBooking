<template>
  <q-page class="flex flex-center">
    <section class="desktop-only">
      <section class="q-pa-xl absolute-top row window-width bg-primary">

        <!-- Header and password stuff -->
        <h2 class="q-mt-sm col-4">Brugere</h2>
        <div class="col-2"></div>
        <div class="col-5 column">
          <div class="row">
            <q-btn
              v-if="hasUnsavedChanges"
              size="md"
              label="opdater"
              class="bg-secondary q-mx-sm q-px-lg"
              @click="submitChangePassword">
            </q-btn>
            <q-input
              color="accent"
              style="width: 60%"
              class="q-ml-auto"
              outlined
              v-model="password"
              label="Password for alle brugere"
              standout="bg-secondary text-accent"
              @update:model-value="inputChange()">
              <template v-slot:append>
                <q-icon name="edit" />
              </template>
            </q-input>
          </div>
        </div>


        <!-- Users -->
        <section class="q-pa-md q-mt-none col-12">
              <div class="q-pr-none">
                <table class="q-table">
                  <thead>
                  <tr>
                    <th v-for="column in columns" :key="column.name">{{ column.label }}</th>
                    <th>Redigér</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="user in users" :key="user.id"><td v-for="column in columns" :key="column.name" >{{ user[column.field] }}</td>
                    <td>
                      <q-btn
                        size="md"
                        class="q-mr-md"
                        color="secondary"
                        text-color="accent"
                        @click="userClicked(user)"
                      >
                        <q-icon name="edit" />
                      </q-btn>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
        </section>
        <div class="col-12" align="center">
          <q-btn icon="person_add" color="secondary" text-color="accent" @click="addUserClicked" />
        </div>
      </section>
    </section>

    <!-- background for mobile -->
    <section class="mobile-only">
      <div style="max-width: 100vw;overflow: hidden">
        <img
          src="~assets/ferieboligbooking-background-m-swedish-art.png"
          style="object-fit: cover; object-position: 100% 0;"
          alt="FerieboligBooking visuel identitet"
        >
      </div>
      <section class="q-pa-md q-pt-xl absolute-top">
        <section class="q-pa-sm row">
            <h4>Administrer brugere</h4>
        </section>
        <section class="fixed-bottom-right q-pa-md">
          <span class="text-h7 text-accent">FerieboligBooking, JohaJens 2023(™)</span>
        </section>
      </section>
    </section>


    <!-- Edit user dialog -->
    <q-dialog v-model="showPopupEdit">
      <q-card class="bg-primary window-width">
        <q-card-section align="center">
          <h4 class="q-mt-none">Redigér bruger</h4>
          <q-input
            class="q-mt-xl"
            color="accent"
            outlined
            v-model="name"
            label="Navn"
            standout="bg-secondary text-accent"
            />
          <q-input
            class="q-mt-xl"
            color="accent"
            outlined
            v-model="email"
            label="E-mail"
            standout="bg-secondary text-accent"
          />
        </q-card-section>
        <q-card-actions align="between">
          <q-btn icon="delete_forever" color="negative" @click="deleteUser" />
          <q-btn label="Opdater" color="positive" @click="saveUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Create user dialog -->
    <q-dialog v-model="showPopupCreate">
      <q-card class="bg-primary window-width">
        <q-card-section align="center">
          <h4 class="q-mt-none">Opret ny bruger</h4>
          <q-input
            class="q-mt-xl"
            color="accent"
            outlined
            v-model="nameCreate"
            label="Navn"
            standout="bg-secondary text-accent"
          />
          <q-input
            class="q-mt-xl"
            color="accent"
            outlined
            v-model="emailCreate"
            label="E-mail"
            standout="bg-secondary text-accent"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn label="Opret" color="positive" @click="createUserClicked" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>import { onMounted, ref } from "vue";
import { readAllUsersByHouseId, updateUserById, createUser, deleteUserById } from "src/api/user";
import { getUser, routeFrontPage } from "src/service/authentication";

const columns = [

  { name: "name", label: "Navn", field: "name" },
  { name: "email", label: "E-mail", field: "email" },
  { name: "password", label: "Password", field: "password" },
  { name: "created", label: "Oprettet", field: "created" },
]

export default {
  name: "administerUsersPage",

  setup () {
    const user = ref();
    const users = ref([]);
    const password = ref();
    const hasUnsavedChanges = ref(false);
    const showPopupEdit = ref(false);
    const selectedUser = ref();
    const name = ref("");
    const email = ref("");

    const showPopupCreate = ref(false);
    const nameCreate = ref("");
    const emailCreate = ref("");

    const submitChangePassword = async () => {
      if (password.value.length < 1) {
        // TODO errormessage
      }else{
        users.value.forEach(async function(tempUser){
          tempUser.password = password.value
          await updateUserById(tempUser)
        });

      }
    };

    const addUserClicked = () => {
      showPopupCreate.value = true
    }

    const createUserClicked = async () => {
      const newUser = {
        name: nameCreate.value,
        email: emailCreate.value,
        houseId: user.value.houseId,
        password: user.value.password,
        isAdmin: false,
      }
      await createUser(newUser)
      window.location.reload()
    }


    const userClicked = (data) => {
      showPopupEdit.value = true
      selectedUser.value = data
      name.value = data.name
      email.value = data.email
    }

    const saveUser = async () => {
      selectedUser.value.email = email.value
      selectedUser.value.name = name.value
      await updateUserById(selectedUser.value)
      window.location.reload()
    }
    const deleteUser = async () => {
      await deleteUserById(selectedUser.value.id)
      window.location.reload()
    }

    function inputChange(){
      if(user.value.password === password.value){
        hasUnsavedChanges.value = false
      }else{
        hasUnsavedChanges.value = true
      }
    }

    const onPageLoad = async () => {
      user.value = await getUser();
      if(user.value.isAdmin !== true){
        await routeFrontPage();
      }
      users.value = await readAllUsersByHouseId(user.value.houseId);
      password.value = user.value.password
    }
    onMounted(() => {
      onPageLoad();
    })

    return {
      users,
      columns,
      password,
      inputChange,
      hasUnsavedChanges,
      submitChangePassword,
      userClicked,
      showPopupEdit,
      userEdit: selectedUser,
      name,
      email,
      saveUser,
      deleteUser,
      showPopupCreate,
      emailCreate,
      nameCreate,
      addUserClicked,
      createUserClicked

    }
  }
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}
th, td {
  text-align: center; /* Center-align content within cells */
  padding: 8px; /* Add padding for better readability */
}
tr {
  border-bottom: 1pt solid black;
}
</style>
