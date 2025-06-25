<template>
  <div class="max-w-6xl mx-auto p-6 space-y-6">
    <div class="bg-white shadow rounded-lg border">
      <!-- Header -->
      <div class="px-6 py-4 border-b">
        <div class="flex items-center gap-2 mb-2">
          <div class="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Category Management</h2>
        </div>
        <p class="text-gray-600">Manage your product categories. Add, edit, or remove categories as needed.</p>
      </div>

      <div class="p-6 space-y-6">
        <!-- Add New Category -->
        <div class="flex gap-3">
          <div class="flex-1">
            <input v-model="newCategory" @keypress.enter="createCategory" placeholder="Enter new category type..."
              class="w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <button @click="createCategory"
            class="h-10 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </button>
        </div>

        <!-- Search -->
        <div class="relative">
          <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" fill="none"
            stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input v-model="searchTerm" placeholder="Search categories..."
            class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
        </div>

        <!-- Categories Table -->
        <div class="border rounded-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b">
                <tr>
                  <th class="text-left px-6 py-3 text-xs font-medium text-black uppercase tracking-wider">
                    ID
                  </th>
                  <th class="text-left px-6 py-3 text-xs font-medium text-black uppercase tracking-wider">
                    Category Type
                  </th>
                  <th class="text-right px-6 py-3 text-xs font-medium text-black uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <!-- Loading skeleton rows - FIXED -->
                <template v-if="loading">
                  <tr v-for="i in 5" :key="`loading-${i}`" class="animate-pulse">
                    <td class="px-6 py-4">
                      <div class="h-4 bg-gray-200 rounded w-8"></div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="h-4 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex justify-end gap-2">
                        <div class="h-8 w-16 bg-gray-200 rounded"></div>
                        <div class="h-8 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </td>
                  </tr>
                </template>

                <!-- Empty state -->
                <tr v-else-if="filteredCategories.length === 0">
                  <td colspan="3" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center">
                      <div class="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 class="text-lg font-medium text-gray-900 mb-2">
                        {{ searchTerm ? 'No categories found' : 'No categories yet' }}
                      </h3>
                      <p class="text-gray-500 text-center max-w-sm">
                        {{ searchTerm
                          ? 'Try adjusting your search terms or add a new category.'
                          : 'Get started by adding your first category above.'
                        }}
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Category rows -->
                <tr v-else v-for="category in filteredCategories" :key="category.id"
                  class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                      {{ category.id }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <input v-if="editingId === category.id" v-model="editingValue"
                      @keypress.enter="saveEdit(category.id)" @keydown.esc="cancelEdit"
                      class="max-w-xs px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      ref="editInput" />
                    <div v-else class="font-medium text-gray-900">{{ category.type }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="flex justify-end gap-2">
                      <template v-if="editingId === category.id">
                        <button @click="saveEdit(category.id)"
                          class="h-8 px-3 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors flex items-center gap-1">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Save
                        </button>
                        <button @click="cancelEdit"
                          class="h-8 px-3 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors flex items-center gap-1">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                      </template>
                      <template v-else>
                        <!-- Edit Button -->
                        <button @click="startEdit(category)"
                          class="h-8 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors font-medium shadow-sm">
                          Edit
                        </button>

                        <!-- Delete Button -->
                        <button @click="confirmDelete(category.id)"
                          class="h-8 px-4 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors font-medium shadow-sm">
                          Delete
                        </button>

                      </template>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Table Footer with Stats -->
        <div v-if="!loading"
          class="flex items-center justify-between text-sm text-gray-500 bg-gray-50 px-6 py-3 rounded-lg border">
          <div>
            Showing {{ filteredCategories.length }} of {{ categories.length }} categories
          </div>
          <div v-if="searchTerm" class="flex items-center gap-2">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Filtered by: "{{ searchTerm }}"
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show" :class="[
      'fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300 z-50',
      toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    ]">
      <div class="flex items-center gap-2">
        <svg v-if="toast.type === 'success'" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <div>
          <div class="font-medium">{{ toast.title }}</div>
          <div class="text-sm opacity-90">{{ toast.description }}</div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="deleteId !== null" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="deleteId = null">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Delete Category</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this category? This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button @click="deleteId = null"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="deleteCategory(deleteId)"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import api from '@/plugins/axios' // Replace with your API setup

// Reactive state
const categories = ref([])
const newCategory = ref('')
const searchTerm = ref('')
const editingId = ref(null)
const editingValue = ref('')
const loading = ref(true)
const deleteId = ref(null)
const editInput = ref(null)

// Toast notification state
const toast = ref({
  show: false,
  type: 'success',
  title: '',
  description: ''
})

// Computed properties
const filteredCategories = computed(() => {
  return categories.value.filter(category =>
    category.type.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

// Toast helper function
const showToast = (type, title, description) => {
  toast.value = { show: true, type, title, description }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// API methods
const fetchCategories = async () => {
  try {
    loading.value = true
    const response = await api.get('/category')
    categories.value = response.data
  } catch (error) {
    showToast('error', 'Error', 'Failed to fetch categories')
    console.error('Error fetching categories:', error)
  } finally {
    loading.value = false
  }
}

const createCategory = async () => {
  if (!newCategory.value.trim()) {
    showToast('error', 'Validation Error', 'Category type is required')
    return
  }

  try {
    const response = await api.post('/category', {
      type: newCategory.value.trim()
    })
    categories.value.push(response.data)
    newCategory.value = ''
    showToast('success', 'Success', 'Category created successfully')
  } catch (error) {
    showToast('error', 'Error', 'Failed to create category')
    console.error('Error creating category:', error)
  }
}

const startEdit = async (category) => {
  editingId.value = category.id
  editingValue.value = category.type
  await nextTick()
  if (editInput.value) {
    editInput.value.focus()
  }
}

const cancelEdit = () => {
  editingId.value = null
  editingValue.value = ''
}

const saveEdit = async (id) => {
  if (!editingValue.value.trim()) {
    showToast('error', 'Validation Error', 'Category type cannot be empty')
    return
  }

  try {
    await api.put(`/category/${id}`, {
      type: editingValue.value.trim()
    })
    const categoryIndex = categories.value.findIndex(cat => cat.id === id)
    if (categoryIndex !== -1) {
      categories.value[categoryIndex].type = editingValue.value.trim()
    }
    editingId.value = null
    editingValue.value = ''
    showToast('success', 'Success', 'Category updated successfully')
  } catch (error) {
    showToast('error', 'Error', 'Failed to update category')
    console.error('Error updating category:', error)
  }
}

const confirmDelete = (id) => {
  deleteId.value = id
}

const deleteCategory = async (id) => {
  try {
    await api.delete(`/category/${id}`)
    categories.value = categories.value.filter(c => c.id !== id)
    deleteId.value = null
    showToast('success', 'Success', 'Category deleted successfully')
  } catch (error) {
    showToast('error', 'Error', 'Failed to delete category')
    console.error('Error deleting category:', error)
  }
}

// Lifecycle
onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: .5;
  }
}
</style>
