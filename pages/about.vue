<template>
  <v-data-table-server
    v-model:page="page"
    :items-per-page="itemsPerPage"
    :search="search"
    :headers="headers"
    :items-length="totalItems"
    :items="serverItems"
    :loading="loading"
    item-value="id"
    @update:options="loadItems"
  >
  <template v-slot:top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>My CRUD</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="props"
            >
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.id"
                      label="id"
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.username"
                      label="username"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.password"
                      label="password"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.email"
                      label="email"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="save"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        size="small"
        class="me-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      No Data
    </template>
    <template v-slot:tfoot>
      <tr>
        <td style="min-width: 120px;">
          <v-text-field v-model="keyword" hide-details placeholder="Search keyword..." class="ma-2" density="compact"></v-text-field>
        </td>
        <td>
          <v-text-field
            v-model="hits"
            hide-details
            placeholder="Minimum hits"
            type="number"
            class="ma-2"
            density="compact"
          ></v-text-field>
        </td>
      </tr>
    </template>
    <template v-slot:bottom>
      <div class="text-center pt-2">
        <v-pagination
          v-model="page"
          :length="pageCount"
          :total-visible="6"
        ></v-pagination>
      </div>
    </template>
  </v-data-table-server>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      itemsPerPage: 5,
      headers: [
        {
          title: 'id',
          align: 'start',
          key: 'id',
        },
        { title: 'username', key: 'username', align: 'end' },
        { title: 'password', key: 'password', align: 'end' },
        { title: 'email', key: 'email', align: 'end' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      serverItems: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        username: 'string',
        password: 'string',
        email: 'string',
      },
      defaultItem: {
        id: '',
        username: 'string',
        password: 'string',
        email: 'string',
      },
      loading: true,
      totalItems: 0,
      keyword: '',
      hits: '',
      search: '',
      page: 1,
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
      pageCount () {
        return Math.ceil(this.totalItems / this.itemsPerPage)
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
      keyword () {
        this.search = String(Date.now())
      },
      hits () {
        this.search = String(Date.now())
      },
    },
    
    methods: {
      editItem (item) {
        this.editedIndex = item.id
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = item.id
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      async deleteItemConfirm () {
        const result = await $fetch('/api/user/delete', {
          method: 'post',
          body: { id : this.editedIndex }
        })
        this.loadItems({ page: this.page, itemsPerPage: this.itemsPerPage })
        this.closeDelete()
      },
      
      async save () {
        if (this.editedIndex > -1) {
          const result = await $fetch('/api/user/update', {
            method: 'post',
            body: this.editedItem
          })
        } else {
          const result = await $fetch('/api/user/new', {
            method: 'post',
            body: this.editedItem
          })
        }
        this.loadItems({ page: this.page, itemsPerPage: this.itemsPerPage })
        this.close()
      },
      
      loadItems ({ page, itemsPerPage, sortBy }) {
        this.loading = true
        fetchData({ page, itemsPerPage, sortBy, search: { keyword: this.keyword, hits: this.hits }  }).then((data) => {
          this.serverItems = data.value.items
          this.totalItems = data.value.total
          this.loading = false
        })
      },
    },
  }

  function fetchData ({ page, itemsPerPage, sortBy, search }) {
    return new Promise(resolve => {
      setTimeout(async () => {
        const { data } = await useFetch('/api/user', {
          query: { page, itemsPerPage, sortBy, search },
          lazy: true
        })

        resolve(data)
      })
    })
  }
</script>