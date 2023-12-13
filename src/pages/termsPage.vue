<template>
  <q-page class="flex">
    <section class="desktop-only desktop-background">
      <section class="q-pa-xl">
        <section class="q-pa-xl row">
          <div class="col-12">
            <span class="text-h2">Terms of service for FerieFiks.dk </span>
          </div>
          <div class="col-6 q-pt-lg row">
            <span class="text-h5">
              Før du benytter vores service, beder vi dig om nøje at gennemlæse disse vilkår.
            </span>

            <span class="text-h6 col-12">
              1. Accept af Vilkår
            </span>
            <span>Ved at bruge FerieFiks.dk's tjenester, accepterer du disse vilkår og betingelser.</span>

            <span class="text-h6 col-12">2. Sikkerhed</span>
            <span class="col-8"><span class="text-weight-bold">A.</span> FerieFiks.dk er udviklet som en del af et uddannelsesmæssigt eksamensprojekt. Vi tilbyder denne service med det formål at demonstrere og teste vores færdigheder og viden inden for softwareudvikling. </span>
            <span class="col-8"><span class="text-weight-bold">B.</span> På grund af projektets uddannelsesmæssige natur kan vi ikke garantere nogen form for sikkerhed i forbindelse med brugen af vores loginsystem eller andre dele af tjenesten.</span>
            <span class="col-8"><span class="text-weight-bold">C.</span> Du bør ikke bruge dine almindelige passwords eller dele personlige, følsomme eller fortrolige oplysninger gennem vores service.</span>
            <span class="col-8"><span class="text-weight-bold">D.</span> Vi fraskriver os ethvert ansvar for tab eller skader, der måtte opstå som følge af sikkerhedsbrister i vores system. </span>

            <span class="text-h6 col-12">
              3. Ansvarsbegrænsning
            </span>
            <span class="col-8">FerieFiks.dk er ikke ansvarlig for nogen direkte, indirekte, tilfældige, specielle, følgeskader eller eksemplariske skader som følge af brugen eller manglende evne til at bruge tjenesten. </span>

            <span class="text-h6 col-12">
              4. Ændringer i Vilkår
            </span>
            <span class="col-8">Vi forbeholder os retten til at ændre disse vilkår til enhver tid. Din fortsatte brug af tjenesten efter sådanne ændringer betragtes som accept af de nye vilkår.</span>
            <span class="col-4"></span>
            <div class="col-8 flex justify-center q-pt-lg">
              <q-btn
                style="width: 50%"
                class="bg-secondary text-accent"
                push size="lg"
                icon="arrow_back"
                label="Tilbage"
                @click="routeToFrontPage()">
              </q-btn>
            </div>
          </div>
        </section>
      </section>
    </section>


    <section class="mobile-only mobile-background">
      <section class="q-pa-md">
          <div class="col-12 row">
            <span class="text-h6 col-12">Terms of service for FerieFiks.dk </span>
            <span class="col-12">
              Før du benytter vores service, beder vi dig om nøje at gennemlæse disse vilkår.
            </span>

            <span class="text-h6 col-12">
              1. Accept af Vilkår
            </span>
            <span>Ved at bruge FerieFiks.dk's tjenester, accepterer du disse vilkår og betingelser.</span>

            <span class="text-h6 col-12">2. Sikkerhed</span>
            <span><span class="text-weight-bold">A.</span> FerieFiks.dk er udviklet som en del af et uddannelsesmæssigt eksamensprojekt. Vi tilbyder denne service med det formål at demonstrere og teste vores færdigheder og viden inden for softwareudvikling. </span>
            <span><span class="text-weight-bold">B.</span> På grund af projektets uddannelsesmæssige natur kan vi ikke garantere nogen form for sikkerhed i forbindelse med brugen af vores loginsystem eller andre dele af tjenesten.</span>
            <span><span class="text-weight-bold">C.</span> Du bør ikke bruge dine almindelige passwords eller dele personlige, følsomme eller fortrolige oplysninger gennem vores service.</span>
            <span><span class="text-weight-bold">D.</span> Vi fraskriver os ethvert ansvar for tab eller skader, der måtte opstå som følge af sikkerhedsbrister i vores system. </span>

            <span class="text-h6 col-12">
              3. Ansvarsbegrænsning
            </span>
            <span>FerieFiks.dk er ikke ansvarlig for nogen direkte, indirekte, tilfældige, specielle, følgeskader eller eksemplariske skader som følge af brugen eller manglende evne til at bruge tjenesten. </span>

            <span class="text-h6 col-12">
              4. Ændringer i Vilkår
            </span>
            <span>Vi forbeholder os retten til at ændre disse vilkår til enhver tid. Din fortsatte brug af tjenesten efter sådanne ændringer betragtes som accept af de nye vilkår.</span>
            <span class="col-4"></span>
            <div class="col-12 flex justify-center q-pt-lg">
              <q-btn
                style="width: 50%"
                class="bg-secondary text-accent"
                push size="lg"
                icon="arrow_back"
                label="Tilbage"
                @click="routeToFrontPage()">
              </q-btn>
            </div>
          </div>
        </section>
      </section>
  </q-page>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  name: "termsPage",
  data() {
    return {
      router: useRouter(),
    }
  },
  methods: {
    routeToFrontPage(){
      this.router.push('/')
    }
  }
}
</script>
