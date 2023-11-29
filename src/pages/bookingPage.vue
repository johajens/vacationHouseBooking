<template>
  <q-page class="flex desktop-only desktop-background row">
    <section class="col-3">
      <div class="text-h3">
        Booking
      </div>
      <div>
        <q-input
          class="bg-secondary"
          color="accent"
          outlined
          v-model="bookingName"
          label="Bookingens navn"
        />
        <q-input
          class="bg-secondary"
          color="accent"
          outlined
          v-model="optionalNote"
          label="Eventuel note"
          type="textarea"
        />
      </div>

      <div class="row">
        <q-input
          v-model="selectedDateRange[0]"
          class="bg-secondary col-6"
          color="accent"
          outlined
          label="Ankomst">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="date">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-input>

        <q-input
          v-model="selectedDateRange[1]"
          class="bg-secondary col-6"
          color="accent"
          outlined
          label="Ankomst"
        >
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="selectedDateRange[1]">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-input>
      </div>
      <div>
        <q-btn>
          Bekræft booking
        </q-btn>
      </div>


    </section>
    <section class="q-px-lg q-pt-xl col-9">
      <div class="flex flex-center text-h3 text-accent">
        {{formattedMonth()}}
      </div>

      <div class="flex justify-between q-pt-lg">
        <q-btn class="bg-secondary text-accent" @click="onPrev">Forrige</q-btn>
        <q-btn class="bg-secondary text-accent" @click="onToday">I dag</q-btn>
        <q-btn class="bg-secondary text-accent" @click="onNext">Næste</q-btn>
      </div>

      <div class="q-pt-sm q-pb-lg">
        <q-calendar-month
          ref="calendar"
          v-model="selectedDate"
          class=""
          :selected-start-end-dates="selectedDateRange"
          animated
          show-work-weeks
          date-align="left"
          locale="da-dk"
          :weekdays="[1,2,3,4,5,6,0]"
          weekday-align="center"
          :day-height="100"
          @mousedown-day="clickDateHandler"
        ></q-calendar-month>
      </div>
    </section>
  </q-page>
</template>

<script>
import {onMounted, ref, defineComponent, computed} from "vue"
import { readHouseById } from "src/api/house"
import { getUserAndRouteFrontpageIfNotFound } from "src/service/authentication"
import { QCalendarMonth, today } from '@quasar/quasar-ui-qcalendar/src/index'
import { getStringProperCased } from "src/service/utility";

export default {
  name: "bookingPage",
  components: {
    QCalendarMonth
  },
  setup () {
    const user = ref()
    const house = ref()

    const calendar = ref()
    const selectedDate = ref(today())
    const selectedDateRange = ref([])

    const formattedMonth = () => {
      const date = new Date(selectedDate.value)
      const month = date.toLocaleString('da-DK', {month: 'long'})
      const year = date.getFullYear()
      return `${getStringProperCased(month)} ${year}`
    }

    const onPrev = () => {
      calendar.value.prev()
    }

    const onToday = () => {
      calendar.value.moveToToday()
      formattedMonth()
    }

    const onNext = () => {
      calendar.value.next()
    }

    const clickDateHandler = (data) =>{
      const pickedDate = data.scope.timestamp.date
      if (selectedDateRange.value.length === 0){
        selectedDateRange.value.push(pickedDate,pickedDate)
      } else if (selectedDateRange.value[0] === selectedDateRange.value[1]){
        selectedDateRange.value.pop()
        selectedDateRange.value.push(pickedDate)
      } else {
        selectedDateRange.value = [pickedDate, pickedDate]
      }
      selectedDateRange.value.sort()
    }

    const onPageLoad = async () => {
      user.value = await getUserAndRouteFrontpageIfNotFound()
      house.value = await readHouseById(user.value.houseId)
    }

    onMounted(() => {
      onPageLoad()
    })

    return {
      calendar,
      selectedDate,
      selectedDateRange,
      onNext,
      onToday,
      onPrev,
      formattedMonth,
      clickDateHandler,
    }
  }
}
</script>

<style scoped>
.calendar{
  background-color:#FFE48BF2;


  border: #857747;
  border-style: solid;
  border-radius: 5px;
  border-width: 3px;
}

</style>
