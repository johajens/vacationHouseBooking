<template>

  <!-- background for desktop -->
  <q-page class="flex flex-center bg-primary">
    <section class="desktop-only">
      <img
        src="~assets/ferieboligbooking-background-swedish-art.png"
        alt="FerieboligBooking visuel identitet"
      />
      <section class="q-pa-xl absolute-top">
        <section class="row">
          <div class="col-12">
            <span class="text-h2">Hej, {{ user?.name }}</span>
          </div>
          <div class="col-3">
            <q-input
              class="q-mt-xl"
              color="accent"
              outlined
              v-model="name"
              label="Navn"
              standout="bg-secondary text-accent"
              @update:model-value="inputChange()">
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
              @update:model-value="inputChange()">
              <template v-slot:append>
                <q-icon name="edit" />
              </template>
            </q-input>
            <div class="text-negative q-mt-xs text-weight-bold">{{ errorMessage }}</div>

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

    <!-- background for mobile -->
    <section class="mobile-only">
      <div style="max-width: 100vw;overflow: hidden">
        <img
          src="~assets/ferieboligbooking-background-m-swedish-art.png"
          style="object-fit: cover; object-position: 100% 0;"
          alt="FerieboligBooking visuel identitet"
        >
      </div>
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
              @update:model-value="inputChange()">
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
              @update:model-value="inputChange()">
              <template v-slot:append>
                <q-icon name="edit" />
              </template>
            </q-input>
            <div class="text-negative q-mt-xs text-weight-bold">{{ errorMessage }}</div>

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
        <section class="fixed-bottom-right q-pa-md">
          <span class="text-h7 text-accent">FerieboligBooking, JohaJens 2023(™)</span>
        </section>
      </section>
    </section>
  </q-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { getUser } from "src/service/authentication";
import { readAllUsers, updateUserById } from "src/api/user";
import {isEmailInUse} from "src/service/utility";

export default {
  name: "profilePage",
  setup() {
    const user = ref();
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const hasUnsavedChanges = ref(false);
    const errorMessage = ref("");

    const submitChangeData = async () => {
      if (user.value.email !== email.value) {
        if (await isEmailInUse(email.value)) {
          //TODO: Add error handling
        }else{
          await updateUser()
        }
      } else {
        await updateUser()
      }
    };

    async function updateUser() {
      errorMessage.value = "";
      user.value.name = name.value;
      user.value.email = email.value;
      await updateUserById(user.value);
      hasUnsavedChanges.value = false
    }

    function inputChange(){
      errorMessage.value = "";
      if(user.value.name === name.value && user.value.email === email.value){
        hasUnsavedChanges.value = false
      }else{
        hasUnsavedChanges.value = true
      }
    }

    const onPageLoad = async () => {
      user.value = await getUser();
      user.value = await getUser();
      name.value = user.value.name;
      email.value = user.value.email;
      password.value = user.value.password;
    };

    onMounted(() => {
      onPageLoad();
    });

    return {
      user,
      name,
      email,
      password,
      hasUnsavedChanges,
      submitChangeData,
      inputChange,
      errorMessage
    };
  },
};
</script>

<style scoped></style>
