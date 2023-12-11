<template>
  <q-page class="flex items-start desktop-background-low-opacity row">
    <section class="row col-12">
      <section class="col-12 q-px-lg q-pt-xl q-pb-xs" style="width: 100%">
        <div class="text-h3 text-accent">
          Opgaver
        </div>
      </section>

      <section class="col-md-4 col-xs-12 q-px-lg q-pb-lg">
        <div class="q-pt-lg">
          <q-input
            class="bg-secondary"
            color="accent"
            outlined
            v-model="repairName"
            label="Titel"
            @keyup.enter="clickSubmitRepairHandler">
          </q-input>
        </div>

        <div class="q-pt-lg">
          <q-input
            class="bg-secondary"
            color="accent"
            outlined
            v-model="description"
            label="Beskrivelse"
            type="textarea">
          </q-input>
        </div>


        <div class="q-pt-lg">
          <label class="text-h6 text-accent">Ansvarlig</label>
          <q-select
            borderless
            outlined
            style="width: 100%;"
            class="bg-secondary"
            v-model="responsibleSelector"
            :options="users"
            option-value="id"
            option-label="name"
            :menu-props="{ style: { backgroundColor: '#FFEEB5', color: '#857747' } }"/>
        </div>

        <div class="flex flex-center q-pt-lg">
          <q-btn
            class="bg-secondary text-accent"
            style="width: 100%"
            size="large"
            @click="clickSubmitRepairHandler">
            Bekræft opgave
          </q-btn>
        </div>
      </section>

      <section class="col-md-8 col-xs-12 q-pa-lg">
        <q-list>
          <!-- Done repairs-->
          <q-expansion-item
            group="repairs"
            icon="assignment"
            label="Mangler"
            default-opened
            header-class="text-accent bg-secondary"
            class="q-mb-sm shadow-3">
            <q-separator/>
            <div class="row flex justify-between q-px-md text-weight-bold q-py-xs">
              <span>Opgave</span>
              <span>Dato oprettet</span>
            </div>
              <q-scroll-area
                :style="calculateScrollAreaHeightByRepairList(true)">
                <table class="q-table overflow-hidden-y">
                  <tbody>
                  <tr
                    class="bg-secondary text-accent flex justify-between q-card--bordered cursor-pointer"
                    v-for="repair in notDoneRepairs"
                    :key="repair.id"
                    @click="clickRepairHandler(repair)">
                    <td
                      style="font-size: 25px; width: 70%; overflow: hidden;">
                      {{ repair.name }}
                    </td>
                    <td
                      class="flex justify-end"
                      style="font-size: 25px; width: 30%; overflow: hidden;">
                      {{ repair.created.split(",")[0] }}
                    </td>
                  </tr>
                  </tbody>
                </table>
              </q-scroll-area>
          </q-expansion-item>
          <q-expansion-item
            group="repairs"
            icon="done"
            label="Færdigmeldte"
            header-class="text-accent bg-secondary"
            class="shadow-3">
            <q-separator/>
            <div class="row flex justify-between q-px-md text-weight-bold q-py-xs">
              <span>Titel</span>
              <span>Dato afsluttet</span>
            </div>
            <!-- Done repairs-->
            <q-scroll-area
              :style="calculateScrollAreaHeightByRepairList(false)">
              <table class="q-table overflow-hidden-y ">
                <tbody>
                <tr
                  class="bg-accent text-secondary flex justify-between q-card--bordered cursor-pointer"
                  v-for="repair in doneRepairs"
                  :key="repair.id"
                  @click="clickRepairHandler(repair)">
                  <td
                    style="font-size: 25px; width: 70%; overflow: hidden;">
                    {{ repair.name }}
                  </td>
                  <td
                    class="flex justify-end"
                    style="font-size: 25px; width: 30%; overflow: hidden;">
                    {{ repair.finished.split(",")[0] }}
                  </td>
                </tr>
                </tbody>
              </table>
            </q-scroll-area>
          </q-expansion-item>
        </q-list>

      </section>
    </section>

  </q-page>

  <!-- Specific repair dialog -->
  <q-dialog v-model="dialogs.repair">
    <q-card class="bg-secondary text-accent" style="width: 100vw">
      <q-card-section class="column items-center bg-primary">
          <section class="row" style="width: 100%">
          <q-input
            style="width: 70%"
            v-model="viewRepair.name"
            color="accent"
            dense
            autogrow
            label="Titel"
            class="text-h5 text-accent"
            @keyup.enter="clickUpdateRepairHandler"
            @update:model-value="checkForInputChange">
          </q-input>
          <q-space />
          <q-btn icon="delete" flat round dense @click="toggleDialog(dialogs, 'confirmRepairDeletion')"/>
          <q-btn icon="close" flat round dense v-close-popup />

        </section>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="viewRepair.description"
          color="accent"
          dense
          autogrow
          label="Beskrivelse"
          class="text-body1 text-accent"
          @update:model-value="checkForInputChange">
        </q-input>
      </q-card-section>

      <q-card-section class="flex">
        <q-select
          label="Ansvarlig"
          borderless
          outlined
          style="width: 100%;"
          color="accent"
          class="bg-secondary"
          v-model="selectedRepairResponsibleSelector"
          :options="users"
          option-value="id"
          option-label="name"
          :menu-props="{ style: { backgroundColor: '#FFEEB5', color: '#857747' } }"
          @update:model-value="checkForInputChange"/>
      </q-card-section>

      <q-card-section class="flex justify-between">

        <q-checkbox
          size="md"
          v-model="selectedRepair.done"
          label="Udført"
          color="accent"
          @update:model-value="clickToggleRepairState"/>
        <q-btn
          v-if="hasUnsavedChanges"
          size="md"
          class="bg-secondary"
          @click="clickUpdateRepairHandler">
          Opdater
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Delete dialog -->
  <q-dialog v-model="dialogs.confirmRepairDeletion" persistent>
    <q-card class="bg-primary">
      <q-card-section class="row items-center">
        <div>
          <div class="text-h5 flex justify-center text-accent text-bold">{{selectedRepair.name}}</div>
          <div class="text-accent text-bold flex justify-center" >
            Er du sikker på at du vil slette denne opgave permanent?
          </div>
          <div class="text-accent text-bold flex justify-center" >
            Den kan også bare markeres som 'færdig', så den stadig kan tilgås.
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
          @click="clickConfirmDeleteRepairHandler(selectedRepair.id)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <notification-banner ref="notificationBanner"></notification-banner>
