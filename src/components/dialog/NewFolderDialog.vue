<script setup lang="ts">
import { ref, shallowRef } from 'vue'


const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'New folder teste'
  },
  currentFolder: {
    type: String,
    default: 'root'
  }
})

const emit = defineEmits(['update:modelValue', 'newFolderResponse'])

const folderName = ref('')
const newFolderError = ref('')

const toggle = (value: boolean) => {
  emit('update:modelValue', value)
  newFolderError.value = ''
  folderName.value = ''
}

const newFolder = () => {
  if (folderName.value.length > 0) {
    // Call the API to create a new folder
    let folder = {
      name: folderName.value,
      size: 0,
      type: 'folder',
      folder: props.currentFolder
    }
    let folders = JSON.parse(localStorage.getItem('folders') || '[]')
    folders.push(folder)
    localStorage.setItem('folders', JSON.stringify(folders))
    folderName.value = ''
    newFolderError.value = ''
    toggle(false)
    emit('newFolderResponse')
  } else {
    newFolderError.value = "Please enter a folder name"
  }
}
</script>

<template>
  <div class="text-center">
    <v-dialog
      :model-value=modelValue
      @update:model-value="toggle"
      max-width="600"
    >

      <v-card
        prepend-icon="mdi-account"
        :title=title
      >
        <v-card-text>
          <!-- NEW COMPONENT ALERT -->
          <v-row
            dense
            class="py-5"
            v-if=newFolderError
          >
            <v-col cols="12">
              <v-alert
                color="warning"
                icon="$error"
                type="error"
                dismissible
              >
                {{ newFolderError }}
                <template #close>
                  <v-btn
                    icon
                    @click="newFolderError = ''"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
              </v-alert>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                label="Folder name*"
                required
                variant="outlined"
                v-model=folderName
              ></v-text-field>
            </v-col>
          </v-row>
          <small class="text-orange-darken-3 text-caption">*indicates required field</small>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text="Close"
            variant="plain"
            @click="toggle(false)"
          ></v-btn>
          <v-btn
            color="orange-darken-3"
            text="Save"
            variant="tonal"
            @click=newFolder
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
