<template>
  <q-page class="flex flex-center">
    <!-- Desktop version -->
    <section class="desktop-only desktop-background">
      <section class="q-pa-xl">
        <section class="row">
          <div class="col-12">
            <span class="text-h2">
              Hej, {{ user?.name }}
            </span>
          </div>

          <div class="col-3">
            <q-input
              class="q-mt-xl bg-secondary"
              color="accent"
              outlined
              v-model="name"
              label="Navn"
              @update:model-value="inputChange"
              @keyup.enter="submitChangeData">
            </q-input>

            <q-input
              class="q-mt-xl bg-secondary"
              color="accent"
              outlined
              v-model="email"
              label="Email"
              @update:model-value="inputChange"
              @keyup.enter="submitChangeData">
            </q-input>

            <div class="q-mt-xl">
              <q-input outlined v-model="password" label="Password" :disable="true" />
              <q-tooltip class="bg-warning text-black" :offset="[0, -40]">Password kan ikke ændres</q-tooltip>
            </div>

            <div class="q-mt-xl">
              <q-btn
                class="bg-secondary text-accent q-py-sm"
                style="width: 100%"
                no-caps
              >
                <div class="row justify-between no-wrap" style="width: 100%">
                  <span class="col-6 text-body1 flex justify-start q-my-xs">
                    Skift din farve
                  </span>
                  <div
                    class="col-4 flex justify-center shadow-2 q-my-xs"
                    :style="{backgroundColor: color.hexValue, width: '30%', borderRadius:'5px'}">
                  </div>
                  <q-icon class="col-2" name="chevron_right" size="2em" style="width: max-content;"/>
                </div>
                <q-menu
                  anchor="bottom right"
                  self="bottom left"
                  class="bg-secondary flex flex-center q-pb-md"
                  max-width="30vw"
                >
                  <div class="text-h5 text-accent flex flex-center q-pa-md" style="width: 100%">Vælg farve</div>
                  <q-btn
                    class="q-ma-xs text-white"
                    v-for="color in allColorObjects"
                    :key="color.id"
                    :style="{backgroundColor: color.hexValue}"
                    :icon="!availableColorObjects.some(availableColor => availableColor.id === color.id) ? 'lock' : ''"
                    :disable="!availableColorObjects.some(availableColor => availableColor.id === color.id)"
                    @click="colorClickHandler(color)"
                    v-close-popup>
                    <q-tooltip>
                      {{color.name}}
                    </q-tooltip>
                  </q-btn>
                </q-menu>
              </q-btn>
            </div>

            <div class="relative-position">
              <q-btn
                v-if="hasUnsavedChanges"
                size="md"
                class="bg-secondary absolute-center q-mt-xl"
                @click="submitChangeData"
              >Opdater</q-btn>
            </div>
          </div>
        </section>
      </section>
    </section>

    <!-- Mobile Version -->
    <section class="mobile-only mobile-background">
      <section class="q-pa-md q-pt-xl absolute-top">
        <section class="row">
          <div class="col-12">
            <span class="text-h6">Hej, {{ user?.name }}</span>
          </div>

          <div class="col-12">
            <q-input
              class="bg-secondary text-accent q-mt-xl"
              outlined
              v-model="name"
              label="Navn"
              @update:model-value="inputChange">
              <template v-slot:append>
                <q-icon name="edit" />
              </template>
            </q-input>

            <q-input
              class="bg-secondary text-accent q-mt-xl"
              outlined
              v-model="email"
              label="Email"
              @update:model-value="inputChange">
              <template v-slot:append>
                <q-icon name="edit" />
              </template>
            </q-input>

            <div class="q-mt-xl">
              <q-input outlined v-model="password" label="Password" :disable="true" />
              <q-tooltip class="bg-warning text-black" :offset="[0, -40]">
                Password kan ikke ændres
              </q-tooltip>
            </div>

            <div class="q-mt-xl">
              <q-btn
                class="bg-secondary text-accent q-py-sm"
                style="width: 100%"
                no-caps
              >
                <div class="row justify-between no-wrap" style="width: 100%">
                  <span class="col-6 text-body1 flex justify-start q-my-xs">Skift din farve</span>
                  <div class="col-4 flex justify-center shadow-2 q-my-xs" :style="{backgroundColor: color.hexValue, width: '30%', borderRadius:'5px'}"></div>
                  <q-icon class="col-2" name="chevron_right" size="2em" style="width: max-content;"/>
                </div>
                <q-menu
                  class="bg-secondary flex flex-center q-pb-md"
                  fit
                  max-width="90%"
                >
                  <div class="text-h5 text-accent flex flex-center q-pa-md" style="width: 100%">Vælg farve</div>
                  <q-btn
                    class="q-ma-xs text-white"
                    v-for="color in allColorObjects"
                    :key="color.id"
                    :style="{backgroundColor: color.hexValue, maxWidth: '20%'}"
                    :icon="!availableColorObjects.some(availableColor => availableColor.id === color.id) ? 'lock' : ''"
                    :disable="!availableColorObjects.some(availableColor => availableColor.id === color.id)"
                    @click="colorClickHandler(color)"
                    v-close-popup>
                    <q-tooltip>{{color.name}}</q-tooltip>
                  </q-btn>
                </q-menu>
              </q-btn>
            </div>

            <div class="relative-position">
              <q-btn
                v-if="hasUnsavedChanges"
                size="md"
                class="bg-secondary absolute-center q-mt-xl"
                @click="submitChangeData">
                Opdater
              </q-btn>
            </div>
          </div>
        </section>
      </section>
    </section>
  </q-page>
  <notification-banner ref="notificationBanner"></notification-banner>
