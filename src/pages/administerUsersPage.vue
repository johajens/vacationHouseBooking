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
              @keyup.enter="submitChangePassword"
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
                    @click="clickEditUserHandler(user)">
                    <q-icon name="edit"/>
                  </q-btn>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div class="col-12" align="center">
          <q-btn icon="person_add" color="secondary" text-color="accent" @click="toggleDialog(dialogs,'createNewUser')" />
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
                    @click="clickEditUserHandler(user)">
                    <q-icon name="edit" />
                  </q-btn>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div class="col-12" align="center">
          <q-btn icon="person_add" color="secondary" text-color="accent" @click="toggleDialog(dialogs,'createNewUser')" />
        </div>
      </section>
    </section>

    <!-- Edit user dialog -->
    <q-dialog v-model="dialogs.editUser" @hide="hasUnsavedChanges = false">
      <q-card class="bg-primary window-width">
        <q-card-section align="center">
          <h4 class="q-mt-none text-accent">Redigér {{getFirstNameWithPossessive(selectedUser.name)}} bruger</h4>
          <q-input
            class="q-mt-xl bg-secondary"
            color="accent"
            outlined
            v-model="nameUpdate"
            label="Navn"
            standout="bg-secondary text-accent"
            @update:model-value="checkForInputChange"
            @keyup.enter="saveUser"
            />
          <q-input
            class="q-mt-md bg-secondary"
            color="accent"
            outlined
            v-model="emailUpdate"
            label="E-mail"
            standout="bg-secondary text-accent"
            @update:model-value="checkForInputChange"
            @keyup.enter="saveUser"
          />
          <q-card-actions class="q-pa-none q-mt-md" align="between">
            <q-btn  icon="delete_forever" color="secondary" text-color="accent" @click="toggleDialog(dialogs, 'confirmUserDeletion')" />
            <q-btn  v-if="hasUnsavedChanges" label="Opdater" color="secondary" text-color="accent" @click="saveUser" />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Create user dialog -->
    <q-dialog v-model="dialogs.createNewUser">
      <q-card class="bg-primary window-width">
        <q-card-section align="center">
          <h4 class="q-mt-none">Opret ny bruger</h4>
          <q-input
            class="q-mt-xl bg-secondary"
            color="accent"
            outlined
            v-model="nameCreate"
            label="Navn"
            @keyup.enter="clickCreateNewUserHandler"
          />
          <q-input
            class="q-mt-xl bg-secondary"
            color="accent"
            outlined
            v-model="emailCreate"
            label="E-mail"
            @keyup.enter="clickCreateNewUserHandler"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn label="Opret" color="secondary" text-color="accent" @click="clickCreateNewUserHandler" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Confirm user deletion -->
    <q-dialog v-model="dialogs.confirmUserDeletion" persistent>
      <q-card class="bg-primary">
        <q-card-section class="row items-center">
          <div>
            <div class="text-h5 text-accent text-bold" >
              Er du sikker på at du vil slette {{getFirstNameWithPossessive(selectedUser.name)}} bruger?
            </div>
            <div class="q-pt-sm text-body2 text-accent">
              Når du sletter {{getFirstName(selectedUser.name)}}, vil de ikke længere kunne tilgå nogle af ferieboligens funktionaliteter.
            </div>
            <div class="q-pt-xs text-body2 text-accent">
              Alle {{getFirstNameWithPossessive(selectedUser.name)}} bookinger, reparationer, dokumenter, billeder, etc. vil ikke blive slettet.
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

<script>
import { onMounted, ref } from "vue"
import { readAllUsersByHouseId, updateUserById, createUser, deleteUserById, readUserById } from "src/api/user"
import { getUserAndRouteFrontpageIfNotFound, routeFrontPage } from "src/service/authentication"
import { userDataValid, getFirstName, getFirstNameWithPossessive, getStringProperCased, toggleDialog, isInputInvalid, hasInputChanged } from "src/service/utility";

import NotificationBanner from "components/notificationBanner.vue";

