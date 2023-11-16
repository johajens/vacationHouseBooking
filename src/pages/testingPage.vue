<template>
  <q-page class="flex flex-center bg-primary">
    <section class="desktop-only">
      <q-btn class="bg-secondary text-accent q-ma-md" label="set user storage" @click="setLocalStorageUser()" />
      <q-btn class="bg-secondary text-accent q-ma-md" label="Delete user storage" @click="deleteLocalStorageUser" />
    </section>
      <section class="mobile-only">
      <div style="max-width: 100vw;overflow: hidden">
        <img
          src="~assets/ferieboligbooking-background-m-swedish-art.png"
          style="object-fit: cover; object-position: 100% 0;"
          alt="FerieboligBooking visuel identitet"
        >
      </div>
      <section class="q-pa-md q-pt-xl absolute-top">
        <section class="q-pa-sm row">
          <q-btn class="bg-secondary text-accent q-ma-md" label="set user storage" @click="setLocalStorageUser()" />
          <q-btn class="bg-secondary text-accent q-ma-md" label="Delete user storage" @click="deleteLocalStorageUser" />
        </section>
        <section class="fixed-bottom-right q-pa-md">
          <span class="text-h7 text-accent">FerieboligBooking, JohaJens 2023(™)</span>
        </section>
      </section>
    </section>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { createHouse, readAllHouses, readHouseById, updateHouseById, deleteHouseById} from 'src/api/house.js';

import { useRouter } from "vue-router";
export default defineComponent({
  name: 'IndexPage',
  setup() {
    const router = useRouter();

    const setLocalStorageUser = async () => {
      // Fetch houses and update the items list
      localStorage.setItem("userId", "k8rHraDvYKVmY040jlwY")
      await router.push("/houseFrontpage");
      await window.location.reload();
    };
    const deleteLocalStorageUser = async () => {
      localStorage.removeItem("userId")
      await router.push("/houseFrontpage");
      await window.location.reload();
    };

    return {
      setLocalStorageUser,
      deleteLocalStorageUser
    };
  },
})
</script>
