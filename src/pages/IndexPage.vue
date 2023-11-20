<template>
  <q-page class="flex flex-center bg-primary">
    <!-- background for desktop -->
    <section class="desktop-only">
      <img
        src="~assets/ferieboligbooking-background-swedish-art.png"
        alt="FerieboligBooking visuel identitet"
      >
      <section class="q-pa-xl absolute-top">
        <section class="q-pa-xl row">
          <div class="col-12">
            <span class="text-h2">Velkommen til FerieboligBooking</span>
          </div>
          <div class="col-12 q-pt-lg">
            <q-btn
              class="q-px-xl"
              push size="lg"
              color="secondary"
              text-color="accent"
              icon="login"
              label="Log ind"
              @click="toggleDialog('login')"
            />
          </div>
          <div class="col-3 q-pt-xl">
            <div>
              <span class="text-body1">FerieboligBooking er for dig der lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec neque quis ipsum vulputate posuere. Vestibulum luctus congue pellentesque. In vel commodo nunc. Duis interdum mauris nibh, eget iaculis ante rutrum a. Vestibulum luctus congue pellentesque.</span>
            </div>
          </div>
        </section>
        <section class="fixed-bottom-right q-pa-md">
          <span class="text-h7 text-accent">FerieboligBooking, JohaJens 2023(™)</span>
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
        <section class="q-pa-md row">
          <div class="col-12">
            <span class="text-h4">Velkommen til FerieboligBooking</span>
          </div>
          <div class="col-12 q-pt-lg">
            <q-btn class="q-px-lg" push size="lg" color="secondary" text-color="accent" icon="login" label="Log ind" @click="toggleDialog('login')" />
          </div>
          <div class="col-12 q-pt-xl">
            <div>
              <span class="text-body1">FerieboligBooking er for dig der lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec neque quis ipsum vulputate posuere. Vestibulum luctus congue pellentesque. In vel commodo nunc. Duis interdum mauris nibh, eget iaculis ante rutrum a. Vestibulum luctus congue pellentesque.</span>
            </div>
          </div>
        </section>
        <section class="fixed-bottom-right q-pa-md">
          <span class="text-h7 text-accent">FerieboligBooking, JohaJens 2023(™)</span>
        </section>
      </section>
    </section>

    <!-- Login pop-up -->
    <q-dialog v-model="dialogs.login" position="right">
      <q-card class="bg-primary q-pa-md" style="width: 100vw; height: auto">
        <div class="row justify-around">
          <div class="col-6">
            <q-input class="bg-secondary q-mt-md" color="accent" outlined v-model="loginUserEmail" label="E-mail">
              <template v-slot:append>
                <q-icon name="mail" />
              </template>
            </q-input>
            <q-input class="bg-secondary q-mt-md" color="accent" outlined v-model="loginUserPassword" label="Password" :type="isPwd ? 'password' : 'text'">
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>

          <div class="col-6">
            <div class="q-ma-md">
              <span>Administratoren af en feriebolig skal oprette adgang til dig. Har du brug for selv at oprette en feriebolig til udlejning, kan du <a class="cursor-pointer" style="font-weight: bold;text-decoration: underline" @click="toggleDialog('createUserInfo')">oprette en ny feriebolig her</a>.</span>
            </div>
          </div>

          <div class="col-6 items-center">
            <q-btn
              class="q-px-xl q-mt-md"
              size="lg"
              color="secondary"
              text-color="accent"
              icon-right="login"
              label="Log ind"
              @click="handleLogin"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- Create user & house pop-up -->
    <q-dialog v-model="dialogs.createUserInfo" position="right">
      <q-card class="column justify-between bg-primary q-pa-md" style="width: 100vw; height: auto; min-height:55vh">
        <div class="col-10">
          <div class="text-h4 text-accent">Først, lidt om dig...</div>
          <q-input class="bg-secondary q-mt-md" color="accent" outlined v-model="createUserName" label="Navn">
            <template v-slot:append>
              <q-icon name="badge" />
            </template>
          </q-input>
          <q-input class="bg-secondary q-mt-md" color="accent" outlined v-model="createUserEmail" label="E-mail">
            <template v-slot:append>
              <q-icon name="mail" />
            </template>
          </q-input>
          <q-input class="bg-secondary q-mt-md" color="accent" outlined v-model="createPassword" label="Adgangskode" :type="isPwd ? 'password' : 'text'">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input class="bg-secondary q-mt-md" color="accent" outlined v-model="createPasswordRepeat" label="Gentag adgangskode" :type="isPwdRepeat ? 'password' : 'text'">
            <template v-slot:append>
              <q-icon
                :name="isPwdRepeat ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdRepeat = !isPwdRepeat"
              />
            </template>
          </q-input>
          </div>
        <div class="col-2">
          <q-btn
              class="q-pl-lg"
              size="lg"
              color="secondary"
              text-color="accent"
              icon-right="navigate_next"
              label="Fortsæt"
              @click="validateUserInfoAndProceed"
        />
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="dialogs.createHouseInfo" position="right">
      <q-card class="column justify-between bg-primary q-pa-md" style="width: 100vw; height: auto; min-height: 55vh">
        <div class="col-10">
          <div class="text-h4 text-accent">Lidt om ferieboligen</div>
          <q-input class="bg-secondary q-mt-md" color="accent" outlined v-model="createHouseName" label="Ferieboligens navn">
            <template v-slot:append>
              <q-icon name="cabin" />
            </template>
          </q-input>
          <q-input class="bg-secondary q-mt-md" color="accent" outlined v-model="createHouseDescription" autogrow label="Kort beskrivelse af ferieboligen">
            <template v-slot:append>
              <q-icon name="menu_book" />
            </template>
          </q-input>
          <div class="text-caption text-accent q-pl-xs">Her kan du skrive en kort beskrivelse af boligen eller historikken omkring det, f.eks. hvem der ejer det, hvornår det blev opført o.l</div>
        </div>
        <div class="col-2">
          <q-btn
            class="q-pl-lg"
            size="lg"
            color="secondary"
            text-color="accent"
            icon-right="check"
            label="Opret bruger & feriebolig"
            @click="validateHouseInfoAndCreateNewUser"
          />
        </div>
      </q-card>
    </q-dialog>

    <!-- Notification dialog -->
    <notification-banner ref="notificationBanner"></notification-banner>

  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import { createUser, verifyAndLoginUser} from "src/api/user.js"