export default {
  name: "administerUsersPage",

  components: { NotificationBanner },

  data(){
    return{
      //Static data
      user: ref(),
      users: ref([]),
      password: ref(),
      hasUnsavedPasswordChanges: ref(false),
      isPwd: ref(true),

      //Update data
      selectedUser: ref(),
      nameUpdate: ref(""),
      emailUpdate: ref(""),
      hasUnsavedChanges: ref(false),

      //Create data
      nameCreate: ref(""),
      emailCreate: ref(""),

      //Dialog data
      dialogs: ref({
        confirmUserDeletion: false,
        createNewUser: false,
        editUser: false}),

      //Model data
      columns: {
        mobile: [
          { name: "name", label: "Navn", field: "name" },
          { name: "email", label: "E-mail", field: "email" }
        ],
        desktop: [
          { name: "name", label: "Navn", field: "name" },
          { name: "email", label: "E-mail", field: "email" },
          { name: "created", label: "Oprettet", field: "created" }
        ]
      },
    }
  },

  methods:{
    getFirstName,

    getFirstNameWithPossessive,

    toggleDialog,

    async clickCreateNewUserHandler(){
      const data = await userDataValid([this.emailCreate, this.nameCreate], this.user.email)
      if (data.validInfo){
        const newUser = {
          name: getStringProperCased(this.nameCreate, true),
          email: this.emailCreate,
          houseId: this.user.houseId,
          password: this.user.password,
          colorId: 'default',
          isAdmin: false,
        }
        const newUserId = await createUser(newUser)
        const newUserCreated = await readUserById(newUserId)
        data.notificationMessage = "Bruger med navnet: '" + this.nameCreate + "' oprettet"
        this.users.push(newUserCreated)
        toggleDialog(this.dialogs, 'createNewUser')
        this.nameCreate = ""
        this.emailCreate = ""
      }
      this.notificationBanner.displayNotification(data.notificationMessage, data.type)
    },

    clickEditUserHandler(data){
      toggleDialog(this.dialogs, 'editUser')
      this.selectedUser = data
      this.nameUpdate = data.name
      this.emailUpdate = data.email
    },

    checkForInputChange(){
      const input = [
        [this.selectedUser.name, this.nameUpdate],
        [this.selectedUser.email, this.emailUpdate]
      ]
      this.hasUnsavedChanges = hasInputChanged(input)
    },

    async saveUser(){
      if(!this.hasUnsavedChanges){
        return
      }
      const data = await userDataValid([this.emailUpdate, this.nameUpdate], this.selectedUser.email)
      if (data.validInfo){
        this.selectedUser.name = getStringProperCased(this.nameUpdate, true)
        this.selectedUser.email = this.emailUpdate
        await updateUserById(this.selectedUser)
        data.notificationMessage = "Bruger opdateret"
        const index = this.users.findIndex(user => user.id === this.selectedUser.id);
        if (index !== -1) {
          this.users[index] = this.selectedUser;
        }
        toggleDialog(this.dialogs, 'editUser')
      }
      this.notificationBanner.displayNotification(data.notificationMessage, data.type)
    },

    async confirmUserDeletionHandler(){
      toggleDialog(this.dialogs, 'editUser')
    },

    async deleteUser(){
      const id = this.selectedUser.id
      await deleteUserById(id)
      const index = this.users.findIndex(user => user.id === id);
      if (index !== -1) {
        this.users.splice(index, 1)
      }
      this.notificationBanner.displayNotification("Bruger med navnet: '" + this.selectedUser.name + "' slettet","success")
    },

    inputChangePassword(){
      this.hasUnsavedPasswordChanges = hasInputChanged([[this.user.password, this.password]])
    },

    async submitChangePassword(){
      if(!this.hasUnsavedPasswordChanges){
        return
      }
      if (isInputInvalid(this.password)) {
        this.notificationBanner.displayNotification("Password må ikke være tom", "error")
      }else{
        this.user.password = this.password
        await updateUserById(this.user)
        for (const tempUser of this.users) {
          tempUser.password = this.password
          await updateUserById(tempUser)
        }
        this.notificationBanner.displayNotification("Password opdateret", "success")
        this.hasUnsavedPasswordChanges = false
      }
    }
  },

  async mounted() {
    this.user = await getUserAndRouteFrontpageIfNotFound()

    if(this.user.isAdmin !== true){
      await routeFrontPage()
    }

    this.users = await readAllUsersByHouseId(this.user.houseId)
      .then(users => users
        .filter(tempUser => tempUser.id !== this.user.id))

    this.password = this.user.password
    this.notificationBanner = this.$refs.notificationBanner
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
