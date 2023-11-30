<template>
  <q-page class="flex items-start desktop-only desktop-background row">
    <section class="row">
      <div class="col-12 q-px-lg q-pt-xl q-pb-xs text-h3 text-accent">
        Booking
      </div>
      <section class="col-md-4 col-xs-12 q-px-lg q-pb-lg">
        <div class="q-pt-lg">
          <q-input
            class="bg-secondary"
            color="accent"
            outlined
            v-model="bookingName"
            label="Bookingens navn">
            <template v-slot:append>
              <q-icon
                name="help_outline">
                <q-tooltip
                  class="bg-warning text-black"
                  anchor="center right"
                  self="center start">
                  Bookingens navn udfyldes med brugers navn medmindre andet er indtastet
                </q-tooltip>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="q-pt-lg">
          <q-input
            class="bg-secondary"
            color="accent"
            outlined
            v-model="bookingNotes"
            label="Eventuel note"
            type="textarea"
          />
        </div>

        <div class="row flex justify-between q-pt-lg">
          <q-input
            v-model="selectedDateRange[0]"
            class="bg-secondary col-5"
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
            class="bg-secondary col-5"
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
        <div class="flex flex-center q-pt-lg">
          <q-btn
            class="bg-secondary"
            style="width: 100%"
            size="large"
            @click="submitBooking"
          >
            Bekræft booking
          </q-btn>
        </div>
      </section>
      <section class="col-md-8 col-xs-12 q-px-lg q-pb-lg">
      <div class="flex row justify-between q-pt-lg">
        <div class="col-6 flex justify-between">
          <q-btn
            class="bg-secondary text-accent"
            icon="navigate_before"
            @click="onPrev">
            Forrige
          </q-btn>
          <q-btn
            class="bg-secondary text-accent"
            icon-right="today"
            @click="onToday">
            I dag
          </q-btn>
          <q-btn
            class="bg-secondary text-accent"
            icon-right="navigate_next"
            @click="onNext">
            Næste
          </q-btn>
        </div>
        <div class="col-6 flex justify-end text-h4 text-accent">
          {{formattedMonth()}}
        </div>
      </div>

      <div class="q-pt-sm">
        <q-calendar-month
          month
          ref="calendar"
          v-model="selectedDate"
          class="calendar shadow-5"
          :selected-start-end-dates="selectedDateRange"
          animated
          show-work-weeks
          date-align="left"
          locale="da-dk"
          :weekdays="[1,2,3,4,5,6,0]"
          weekday-align="center"
          :day-height="100"
          @mousedown-day="clickDateHandler"
          no-active-date>
          <template v-if="bookings.length !== 0" #week="{ scope: { week, weekdays } }">
            <template
              v-for="(computedEvent, index) in getWeekEvents(week, weekdays)"
              :key="index"
            >
              <div
                style="margin-top: 1px;"
                :class="badgeClasses(computedEvent)"
                :style="badgeStyles(computedEvent, week.length)"
              >
                <div
                  :id="'id_' + computedEvent.booking.id"
                  v-if="computedEvent.booking && computedEvent.booking.name"
                  class="title q-calendar__ellipsis"
                >
                  {{ computedEvent.booking.name }}
                </div>
              </div>
            </template>
          </template>
        </q-calendar-month>
      </div>
    </section>
    </section>
  </q-page>

  <q-page class="flex items-start mobile-only mobile-background row">
    <section class="row">
      <div class="col-12 q-px-lg q-pt-xl q-pb-xs text-h3 text-accent">
        Booking
      </div>
      <section class="col-md-4 col-xs-12 q-px-lg q-pb-lg">
        <div class="q-pt-lg">
          <q-input
            class="bg-secondary"
            color="accent"
            outlined
            v-model="bookingName"
            label="Bookingens navn">
            <template v-slot:append>
              <q-icon
                name="help_outline">
                <q-tooltip
                  class="bg-warning text-black"
                  anchor="center right"
                  self="center start">
                  Bookingens navn udfyldes med brugers navn medmindre andet er indtastet
                </q-tooltip>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="q-pt-lg">
          <q-input
            class="bg-secondary"
            color="accent"
            outlined
            v-model="bookingNotes"
            label="Eventuel note"
            type="textarea"
          />
        </div>

        <div class="row flex justify-between q-pt-lg">
          <q-input
            v-model="selectedDateRange[0]"
            class="bg-secondary col-5"
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
            class="bg-secondary col-5"
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
        <div class="flex flex-center q-pt-lg">
          <q-btn
            class="bg-secondary"
            style="width: 100%"
            size="large"
            @click="submitBooking"
          >
            Bekræft booking
          </q-btn>
        </div>
      </section>
      <q-separator></q-separator>
      <section class="col-md-8 col-xs-12 q-px-lg q-pb-lg">
        <div class="flex row justify-between q-pt-lg">
          <div class="col-md-6 col-xs-12 flex justify-end text-h4 text-accent">
            {{formattedMonth()}}
          </div>
          <div class="col-md-6 col-xs-12 flex justify-between">
            <q-btn
              class="bg-secondary text-accent"
              icon="navigate_before"
              @click="onPrev">
              Forrige
            </q-btn>
            <q-btn
              class="bg-secondary text-accent q-mx-xs"
              icon-right="today"
              @click="onToday">
              I dag
            </q-btn>
            <q-btn
              class="bg-secondary text-accent"
              icon-right="navigate_next"
              @click="onNext">
              Næste
            </q-btn>
          </div>
        </div>
        <div class="q-pt-sm">
          <q-calendar-month
            month
            ref="calendar"
            v-model="selectedDate"
            class="calendar shadow-5"
            :selected-start-end-dates="selectedDateRange"
            animated
            show-work-weeks
            date-align="left"
            locale="da-dk"
            :weekdays="[1,2,3,4,5,6,0]"
            weekday-align="center"
            :day-height="100"
            @mousedown-day="clickDateHandler"
            no-active-date>
          </q-calendar-month>
        </div>
      </section>
    </section>
  </q-page>
  <notification-banner ref="notificationBanner"></notification-banner>
