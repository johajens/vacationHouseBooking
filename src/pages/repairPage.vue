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
            @keyup.enter="submitRepair">
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
            @click="submitRepair">
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
                :style="scrollAreaHeight(true)">
                <table class="q-table overflow-hidden-y">
                  <tbody>
                  <tr
                    class="bg-secondary text-accent flex justify-between q-card--bordered cursor-pointer"
                    v-for="repair in notDoneRepairs"
                    :key="repair.id"
                    @click="repairClickHandler(repair)">
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
              :style="scrollAreaHeight(false)">
              <table class="q-table overflow-hidden-y ">
                <tbody>
                <tr
                  class="bg-accent text-secondary flex justify-between q-card--bordered cursor-pointer"
                  v-for="repair in doneRepairs"
                  :key="repair.id"
                  @click="repairClickHandler(repair)">
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
            @keyup.enter="updateRepairHandler"
            @update:model-value="repairChangeHandler">
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
          @update:model-value="repairChangeHandler">
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
          @update:model-value="repairChangeHandler"/>
      </q-card-section>

      <q-card-section class="flex justify-between">

        <q-checkbox
          size="md"
          v-model="selectedRepair.done"
          label="Udført"
          color="accent"
          @update:model-value="toggleRepair"/>
        <q-btn
          v-if="hasUnsavedChanges"
          size="md"
          class="bg-secondary"
          @click="updateRepairHandler">
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
          @click="deleteRepairHandler(selectedRepair.id)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <notification-banner ref="notificationBanner"></notification-banner>
</template>

<script>
import { onMounted, ref } from "vue"
import { getUserAndRouteFrontpageIfNotFound } from "src/service/authentication"
import { getReadableTimestamp, hasInputChanged, toggleDialog } from "src/service/utility";
import { readAllUsersByHouseId, readUserById } from "src/api/user";
import NotificationBanner from "components/notificationBanner.vue";
import {
  createRepair,
  deleteRepairById,
  readAllRepairsByHouseId,
  readRepairById,
  updateRepairById
} from "src/api/repair";
const nobody = {name:"[Ingen]", id: "[Ingen]"}

