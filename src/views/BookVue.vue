<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Book Store</h1>
          <p class="mt-2 text-sm text-gray-600">Manage your book collection with ease</p>
        </div>
        <button
          @click="openCreateDialog"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center shadow-md hover:shadow-lg w-full sm:w-auto justify-center transform hover:-translate-y-0.5 ring-1 ring-indigo-300"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add New Book
        </button>
      </div>

      <!-- Search and Filter Bar -->
      <div class="mb-6 bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search books by title or author..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <select
          v-model="categoryFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.type }}
          </option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-md p-12 text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
        <p class="text-gray-600 font-medium">Loading your book collection...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <div class="flex-1">
            <h3 class="text-base font-semibold text-red-800">Error</h3>
            <p class="text-sm text-red-600 mt-1">{{ error }}</p>
            <button @click="loadBooks" class="mt-3 text-sm text-red-700 font-medium hover:text-red-800 transition-colors">
              Try Again
            </button>
          </div>
        </div>
      </div>

      <!-- Books Table -->
      <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Mobile Card View -->
        <div class="block sm:hidden">
          <div v-for="book in filteredBooks" :key="book.id" class="border-b border-gray-200 p-6 last:border-b-0">
            <div class="space-y-3">
              <h3 class="text-base font-semibold text-gray-900">{{ book.title }}</h3>
              <p class="text-sm text-gray-600">by {{ book.author }}</p>
              <div class="flex justify-between text-sm text-gray-600">
                <span>{{ book.year }}</span>
                <span>{{ getCategoryName(book.category_id) }}</span>
              </div>
              <div class="text-sm text-gray-600">Available: {{ book.numofbooks }}</div>
              <div class="flex space-x-2 pt-4">
                <button
                  @click="openEditDialog(book)"
                  :disabled="updating === book.id"
                  class="flex-1 bg-orange-500 text-white hover:bg-orange-600 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-md hover:shadow-lg ring-1 ring-orange-300"
                >
                  <svg v-if="updating === book.id" class="animate-spin w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Edit
                </button>
                <button
                  @click="deleteBook(book.id)"
                  :disabled="deleting === book.id"
                  class="flex-1 bg-red-500 text-white hover:bg-red-600 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-md hover:shadow-lg ring-1 ring-red-300"
                >
                  <svg v-if="deleting === book.id" class="animate-spin w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
          <!-- Mobile Empty State -->
          <div v-if="filteredBooks.length === 0 && !loading" class="p-12 text-center">
            <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
            </svg>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No Books Found</h3>
            <p class="text-gray-500">Try adjusting your search or add a new book.</p>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider cursor-pointer" @click="sortBooks('title')">
                  Title
                  <svg v-if="sortKey === 'title'" class="inline w-4 h-4 ml-1" :class="{ 'rotate-180': sortOrder === 'desc' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider cursor-pointer" @click="sortBooks('author')">
                  Author
                  <svg v-if="sortKey === 'author'" class="inline w-4 h-4 ml-1" :class="{ 'rotate-180': sortOrder === 'desc' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider cursor-pointer" @click="sortBooks('year')">
                  Year
                  <svg v-if="sortKey === 'year'" class="inline w-4 h-4 ml-1" :class="{ 'rotate-180': sortOrder === 'desc' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">Category</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">Available</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="book in filteredBooks" :key="book.id" class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ book.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-black">{{ book.author }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-black">{{ book.year }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-black">{{ getCategoryName(book.category_id) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-black">{{ book.numofbooks }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex space-x-2">
                   <!-- Edit Button -->
<!-- Edit Button (blue) -->
<button
  @click="openEditDialog(book)"
  :disabled="updating === book.id"
  class="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-2 rounded-md transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md"
>
  Edit
</button>

<!-- Delete Button (red) -->
<button
  @click="deleteBook(book.id)"
  :disabled="deleting === book.id"
  class="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-md transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md"
>
  Delete
</button>


                  </div>
                </td>
              </tr>
              <!-- Desktop Empty State -->
              <tr v-if="filteredBooks.length === 0 && !loading">
                <td colspan="6" class="px-6 py-16 text-center">
                  <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">No Books Found</h3>
                  <p class="text-gray-500">Try adjusting your search or add a new book.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
          <button
            @click="closeModal"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <h3 class="text-xl font-bold text-gray-900 mb-6">
            {{ isEditing ? 'Edit Book' : 'Add New Book' }}
          </h3>

          <!-- Error in Modal -->
          <div v-if="modalError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p class="text-sm text-red-600 font-medium">{{ modalError }}</p>
          </div>

          <form @submit.prevent="isEditing ? updateBook() : createBook()" class="space-y-5">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
              <input
                v-model="formData.title"
                type="text"
                id="title"
                required
                :disabled="submitting"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 transition-all"
                placeholder="Enter book title"
              />
            </div>

            <div>
              <label for="author" class="block text-sm font-medium text-gray-700 mb-1.5">Author</label>
              <input
                v-model="formData.author"
                type="text"
                id="author"
                required
                :disabled="submitting"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 transition-all"
                placeholder="Enter author name"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="year" class="block text-sm font-medium text-gray-700 mb-1.5">Year</label>
                <input
                  v-model.number="formData.year"
                  type="number"
                  id="year"
                  required
                  :disabled="submitting"
                  min="1000"
                  :max="new Date().getFullYear() + 1"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 transition-all"
                  placeholder="Publication year"
                />
              </div>
              <div>
                <label for="numofbooks" class="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
                <input
                  v-model.number="formData.numofbooks"
                  type="number"
                  id="numofbooks"
                  required
                  min="0"
                  :disabled="submitting"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 transition-all"
                  placeholder="Number of books"
                />
              </div>
            </div>

            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select
                v-model="formData.category_id"
                id="category"
                required
                :disabled="submitting"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 transition-all"
              >
                <option value="">Select a category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.type }}
                </option>
              </select>
            </div>

            <div class="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                @click="closeModal"
                :disabled="submitting"
                class="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg ring-1 ring-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center shadow-md hover:shadow-lg ring-1 ring-indigo-300"
              >
                <svg v-if="submitting" class="animate-spin w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ submitting ? 'Processing...' : (isEditing ? 'Update Book' : 'Add Book') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/plugins/axios'

const books = ref([])
const categories = ref([])
const loading = ref(false)
const error = ref(null)
const modalError = ref(null)
const showModal = ref(false)
const isEditing = ref(false)
const editingBookId = ref(null)
const submitting = ref(false)
const updating = ref(null)
const deleting = ref(null)
const searchQuery = ref('')
const categoryFilter = ref('')
const sortKey = ref('title')
const sortOrder = ref('asc')

const formData = ref({
  title: '',
  author: '',
  year: new Date().getFullYear(),
  category_id: '',
  numofbooks: 0,
  image: 'no-image.jpg'
})

const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.type : 'Unknown'
}

