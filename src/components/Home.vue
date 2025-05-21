<script setup lang="ts">

import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps({
  boxCleared: {
    type: Boolean,
    default: false
  }
})


const emit = defineEmits(['newFileResponse', 'newFolderResponse'])

const page = ref(1)
const itemsPerPage = ref(5)
const showCreateFolderDialog = ref(false)
const showUploadFileDialog = ref(false)
const folders = ref([])
const files = ref([])
const dataTable = ref<(typeof folders.value[] | typeof files.value[])[]>([])
const filePath = `../../box/`
const currentFolder = ref('root')
const breadCrumbItens = ref(['Root'])
const showFileDialog = ref(false)
const currentFile = ref('')
const hint = ref(true)

const headers = [
  { title: '', key: 'file' },
  { title: 'Name', key: 'name' },
  { title: 'Type', key: 'type' },
  { title: 'Size', key: 'size' },
  { title: 'Starred', key: 'starred' },
]
const toggleCreateFolderDialog = () => {
  showCreateFolderDialog.value = !showCreateFolderDialog.value
}

const toggleUploadFileDialog = () => {
  showUploadFileDialog.value = !showUploadFileDialog.value
}

const fetchFolders = () => {
  folders.value = JSON.parse(localStorage.getItem('folders') || '[]').filter((file: any) => file.folder === currentFolder.value)
  dataTable.value = [...folders.value, ...files.value]
}

const fetchFiles = () => {
  files.value = JSON.parse(localStorage.getItem('files') || '[]').filter((file: any) => file.folder === currentFolder.value)
  dataTable.value = [...folders.value, ...files.value]

  emit('newFileResponse')
}

const pageCount = computed(() => {
  return Math.ceil(dataTable.value.length / itemsPerPage.value)
})

const openFolder = (name: string) => {
  currentFolder.value = name
  breadCrumbItens.value.push(name)
  files.value = JSON.parse(localStorage.getItem('files') || '[]').filter((file: any) => file.folder === name)
  folders.value = JSON.parse(localStorage.getItem('folders') || '[]').filter((file: any) => file.folder === name)
  dataTable.value = [...folders.value, ...files.value]

  emit('newFolderResponse')
}

const openItem = (type: string, name: string) => {
  if (type === 'folder') {
    openFolder(name)
  } else {
    showFileDialog.value = true
    currentFile.value = filePath + name
  }
}

const toggleFileDialog = () => {
  showFileDialog.value = !showFileDialog.value
}

const navigateBreadCrumb = (index: number) => {
  if (index === 0) {
    currentFolder.value = 'root'
    breadCrumbItens.value = ['Root']
  } else {
    currentFolder.value = breadCrumbItens.value[index]
    breadCrumbItens.value = breadCrumbItens.value.slice(0, index + 1)
  }

  fetchFolders()
  fetchFiles()
}

const flagStarred = (name: string) => {
  const files = JSON.parse(localStorage.getItem('files') || '[]')
  const index = files.filter((file: File, index: number) =>
    file.name === name
  ).map((item: JSON) => files.indexOf(item))[0]

  files[index].starred = !files[index].starred
  localStorage.setItem('files', JSON.stringify(files))
  fetchFolders()
  fetchFiles()
}

const closeHint = () => {
  hint.value = false
  localStorage.setItem('hint', JSON.stringify(hint.value))
}

watch(() => props.boxCleared, () => {
  fetchFiles()
})

onMounted(() => {
  hint.value = localStorage.getItem('hint') == null ? true : false
  fetchFolders()
  fetchFiles()
})

</script>