</template>

<script>
import { ref } from "vue"
import { getUserAndRouteFrontpageIfNotFound } from "src/service/authentication"
import { getReadableTimestamp, hasInputChanged, toggleDialog } from "src/service/utility";
import { readAllUsersByHouseId, readUserById } from "src/api/user";
import { createRepair, deleteRepairById, readAllRepairsByHouseId, readRepairById, updateRepairById } from "src/api/repair";
import NotificationBanner from "components/notificationBanner.vue";

export default {
  name: "repairPage",

  components: { NotificationBanner },

  data(){
    return{
      // General Data
      user: ref(),
      users: ref([]),
      allRepairs: ref([]),
      doneRepairs: ref([]),
      notDoneRepairs: ref([]),
      nobody: {name:"[Ingen]", id: "[Ingen]"},

      // Repair data
      repairName: ref(""),
      description: ref(""),
      responsibleSelector: ref(),

      // Dialog data
      hasUnsavedChanges: ref(),
      responsible: ref(),
      selectedRepair: ref(),
      selectedRepairResponsibleSelector: ref(),
      viewRepair: ref({
        name: '',
        description: '',
        responsibleId: ''
      }),
      dialogs:ref({
        repair: false,
        confirmRepairDeletion: false
      })
    }
  },

  methods:{
    toggleDialog,

    async clickRepairHandler(data){
      this.selectedRepair = data
      this.viewRepair.name = data.name
      this.viewRepair.description = data.description
      this.viewRepair.responsibleId = data.responsibleId
      if(data.responsibleId !== ""){
        this.responsible = await readUserById(data.responsibleId)
        if(!this.responsible.name){
          // If user has been deleted
          this.responsible = this.nobody
        }
      } else{
        this.responsible = this.nobody
      }
      this.selectedRepairResponsibleSelector = this.responsible
      this.hasUnsavedChanges = false
      toggleDialog(this.dialogs, 'repair')
    },

    async checkForInputChange(){
      const input = [
        [this.viewRepair.name, this.selectedRepair.name],
        [this.viewRepair.description, this.selectedRepair.description],
        [this.viewRepair.responsibleId, this.selectedRepair.responsibleId],
        [this.selectedRepairResponsibleSelector.id,this.responsible.id]
      ]
      this.hasUnsavedChanges = hasInputChanged(input)
    },

    async clickUpdateRepairHandler(){
      await this.updateRepairHandler(true)
    },

    async clickToggleRepairState(){
      this.selectedRepair.finished = this.selectedRepair.done ? getReadableTimestamp() : ""
      await this.updateRepairHandler(false)
    },

    async updateRepairHandler(closePopup){
      if (this.viewRepair.name.trim().length === 0) {
        this.notificationBanner.displayNotification("Opgaven mangler en titel", "error")
        return
      }
      this.selectedRepair.name = this.viewRepair.name
      this.selectedRepair.description = this.viewRepair.description
      this.selectedRepair.responsibleId = this.selectedRepairResponsibleSelector.id
      await updateRepairById(this.selectedRepair)
      const index = this.allRepairs.findIndex(repair => repair.id === this.selectedRepair.id);
      if (index !== -1) {
        this.allRepairs[index] = this.selectedRepair;
      }
      if(closePopup){
        this.notificationBanner.displayNotification("Opgave opdateret", "success")
      }else{
        const bannerText = this.selectedRepair.done ? "Opgave færdigmeldt" : "Opgave tilbagekaldt"
        this.notificationBanner.displayNotification(bannerText, "success")
      }
      this.hasUnsavedChanges = false
      this.updateRepairLists()
      toggleDialog(this.dialogs, 'repair')
    },

    async clickSubmitRepairHandler(){
      if (this.repairName.trim().length === 0) {
        this.notificationBanner.displayNotification("Opgaven mangler en titel", "error")
        return
      }

      const newRepair = {
        houseId: this.user.houseId,
        userId: this.user.id,
        name: this.repairName,
        description: this.description,
        responsibleId: this.responsibleSelector.id,
        finished: "",
        done: false
      }
      const newRepairId = await createRepair(newRepair)
      if(newRepairId){
        this.allRepairs.push(await readRepairById(newRepairId))
        this.notificationBanner.displayNotification("Ny Opgave oprettet", "success")
        this.repairName = ""
        this.description = ""
      }
      await this.updateRepairLists()
    },

    async clickConfirmDeleteRepairHandler(id){
      await deleteRepairById(id)
      this.allRepairs.splice(this.allRepairs.findIndex(repair => repair.id === id), 1)
      this.notificationBanner.displayNotification("Opgave slettet", "success")
      await this.updateRepairLists()
    },

    async updateRepairLists(){
      this.doneRepairs = this.allRepairs.filter(repair => repair.done);;
      this.doneRepairs.sort((a, b) => a.finished.localeCompare(b.finished));
      this.notDoneRepairs = this.allRepairs.filter(repair => !repair.done);
      this.notDoneRepairs.sort((a, b) => a.created.localeCompare(b.created));
    },

    calculateScrollAreaHeightByRepairList(isDone){
      const style = {}
      let listLength;
      if(!isDone){
        listLength = this.doneRepairs.length
      }else{
        listLength = this.notDoneRepairs.length
      }
      style.maxHeight = (6* 50) + "px"
      style.height =  (listLength* 50) + "px"
      return style
    }
  },

  async mounted() {
    this.user = await getUserAndRouteFrontpageIfNotFound()
    this.users = await readAllUsersByHouseId(this.user.houseId)
    this.users.push(this.nobody)
    this.responsibleSelector = this.nobody
    this.allRepairs = await readAllRepairsByHouseId(this.user.houseId)
    await this.updateRepairLists()
    this.notificationBanner = this.$refs.notificationBanner;
  }
}
</script>