const filteredBooks = computed(() => {
  let filtered = books.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query)
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(book => book.category_id === categoryFilter.value)
  }

  return filtered.sort((a, b) => {
    const valueA = a[sortKey.value]
    const valueB = b[sortKey.value]
    const modifier = sortOrder.value === 'asc' ? 1 : -1

    if (typeof valueA === 'string') {
      return valueA.localeCompare(valueB) * modifier
    }
    return (valueA - valueB) * modifier
  })
})

const sortBooks = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const loadBooks = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/books')
    books.value = response.data
  } catch (err) {
    console.error('Error loading books:', err)
    error.value = err.response?.data?.message || 'Failed to load books'
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const response = await api.get('/category')
    categories.value = response.data.sort((a, b) => a.type.localeCompare(b.type))
  } catch (err) {
    console.error('Error loading categories:', err)
  }
}

const createBook = async () => {
  submitting.value = true
  modalError.value = null

  if (
    !formData.value.title ||
    !formData.value.author ||
    !formData.value.year ||
    !formData.value.category_id ||
    formData.value.numofbooks < 0
  ) {
    modalError.value = 'All fields are required and quantity must be non-negative.'
    submitting.value = false
    return
  }

  try {
    const response = await api.post('/books', formData.value)
    books.value.push(response.data.book)
    closeModal()
  } catch (err) {
    console.error('Error creating book:', err)
    modalError.value = err.response?.data?.message || 'Failed to create book'
  } finally {
    submitting.value = false
  }
}

const updateBook = async () => {
  submitting.value = true
  updating.value = editingBookId.value
  modalError.value = null

  try {
    const response = await api.put(`/books/${editingBookId.value}`, formData.value)
    const bookIndex = books.value.findIndex(book => book.id === editingBookId.value)
    if (bookIndex !== -1) {
      books.value[bookIndex] = { ...books.value[bookIndex], ...formData.value }
    }
    closeModal()
  } catch (err) {
    console.error('Error updating book:', err)
    modalError.value = err.response?.data?.message || 'Failed to update book'
  } finally {
    submitting.value = false
    updating.value = null
  }
}

const deleteBook = async (bookId) => {
  if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) return
  deleting.value = bookId
  try {
    await api.delete(`/books/${bookId}`)
    books.value = books.value.filter(book => book.id !== bookId)
  } catch (err) {
    console.error('Error deleting book:', err)
    error.value = err.response?.data?.message || 'Failed to delete book'
  } finally {
    deleting.value = null
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  modalError.value = null
  formData.value = {
    title: '',
    author: '',
    year: new Date().getFullYear(),
    category_id: '',
    numofbooks: 0,
    image: 'no-image.jpg'
  }
  showModal.value = true
}

const openEditDialog = (book) => {
  isEditing.value = true
  editingBookId.value = book.id
  modalError.value = null
  formData.value = {
    title: book.title,
    author: book.author,
    year: book.year,
    category_id: book.category_id,
    numofbooks: book.numofbooks,
    image: book.image || 'no-image.jpg'
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingBookId.value = null
  modalError.value = null
}

onMounted(() => {
  loadBooks()
  loadCategories()
})
</script>