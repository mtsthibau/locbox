<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'New file teste'
  },
  currentFolder: {
    type: String,
    default: 'root'
  }
})

const emit = defineEmits(['update:modelValue', 'newFileResponse'])

const file = ref<File>()

const toggle = (value: boolean) => {
  emit('update:modelValue', value)
}

const newFile = () => {

  let files = JSON.parse(localStorage.getItem('files') || '[]')

  const { name, size, type } = file.value || {}
  let newFile = {
    name,
    size,
    type,
    folder: props.currentFolder
  }

  files.push(newFile)
  localStorage.setItem('files', JSON.stringify(files))
  toggle(false)
  file.value = undefined
  emit('newFileResponse')
}

</script>

<template>
  <v-dialog :model-value=modelValue @update:model-value="toggle" max-width="800">
    <v-card prepend-icon="mdi-upload" :title=title>
      <v-file-upload density="default" v-model="file" />
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text="Close" variant="plain" @click="toggle(false)"></v-btn>
        <v-btn color="orange-darken-3" text="Save" variant="tonal" @click=newFile></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
