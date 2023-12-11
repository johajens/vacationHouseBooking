<template>
  <q-page class="flex">
    <!-- Desktop version -->
    <section class="desktop-only desktop-background">
      <section class="q-pa-xl">
        <section class="q-pa-xl row">
          <div class="col-12">
            <span class="text-h2">Hej, {{ user?.name }}</span>
          </div>

          <div class="col-12 q-pt-lg">
            <div v-if="user?.isAdmin" class="row">
              <span class="text-h5 q-pt-xs">
                Velkommen til
              </span>
              <q-input
                :style="{ width: `${houseName.length*15+20}px`}"
                v-model="houseName"
                color="accent"
                dense
                class="text-h5 q-pl-sm"
                @update:model-value="checkForInputChange()"
              @keydown.enter="updateHouse">
              </q-input>
            </div>
            <span v-else class="text-h5">
              Velkommen til {{ house?.name }}
            </span>
          </div>

          <div class="col-4 q-pt-lg">
            <q-input
              v-if="user?.isAdmin"
              v-model="houseDescription"
              color="accent"
              dense
              autogrow
              class="text-body1"
              @update:model-value="checkForInputChange">
            </q-input>
            <span v-else class="text-body1">
              {{ house?.description }}
            </span>
          </div>

          <div class="col-12 q-pt-lg">
            <q-btn
              v-if="hasUnsavedChanges"
              size="md"
              class="bg-secondary"
              @click="updateHouse">
              Opdater
            </q-btn>
          </div>
        </section>
      </section>
    </section>

    <!-- Mobile version -->
    <section class="mobile-only mobile-background">
      <section class="q-pa-md q-pt-xl">
        <section class="q-pa-sm row">
          <div class="col-12">
            <span class="text-h6">Hej, {{ user?.name }}</span>
          </div>

          <div class="row col-12 q-pt-lg">
            <div v-if="user?.isAdmin" class="row">
              <span class="text-h6 text-weight-regular q-pt-xs">
                Velkommen til
              </span>
              <q-input
                :style="{ width: `${houseName.length*12+20}px`}"
                v-model="houseName"
                color="accent"
                dense
                class="text-h6 q-pl-sm"
                @update:model-value="checkForInputChange">
              </q-input>
            </div>
            <span v-else class="text-h6 text-weight-regular">
              Velkommen til {{ house?.name }}
            </span>
          </div>

          <div class="col-12 q-pt-lg">
            <q-input
              v-if="user?.isAdmin"
              v-model="houseDescription"
              color="accent"
              dense
              autogrow
              class="text-body1"
              @update:model-value="checkForInputChange">
            </q-input>
            <span v-else class="text-body1">
              {{ house?.description }}
            </span>
          </div>

          <div class="col-12 q-pt-lg">
            <q-btn
              v-if="hasUnsavedChanges"
              size="md"
              class="bg-secondary"
              @click="updateHouse">
              opdater
            </q-btn>
          </div>
        </section>
      </section>
    </section>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { readHouseById, updateHouseById } from "src/api/house"
import { getUserAndRouteFrontpageIfNotFound } from "src/service/authentication"
import { getStringProperCased, hasInputChanged } from "src/service/utility"

export default {
  name: "houseFrontpage",

  data () {
    return {
      user: ref(),
      house: ref(),
      houseDescription: ref(),
      houseName: ref(),
      hasUnsavedChanges: ref(false)
    }
  },

  methods:{
    async updateHouse(){
      this.houseName = getStringProperCased(this.houseName, false)
      const updatedHouse = {
        id: this.user.houseId,
        name: this.houseName,
        description: this.houseDescription
      }
      await updateHouseById(updatedHouse)
      this.hasUnsavedChanges = false
      //TODO: Toggle information dialog
    },

    checkForInputChange(){
      const input = [
        [this.house.name, this.houseName],
        [this.house.description, this.houseDescription]
      ]
      this.hasUnsavedChanges = hasInputChanged(input)
    }
  },

  async mounted() {
    this.user = await getUserAndRouteFrontpageIfNotFound();
    this.house = await readHouseById(this.user.houseId);
    if(!this.house.description.trim().endsWith(".")){
      this.house.description = this.house.description.trim()+"."
    }
    this.houseDescription = this.house.description
    this.houseName = this.house.name
  }
}
</script>
