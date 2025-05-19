<script setup lang="ts">

import { computed, onMounted, ref } from 'vue'

const starreFiles = ref([])
const filePath = `../../box/`

const getStarredFIles = () => {
  starreFiles.value = JSON.parse(localStorage.getItem('files') || '[]').filter((file: any) => file.starred === true)
}


onMounted(() => {
  getStarredFIles()
})
</script>

<template>
  <v-container max-width="1200" fluid>
    <h1 class="my-5"><v-icon icon="mdi-star" /> Starred</h1>
    <code class="d-flex">
    <v-row v-for="item in starreFiles" class="my-5">
      <v-img class="ma-1" max-height="250" max-width="250" contain :src="`${filePath}${item.name}`" />
    </v-row>
    </code>
  </v-container>
</template>
