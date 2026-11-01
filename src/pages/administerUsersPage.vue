<template>
  <q-page class="flex">
    <section
      class="full-width"
      :class="isMobile ? 'mobile-background-low-opacity' : 'desktop-background-low-opacity'">
      <section class="row" :class="isMobile ? 'q-pa-md' : 'q-pa-xl'">

        <!-- Header and password -->
        <div class="col-12 col-sm-4">
          <component
            :is="isMobile ? 'h4' : 'h2'"
            class="text-accent"
            :class="isMobile ? 'q-ma-none' : 'q-mt-sm'">
            {{ "Administrer brugere"}}
          </component>
        </div>

        <div class="col-12 col-sm-8 col-md-6 offset-md-2">
          <div class="row items-center no-wrap" :class="isMobile ? '' : 'justify-end'">
            <q-btn
              v-if="hasUnsavedPasswordChanges"
              size="md"
              label="Opdater"
              class="bg-secondary q-mx-sm q-px-lg"
              @click="submitChangePassword" />

            <q-input
              color="accent"
              class="bg-secondary q-my-sm"
              :style="{ width: isMobile ? '70%' : '60%' }"
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
                  @click="isPwd = !isPwd" />
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
                <th
                  v-for="column in columns"
                  :key="column.name"
                  :class="{ 'gt-xs': column.hideOnMobile }">
                  {{ column.label }}
                </th>
                <th>Redigér</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="user in users" :key="user.id">
                <td
                  v-for="column in columns"
                  :key="column.name"
                  :class="{ 'gt-xs': column.hideOnMobile }">
                  {{ user[column.field] }}
                </td>
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

        <div class="col-12" >
          <q-btn
            icon="person_add"
            color="secondary"
            text-color="accent"
            @click="toggleDialog(dialogs, 'createNewUser')" />
        </div>
      </section>
    </section>

    <!-- Edit user dialog -->
    <q-dialog v-model="dialogs.editUser" @hide="hasUnsavedChanges = false">
      <q-card class="bg-primary window-width">
        <q-card-section>
          <h4 class="q-mt-none text-accent">Redigér {{ getFirstNameWithPossessive(selectedUser.name) }} bruger</h4>
          <q-input
            class="q-mt-xl bg-secondary"
            color="accent"
            outlined
            v-model="nameUpdate"
            label="Navn"
            standout="bg-secondary text-accent"
            @update:model-value="checkForInputChange"
            @keyup.enter="saveUser" />
          <q-input
            class="q-mt-md bg-secondary"
            color="accent"
            outlined
            v-model="emailUpdate"
            label="E-mail"
            standout="bg-secondary text-accent"
            @update:model-value="checkForInputChange"
            @keyup.enter="saveUser" />
          <q-card-actions class="q-pa-none q-mt-md" align="between">
            <q-btn icon="delete_forever" color="secondary" text-color="accent" @click="toggleDialog(dialogs, 'confirmUserDeletion')" />
            <q-btn v-if="hasUnsavedChanges" label="Opdater" color="secondary" text-color="accent" @click="saveUser" />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Create user dialog -->
    <q-dialog v-model="dialogs.createNewUser">
      <q-card class="bg-primary window-width">
        <q-card-section >
          <h4 class="q-mt-none">Opret ny bruger</h4>
          <q-input
            class="q-mt-xl bg-secondary"
            color="accent"
            outlined
            v-model="nameCreate"
            label="Navn"
            @keyup.enter="clickCreateNewUserHandler" />
          <q-input
            class="q-mt-xl bg-secondary"
            color="accent"
            outlined
            v-model="emailCreate"
            label="E-mail"
            @keyup.enter="clickCreateNewUserHandler" />
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
            <div class="text-h5 text-accent text-bold">
              Er du sikker på at du vil slette {{ getFirstNameWithPossessive(selectedUser.name) }} bruger?
            </div>
            <div class="q-pt-sm text-body2 text-accent">
              Når du sletter {{ getFirstName(selectedUser.name) }}, vil de ikke længere kunne tilgå nogle af ferieboligens funktionaliteter.
            </div>
            <div class="q-pt-xs text-body2 text-accent">
              Alle {{ getFirstNameWithPossessive(selectedUser.name) }} bookinger, opgaver, dokumenter, billeder, etc. vil ikke blive slettet.
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="q-ml-sm justify-between">
          <q-btn label="Annullér" color="secondary" text-color="accent" v-close-popup />
          <q-btn label="Bekræft" color="secondary" text-color="accent" v-close-popup @click="deleteUser" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
  <notification-banner ref="notificationBanner"></notification-banner>
