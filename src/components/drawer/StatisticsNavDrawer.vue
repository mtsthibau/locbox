<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const toggle = (value: boolean) => {
  emit('update:modelValue', value)
}
</script>

<template>

  <v-navigation-drawer :model-value="modelValue" :location="$vuetify.display.mobile ? 'bottom' : undefined" temporary>

    <slot></slot>

    <slot name="append">

    </slot>
  </v-navigation-drawer>
</template>
