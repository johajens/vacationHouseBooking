<template>
  <!-- Desktop version -->
  <q-page class="flex items-start desktop-only desktop-background row">
    <section class="row">
      <section class="col-12 q-px-lg q-pt-xl q-pb-xs">
        <div class="text-h3 text-accent">
          Booking
        </div>
      </section>

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
            v-model="notes"
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
        <section class="flex row justify-between q-pt-lg">
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
        </section>

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
            no-active-date
          ></q-calendar-month>
        </div>
      </section>
    </section>
  </q-page>

  <!-- Mobile version -->
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
            v-model="notes"
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
            no-active-date
          ></q-calendar-month>
        </div>
      </section>
    </section>
  </q-page>

  <!-- Booking popup -->
  <q-dialog v-model="dialogs.booking">
    <q-card class="bg-secondary text-accent" style="width: 60vw">
      <q-card-section class="column items-center bg-primary">
        <section class="row" style="width: 100%">
          <q-input
            v-if="isUserAdmin"
            v-model="viewBooking.name"
            color="accent"
            dense
            autogrow
            class="text-h5 text-accent"
            @update:model-value="bookingChangeHandler">
          </q-input>
          <div v-else class="text-h5">{{viewBooking.name}}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </section>

        <section class="row" style="width: 100%">
          <q-icon name="more_time" class="q-pr-xs" style="padding-top: 2px"></q-icon>
          <div class="text-caption">Oprettet d. {{viewBooking.created}} af {{viewBooking.bookersName}}</div>
        </section>
      </q-card-section>

      <q-separator></q-separator>

      <q-card-section>
        <q-input
          v-if="isUserAdmin"
          v-model="viewBooking.notes"
          color="accent"
          dense
          autogrow
          class="text-body1 text-accent"
          @update:model-value="bookingChangeHandler">
        </q-input>
        <span v-else class="text-body1">
          {{ viewBooking.notes }}
        </span>
      </q-card-section>

      <q-separator></q-separator>

      <q-card-section class="flex justify-between">
        <div>
          Ankomst: {{viewBooking.startDate}}
          <q-icon v-if="isUserAdmin" class="q-pb-xs cursor-pointer" size="1.5em" name="edit_calendar" >
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date class="bg-secondary text-accent" mask="YYYY-MM-DD" v-model="viewBooking.startDate" @update:model-value="bookingChangeHandler" minimal today-btn landscape>
                <div class="row items-center justify-end">
                  <q-btn outline v-close-popup label="Bekræft" color="accent" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </div>
        <div>
          <q-icon v-if="isUserAdmin" class="q-pb-xs cursor-pointer" size="1.5em" name="edit_calendar" >
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date class="bg-secondary text-accent" mask="YYYY-MM-DD" v-model="viewBooking.endDate" @update:model-value="bookingChangeHandler" minimal today-btn landscape>
                <div class="row items-center justify-end">
                  <q-btn outline v-close-popup label="Bekræft" color="accent" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
          Afrejse: {{viewBooking.endDate}}
        </div>
      </q-card-section>

      <q-card-section class="flex flex-center" v-if="hasUnsavedChanges && isUserAdmin">
        <q-btn
          size="md"
          class="bg-secondary"
          @click="updateBooking">
          Opdater
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>

  <notification-banner ref="notificationBanner"></notification-banner>
</template>

<script>
import { onMounted, ref} from "vue"
import { getUserAndRouteFrontpageIfNotFound, isUserAdmin } from "src/service/authentication"
import { QCalendarMonth, today } from '@quasar/quasar-ui-qcalendar/src/index'
import { getStringProperCased, dateDataValid, getFirstNameWithPossessive, toggleDialog, hasInputChanged } from "src/service/utility";
import {createBooking, readAllBookingsByHouseId, readBookingById, updateBookingById} from "src/api/booking";
import { readUserById } from "src/api/user";
import NotificationBanner from "components/notificationBanner.vue";

