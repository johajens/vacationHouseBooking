<template>
  <q-page class="flex flex-center">
    <!-- background for desktop -->
    <section class="desktop-only desktop-background">
      <section class="q-pa-xl">
        <section class="q-pa-xl row">
          <div class="col-12">
            <span class="text-h2">
              Velkommen til FerieFiks
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
              @click="clickLoginHandler"/>

          </div>

          <div class="col-3 q-pt-xl">
            <div>
              <span class="text-body1">FerieFiks er for dig der der ejer en feriebolig sammen med nogle andre.<br>
                Her på siden er det muligt at fordele brugsret af huset i en smart kalender, dele vigtig information vedrørende boligen, og holde styr på fejl og mangler i og omkring huset.
                Du kan holde styr på hvem der kommer i dit hus og i hvilket tidsrum de skal være der.<br>
                Du kan invitere medejererne af dit huset til din personlige FerieFiks side, hvor i sammen kan holde styr på det hele.<br><br>

                <a class="cursor-pointer text-weight-bold" style="text-decoration: underline" @click="routeTerms">Læs vores terms inden du opretter en bolig her.</a>
              </span>
            </div>
          </div>
        </section>
      </section>
    </section>

    <!-- background for mobile -->
    <section class="mobile-only mobile-background">
      <section class="q-pa-md">
        <section class="q-pa-md row">
          <div class="col-12">
            <span class="text-h4">
              Velkommen til FerieFiks
            </span>
          </div>

          <div class="col-12 q-pt-lg">
            <q-btn class="q-px-lg" push size="lg" color="secondary" text-color="accent" icon="login" label="Log ind" @click="clickLoginHandler" />
          </div>

          <div class="col-12 q-pt-xl">
            <div>
              <span class="text-body1">
                FerieFiks er for dig der der ejer en feriebolig sammen med nogle andre.<br>
                Her på siden er det muligt at fordele brugsret af huset i en smart kalender, dele vigtig information vedrørende boligen, og holde styr på fejl og mangler i og omkring huset.
                Du kan holde styr på hvem der kommer i dit hus og i hvilket tidsrum de skal være der.<br>
                Du kan invitere medejererne af dit huset til din personlige FerieFiks side, hvor i sammen kan holde styr på det hele.<br><br>
                <a class="cursor-pointer text-weight-bold" style="text-decoration: underline" @click="routeTerms">Læs vores terms inden du opretter en bolig her.</a>

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
import { useRouter } from 'vue-router'
import houseFrontpage from "pages/houseFrontpage.vue"
import LoginAndRegistrationDialogs from "components/loginAndRegistrationDialogs.vue"

export default {
  name: 'IndexPage',

  components: {LoginAndRegistrationDialogs},

  data() {
    return {
      router: useRouter(),
    }
  },

  methods: {
    clickLoginHandler() {
      this.loginAndRegistrationDialogs.toggleDialog(this.loginAndRegistrationDialogs.dialogs, "login")
    },
    routeTerms(){
      this.router.push('termsPage')
    }
  },
  mounted() {
    this.loginAndRegistrationDialogs = this.$refs.loginAndRegistrationDialogs
    if (localStorage.getItem('userId')) {
      setTimeout(async () => {

        await this.router.push('houseFrontpage')
        window.location.reload()
      }, 1000)
    }
  }
}
</script>