<template>
  <v-container
    max-width="1200"
    fluid
  >

    <v-row v-if="currentFolder == 'root' && hint === true">
      <v-col cols="12">
        <v-card
          class="py-3"
          color="orange-darken-1"
          rounded="lg"
          variant="tonal"
        >
          <v-card-title class="text-h6 font-weight-bold">
            Upload your files to the Sisloc Cloud Box.
          </v-card-title>
          <v-card-subtitle class="text-body-1 font-weight-light">
            <p>
              Keep your files safe and secure in the cloud, back them up and access them from anywhere.
            </p>
            <p>
              A simple and easy to use tool for managing your local storage.
            </p>
          </v-card-subtitle>
          <v-card-actions>
            <v-btn
              class="ma-2"
              variant="tonal"
              prepend-icon="mdi-check-circle"
              color="white"
              v-model="hint"
              @click="closeHint"
            > Understood
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card
          rounded="lg"
          variant="tonal"
        >
          <v-breadcrumbs divider=" / ">
            <v-breadcrumbs-item
              @click.native="navigateBreadCrumb(key)"
              v-for="(item, key) in breadCrumbItens"
            >
              / {{ item }}
            </v-breadcrumbs-item>
          </v-breadcrumbs>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6">
        <v-card
          class="py-4"
          color="surface-variant"
          rounded="lg"
          variant="tonal"
          @click="toggleCreateFolderDialog"
        >
          <v-card-title class="text-h6 font-weight-bold">
            <v-icon icon="mdi-folder-plus" /> Create new folder
          </v-card-title>
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-card
          class="py-4"
          color="surface-variant"
          rounded="lg"
          variant="tonal"
          @click="toggleUploadFileDialog"
        >
          <v-card-title class="text-h6 font-weight-bold">
            <v-icon icon="mdi-upload" /> Upload a new file
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        v-if="dataTable.length > 0"
      >
        <v-data-table
          class="mb-8"
          rounded="lg"
          :items="dataTable"
          :headers=headers
          :items-per-page="itemsPerPage"
          :page.sync="page"
        >
          <template v-slot:item="{ item }: { item: any }">
            <tr class="text-wrap cursor-pointer">
              <td
                v-if="item.type === 'image/png' || item.type === 'image/jpeg'"
                @click="openItem(item.type, item.name)"
              >
                <v-img
                  :src="`${filePath}${item.name}`"
                  :width="25"
                  aspect-ratio="16/9"
                  cover
                />
              </td>
              <td
                v-else
                @click="openItem(item.type, item.name)"
              >
                <v-icon icon="mdi-folder text-center" />
              </td>
              <td @click="openItem(item.type, item.name)">{{ item.name }}</td>
              <td @click="openItem(item.type, item.name)">{{ item.type }}</td>
              <td @click="openItem(item.type, item.name)">{{ item.size }}</td>
              <td @click="flagStarred(item.name)">
                <v-icon
                  icon="mdi-star-outline"
                  :color="(item.starred ? 'orange-darken-3' : 'white')"
                  v-if="item.type !== 'folder'"
                ></v-icon>
              </td>
            </tr>
          </template>
          <template v-slot:bottom>
            <div class="text-center pt-2 py-4">
              <v-pagination
                v-model="page"
                :length="pageCount"
              ></v-pagination>
            </div>
          </template>
        </v-data-table>
      </v-col>

      <v-col
        cols="12"
        v-else
      >
        <v-card
          class="py-4"
          color="surface-variant"
          rounded="lg"
          variant="tonal"
        >
          <v-card-title class="text-h6 font-weight-bold text-center text-orange-darken-3">
            <v-icon icon="mdi-robot-confused" />
            <p>No files or folders found</p>
          </v-card-title>
          <v-card-subtitle class="text-h6 font-weight-bold text-center">
            Upload your first file or create a new folder.
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <open-file-dialog
    v-model="showFileDialog"
    :filePath=currentFile
  />
  <new-folder-dialog
    @newFolderResponse="fetchFolders"
    v-model="showCreateFolderDialog"
    title="New folder"
    :currentFolder=currentFolder
  />
  <new-file-dialog
    @newFileResponse="fetchFiles"
    v-model="showUploadFileDialog"
    title="New file"
    :currentFolder=currentFolder
  />

</template>