</template>

<script>
import { onMounted, ref } from "vue";
import { getUserAndRouteFrontpageIfNotFound } from "src/service/authentication"
import { QCalendarMonth, today } from '@quasar/quasar-ui-qcalendar/src/index'
import { getStringProperCased, dateDataValid } from "src/service/utility";
import { createBooking, readAllBookingsByHouseId, readBookingById } from "src/api/booking";
import { daysBetween, isOverlappingDates, parsed } from "@quasar/quasar-ui-qcalendar";
import NotificationBanner from "components/notificationBanner.vue";


export default {
  name: "bookingPage",
  components: {
    NotificationBanner,
    QCalendarMonth
  },
  setup () {
    const notificationBanner = ref()
    const user = ref()
    const bookings = ref([])

    const calendar = ref()
    const selectedDate = ref(today())
    const selectedDateRange = ref([])

    const bookingName = ref()
    const bookingNotes = ref("")
    const calendarLoaded = ref(false)

    const bookingClicked = (bookingId) => {
      console.log(bookingId);
    }

    const handleBookingClicks = (e) => {
      let elements = document.elementsFromPoint(e.clientX, e.clientY);
      elements.forEach(element => {
          if(element.id.includes("id_")){
            bookingClicked(element.id.split("id_")[1])
          }
      }
      )
    }


    const getWeekEvents = (week) => {
      if(calendarLoaded.value)
        return
      const firstDay = parsed(week[ 0 ].date + ' 00:00')
      const lastDay = parsed(week[ week.length - 1 ].date + ' 23:59')
      const eventsWeek = []
      bookings.value.forEach((booking, id) => {
        const startDate = parsed(booking.startDate)
        const endDate = parsed(booking.endDate)

        if (isOverlappingDates(startDate, endDate, firstDay, lastDay)) {
          const left = daysBetween(firstDay, startDate)
          const right = daysBetween(endDate, lastDay)

          eventsWeek.push({
            id, // index event
            left, // Position initial day [0-6]
            right, // Number days available
            size: week.length - (left + right), // Size current event (in days)
            booking // Info
          })
        }
      })
      return eventsWeek;
    }


    const badgeClasses = (computedEvent) => {
      if (computedEvent.booking !== undefined) {
        return {
          'my-event': true,
          'text-white': true,
          'bg-accent': true,
          'rounded-border': true,
          'q-calendar__ellipsis': true
        }
      }
      return {
        'my-void-event': true
      }
    }

    const badgeStyles = (computedEvent, weekLength) => {
      const style = {}
      if (computedEvent.size !== undefined) {
        style.width = ((100 / weekLength) * computedEvent.size) + "%"
        style.marginLeft = ((100 / weekLength) * computedEvent.left) + "%"
        style.marginRight = ((100 / weekLength) * computedEvent.right) + "%"
        style.textAlign = "center"
      }
      return style
    }

    const formattedMonth = () => {
      const date = new Date(selectedDate.value)
      const month = date.toLocaleString('da-DK', {month: 'long'})
      const year = date.getFullYear()
      return `${getStringProperCased(month)} ${year}`
    }

    const submitBooking = async () => {
      if(!dateDataValid(selectedDateRange.value)){
        notificationBanner.value.displayNotification("Venligst vælg datoer", "error")
        return
      }

      const newBooking = {
        houseId: user.value.houseId,
        userId: user.value.id,
        startDate: selectedDateRange.value[0],
        endDate: selectedDateRange.value[1],
        name: bookingName.value,
        notes: bookingNotes.value,
        diary: ""
      }
      if(!newBooking.name){
        newBooking.name = user.value.name
      }

      const newBookingId = await createBooking(newBooking)
      bookings.value.push(await readBookingById(newBookingId))
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
      } else if (selectedDateRange.value[0] === selectedDateRange.value[1] && pickedDate !== selectedDateRange.value[0]){
        selectedDateRange.value.pop()
        selectedDateRange.value.push(pickedDate)
      } else if(pickedDate === selectedDateRange.value[0] && pickedDate === selectedDateRange.value[1]){
        selectedDateRange.value = []
      } else {
        selectedDateRange.value = [pickedDate, pickedDate]
      }
      selectedDateRange.value.sort()
    }

    const onPageLoad = async () => {
      user.value = await getUserAndRouteFrontpageIfNotFound()
      bookings.value = await readAllBookingsByHouseId(user.value.houseId)
      bookings.value = await readAllBookingsByHouseId(user.value.houseId)
      document.addEventListener('click', handleBookingClicks);
    }

    onMounted(() => {
      onPageLoad()
    })

    return {
      // General stuff
      notificationBanner,

      // Calendar stuff
      calendar,
      selectedDate,
      selectedDateRange,
      onNext,
      onToday,
      onPrev,
      formattedMonth,
      clickDateHandler,

      // Booking stuff
      bookingName,
      bookingNotes,
      submitBooking,
      getWeekEvents,
      badgeClasses,
      badgeStyles,
      bookings,
      bookingClicked

    }
  }
}
</script>