export default {
  name: "bookingPage",
  components: {
    NotificationBanner,
    QCalendarMonth
  },
  setup: function () {
    const notificationBanner = ref()
    const user = ref()
    const bookings = ref([])

    const calendar = ref()
    const selectedDate = ref(today())
    const selectedDateRange = ref([])

    const bookingName = ref()
    const notes = ref("")

    // Booking dialog stuff
    const viewBooking = ref({
      bookersName: '',
      name: '',
      notes: '',
      created: '',
      startDate: '',
      endDate: ''
    })
    const dialogs = ref({
      booking: false
    })
    const hasUnsavedChanges = ref()

    const formattedMonth = () => {
      const date = new Date(selectedDate.value)
      const month = date.toLocaleString('da-DK', {month: 'long'})
      const year = date.getFullYear()
      return `${getStringProperCased(month)} ${year}`
    }

    const bookingDialogHandler = async (bookingId) => {
      bookingId = '5UiFr5MAePtFdgj1mYEr'
      const bookingToDisplay = await readBookingById(bookingId)
      const bookedByUser = await readUserById(bookingToDisplay.userId)
      viewBooking.value.bookersName = bookedByUser.name
      viewBooking.value.name = bookingToDisplay.name
      viewBooking.value.notes = bookingToDisplay.notes
      viewBooking.value.created = bookingToDisplay.created
      viewBooking.value.startDate = bookingToDisplay.startDate
      viewBooking.value.endDate = bookingToDisplay.endDate
      toggleDialog(dialogs.value, 'booking')
    }

    const updateBooking = async (bookingId) => {
      bookingId = '5UiFr5MAePtFdgj1mYEr'
      const bookingToUpdate = await readBookingById(bookingId)
      bookingToUpdate.name = viewBooking.value.name
      bookingToUpdate.notes = viewBooking.value.notes
      bookingToUpdate.startDate = viewBooking.value.startDate
      bookingToUpdate.endDate = viewBooking.value.endDate
      await updateBookingById(bookingToUpdate)
      hasUnsavedChanges.value = false
    }

    const bookingChangeHandler = async (bookingId) => {
      bookingId = '5UiFr5MAePtFdgj1mYEr'
      const bookingToCheck = await readBookingById(bookingId)
      const input = [
        [viewBooking.value.name, bookingToCheck.name],
        [viewBooking.value.notes, bookingToCheck.notes],
        [viewBooking.value.startDate, bookingToCheck.startDate],
        [viewBooking.value.endDate, bookingToCheck.endDate]
      ]
      console.log(input)
      hasUnsavedChanges.value = hasInputChanged(input)
    }

    const submitBooking = async () => {
      if (!dateDataValid(selectedDateRange.value)) {
        notificationBanner.value.displayNotification("Venligst vælg datoer", "error")
        return
      }

      const newBooking = {
        houseId: user.value.houseId,
        userId: user.value.id,
        startDate: selectedDateRange.value[0],
        endDate: selectedDateRange.value[1],
        name: bookingName.value,
        notes: notes.value,
        diary: ""
      }
      if (!newBooking.name) {
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

    const clickDateHandler = (data) => {
      const pickedDate = data.scope.timestamp.date
      if (selectedDateRange.value.length === 0) {
        selectedDateRange.value.push(pickedDate, pickedDate)
      } else if (selectedDateRange.value[0] === selectedDateRange.value[1]) {
        selectedDateRange.value.pop()
        selectedDateRange.value.push(pickedDate)
      } else {
        selectedDateRange.value = [pickedDate, pickedDate]
      }
      selectedDateRange.value.sort()
    }

    const onPageLoad = async () => {
      user.value = await getUserAndRouteFrontpageIfNotFound()
      bookings.value = await readAllBookingsByHouseId(user.value.houseId)
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
      notes,
      submitBooking,

      // Booking dialog stuff
      dialogs,
      viewBooking,
      bookingDialogHandler,
      getFirstNameWithPossessive,
      hasUnsavedChanges,
      bookingChangeHandler,
      updateBooking,

      isUserAdmin


    }
  }
}
</script>

<style scoped>
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

</style>
