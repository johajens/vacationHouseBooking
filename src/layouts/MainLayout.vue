<template>
  <q-layout view="hHh lpR fFf" @click="handleBodyClick">

    <q-header elevated class="bg-secondary text-accent">
      <q-toolbar>
<!--        insert this into q-btn: v-if="userId"-->
        <q-btn
          class="text-h5"
          dense
          flat
          round
          icon="menu"
          @click.stop="toggleLeftDrawer"
          />
        <q-toolbar-title>
          <section class="desktop-only">
            <div class="float-right q-ma-sm">
              <span class="text-h4">Feriebolig </span>
              <span class="text-h6">Booking</span>
            </div>
          </section>
          <section class="mobile-only">
            <div class="float-right q-ma-sm">
              <span class="text-h6">Feriebolig </span>
              <span style="font-size: 12px;">Booking</span>
            </div>
          </section>
        </q-toolbar-title>
        <q-btn-dropdown
          dense
          flat
          round
          icon="account_circle"
          class="float-right q-ma-sm"
          size="20px">
          <q-list>
            <q-item
              class="q-ma-sm text-weight-bold text-accent"
              v-for="(item, index) in profileDropdown"
              :key="index"
            >
              <q-btn @click="() => handleDropdownClick(item)" flat round dense>
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
              </q-btn>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      class="bg-secondary"
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      overlay
      elevated
      behavior="desktop"
      :width="250"
      >
      <q-scroll-area class="fit">
        <q-item
          class="text-accent text-weight-bold q-ma-sm"
          v-for="(link, index) in leftSideLinks"
          :key="index"
          :to="link.to"
          @click="handleLeftDrawerItemClick(link.to)">
          <q-item-section>{{ link.label }}</q-item-section>
        </q-item>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { onMounted, ref } from "vue";
import{ readUserById } from "src/api/user";
import { useRouter } from 'vue-router'

export default {
  setup () {
    const router = useRouter()
    const leftDrawerOpen = ref(false)
    const userId = ref(localStorage.getItem("userId"))
    const profileDropdown = ref([])
    let leftSideLinks = ref([
      {to: "/", label: "Forside anonym (Slettes)"},
      {to: "/houseFrontpage", label: "Forside"},
      {to: "/bookingPage", label: "Booking (Not implemented)"},
      {to: "/repairPage", label: "Reparation (Not implemented)"},
      {to: "/informationPage", label: "Information (Not implemented)"},
      {to: "/documentPage", label: "Dokumenter (Not implemented)"},
      {to: "/galleryPage", label: "Galleri (Not implemented)"},
    ])

    // Handling two different types of clicks. Both links and functionality
    const handleDropdownClick = (event) => {
      if(event.label === "Log ud"){
        localStorage.removeItem("userId")
        window.location.reload()
      }else if(event.label === "Log ind"){
        console.log("You have clicked 'Log ind' :D ")
        // TODO open log in
      }
      else{
        router.push(event.to)
      }
    }

    const handleLeftDrawerItemClick = (to) => {
      if (router.currentRoute.value.path === to) {
        leftDrawerOpen.value = false;
      }
    };

    //Open left drawer on click
    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    // Check if the click occurred outside the left drawer and close it if it did
    const handleBodyClick = (event) => {
      const leftDrawer = document.querySelector(".q-drawer--left")
      if (leftDrawer && !leftDrawer.contains(event.target)) {
        leftDrawerOpen.value = false
      }
    }

    // On page load, make both profile dropdown and left-drawer links as needed
    const onPageLoad = async () => {
      leftDrawerOpen.value = false;
      userId.value = localStorage.getItem("userId");
      if (userId.value !== null) {
        profileDropdown.value = [
          { to: "/profilePage", label: "Profil" },
          { to: "/", label: "Log ud" }
        ]
        const user = await readUserById(userId.value);
        if (user.isAdmin === true) {
          leftSideLinks.value.push({ to: "/administerUsersPage", label: "Administration" },);
        }
      } else {
        profileDropdown.value = [
          { to: "/", label: "Log ind" }
        ]
      }
    };

    // Add event listener when the component is mounted
    onMounted(() => {
      document.body.addEventListener("click", handleBodyClick);
      onPageLoad();
    })

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      leftSideLinks,
      handleBodyClick,
      profileDropdown,
      userId,
      handleDropdownClick,
      handleLeftDrawerItemClick
    }
  },
}
</script>
<style>
.q-btn-dropdown__arrow{
  display: none;
}
</style>
