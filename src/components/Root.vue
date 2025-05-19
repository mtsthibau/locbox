<script setup>
import { onMounted, ref, watch } from 'vue'
const drawer = ref(false)
const group = ref(null)

const typeFiles = [
  '10 folders',
  '80 images',
  '2 pdfs',
  '5 videos',
  '3 audios',
  '2 docs',
  '1 zip',
  '3 presentations',
  '1 spreadsheet',
  '1 text file',
  '1 other'
];

const diskUsage = ref(100)
const clearBoxConfirmation = ref(false)
const boxCleared = ref(false)

const calcDiskUsage = () => {
  const totalStorage = 10240; // 10MB
  const usedStorage = JSON.stringify(localStorage).length / 1024;
  diskUsage.value = Math.min((usedStorage / totalStorage) * 100, 100).toFixed(3); // Calculate percentage and cap at 100%
}

const clearBox = () => {
  localStorage.clear()
  clearBoxConfirmation.value = !clearBoxConfirmation
  boxCleared.value = true
}

watch(group, () => {
  drawer.value = false
})

onMounted(() => {
  calcDiskUsage()
})
</script>

<template>
  <v-card>
    <v-layout>

      <v-app-bar color="default" @click.stop="drawer = !drawer">
        <v-app-bar-nav-icon variant="text" />
        <v-img class="mx-1" max-height="100" max-width="100" contain src="@/assets/sisloc.png" />
        <v-toolbar-title>
          <span class="text-orange-darken-3"><strong>LocBox</strong></span>
        </v-toolbar-title>
      </v-app-bar>

      <statistics-nav-drawer v-model="drawer">
        <template v-slot:default>

          <v-list density="compact" nav class="mb-3">
            <v-list-item prepend-icon="mdi-home" title="/ Root" value="shared" to="/"></v-list-item>

            <v-list-item prepend-icon="mdi-star" title="Starred" value="starred" to="/starred"></v-list-item>
          </v-list>

          <!-- <v-divider class="mb-5"></v-divider>

          <v-chip-group column class="mb-5">
            <v-chip v-for="type in typeFiles" :key="type" :text="type" :value="type"></v-chip>
          </v-chip-group> -->

          <v-divider class="mb-5"></v-divider>

          <v-row class="pa-5 mb-5">
            <h5 class="mb-2">Disk Usage</h5>
            <v-progress-linear v-model="diskUsage" color="orange-darken-3" height="25">
              <strong> {{ diskUsage }}% </strong>
            </v-progress-linear>
          </v-row>

          <v-divider class="mb-5"></v-divider>
        </template>

        <template v-slot:append>
          <div class="px-2 py-5 my-5">
            <v-btn block variant="tonal" prepend-icon="mdi-trash-can-outline" color="orange-darken-3"
              @click="clearBoxConfirmation = !clearBoxConfirmation">
              clear your box
            </v-btn>
          </div>

          <v-dialog v-model=clearBoxConfirmation max-width="800">
            <v-card class="text-h6">
              <v-card-title prepend-icon="mdi-warning">
                Clear LocBox
              </v-card-title>
              <v-card-subtitle>
                You are going to lose all your Data.
                That action cannot be undone. Do you want to continue?
              </v-card-subtitle>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text="Close" variant="plain" @click="clearBoxConfirmation = !clearBoxConfirmation"></v-btn>
                <v-btn color="orange-darken-3" text="clear" variant="tonal" @click=clearBox></v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </template>
      </statistics-nav-drawer>

      <v-main>
        <home @newFileResponse="calcDiskUsage" @newFolderResponse="calcDiskUsage" :boxCleared=boxCleared />
      </v-main>

    </v-layout>
  </v-card>

  <v-footer class="d-flex align-center justify-center ga-2 flex-wrap flex-grow-1 py-3 border-t-md" color="default">
    <h5 class="text-orange-darken-3">
      <v-icon icon="mdi-copyleft" />
      SISLOC SOFTWARES - MATHEUS THIBAU
    </h5>
  </v-footer>

</template>
