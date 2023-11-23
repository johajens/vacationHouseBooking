<template>
  <q-page class="flex">
    <!-- Desktop version -->
    <section class="desktop-only desktop-background-low-opacity">
      <section class="q-pa-xl row">
        <!-- Header and password stuff -->
        <h2 class="q-mt-sm col-4">Brugere</h2>

        <div class="col-2"></div>

        <div class="col-5 column">
          <div class="row">
            <q-btn
              v-if="hasUnsavedPasswordChanges"
              size="md"
              label="Opdater"
              class="bg-secondary q-mx-sm q-px-lg"
              @click="submitChangePassword">
            </q-btn>
            <q-input
              color="accent"
              style="width: 60%"
              class="q-ml-auto bg-secondary"
              outlined
              v-model="password"
              label="Password for alle brugere"
              @update:model-value="inputChangePassword"
              :type="isPwd ? 'password' : 'text'">
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
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
                    @click="userClicked(user)">
                    <q-icon name="edit"/>
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
    <section class="mobile-only mobile-background-low-opacity">
      <section class="q-pa-md q-pt-xl ">
        <section class="q-pa-sm column col-12">
            <h4 class="q-ma-none">Administrer brugere</h4>
          <div class="row">
          <q-input
            color="accent"
            style="width: 70%"
            class="q-my-sm bg-secondary"
            outlined
            v-model="password"
            label="Password for alle brugere"
            @update:model-value="inputChangePassword"
            :type="isPwd ? 'password' : 'text'">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-btn
            v-if="hasUnsavedPasswordChanges"
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
                    @click="userClicked(user)">
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


    <!-- Edit user dialog -->
    <q-dialog v-model="showPopupEdit" @hide="hasUnsavedUpdateChanges = false">
      <q-card class="bg-primary window-width">
        <q-card-section align="center">
          <h4 class="q-mt-none">Redigér bruger</h4>
          <q-input
            class="q-mt-xl bg-secondary"
            color="accent"
            outlined
            v-model="nameUpdate"
            label="Navn"
            standout="bg-secondary text-accent"
            @update:model-value="inputChangeUpdate"
            />
          <q-input
            class="q-mt-md bg-secondary"
            color="accent"
            outlined
            v-model="emailUpdate"
            label="E-mail"
            standout="bg-secondary text-accent"
            @update:model-value="inputChangeUpdate"
          />
          <q-card-actions class="q-pa-none q-mt-md" align="between">
            <q-btn  icon="delete_forever" color="secondary" text-color="accent" @click="confirmUserDeletion" />
            <q-btn  v-if="hasUnsavedUpdateChanges" label="Opdater" color="secondary" text-color="accent" @click="saveUser" />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Create user dialog -->
    <q-dialog v-model="showPopupCreate">
      <q-card class="bg-primary window-width">
        <q-card-section align="center">
          <h4 class="q-mt-none">Opret ny bruger</h4>
          <q-input
            class="q-mt-xl bg-secondary"
            color="accent"
            outlined
            v-model="nameCreate"
            label="Navn"
          />
          <q-input
            class="q-mt-xl bg-secondary"
            color="accent"
            outlined
            v-model="emailCreate"
            label="E-mail"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn label="Opret" color="secondary" text-color="accent" @click="createUserClicked" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Confirm user deletion -->
    <q-dialog v-model="confirmUserDeletionDialog" persistent>
      <q-card class="bg-primary">
        <q-card-section class="row items-center">
          <div>
            <div class="text-h5 text-accent text-bold" >
              Er du sikker på at du vil slette {{nameUpdate.split(" ").at(0)}}s bruger?
            </div>
            <div class="q-pt-sm text-body2 text-accent">
              Når du sletter {{nameUpdate.split(" ").at(0)}}, vil de ikke længere kunne tilgå nogle af ferieboligens funktionaliteter.
            </div>
            <div class="q-pt-xs text-body2 text-accent">
              Alle {{nameUpdate.split(" ").at(0)}}s bookinger, reparationer, dokumenter, billeder, etc. vil ikke blive slettet.
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="q-ml-sm justify-end">
          <q-btn
            label="Annullér"
            color="secondary"
            text-color="accent"
            v-close-popup
          />
          <q-btn
            label="Bekræft"
            color="secondary"
            text-color="accent"
            v-close-popup
            @click="deleteUser"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
  <notification-banner ref="notificationBanner"></notification-banner>
</template>

<script>import { onMounted, ref } from "vue"
import { readAllUsersByHouseId, updateUserById, createUser, deleteUserById, readUserById } from "src/api/user"
import { getUserAndRouteFrontpageIfNotFound, routeFrontPage } from "src/service/authentication"
import { userDataValid } from "src/service/utility";
import NotificationBanner from "components/notificationBanner.vue";