import { createHouse } from "src/api/house.js"
import { isInputValid } from "src/service/utility";
import houseFrontpage from "pages/houseFrontpage.vue";
import NotificationBanner from "components/notificationBanner.vue";

export default defineComponent({
  name: 'IndexPage',
  components: { NotificationBanner },
  setup () {
    const router = useRouter()
    const isPwd = ref(true)
    const isPwdRepeat = ref(true)
    const notificationBanner = ref()
    const loginUserEmail = ref("")
    const loginUserPassword = ref("")
    const createUserName = ref("")
    const createUserEmail = ref("")
    const createPassword = ref("")
    const createPasswordRepeat = ref("")
    const createHouseName = ref("")
    const createHouseDescription = ref("")

    const dialogs = ref({
      login: false,
      createUserInfo: false,
      createHouseInfo: false,
    })

    const handleLogin = async () => {
      try {
        const email = loginUserEmail.value
        const password = loginUserPassword.value
        const [message, type] = await verifyAndLoginUser(email, password, localStorage)
        notificationBanner.value.displayNotification(message, type);
        onPageLoad()
      } catch (error) {
        notificationBanner.value.displayNotification(error.message, 'error')
      }
    }

    const toggleDialog = (dialogName) => {
      Object.keys(dialogs.value).forEach(key => {
        dialogs.value[key] = false;
      });
      dialogs.value[dialogName] = !dialogs.value[dialogName]
    }

    const validateUserInfoAndProceed = () => {
      const error = isInputValid([createUserName.value ,createUserEmail.value, createPassword.value, createPasswordRepeat.value])
      //TODO: Add matching password verification + check if email already exists
      if (error) {
        notificationBanner.value.displayNotification("Alle felter skal udfyldes", 'error')
      } else {
        toggleDialog('createHouseInfo')
      }
    }

    const validateHouseInfoAndCreateNewUser = async () => {
      const error = isInputValid(createHouseName.value);
      if (error) {
        notificationBanner.value.displayNotification("Ferieboligen skal have et navn", 'error')
        return
      }

      try {
        const newHouse = {
          name: createHouseName.value,
          description: createHouseDescription.value
        }
        const houseId = await createHouse(newHouse)

        const newUser = {
          name: createUserName.value,
          email: createUserEmail.value,
          password: createPassword.value,
          houseId: houseId,
          isAdmin: true
        }
        await createUser(newUser)
        toggleDialog('createHouseInfo')
        notificationBanner.value.displayNotification("Succes! Brugeren og ferieboligen blev oprettet", "notification")
        //TODO: Add automatic login and closing of login dialog
      } catch (e) {
        notificationBanner.value.displayNotification(e.message, 'error');
      }
    }

    const onPageLoad = () => {
      if (localStorage.getItem('userId')){
        setTimeout(async () => {

          await router.push('houseFrontpage')
          window.location.reload()
        },1000)
      }
    }

    onMounted(() => {
      onPageLoad()
    })

    // Expose only the necessary data and methods
    return {
      //Functionality
      validateUserInfoAndProceed,
      validateHouseInfoAndCreateNewUser,
      handleLogin,
      //Dialogs and components
      dialogs,
      toggleDialog,
      notificationBanner,
      //Form values
      isPwd,
      isPwdRepeat,
      loginUserEmail,
      loginUserPassword,
      createUserName,
      createUserEmail,
      createPassword,
      createPasswordRepeat,
      createHouseName,
      createHouseDescription,
    }
  }
})
</script>
