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
            label="Bookingens navn"
            @keyup.enter="clickCreateNewBookingHandler">
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
              <q-date @update:model-value="clickSingleDateHandler(true, $event)" :options="getMaxDateValue">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="LUK" color="accent" flat icon-right="close"/>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-input>

          <q-input
            v-model="selectedDateRange[1]"
            class="bg-secondary col-5"
            color="accent"
            outlined
            label="Afrejse">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date @update:model-value="clickSingleDateHandler(false, $event)" :options="getMinDateValue">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="LUK" color="accent" flat icon-right="close"/>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-input>
        </div>
        <div class="q-pt-lg" v-if="isUserAdmin">
          <label class="text-h6 text-accent">Booker på vegne af</label>
          <q-select
            borderless
            outlined
            style="width: 100%;"
            class="bg-secondary"
            v-model="actingAs"
            :options="users"
            option-value="id"
            option-label="name"
            :menu-props="{ style: { backgroundColor: '#FFEEB5', color: '#857747' } }"/>
        </div>

        <div class="flex flex-center q-pt-lg">
          <q-btn
            class="bg-secondary text-accent"
            style="width: 100%"
            size="large"
            @click="clickCreateNewBookingHandler">
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
              @click="clickPreviousMonthHandler">
              Forrige
            </q-btn>
            <q-btn
              class="bg-secondary text-accent"
              icon-right="today"
              @click="clickTodayHandler">
              I dag
            </q-btn>
            <q-btn
              class="bg-secondary text-accent"
              icon-right="navigate_next"
              @click="clickNextMonthHandler">
              Næste
            </q-btn>
          </div>
          <div class="col-md-6 col-xs-12 flex justify-end text-h4 text-accent">
            {{ getFormattedMonth() }}
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
          @mousedown-day="clickCalendarDateHandler"
          no-active-date>
          <template v-if="bookings.length !== 0" #week="{ scope: { week, weekdays } }">
            <template
              v-for="(computedEvent, index) in getWeekEvents(week, weekdays)"
              :key="index"
            >
              <div
                class="my-event text-white rounded-border q-calendar__ellipsis shadow-2 q-mb-xs"
                :style="getCalendarBookingStyle(computedEvent, week.length)">
                <div
                  :id="'id_' + computedEvent.booking.id"
                  v-if="computedEvent.booking && computedEvent.booking.name"
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
              <q-date @update:model-value="clickSingleDateHandler(true, $event)" :options="getMaxDateValue">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="LUK" color="accent" flat icon-right="close"/>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-input>

          <q-input
            v-model="selectedDateRange[1]"
            class="bg-secondary col-5"
            color="accent"
            outlined
            label="Afrejse"
          >
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date @update:model-value="clickSingleDateHandler(false, $event)" :options="getMinDateValue">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="LUK" color="accent" flat icon-right="close"/>
                </div>
              </q-date>
            </q-popup-proxy>
          </q-input>
        </div>
        <div class="q-pt-lg" v-if="isUserAdmin">
          <label class="text-h6 text-accent">Booker på vegne af</label>
          <q-select
            borderless
            outlined
            style="width: 100%;"
            class="bg-secondary"
            v-model="actingAs"
            :options="users"
            option-value="id"
            option-label="name"
            :menu-props="{ style: { backgroundColor: '#FFEEB5', color: '#857747' } }"/>
        </div>
        <div class="flex flex-center q-pt-lg">
          <q-btn
            class="bg-secondary"
            style="width: 100%"
            size="large"
            @click="clickCreateNewBookingHandler"
          >
            Bekræft booking
          </q-btn>
        </div>
      </section>
      <q-separator></q-separator>
      <section class="col-md-8 col-xs-12 q-px-lg q-pb-lg">
        <div class="flex row justify-between q-pt-lg">
          <div class="col-md-6 col-xs-12 flex justify-end text-h4 text-accent">
            {{ getFormattedMonth() }}
          </div>
          <div class="col-md-6 col-xs-12 flex justify-between">
            <q-btn
              class="bg-secondary text-accent"
              icon="navigate_before"
              @click="clickPreviousMonthHandler">
              Forrige
            </q-btn>
            <q-btn
              class="bg-secondary text-accent q-mx-xs"
              icon-right="today"
              @click="clickTodayHandler">
              I dag
            </q-btn>
            <q-btn
              class="bg-secondary text-accent"
              icon-right="navigate_next"
              @click="clickNextMonthHandler">
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
            draggable="true"
            v-touch-pan.horizontal.prevent.mouse="dragHandler"
            show-work-weeks
            date-align="left"
            locale="da-dk"
            :weekdays="[1,2,3,4,5,6,0]"
            weekday-align="center"
            :day-height="100"
            @mousedown-day="clickCalendarDateHandler"
            no-active-date>
            <template v-if="bookings.length !== 0" #week="{ scope: { week, weekdays } }">
              <template
                v-for="(computedEvent, index) in getWeekEvents(week, weekdays)"
                :key="index"
              >
                <div
                  class="my-event text-white rounded-border q-calendar__ellipsis shadow-2 q-mb-xs"
                  :style="getCalendarBookingStyle(computedEvent, week.length)"
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

  <!-- Booking popup -->
  <q-dialog v-model="dialogs.booking" no-backdrop-dismiss>
    <q-card :class="{'bg-secondary': true, 'text-accent': true, 'window-width': isMobile}" :style="{ width: isMobile ? '100%' : '60vw' }">
    <q-card-section class="column items-center bg-primary">
        <section class="row" style="width: 100%">
          <q-input
            v-if="userCanEdit"
            v-model="viewBooking.name"
            color="accent"
            dense
            autogrow
            class="text-h5 text-accent"
            style="width: 70%"
            @update:model-value="checkForInputChange"
            @keyup.enter="clickUpdateBookingHandler">
          </q-input>
          <div v-else class="text-h5">{{viewBooking.name}}</div>
          <q-space />
          <q-btn icon="delete" flat round dense v-if="userCanEdit" @click="toggleDialog(dialogs, 'confirmBookingDeletion')"/>
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
          v-if="userCanEdit"
          v-model="viewBooking.notes"
          color="accent"
          dense
          autogrow
          label="Note"
          class="text-body1 text-accent"
          @update:model-value="checkForInputChange">
        </q-input>
        <span v-else class="text-body1">
          {{ viewBooking.notes }}
        </span>
      </q-card-section>

      <q-separator></q-separator>

      <q-card-section class="flex justify-between">
        <div>
          <q-icon v-if="userCanEdit" class="q-pb-xs cursor-pointer" size="1.5em" name="edit_calendar" >
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date class="bg-secondary text-accent" mask="YYYY-MM-DD" v-model="viewBooking.startDate" @update:model-value="checkForInputChange" minimal today-btn landscape>
                <div class="row items-center justify-end">
                  <q-btn outline v-close-popup label="Bekræft" color="accent" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
          Ankomst: {{viewBooking.startDate}}
        </div>
        <div>
          <q-icon v-if="userCanEdit" class="q-pb-xs cursor-pointer" size="1.5em" name="edit_calendar" >
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date class="bg-secondary text-accent" mask="YYYY-MM-DD" v-model="viewBooking.endDate" @update:model-value="checkForInputChange" minimal today-btn landscape>
                <div class="row items-center justify-end">
                  <q-btn outline v-close-popup label="Bekræft" color="accent" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
          Afrejse: {{viewBooking.endDate}}
        </div>
      </q-card-section>

      <q-card-section class="flex flex-center" v-if="hasUnsavedChanges && userCanEdit">
        <q-btn
          size="md"
          class="bg-secondary"
          @click="clickUpdateBookingHandler">
          Opdater
        </q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="dialogs.confirmBookingDeletion" persistent>
    <q-card class="bg-primary">
      <q-card-section class="row items-center">
        <div>
          <div class="text-h5 text-accent text-bold" >
            Er du sikker på at du vil slette booking med navn: {{viewBooking.name}}?
          </div>
          <div class="q-pt-sm text-body2 text-accent">
            Når du sletter bookingen i perioden {{viewBooking.startDate}}-{{viewBooking.endDate}}, vil den blive fjernet fra kalenderen.
          </div>
        </div>
      </q-card-section>

      <q-card-actions class="q-ml-sm justify-between">
        <q-btn
          label="Annullér"
          color="secondary"
          text-color="accent"
          v-close-popup
        />
        <q-btn
          label="Bekræft"
          color="secondary"
          text-color="accent"
          v-close-popup
          @click="clickDeleteBookingHandler(viewBooking.id)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <notification-banner ref="notificationBanner"></notification-banner>
