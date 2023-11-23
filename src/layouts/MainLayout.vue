<template>
  <q-layout view="hHh lpR fFf" @click="handleBodyClick">

    <!-- Header menu -->
    <q-header elevated class="bg-secondary text-accent">
      <q-toolbar>
        <q-btn
          v-if="user"
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
              <span style="font-size: 12px">Booking</span>
            </div>
          </section>
        </q-toolbar-title>
        <q-btn-dropdown
          dense
          flat
          round
          auto-close
          icon="account_circle"
          class="float-right q-ma-sm"
          size="20px"
          >
          <q-list class="bg-secondary">
            <q-item
              class="text-weight-bold text-accent q-pa-none column"
              v-for="(item, index) in profileDropdown"
              :key="index">
              <q-btn @click="() => handleDropdownClick(item)" flat dense class="q-px-xl q-py-md" style="width: 100%" no-caps>
                <q-item-section>
                  <q-item-label>
                    {{ item.label }}
                  </q-item-label>
                </q-item-section>
              </q-btn>
              <q-separator/>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <!-- Left menu -->
    <q-drawer
      class="bg-secondary"
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      elevated
      overlay
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
  <login-and-registration-dialogs ref="loginAndRegistrationDialogs"></login-and-registration-dialogs>
</template>

<script>
import { onMounted, ref } from "vue"
import{ getDropdownLinks, getLeftDrawerLinks } from "src/service/utility"
import{ readUserById } from "src/api/user"
import { onBeforeRouteUpdate, useRouter } from "vue-router"
import LoginAndRegistrationDialogs from "components/loginAndRegistrationDialogs.vue"

export default {
  components: { LoginAndRegistrationDialogs },
  setup () {
    const router = useRouter()
    const user = ref()
    // Dialogs
    const loginAndRegistrationDialogs = ref()
    // Navigation
    const leftDrawerOpen = ref(false)
    const profileDropdown = ref([])
    const leftSideLinks = ref([])

    // Handling two different types of clicks. Both links and functionality
    const handleDropdownClick = (event) => {
      if(event.label === "Log ud"){
        localStorage.removeItem("userId")
        window.location.reload()
      }else if(event.label === "Log ind"){
        loginAndRegistrationDialogs.value.toggleDialog("login")
      }
      else{
        router.push(event.to)
      }
    }

    // Close left drawer if click on page you are on
    const handleLeftDrawerItemClick = (to) => {
      if (router.currentRoute.value.path === to) {
        leftDrawerOpen.value = false
      }
    }

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
      leftDrawerOpen.value = false
      const userId = localStorage.getItem("userId")
      if (userId) {
        user.value = await readUserById(userId)
        if (user.value) {
          leftSideLinks.value = await getLeftDrawerLinks(user.value)
        }
      }
      profileDropdown.value = await getDropdownLinks(user.value)
    }

    // Add event listener when the component is mounted
    onMounted(() => {
      document.body.addEventListener("click", handleBodyClick)
      onPageLoad()
    })

    onBeforeRouteUpdate(() => {
      onPageLoad()
    })

    return {
      // General stuff
      user,
      loginAndRegistrationDialogs,
      // Left drawer stuff
      leftDrawerOpen,
      toggleLeftDrawer,
      handleLeftDrawerItemClick,
      leftSideLinks,
      // Dropdown stuff
      handleBodyClick,
      profileDropdown,
      handleDropdownClick
    }
  },
}
</script>

<style>
  .q-btn-dropdown__arrow{
    display: none
  }
  .q-header {
    z-index: 1000; /* Adjust the value as needed */
  }
  .q-drawer {
    z-index: 900; /* Adjust the value as needed */
  }
</style>
