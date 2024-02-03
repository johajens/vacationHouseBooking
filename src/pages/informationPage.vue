<template>
  <q-page class="flex items-start row desktop-background-low-opacity">
    <section class="row col-12 q-px-lg desktop-only">
      <section class="col-12 q-py-lg q-pb-xs">
        <div class="text-h3 text-accent flex justify-between">
          Opslagstavlen
          <q-btn
            @click="toggleDialog(dialogs,'createNewInformation')"
            class="bg-secondary"
            v-if="isUserAdmin"
            >
            opret ny
          </q-btn>

        </div>
      </section>

      <!--CARDS-->
      <section class="row col-12 q-pa-sm items-start shadow-10 flex justify-around" style="border-radius: 10px">
        <q-card
          v-for="(info, index) in allInformation"
          :key="index"
          class="bg-secondary text-accent q-ma-lg shadow-10"
          style="width: 20%">
          <q-card-section>
            <div class="text-h6">{{ info.name }}</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            {{ info.description }}
          </q-card-section>
          <q-separator/>
          <q-card-actions v-if="isUserAdmin" class="flex justify-center q-pa-none">
            <q-btn
              flat
              style="width: 100%"
              @click="clickEditInformationHandler(info)">
              Redigér
            </q-btn>
          </q-card-actions>
        </q-card>
      </section>
    </section>

    <!-- Mobile Version -->
    <section class="mobile-only mobile-background-low-opacity">
      <section class="q-pa-md absolute-top flex flex-center bg-primary">
        <div class="text-h3 text-accent flex justify-between">
          Opslagstavlen
        </div>
        <q-btn
          @click="toggleDialog(dialogs,'createNewInformation')"
          class="bg-secondary q-ma-sm"
          v-if="isUserAdmin"
        >
          opret ny
        </q-btn>

        <section class="row col-12 q-ma-sm bg-primary shadow-10" style="border-radius: 10px">
          <q-card
            v-for="(info, index) in allInformation"
            :key="index"
            class="bg-secondary text-accent q-ma-lg shadow-10"
            style="width: 90%">
            <q-card-section>
              <div class="text-h6">{{ info.name }}</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              {{ info.description }}
            </q-card-section>
            <q-separator/>
            <q-card-actions v-if="isUserAdmin" class="flex justify-center q-pa-none">
              <q-btn
                flat
                style="width: 100%"
                @click="clickEditInformationHandler(info)">
                Redigér
              </q-btn>
            </q-card-actions>
          </q-card>
        </section>
      </section>
    </section>



    <!-- Create information dialog -->
    <q-dialog v-model="dialogs.createNewInformation">
      <q-card class="bg-primary window-width">
        <q-card-section align="center">
          <h4 class="q-mt-none">Opret nyt opslag</h4>
          <q-input
            class="q-mt-xl bg-secondary"
            color="accent"
            outlined
            v-model="nameCreate"
            label="Titel"
            @keyup.enter="clickCreateNewInformationHandler"
          />
          <q-input
            class="q-mt-xl bg-secondary"
            color="accent"
            outlined
            v-model="descriptionCreate"
            label="Tekst"
            @keyup.enter="clickCreateNewInformationHandler"
          />
        </q-card-section>
        <q-card-actions align="center">
          <q-btn label="Opret" color="secondary" text-color="accent" @click="clickCreateNewInformationHandler" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Edit information dialog -->
    <q-dialog v-model="dialogs.editInformation" @hide="hasUnsavedChanges = false">
      <q-card class="bg-primary window-width">
        <q-card-section align="center">
          <h4 class="q-mt-none text-accent">Redigér opslag</h4>
          <q-input
            class="q-mt-xl bg-secondary"
            color="accent"
            outlined
            v-model="nameUpdate"
            label="Titel"
            standout="bg-secondary text-accent"
            @update:model-value="checkForInputChange"
            @keyup.enter="clickSaveInformationHandler"
          />
          <q-input
            class="q-mt-md bg-secondary"
            color="accent"
            outlined
            v-model="descriptionUpdate"
            label="Tekst"
            standout="bg-secondary text-accent"
            @update:model-value="checkForInputChange"
            @keyup.enter="clickSaveInformationHandler"
          />
          <q-card-actions class="q-pa-none q-mt-md" align="between">
            <q-btn  icon="delete_forever" color="secondary" text-color="accent" @click="toggleDialog(dialogs, 'confirmInformationDeletion')" />
            <q-btn  v-if="hasUnsavedChanges" label="Opdater" color="secondary" text-color="accent" @click="clickSaveInformationHandler" />
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Confirm information deletion -->
    <q-dialog v-model="dialogs.confirmInformationDeletion" persistent>
      <q-card class="bg-primary">
        <q-card-section class="row items-center">
          <div>
            <div class="text-h5 text-accent text-bold" >
              Er du sikker på at du vil slette opslaget?
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="q-ml-sm justify-between">
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
            @click="deleteInformation"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>


  </q-page>
  <notification-banner ref="notificationBanner"></notification-banner>