const columns = {
  mobile: [
    { name: "name", label: "Navn", field: "name" },
    { name: "email", label: "E-mail", field: "email" }
  ],
  desktop: [
    { name: "name", label: "Navn", field: "name" },
    { name: "email", label: "E-mail", field: "email" },
    { name: "created", label: "Oprettet", field: "created" }
  ]
}

export default {
  name: "administerUsersPage",
  components: { NotificationBanner },

  setup () {
    // General
    const user = ref()
    const users = ref([])
    const notificationBanner = ref()
    // Password
    const password = ref()
    const hasUnsavedPasswordChanges = ref(false)
    const isPwd = ref(true)
    // Edit dialog
    const showPopupEdit = ref(false)
    const selectedUser = ref()
    const nameUpdate = ref("")
    const emailUpdate = ref("")
    const hasUnsavedUpdateChanges = ref(false)
    const confirmUserDeletionDialog = ref()
    // Create user dialog
    const showPopupCreate = ref(false)
    const nameCreate = ref("")
    const emailCreate = ref("")

    const addUserClicked = () => {
      showPopupCreate.value = true
    }

    const createUserClicked = async () => {
      const data = await userDataValid([emailCreate.value, nameCreate.value], user)
      if (data.validInfo){
        const newUser = {
          name: nameCreate.value,
          email: emailCreate.value,
          houseId: user.value.houseId,
          password: user.value.password,
          isAdmin: false,
        }
        const newUserId = await createUser(newUser)
        const newUserCreated = await readUserById(newUserId)
        data.notificationMessage = "Bruger med navnet: '" + nameCreate.value + "' oprettet"
        users.value.push(newUserCreated)
        showPopupCreate.value = false
      }
      notificationBanner.value.displayNotification(data.notificationMessage, data.type)
    }


    const userClicked = (data) => {
      showPopupEdit.value = true
      selectedUser.value = data
      nameUpdate.value = data.name
      emailUpdate.value = data.email
    }

    const inputChangeUpdate = () => {
      if(selectedUser.value.name === nameUpdate.value && selectedUser.value.email === emailUpdate.value){
        hasUnsavedUpdateChanges.value = false
      }else{
        hasUnsavedUpdateChanges.value = true
      }
    }

    const saveUser = async () => {
      const data = await userDataValid([emailUpdate.value, nameUpdate.value], selectedUser.value)
      if (data.validInfo){
        selectedUser.value.email = emailUpdate.value
        selectedUser.value.name = nameUpdate.value
        await updateUserById(selectedUser.value)
        data.notificationMessage = "Bruger opdateret"
        const index = users.value.findIndex(user => user.id === selectedUser.value.id);
        if (index !== -1) {
          users[index] = selectedUser.value;
        }
        showPopupEdit.value = false
      }
      notificationBanner.value.displayNotification(data.notificationMessage, data.type)
    }

    const confirmUserDeletion = () => {
      showPopupEdit.value = false
      confirmUserDeletionDialog.value = true
    }

    const deleteUser = async () => {
      const id = selectedUser.value.id
      await deleteUserById(id)
      const index = users.value.findIndex(user => user.id === id);
      if (index !== -1) {
        users.value.splice(index, 1)
      }
      confirmUserDeletionDialog.value = false
      notificationBanner.value.displayNotification("Bruger med navnet: '" + selectedUser.value.name + "' slettet","success")
    }

    const inputChangePassword = () => {
      if(user.value.password === password.value){
        hasUnsavedPasswordChanges.value = false
      }else{
        hasUnsavedPasswordChanges.value = true
      }
    }

    const submitChangePassword = async () => {
      if (password.value.trim().length === 0) {
        notificationBanner.value.displayNotification("Password må ikke være tom", "error")
      }else{
        for (const tempUser of users.value) {
          tempUser.password = password.value
          await updateUserById(tempUser)
        }
        notificationBanner.value.displayNotification("Password opdateret", "success")
        hasUnsavedPasswordChanges.value = false
      }
    }

    const onPageLoad = async () => {
      user.value = await getUserAndRouteFrontpageIfNotFound()
      if(user.value.isAdmin !== true){
        await routeFrontPage()
      }
      const allUsers = await readAllUsersByHouseId(user.value.houseId);
      users.value = allUsers.filter(tempUser => tempUser.id !== user.value.id)
      password.value = user.value.password
    }
    onMounted(() => {
      onPageLoad()
    })

    return {
      users,
      columns,
      notificationBanner,

      //Password stuff
      password,
      inputChangePassword,
      hasUnsavedPasswordChanges,
      submitChangePassword,
      isPwd,

      //Edit user stuff
      userClicked,
      showPopupEdit,
      nameUpdate,
      emailUpdate,
      hasUnsavedUpdateChanges,
      inputChangeUpdate,
      saveUser,
      deleteUser,
      confirmUserDeletionDialog,
      confirmUserDeletion,

      //Create user stuff
      showPopupCreate,
      emailCreate,
      nameCreate,
      addUserClicked,
      createUserClicked,
    }
  }
}
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