export default {
  name: "repairPage",
  components: { NotificationBanner },
  setup () {
    // General stuff
    const notificationBanner = ref()
    const user = ref()
    const users = ref([])
    const allRepairs = ref([])
    const doneRepairs = ref([])
    const notDoneRepairs = ref([])

    // Repair stuff
    const repairName = ref("")
    const description = ref("")
    const responsibleSelector = ref()

    // Dialog stuff
    const hasUnsavedChanges = ref()
    const responsible = ref()
    const selectedRepair = ref()
    const selectedRepairResponsibleSelector = ref()
    const viewRepair = ref({
      name: '',
      description: '',
      responsibleId: ''
    })
    const dialogs = ref({
      repair: false,
      confirmRepairDeletion: false
    })

    const repairClickHandler = async (data) => {
      selectedRepair.value = data
      viewRepair.value.name = data.name
      viewRepair.value.description = data.description
      viewRepair.value.responsibleId = data.responsibleId
      if(data.responsibleId !== ""){
        responsible.value = await readUserById(data.responsibleId)
        if(!responsible.value.name){
          // If user has been deleted
          responsible.value = nobody
        }
      } else{
        responsible.value = nobody
      }
      selectedRepairResponsibleSelector.value = responsible.value
      hasUnsavedChanges.value = false
      toggleDialog(dialogs.value, 'repair')
    }

    const repairChangeHandler = async () => {
      const input = [
        [viewRepair.value.name, selectedRepair.value.name],
        [viewRepair.value.description, selectedRepair.value.description],
        [viewRepair.value.responsibleId, selectedRepair.value.responsibleId],
        [selectedRepairResponsibleSelector.value.id,responsible.value.id]
      ]
      hasUnsavedChanges.value = hasInputChanged(input)
    }

    const updateRepairHandler = async () => {
      if (viewRepair.value.name.trim().length === 0) {
        notificationBanner.value.displayNotification("Opgaven mangler en titel", "error")
        return
      }
      selectedRepair.value.name = viewRepair.value.name
      selectedRepair.value.description = viewRepair.value.description
      selectedRepair.value.responsibleId = selectedRepairResponsibleSelector.value.id
      await updateRepair(true)
    }

    const updateRepair = async (closePopup) => {
      await updateRepairById(selectedRepair.value)
      const index = allRepairs.value.findIndex(repair => repair.id === selectedRepair.value.id);
      if (index !== -1) {
        allRepairs.value[index] = selectedRepair.value;
      }
      if(closePopup){
        notificationBanner.value.displayNotification("Opgave opdateret", "success")
      }else{
        const bannerText = selectedRepair.value.done ? "Opgave færdigmeldt" : "Opgave tilbagekaldt"
        notificationBanner.value.displayNotification(bannerText, "success")
      }
      hasUnsavedChanges.value = false
      updateRepairLists()
      toggleDialog(dialogs.value, 'repair')
    }

    const submitRepair = async () => {
      if (repairName.value.trim().length === 0) {
        notificationBanner.value.displayNotification("Opgaven mangler en titel", "error")
        return
      }

      const newRepair = {
        houseId: user.value.houseId,
        userId: user.value.id,
        name: repairName.value,
        description: description.value,
        responsibleId: responsibleSelector.value.id,
        finished: "",
        done: false
      }
      const newRepairId = await createRepair(newRepair)
      if(newRepairId){
        allRepairs.value.push(await readRepairById(newRepairId))
        notificationBanner.value.displayNotification("Ny Opgave oprettet", "success")
        repairName.value = ""
        description.value = ""
      }
      updateRepairLists()
    }

    const deleteRepairHandler = async (id) => {
      await deleteRepairById(id)
      allRepairs.value.splice(allRepairs.value.findIndex(repair => repair.id === id), 1)
      notificationBanner.value.displayNotification("Opgave slettet", "success")
      updateRepairLists()
    }

    const toggleRepair = async () => {
      selectedRepair.value.finished = selectedRepair.value.done ? getReadableTimestamp() : ""
      await updateRepair(false)
    }

    const updateRepairLists = () => {
      doneRepairs.value = allRepairs.value.filter(repair => repair.done);;
      doneRepairs.value.sort((a, b) => a.finished.localeCompare(b.finished));
      notDoneRepairs.value = allRepairs.value.filter(repair => !repair.done);
      notDoneRepairs.value.sort((a, b) => a.created.localeCompare(b.created));
    }

    const scrollAreaHeight = (isDone) => {
      const style = {}
      let listLength;
      if(!isDone){
        listLength = doneRepairs.value.length
      }else{
        listLength = notDoneRepairs.value.length
      }
      style.maxHeight = (6* 50) + "px"
      style.height =  (listLength* 50) + "px"
      return style
    }

    const onPageLoad = async () => {
      user.value = await getUserAndRouteFrontpageIfNotFound()
      users.value = await readAllUsersByHouseId(user.value.houseId)
      users.value.push(nobody)
      responsibleSelector.value = nobody
      allRepairs.value = await readAllRepairsByHouseId(user.value.houseId)
      updateRepairLists()
    }

    onMounted(() => {
      onPageLoad()
    })

    return {
      // General
      notificationBanner,
      users,
      doneRepairs,
      notDoneRepairs,

      // Repair stuff
      repairName,
      description,
      responsibleSelector,
      submitRepair,
      scrollAreaHeight,

      // Dialog stuff
      repairClickHandler,
      dialogs,
      toggleDialog,
      viewRepair,
      selectedRepair,
      repairChangeHandler,
      deleteRepairHandler,
      hasUnsavedChanges,
      selectedRepairResponsibleSelector,
      toggleRepair,
      updateRepairHandler

    }
  }
}
</script>
<style scoped>

</style>
