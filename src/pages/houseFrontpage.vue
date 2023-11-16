<template>
  <q-page class="flex flex-center bg-primary">
    <section class="desktop-only">
      <img
        src="~assets/ferieboligbooking-background-swedish-art.png"
        alt="FerieboligBooking visuel identitet">
      <section class="q-pa-xl absolute-top">
        <section class="q-pa-xl row">
          <div class="col-12">
            <span class="text-h2">Hej, {{ user?.name }}</span>
          </div>
          <div class="col-6 q-pt-lg">
            <span class="text-h5">Velkommen til {{ house?.name }}</span>
          </div>
          <div class="col-6">
          </div>
          <div class="col-3 q-pt-lg">
            <span class="text-body1">{{ house?.description }}</span>
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
        <section class="q-pa-sm row">
          <div class="col-12">
            <span class="text-h6">Hej, {{ user?.name }}</span>
          </div>
          <div class="col-12 q-pt-lg">
            <span class="text-weight-bold">Velkommen til {{ house?.name }}</span>
          </div>

          <div class="col-12 q-pt-lg">
            <span class="text-body1">{{ house?.description }}</span>
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
import { readHouseById } from "src/api/house";
import { getUser } from "src/service/authentication";

export default {
  name: "houseFrontpage",
  setup () {
    const user = ref();
    const house = ref();

    const onPageLoad = async () => {
      user.value = await getUser();
      house.value = await readHouseById(user.value.houseId);
      if(!house.value.description.trim().endsWith(".")){
        house.value.description += "."
      }
    }

    onMounted(() => {
      onPageLoad();
    })

    return {
      user,
      house
    }
  }
};
</script>

<style scoped>

</style>
