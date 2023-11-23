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
            <div class="relative-position">
              <q-btn
                v-if="hasUnsavedChanges"
                size="md"
                class="bg-secondary absolute-center q-mt-xl"
                @click="submitChangeData"
              >opdater</q-btn>
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
              class="q-mt-xl"
              color="accent"
              outlined
              v-model="name"
              label="Navn"
              standout="bg-secondary text-accent"
              @update:model-value="inputChange">
              <template v-slot:append>
                <q-icon name="edit" />
              </template>
            </q-input>

            <q-input
              class="q-mt-xl"
              color="accent"
              outlined
              v-model="email"
              label="Email"
              standout="bg-secondary text-accent"
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
import { updateUserById } from "src/api/user"
import { userDataValid, getStringProperCased } from "src/service/utility"
import NotificationBanner from "components/notificationBanner.vue"

export default {
  name: "profilePage",
  components: { NotificationBanner },
  setup() {
    const user = ref()
    const name = ref("")
    const email = ref("")
    const password = ref("")
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
      await updateUserById(user.value)
      hasUnsavedChanges.value = false
    }

    const inputChange = () =>{
      if(user.value.name === name.value && user.value.email === email.value){
        hasUnsavedChanges.value = false
      }else{
        hasUnsavedChanges.value = true
      }
    }

    const onPageLoad = async () => {
      user.value = await getUserAndRouteFrontpageIfNotFound()
      user.value = await getUserAndRouteFrontpageIfNotFound()
      name.value = user.value.name
      email.value = user.value.email
      password.value = user.value.password
    }

    onMounted(() => {
      onPageLoad();
    })

    return {
      user,
      name,
      email,
      password,
      hasUnsavedChanges,
      submitChangeData,
      inputChange,
      notificationBanner
    }
  },
}
</script>
