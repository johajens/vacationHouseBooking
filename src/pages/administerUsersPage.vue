<template>
  <q-page class="flex flex-center bg-primary">
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
                    <th v-for="column in columns.desktop" :key="column.name">{{ column.label }}</th>
                    <th>Redigér</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="user in users" :key="user.id"><td v-for="column in columns.desktop" :key="column.name" >{{ user[column.field] }}</td>
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

    <!-- Mobile version -->
    <section class="mobile-only">
      <section class="q-pa-md q-pt-xl absolute-top bg-primary">
        <section class="q-pa-sm column col-12">
            <h4 class="q-ma-none">Administrer brugere</h4>
          <div class="row">
          <q-input
            color="accent"
            style="width: 70%"
            class="q-my-sm"
            outlined
            v-model="password"
            label="Password for alle brugere"
            standout="bg-secondary text-accent"
            @update:model-value="inputChange()">
            <template v-slot:append>
              <q-icon name="edit" />
            </template>
          </q-input>
          <q-btn
            v-if="hasUnsavedChanges"
            style="width: 25%;"
            label="opdater"
            class="bg-secondary q-ma-sm"
            @click="submitChangePassword">
          </q-btn>
          </div>
        </section>

        <section class="q-pa-md q-mt-none col-12">
          <div class="q-pr-none">
            <table class="q-table">
              <thead>
              <tr>
                <th v-for="column in columns.mobile" :key="column.name">{{ column.label }}</th>
                <th>Redigér</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="user in users" :key="user.id"><td v-for="column in columns.mobile" :key="column.name" >{{ user[column.field] }}</td>
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

<!--        <section class="fixed-bottom-right q-pa-md">
          <span class="text-h7 text-accent">FerieboligBooking, JohaJens 2023(™)</span>
        </section>-->

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

const columns = {
  mobile: [
    { name: "name", label: "Navn", field: "name" },
    { name: "email", label: "E-mail", field: "email" }
  ],
  desktop: [
    { name: "name", label: "Navn", field: "name" },
    { name: "email", label: "E-mail", field: "email" },
    { name: "created", label: "Oprettet", field: "created" },
    { name: "isAdmin", label: "Admin", field: "isAdmin" }
  ]
};



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
