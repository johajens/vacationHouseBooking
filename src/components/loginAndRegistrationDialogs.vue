<template>
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

  <!-- Create user pop-up -->
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

  <!-- Create house pop-up -->
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

  <notification-banner ref="notificationBanner"></notification-banner>
</template>

<script>
import { ref } from "vue"
import { createUser, verifyAndLoginUser } from "src/api/user"
import { isEmailInUse, isInputInvalid, getStringProperCased } from "src/service/utility"
import { createHouse } from "src/api/house"
import { useRouter } from "vue-router"
import NotificationBanner from "components/notificationBanner.vue"

export default {
  name: "loginAndRegistrationDialogs",
  components: { NotificationBanner },
  setup () {
    const router = useRouter()
    //Form values
    const isPwd = ref(true)
    const isPwdRepeat = ref(true)
    const loginUserEmail = ref("")
    const loginUserPassword = ref("")
    const createUserName = ref("")
    const createUserEmail = ref("")
    const createPassword = ref("")
    const createPasswordRepeat = ref("")
    const createHouseName = ref("")
    const createHouseDescription = ref("")
    //Dialogs and components
    const notificationBanner = ref()
    const dialogs = ref({
      login: false,
      createUserInfo: false,
      createHouseInfo: false,
    })


    const toggleDialog = (dialogName) => {
      Object.keys(dialogs.value).forEach(key => {
        if (key !== dialogName){
          dialogs.value[key] = false
        }
      })
      dialogs.value[dialogName] = !dialogs.value[dialogName]
    }

    const handleLogin = async () => {
      try {
        const email = loginUserEmail.value
        const password = loginUserPassword.value
        const [message, type] = await verifyAndLoginUser(email, password, localStorage)
        notificationBanner.value.displayNotification(message, type)
        if (localStorage.getItem('userId')){
          setTimeout(async () => {
            await router.push('houseFrontpage')

          },500)
        }
      } catch (error) {
        notificationBanner.value.displayNotification(error.message, 'error')
      }
    }

    const validateUserInfoAndProceed = async () => {
      const error = isInputInvalid([createUserName.value ,createUserEmail.value, createPassword.value, createPasswordRepeat.value])
      if (error) {
        notificationBanner.value.displayNotification("Alle felter skal udfyldes", 'error')
      } else if (createPassword.value !== createPasswordRepeat.value) {
        notificationBanner.value.displayNotification("De indtastede adgangskode stemmer ikke overens", 'error')
      } else if (await isEmailInUse(createUserEmail.value)) {
        notificationBanner.value.displayNotification("Den indtastede email-adresse er allerede i brug", 'error')
      } else {
        toggleDialog('createHouseInfo')
      }
    }

    const validateHouseInfoAndCreateNewUser = async () => {
      const error = isInputInvalid(createHouseName.value);
      if (error) {
        notificationBanner.value.displayNotification("Ferieboligen skal have et navn", 'error')
        return
      }

      try {
        const newHouse = {
          name: getStringProperCased(createHouseName.value, false),
          description: createHouseDescription.value
        }
        const houseId = await createHouse(newHouse)

        const newUser = {
          name: getStringProperCased(createUserName.value, true),
          email: createUserEmail.value,
          password: createPassword.value,
          houseId: houseId,
          isAdmin: true
        }
        localStorage.setItem("userId", await createUser(newUser))
        setTimeout(async () => {
          toggleDialog('createHouseInfo')
          await router.push('houseFrontpage')
        },1000)
        notificationBanner.value.displayNotification("Succes! Brugeren og ferieboligen blev oprettet.", "notification")
      } catch (e) {
        notificationBanner.value.displayNotification(e.message, 'error')
      }
    }

    return {
      //Functionality
      validateUserInfoAndProceed,
      validateHouseInfoAndCreateNewUser,
      handleLogin,
      toggleDialog,
      //Dialogs and components
      dialogs,
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
}
</script>

<style scoped>

</style>