<style>
.calendar{

  border-radius: 5px;
  --calendar-border: #85774733 1px solid;
  --calendar-border-dark: #71755d 1px solid;
  --calendar-border-section: #ffe48bff 1px dashed;
  --calendar-border-section-dark: #ffe48bff 1px dashed;
  --calendar-border-current: #857747ff 2px solid;
  --calendar-border-current-dark: #ffe48bff 2px solid;
  --calendar-border-droppable: #027BE3 1px dashed;
  --calendar-border-droppable-dark: #ffe48bff 1px dashed;
  --calendar-mini-range-connector-hover-border: #027BE3 1px dashed;
  --calendar-mini-range-connector-hover-border-dark: #ffe48bff 1px dashed;
  --calendar-color: #857747ff;
  --calendar-color-dark: #fafafa;
  --calendar-background: #FFEEB5FA;
  --calendar-background-dark: #121212;
  --calendar-current-color: #857747ff;
  --calendar-current-color-dark: #ffe48bff;
  --calendar-current-background: #00000000;
  --calendar-current-background-dark: #121212;
  --calendar-disabled-date-color: #a1a1a1;
  --calendar-disabled-date-color-dark: #bebebe;
  --calendar-disabled-date-background: #ffffff;
  --calendar-disabled-date-background-dark: #121212;
  --calendar-active-date-color: #857747ff;
  --calendar-active-date-color-dark: #ffe48bff;
  --calendar-active-date-background: #ffe48bff;
  --calendar-active-date-background-dark: #857747ff;
  --calendar-outside-color: #606c71;
  --calendar-outside-color-dark: #bebebe;
  --calendar-outside-background: #00000000;
  --calendar-outside-background-dark: #121212;
  --calendar-selected-color: #857747ff;
  --calendar-selected-color-dark: #857747ff;
  --calendar-selected-background: #857747ff;
  --calendar-selected-background-dark: #ffe48bff;
  --calendar-mini-selected-color: #857747ff;
  --calendar-mini-selected-color-dark: #857747ff;
  --calendar-mini-selected-background: #00000000;
  --calendar-mini-selected-background-dark: #00000000;
  --calendar-mini-selected-label-color: #857747ff;
  --calendar-mini-selected-label-color-dark: #ffe48bff;
  --calendar-mini-selected-label-background: #ffe48bff;
  --calendar-mini-selected-label-background-dark: #857747ff;
  --calendar-range-color: #857747ff;
  --calendar-range-color-dark: #857747ff;
  --calendar-range-background: #ffe48bBB;
  --calendar-range-background-dark: #ffe48bff;
  --calendar-mini-range-color: #ffe48bff;
  --calendar-mini-range-color-dark: #857747ff;
  --calendar-mini-range-background: #00000000;
  --calendar-mini-range-background-dark: #00000000;
  --calendar-mini-range-label-color: #ffe48bff;
  --calendar-mini-range-label-color-dark: #857747ff;
  --calendar-mini-range-label-background: #ffe48bff;
  --calendar-mini-range-label-background-dark: #ffe48bff;
  --calendar-mini-range-connector-color: #ffe48bff;
  --calendar-mini-range-connector-color-dark: #ffe48bff;
  --calendar-mini-range-hover-color: #857747ff;
  --calendar-mini-range-hover-color-dark: #ffe48bff;
  --calendar-mini-range-firstlast-color: #ffe48bff;
  --calendar-mini-range-firstlast-color-dark: #ffe48bff;
  --calendar-mini-range-firstlast-background: #00000000;
  --calendar-mini-range-firstlast-background-dark: #ffe48bff;
  --calendar-mini-range-firstlast-label-color: #857747ff;
  --calendar-mini-range-firstlast-label-color-dark: #ffe48bff;
  --calendar-mini-range-firstlast-label-background: #857747ff;
  --calendar-mini-range-firstlast-label-background-dark: #ffe48bff;
  --calendar-intervals-width: 56px;
  --calendar-work-week-width: 40px;
  --calendar-mini-work-week-width: 30px;
  --calendar-work-week-font-size: 1.0em;
  --calendar-head-font-weight: 600
}

.q-calendar-month__day--month{
  display: none;
}
.q-calendar-month__week--events{
  z-index: 1;
}
.q-calendar-month__day--content{
  z-index: 2;
}

</style>
