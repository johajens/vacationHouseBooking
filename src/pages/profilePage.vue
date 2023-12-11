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
              @update:model-value="checkForInputChange"
              @keyup.enter="clickUpdateUserHandler">
            </q-input>

            <q-input
              class="q-mt-xl bg-secondary"
              color="accent"
              outlined
              v-model="email"
              label="Email"
              @update:model-value="checkForInputChange"
              @keyup.enter="clickUpdateUserHandler">
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
                    @click="clickColorHandler(color)"
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
                @click="clickUpdateUserHandler"
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
              @update:model-value="checkForInputChange">
              <template v-slot:append>
                <q-icon name="edit" />
              </template>
            </q-input>

            <q-input
              class="bg-secondary text-accent q-mt-xl"
              outlined
              v-model="email"
              label="Email"
              @update:model-value="checkForInputChange">
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
                    @click="clickColorHandler(color)"
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
                @click="clickUpdateUserHandler">
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
import { ref } from "vue"
import { getUserAndRouteFrontpageIfNotFound } from "src/service/authentication"
import { readAllUsersByHouseId, updateUserById} from "src/api/user"
import { userDataValid, getStringProperCased, hasInputChanged } from "src/service/utility"
import { readAllColors, readColorById } from "src/api/color";
import NotificationBanner from "components/notificationBanner.vue"

export default {
  name: "profilePage",

  components: { NotificationBanner },

  data(){
    return{
      //Profile data
      user: ref(),
      name: ref(""),
      email: ref(""),
      password: ref(""),
      color: ref(""),

      //Color function data
      availableColorObjects: ref([]),
      allColorObjects: ref([]),

      //Update data
      hasUnsavedChanges: ref(false)
    }
  },

  methods:{
    async clickUpdateUserHandler(){
      if(!this.hasUnsavedChanges){
        return
      }
      const data = await userDataValid([this.email, this.name], this.user.email)
      if (data.validInfo){
        this.user.name = getStringProperCased(this.name, true)
        this.user.email = this.email
        this.user.colorId = this.color.id
        await updateUserById(this.user)
        this.hasUnsavedChanges = false
        data.notificationMessage = "Bruger opdateret"
      }
      this.notificationBanner.displayNotification(data.notificationMessage, data.type)
    },

    checkForInputChange(){
      const inputs = [
        [this.user.name, this.name],
        [this.user.email, this.email],
        [this.user.colorId, this.color.id]
      ]
      this.hasUnsavedChanges = hasInputChanged(inputs)
    },

    async getAvailableColorObjects(){
      const colorsTakenById = await readAllUsersByHouseId(this.user.houseId)
        .then(users => users
          .filter(user => user.colorId !== 'default')
          .map(user => user.colorId))

      const colorsAvailable = await readAllColors()
        .then(colors => colors
          .filter(color => !colorsTakenById.includes(color.id))
          .sort((a, b) => a.hexValue.localeCompare(b.hexValue)))
      return colorsAvailable
    },

    async getAllColorObjects(){
      const allColorObjects = await readAllColors()
        .then(colors => colors
          .sort((a, b) => a.hexValue.localeCompare(b.hexValue)))

      return allColorObjects
    },

    clickColorHandler(colorClicked){
      this.availableColorObjects[this.availableColorObjects.findIndex(colorObject => colorObject.id === colorClicked.id)] = this.color
      this.color = colorClicked
      this.checkForInputChange()
    }
  },

  async mounted(){
    this.user = await getUserAndRouteFrontpageIfNotFound()
    this.name = this.user.name
    this.email = this.user.email
    this.color = await readColorById(this.user.colorId)
    this.password = this.user.password
    this.allColorObjects = await this.getAllColorObjects()
    this.availableColorObjects = await this.getAvailableColorObjects()
    this.notificationBanner = this.$refs.notificationBanner
  },
}
</script>
