<template>
  <q-page class="flex flex-center">
    <div class="text-h1">
      InfoRAMtion page
    </div>
  </q-page>
  <notification-banner ref="notificationBanner"></notification-banner>
</template>

<script>
import { ref } from "vue"
import { getUserAndRouteFrontpageIfNotFound } from "src/service/authentication"
import { readAllUsersByHouseId } from "src/api/user";

export default {
  name: "informationPage",
  data() {
    return {
      // General stuff
      user: ref(),
      users: ref()
    }
  },

  methods: {

  },

  async mounted() {
    this.notificationBanner = this.$refs.notificationBanner
    this.user = await getUserAndRouteFrontpageIfNotFound()
    this.users = await readAllUsersByHouseId(this.user.houseId)
  },
}
</script>

<style scoped>

</style>
