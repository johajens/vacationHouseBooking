<template>
  <q-page class="flex flex-center bg-primary">
    <div class="text-h1">
      Inforamtion page
    </div>
  </q-page>
</template>

<script>
import { onMounted, ref } from "vue";
import { readHouseById } from "src/api/house";
import { getUser } from "src/service/authentication";

export default {
  name: "informationPage",
  setup () {
    const user = ref();
    const house = ref();
    const onPageLoad = async () => {
      user.value = await getUser();
      house.value = await readHouseById(user.value.houseId);
    }

    onMounted(() => {
      onPageLoad();
    })

    return {
    }
  }
};
</script>

<style scoped>

</style>
