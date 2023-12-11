<template>
  <q-page class="flex flex-center">
    <div class="text-h1">
      Documents page
    </div>
  </q-page>
  <notification-banner ref="notificationBanner"></notification-banner>
</template>

<script>
import { onMounted, ref } from "vue"
import { readHouseById } from "src/api/house"
import { getUserAndRouteFrontpageIfNotFound } from "src/service/authentication"
import { readAllUsersByHouseId } from "src/api/user";

export default {
  name: "documentPage",
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