</template>

<script>
import { onMounted, ref } from "vue"
import { getUserAndRouteFrontpageIfNotFound } from "src/service/authentication"
import { readAllUsers, updateUserById } from "src/api/user"
import { userDataValid, getStringProperCased, hasInputChanged } from "src/service/utility"
import { readAllColors, readColorById } from "src/api/color";
import NotificationBanner from "components/notificationBanner.vue"

export default {
  name: "profilePage",
  components: { NotificationBanner },
  setup() {
    const user = ref()
    const name = ref("")
    const email = ref("")
    const password = ref("")
    //color stuff
    const color = ref("")
    const availableColorObjects = ref([])
    const allColorObjects = ref([])

    const hasUnsavedChanges = ref(false)
    const notificationBanner = ref()

    const submitChangeData = async () => {
      if(!hasUnsavedChanges.value){
        return
      }
      const data = await userDataValid([email.value, name.value], user.value.email)
      if (data.validInfo){
        await updateUser()
        data.notificationMessage = "Bruger opdateret"
      }
      notificationBanner.value.displayNotification(data.notificationMessage, data.type)
    }

    async function updateUser() {
      user.value.name = getStringProperCased(name.value, true)
      user.value.email = email.value
      user.value.colorId = color.value.id
      await updateUserById(user.value)
      hasUnsavedChanges.value = false
    }

    const inputChange = () =>{
      const inputs = [
        [user.value.name, name.value],
        [user.value.email, email.value],
        [user.value.colorId, color.value.id]
      ]
      hasUnsavedChanges.value = hasInputChanged(inputs)
    }

    const getAvailableColorObjects = async () => {
      const colorsTakenById = await readAllUsers().then(users => users.map(user => user.colorId))

      const colorsAvailable = await readAllColors()
        .then(colors => colors
          .filter(color => !colorsTakenById.includes(color.id))
          .sort((a, b) => a.name.localeCompare(b.name)))
      return colorsAvailable
    }

    const getAllColorObjects = async () => {
      const allColorObjects = await readAllColors()
        .then(colors => colors
          .sort((a, b) => a.name.localeCompare(b.name)))

      return allColorObjects
    }

    const colorClickHandler = (colorClicked) => {
      availableColorObjects.value[availableColorObjects.value.findIndex(colorObject => colorObject.id === colorClicked.id)] = color.value //Fjern fra tilgængelige farver
      color.value = colorClicked
      inputChange()
    }

    const onPageLoad = async () => {
      user.value = await getUserAndRouteFrontpageIfNotFound()
      name.value = user.value.name
      email.value = user.value.email
      color.value = await readColorById(user.value.colorId)
      password.value = user.value.password
      allColorObjects.value = await getAllColorObjects()
      availableColorObjects.value = await getAvailableColorObjects()
    }

    onMounted(() => {
      onPageLoad()
    })

    return {
      user,
      name,
      email,
      password,
      hasUnsavedChanges,
      submitChangeData,
      inputChange,
      notificationBanner,

      //color stuff!
      color,
      allColorObjects,
      availableColorObjects,
      colorClickHandler,
    }
  },
}
</script>
