<template>
  <q-page class="flex flex-center bg-primary">
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
