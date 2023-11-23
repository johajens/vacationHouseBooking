<template>
  <q-page class="flex flex-center">
    <!-- background for desktop -->
    <section class="desktop-only desktop-background">
      <section class="q-pa-xl">
        <section class="q-pa-xl row">
          <div class="col-12">
            <span class="text-h2">
              Velkommen til FerieboligBooking
            </span>
          </div>

          <div class="col-12 q-pt-lg">
            <q-btn
              class="q-px-xl"
              push size="lg"
              color="secondary"
              text-color="accent"
              icon="login"
              label="Log ind"
              @click="toggleLogin"/>

          </div>

          <div class="col-3 q-pt-xl">
            <div>
              <span class="text-body1">FerieboligBooking er for dig der der ejer en feriebolig sammen med nogle andre.<br>
                Her på siden er det muligt at fordele brugsret af huset i en smart kalender, dele vigtig information vedrørende boligen, og holde styr på fejl og mangler i og omkring huset.
                Du kan holde styr på hvem der kommer i dit hus og i hvilket tidsrum de skal være der.<br>
                Du kan invitere medejererne af dit huset til din personlige ferieboligside, hvor i sammen kan holde styr på det hele.<br><br>
                Det er nemt og gratis at benytte siden (for nu), så tøv ikke. Opret en bolig i dag!
              </span>
            </div>
          </div>
        </section>
      </section>
    </section>

    <!-- background for mobile -->
    <section class="mobile-only mobile-background">
      <section class="q-pa-md q-pt-xl">
        <section class="q-pa-md row">
          <div class="col-12">
            <span class="text-h4">
              Velkommen til FerieboligBooking
            </span>
          </div>

          <div class="col-12 q-pt-lg">
            <q-btn class="q-px-lg" push size="lg" color="secondary" text-color="accent" icon="login" label="Log ind" @click="toggleLogin" />
          </div>

          <div class="col-12 q-pt-xl">
            <div>
              <span class="text-body1">
                FerieboligBooking er for dig der der ejer en feriebolig sammen med nogle andre.<br>
                Her på siden er det muligt at fordele brugsret af huset i en smart kalender, dele vigtig information vedrørende boligen, og holde styr på fejl og mangler i og omkring huset.
                Du kan holde styr på hvem der kommer i dit hus og i hvilket tidsrum de skal være der.<br>
                Du kan invitere medejererne af dit huset til din personlige ferieboligside, hvor i sammen kan holde styr på det hele.<br><br>
                Det er nemt og gratis at benytte siden (for nu), så tøv ikke. Opret en bolig i dag!
              </span>
            </div>
          </div>
        </section>
      </section>
    </section>

    <login-and-registration-dialogs ref="loginAndRegistrationDialogs"></login-and-registration-dialogs>

  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import houseFrontpage from "pages/houseFrontpage.vue"
import LoginAndRegistrationDialogs from "components/loginAndRegistrationDialogs.vue"

export default defineComponent({
  name: 'IndexPage',
  components: { LoginAndRegistrationDialogs },
  setup () {
    const router = useRouter()
    const loginAndRegistrationDialogs = ref()

    const toggleLogin = () => {
      loginAndRegistrationDialogs.value.toggleDialog("login")
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

    return {
      loginAndRegistrationDialogs,
      toggleLogin
    }
  }
})
</script>
