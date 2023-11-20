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
              @click="toggleLogin"
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
            <q-btn class="q-px-lg" push size="lg" color="secondary" text-color="accent" icon="login" label="Log ind" @click="toggleLogin" />
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


    <login-and-registration-dialogs ref="loginAndRegistrationDialogs"></login-and-registration-dialogs>

  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import houseFrontpage from "pages/houseFrontpage.vue";
import LoginAndRegistrationDialogs from "components/loginAndRegistrationDialogs.vue";

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