</template>

<script>
import { readAllUsersByHouseId, updateUserById, createUser, deleteUserById, readUserById } from "src/api/user"
import { getUserAndRouteFrontpageIfNotFound, routeFrontPage } from "src/service/authentication"
import { userDataValid, getFirstName, getFirstNameWithPossessive, getStringProperCased, toggleDialog, isInputInvalid, hasInputChanged } from "src/service/utility";

import NotificationBanner from "components/notificationBanner.vue";

export default {
  name: "administerUsersPage",

  components: { NotificationBanner },

  data() {
    return {
      // Static data
      user: null,
      users: [],
      password: "",
      hasUnsavedPasswordChanges: false,
      isPwd: true,

      // Update data
      selectedUser: { name: "" },
      nameUpdate: "",
      emailUpdate: "",
      hasUnsavedChanges: false,

      // Create data
      nameCreate: "",
      emailCreate: "",

      // Dialog data
      dialogs: {
        confirmUserDeletion: false,
        createNewUser: false,
        editUser: false
      },

      // Model data (hideOnMobile columns get Quasar's "gt-xs" class)
      columns: [
        { name: "name", label: "Navn", field: "name" },
        { name: "email", label: "E-mail", field: "email" },
        { name: "created", label: "Oprettet", field: "created", hideOnMobile: true }
      ]
    }
  },

  computed: {
    isMobile() {
      return this.$q.screen.lt.sm
    }
  },

  methods: {
    getFirstName,

    getFirstNameWithPossessive,

    toggleDialog,

    async clickCreateNewUserHandler() {
      const data = await userDataValid([this.emailCreate, this.nameCreate], this.user.email)
      if (data.validInfo) {
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

    clickEditUserHandler(data) {
      toggleDialog(this.dialogs, 'editUser')
      this.selectedUser = data
      this.nameUpdate = data.name
      this.emailUpdate = data.email
    },

    checkForInputChange() {
      const input = [
        [this.selectedUser.name, this.nameUpdate],
        [this.selectedUser.email, this.emailUpdate]
      ]
      this.hasUnsavedChanges = hasInputChanged(input)
    },

    async saveUser() {
      if (!this.hasUnsavedChanges) {
        return
      }
      const data = await userDataValid([this.emailUpdate, this.nameUpdate], this.selectedUser.email)
      if (data.validInfo) {
        this.selectedUser.name = getStringProperCased(this.nameUpdate, true)
        this.selectedUser.email = this.emailUpdate
        await updateUserById(this.selectedUser)
        data.notificationMessage = "Bruger opdateret"
        const index = this.users.findIndex(user => user.id === this.selectedUser.id)
        if (index !== -1) {
          this.users[index] = this.selectedUser
        }
        toggleDialog(this.dialogs, 'editUser')
      }
      this.notificationBanner.displayNotification(data.notificationMessage, data.type)
    },

    async deleteUser() {
      const id = this.selectedUser.id
      await deleteUserById(id)
      const index = this.users.findIndex(user => user.id === id)
      if (index !== -1) {
        this.users.splice(index, 1)
      }
      this.notificationBanner.displayNotification("Bruger med navnet: '" + this.selectedUser.name + "' slettet", "success")
    },

    inputChangePassword() {
      this.hasUnsavedPasswordChanges = hasInputChanged([[this.user.password, this.password]])
    },

    async submitChangePassword() {
      if (!this.hasUnsavedPasswordChanges) {
        return
      }
      if (isInputInvalid(this.password)) {
        this.notificationBanner.displayNotification("Password må ikke være tom", "error")
      } else {
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

    if (this.user.isAdmin !== true) {
      await routeFrontPage()
    }

    this.users = await readAllUsersByHouseId(this.user.houseId)
      .then(users => users.filter(tempUser => tempUser.id !== this.user.id))

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
  text-align: center;
  padding: 8px;
}

tr {
  border-bottom: 1pt solid black;
}
</style>
