<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  filePath: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'newFileResponse'])

const file = ref<File>()

const toggle = (value: boolean) => {
  emit('update:modelValue', value)
}

const download = () => {
  return true
}
</script>

<template>
  <v-dialog
    :model-value=modelValue
    @update:model-value="toggle"
    max-width="800"
  >
    <v-card
      :title="filePath"
      class="text-h6"
    >
      <div>
        <v-card-item>
          <v-img
            :src="filePath"
            :width="300"
            aspect-ratio="16/9"
            cover
          />
        </v-card-item>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text="Close"
          variant="plain"
          @click="toggle(false)"
        ></v-btn>
        <v-btn
          color="orange-darken-3"
          text="Download"
          variant="tonal"
          @click=download
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