</template>

<script>
import { ref } from "vue"
import { getUserAndRouteFrontpageIfNotFound } from "src/service/authentication"
import { readAllInformationsByHouseId, createInformation, readInformationById, updateInformationById, deleteInformationById } from "src/api/information";
import { toggleDialog, isInputInvalid, hasInputChanged } from "src/service/utility";
import NotificationBanner from "components/notificationBanner.vue";

export default {
  name: "informationPage",
  components: { NotificationBanner },
  data() {
    return {
      // General stuff
      user: ref(),
      isUserAdmin: ref(false),
      house: ref(),
      allInformation: ref([]),

      dialogs: ref({
        createNewInformation: false,
        editInformation: false,
        confirmInformationDeletion: false
      }),

      // Create information data
      nameCreate: ref(""),
      descriptionCreate: ref(""),

      // Edit information data
      hasUnsavedChanges: ref(false),
      nameUpdate: ref(""),
      descriptionUpdate: ref(""),
    }
  },

  methods: {
    toggleDialog,

    async clickCreateNewInformationHandler(){

      if (isInputInvalid([this.nameCreate])){
        this.notificationBanner.displayNotification("Et opslag skal som minimum have en titel", "Error")
        return
      }
      const newInformation = {
        houseId: this.user.houseId,
        name: this.nameCreate,
        description: this.descriptionCreate
      }
      const newInformationId = await createInformation(newInformation)
      const newInformationCreated = await readInformationById(newInformationId)
      this.allInformation.push(newInformationCreated)
      toggleDialog(this.dialogs, 'createNewInformation')
      this.nameCreate = ""
      this.descriptionCreate = ""
      this.notificationBanner.displayNotification("Nyt opslag oprettet", "Success")

    },

    clickEditInformationHandler(info){
      toggleDialog(this.dialogs, 'editInformation')
      this.selectedInformation = info
      this.nameUpdate = this.selectedInformation.name
      this.descriptionUpdate = this.selectedInformation.description
    },

    checkForInputChange(){
      const input = [
        [this.selectedInformation.name, this.nameUpdate],
        [this.selectedInformation.description, this.descriptionUpdate]
      ]
      this.hasUnsavedChanges = hasInputChanged(input)
    },

    clickSaveInformationHandler(){
      if(!this.hasUnsavedChanges){
        return
      }
      if (isInputInvalid([this.nameUpdate])){
        this.notificationBanner.displayNotification("Et opslag skal som minimum have en titel", "Error")
        return
      }
      this.selectedInformation.name = this.nameUpdate
      this.selectedInformation.description = this.descriptionUpdate
      updateInformationById(this.selectedInformation)
      toggleDialog(this.dialogs, 'editInformation')
      this.notificationBanner.displayNotification("Opslag opdateret", "success")
    },

    async deleteInformation(){
      const id = this.selectedInformation.id
      await deleteInformationById(id)
      const index = this.allInformation.findIndex(information => information.id === id);
      if (index !== -1) {
        this.allInformation.splice(index, 1)
      }
      this.notificationBanner.displayNotification("Opslag slettet","success")
    },
  },

  async mounted() {
    this.notificationBanner = this.$refs.notificationBanner
    this.user = await getUserAndRouteFrontpageIfNotFound()
    this.isUserAdmin = this.user.isAdmin
    this.allInformation = await readAllInformationsByHouseId(this.user.houseId)
  },
}
</script>

<style scoped>
.mobile-background-color{
  background-color: red;
}
</style>