</template>

<script>
import { ref} from "vue"
import { getUserAndRouteFrontpageIfNotFound } from "src/service/authentication"
import { QCalendarMonth, today } from '@quasar/quasar-ui-qcalendar/src/index'
import { getStringProperCased, dateDataValid, toggleDialog, hasInputChanged } from "src/service/utility";
import {createBooking, readAllBookingsByHouseId, readBookingById, updateBookingById, deleteBookingById} from "src/api/booking";
import { daysBetween, isOverlappingDates, parsed } from "@quasar/quasar-ui-qcalendar";
import { readAllUsersByHouseId, readUserById } from "src/api/user";
import NotificationBanner from "components/notificationBanner.vue";
import { readAllColors } from "src/api/color";


export default {
  name: "bookingPage",
  components: {
    NotificationBanner,
    QCalendarMonth
  },

  data(){
    return{
      // General stuff
      user: ref(),
      users: ref(),
      isUserAdmin: ref(false),
      userCanEdit: ref(false),
      actingAs: ref(),

      // Calendar stuff
      calendarLoaded: ref(false),
      bookings: ref([]),
      allColors: ref(),
      selectedDate: ref(today()),
      selectedDateRange: ref([]),
      bookingName: ref(),
      notes: ref(""),
      date: ref(),
      startPos: ref(),
      finalPos: ref(),

      // Specific booking stuff
      selectedBooking: ref(),
      viewBooking: ref({
        bookersName: '',
        name: '',
        notes: '',
        created: '',
        startDate: '',
        endDate: '',
        id: ''
      }),
      dialogs: ref({
        booking: false,
        confirmBookingDeletion: false
      }),
      hasUnsavedChanges: ref(),


    }
  },

  methods:{
    toggleDialog,
    clickBookingHandler(e){
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      elements.forEach(element => {
          if(element.id.includes("id_") && !this.dialogs.booking && !this.dialogs.confirmBookingDeletion){
            this.bookingDialogHandler(element.id.split("id_")[1])
          }
        }
      )
    },

    isMobile(){
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    getWeekEvents(week){
      if(this.calendarLoaded)
        return
      const firstDay = parsed(week[ 0 ].date + ' 00:00')
      const lastDay = parsed(week[ week.length - 1 ].date + ' 23:59')
      const eventsWeek = []
      this.bookings.forEach((booking, id) => {
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
    },

    getCalendarBookingStyle(computedEvent, weekLength){
      const colorToUse = this.getColorFromBooking(computedEvent.booking)
      const style = {}
      if (computedEvent.size !== undefined) {
        style.borderRadius = "20px"
        style.backgroundColor = colorToUse
        style.width = ((100 / weekLength) * computedEvent.size) + "%"
        style.marginLeft = ((100 / weekLength) * computedEvent.left) + "%"
        style.marginRight = ((100 / weekLength) * computedEvent.right) + "%"
        style.textAlign = "center"
      }
      return style
    },

    getColorFromBooking(booking){
      const userId = booking.userId
      const index = this.users.findIndex(user => user.id === userId)
      if (index !== -1) {
        const colorIdToUse =  this.users[index].colorId
        const colorIndex = this.allColors.findIndex(color => color.id === colorIdToUse)
        if (colorIndex !== -1) {
          return this.allColors[colorIndex].hexValue
        }
      }
      return "#857747"
    },

    getFormattedMonth(){
      const date = new Date(this.selectedDate)
      const month = date.toLocaleString('da-DK', {month: 'long'})
      const year = date.getFullYear()
      return `${getStringProperCased(month)} ${year}`
    },

    async bookingDialogHandler(bookingId){
      this.selectedDateRange = []
      this.selectedBooking = await readBookingById(bookingId)
      const bookedByUser = await readUserById(this.selectedBooking.userId)
      this.userCanEdit = (this.isUserAdmin || this.user.id === this.selectedBooking.userId)
      this.viewBooking.bookersName = bookedByUser.name
      this.viewBooking.name = this.selectedBooking.name
      this.viewBooking.notes = this.selectedBooking.notes
      this.viewBooking.created = this.selectedBooking.created
      this.viewBooking.startDate = this.selectedBooking.startDate
      this.viewBooking.endDate = this.selectedBooking.endDate
      this.viewBooking.id = this.selectedBooking.id
      toggleDialog(this.dialogs, 'booking')
    },

    async clickUpdateBookingHandler(){
      const bookingToUpdate = this.selectedBooking
      bookingToUpdate.name = await this.getBookingName(this.viewBooking.name, bookingToUpdate.userId)
      bookingToUpdate.notes = this.viewBooking.notes
      bookingToUpdate.startDate = this.viewBooking.startDate
      bookingToUpdate.endDate = this.viewBooking.endDate
      await updateBookingById(bookingToUpdate)
      const index = this.bookings.findIndex(booking => booking.id === this.selectedBooking.id);
      if (index !== -1) {
        this.bookings[index] = this.selectedBooking;
      }
      this.hasUnsavedChanges = false
      toggleDialog(this.dialogs, 'booking')
      this.notificationBanner.displayNotification("Booking opdateret", "success")
    },

    async clickDeleteBookingHandler(bookingId){
      await deleteBookingById(bookingId)
      this.bookings.splice(this.bookings.findIndex(booking => booking.id === bookingId), 1)
    },

    async checkForInputChange(){
      const bookingToCheck = this.selectedBooking
      const input = [
        [this.viewBooking.name, bookingToCheck.name],
        [this.viewBooking.notes, bookingToCheck.notes],
        [this.viewBooking.startDate, bookingToCheck.startDate],
        [this.viewBooking.endDate, bookingToCheck.endDate]
      ]
      this.hasUnsavedChanges = hasInputChanged(input)
    },

    async clickCreateNewBookingHandler(){
      if (!dateDataValid(this.selectedDateRange)) {
        this.notificationBanner.displayNotification("Venligst vælg datoer", "error")
        return
      }

      const newBooking = {
        houseId: this.user.houseId,
        userId: this.actingAs.id,
        startDate: this.selectedDateRange[0],
        endDate: this.selectedDateRange[1],
        name: null,
        notes: this.notes,
        diary: ""
      }
      newBooking.name = await this.getBookingName(this.bookingName, this.actingAs.id)

      const newBookingId = await createBooking(newBooking)
      this.bookings.push(await readBookingById(newBookingId))
      this.selectedDateRange = []
    },

    async getBookingName(name, bookerId){
      if (!name || name.trim().length === 0) {
        const booker = await readUserById(bookerId)
        return booker.name
      }
      return name
    },

    clickPreviousMonthHandler(){
      this.calendar.prev()
    },

    clickTodayHandler(){
      this.calendar.moveToToday()
      this.getFormattedMonth()
    },

    clickNextMonthHandler(){
      this.calendar.next()
    },

    clickCalendarDateHandler(data){
      const pickedDate = data.scope.timestamp.date
      if (this.selectedDateRange.length === 0){
        this.selectedDateRange.push(pickedDate,pickedDate)
      } else if (this.selectedDateRange[0] === this.selectedDateRange[1] && pickedDate !== this.selectedDateRange[0]){
        this.selectedDateRange.pop()
        this.selectedDateRange.push(pickedDate)
      } else if(pickedDate === this.selectedDateRange[0] && pickedDate === this.selectedDateRange[1]){
        this.selectedDateRange = []
      } else {
        this.selectedDateRange = [pickedDate, pickedDate]
      }
      this.selectedDateRange.sort()
    },

    clickSingleDateHandler(isArrival, date){
      date = date.replaceAll("/", "-")
      if (this.selectedDateRange.length === 0){
        this.selectedDateRange.push(date, date)
      }else if(isArrival){
        this.selectedDateRange[0] = date
      }
      else{
        this.selectedDateRange[1] = date
      }
    },

    getMaxDateValue(date){
      if(this.selectedDateRange[1]){
        return date <= this.selectedDateRange[1].replaceAll("-","/")
      }
      return true
    },

    getMinDateValue(date){
      if(this.selectedDateRange[0]){
        return date >= this.selectedDateRange[0].replaceAll("-","/")
      }
      return true
    },

    dragHandler({ evt, ...newInfo }){
      const minimumSwipeDistance = 15
      if (newInfo.isFirst) {
        this.startPos = newInfo.position.left
      }
      else if (newInfo.isFinal) {
        this.finalPos = newInfo.position.left
        if(this.startPos !== undefined && this.finalPos !== undefined){
          console.log("start: " + this.startPos);
          console.log("end: " + this.finalPos);
          if(this.finalPos > (this.startPos + minimumSwipeDistance)){
            this.clickPreviousMonthHandler()
          }
          else if((this.finalPos + minimumSwipeDistance) < this.startPos){
            this.clickNextMonthHandler()
          }
        }
      }


    }
  },

  async mounted(){
    this.user = await getUserAndRouteFrontpageIfNotFound()
    this.isUserAdmin = this.user.isAdmin
    this.bookings = await readAllBookingsByHouseId(this.user.houseId)
    this.users = await readAllUsersByHouseId(this.user.houseId)
    this.allColors = await readAllColors();
    this.actingAs = this.user
    this.notificationBanner = this.$refs.notificationBanner;
    this.calendar = this.$refs.calendar;
    document.addEventListener('click', this.clickBookingHandler);
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
.q-date__header{
  display: none;
}
</style>


