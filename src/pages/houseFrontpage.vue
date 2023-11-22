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
              <span class="text-h5 q-pt-xs">Velkommen til</span>
              <q-input
                :style="{ width: `${houseName.length*15+20}px`}"
                v-model="houseName"
                color="accent"
                dense
                class="text-h5 q-pl-sm"
                @update:model-value="inputChange()">
              </q-input>
            </div>
            <span v-else class="text-h5">Velkommen til {{ house?.name }}</span>
          </div>

          <div class="col-4 q-pt-lg">
            <q-input v-if="user?.isAdmin"
                     v-model="houseDescription"
                     color="accent"
                     dense
                     autogrow
                     class="text-body1"
                     @update:model-value="inputChange">
            </q-input>
            <span v-else class="text-body1">{{ house?.description }}</span>
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

    <!-- Mobile version -->
    <section class="mobile-only mobile-background">
      <section class="q-pa-md q-pt-xl">
        <section class="q-pa-sm row">
          <div class="col-12">
            <span class="text-h6">Hej, {{ user?.name }}</span>
          </div>

          <div class="row col-12 q-pt-lg">
            <div v-if="user?.isAdmin" class="row">
              <span class="text-h6 text-weight-regular q-pt-xs">Velkommen til</span>
              <q-input
                :style="{ width: `${houseName.length*12+20}px`}"
                v-model="houseName"
                color="accent"
                dense
                class="text-h6 q-pl-sm"
                @update:model-value="inputChange"
              >
              </q-input>
            </div>
            <span v-else class="text-h6 text-weight-regular">Velkommen til {{ house?.name }}</span>
          </div>

          <div class="col-12 q-pt-lg">
            <q-input
              v-if="user?.isAdmin"
              v-model="houseDescription"
              color="accent"
              dense
              autogrow
              class="text-body1"
              @update:model-value="inputChange"
            >
            </q-input>
            <span v-else class="text-body1">{{ house?.description }}</span>
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
import { onMounted, ref } from "vue";
import { readHouseById, updateHouseById } from "src/api/house"
import { getUser } from "src/service/authentication"

export default {
  name: "houseFrontpage",
  setup () {
    const user = ref()
    const house = ref()
    const houseDescription = ref("")
    const houseName = ref("")
    const hasUnsavedChanges = ref(false)

    const updateHouse = async () => {
      const updatedHouse = {
        id: user.value.houseId,
        name: houseName.value,
        description: houseDescription.value
      }
      console.log(updatedHouse)
      await updateHouseById(updatedHouse)
      hasUnsavedChanges.value = false
      //TODO: Toggle information dialog
    }

    const inputChange = () => {
      hasUnsavedChanges.value = !(house.value.name === houseName.value && house.value.description === houseDescription.value)
    }

    const onPageLoad = async () => {
      user.value = await getUser();
      house.value = await readHouseById(user.value.houseId);
      if(!house.value.description.trim().endsWith(".")){
        house.value.description = house.value.description.trim()+"."
      }
      houseDescription.value = house.value.description
      houseName.value = house.value.name
    }

    onMounted(() => {
      onPageLoad()
    })

    return {
      user,
      house,
      houseDescription,
      houseName,
      inputChange,
      updateHouse,
      hasUnsavedChanges
    }
  }
}
</script>
