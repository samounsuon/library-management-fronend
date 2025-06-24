<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6">
    <div class="max-w-full mx-auto">
      <!-- Header with Create Button -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Book Store</h1>
        <button
          @click="openCreateDialog"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center w-full sm:w-auto justify-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create New Book
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-md p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading books...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            <button @click="loadBooks" class="mt-2 text-sm text-red-800 underline hover:text-red-900">
              Try again
            </button>
          </div>
        </div>
      </div>

      <!-- Books Table -->
      <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Mobile Card View -->
        <div class="block sm:hidden">
          <div v-for="(book, index) in books" :key="index" class="border-b border-gray-200 p-4">
            <div class="space-y-2">
              <h3 class="text-sm font-medium text-gray-900">{{ book.title }}</h3>
              <p class="text-sm text-gray-500">by {{ book.author }}</p>
              <p class="text-sm text-gray-500">{{ book.year }} • {{ getCategoryName(book.category_id) }}</p>
              
              <div class="flex space-x-2 pt-2">
                <button
                  @click="openEditDialog(book)"
                  :disabled="updating === book.id"
                  class="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  <svg v-if="updating === book.id" class="animate-spin w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Edit
                </button>
                <button
                  @click="deleteBook(book.id)"
                  :disabled="deleting === book.id"
                  class="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 disabled:opacity-50"
                >
                  <svg v-if="deleting === book.id" class="animate-spin w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
          
          <!-- Mobile Empty State -->
          <div v-if="books.length === 0 && !loading" class="p-8 text-center">
            <div class="text-gray-400 mb-4">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No books available</h3>
            <p class="text-gray-500">Check back later for new additions to our collection.</p>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(book, index) in books" :key="index" class="hover:bg-gray-50">
                <!-- Book Title -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ book.title }}</div>
                </td>
                
                <!-- Author -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ book.author }}</div>
                </td>
                
                <!-- Year -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ book.year }}</div>
                </td>
                
                <!-- Category -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ getCategoryName(book.category_id) }}</div>
                </td>
                
                <!-- Actions -->
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="openEditDialog(book)"
                      :disabled="updating === book.id"
                      class="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 disabled:opacity-50"
                      title="Edit book"
                    >
                      <svg v-if="updating === book.id" class="animate-spin w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Edit
                    </button>
                    <button
                      @click="deleteBook(book.id)"
                      :disabled="deleting === book.id"
                      class="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 disabled:opacity-50"
                      title="Delete book"
                    >
                      <svg v-if="deleting === book.id" class="animate-spin w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              
              <!-- Desktop Empty State -->
              <tr v-if="books.length === 0 && !loading">
                <td colspan="5" class="px-6 py-12 text-center">
                  <div class="text-gray-400 mb-4">
                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">No books available</h3>
                  <p class="text-gray-500">Check back later for new additions to our collection.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white m-4">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ isEditing ? 'Edit Book' : 'Create New Book' }}
          </h3>
          
          <!-- Error in Modal -->
          <div v-if="modalError" class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-red-700">{{ modalError }}</p>
          </div>
          
          <form @submit.prevent="isEditing ? updateBook() : createBook()" class="space-y-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                v-model="formData.title"
                type="text"
                id="title"
                required
                :disabled="submitting"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Enter book title"
              />
            </div>
            
            <div>
              <label for="author" class="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                v-model="formData.author"
                type="text"
                id="author"
                required
                :disabled="submitting"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Enter author name"
              />
            </div>
            
            <div>
              <label for="year" class="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                v-model.number="formData.year"
                type="number"
                id="year"
                required
                :disabled="submitting"
                min="1000"
                max="2100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Enter publication year"
              />
            </div>
            
            <div>
              <label for="numofbooks" class="block text-sm font-medium text-gray-700 mb-1">Number of Books</label>
              <input
                v-model.number="formData.numofbooks"
                type="number"
                id="numofbooks"
                required
                min="0"
                :disabled="submitting"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="Enter number of books"
              />
            </div>
            
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                v-model="formData.category_id"
                id="category"
                required
                :disabled="submitting"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              >
                <option value="">Select a category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.type }}
                </option>
              </select>
            </div>
            
            <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                :disabled="submitting"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ submitting ? 'Processing...' : (isEditing ? 'Update Book' : 'Create Book') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

// Book form data - set image to a default placeholder value
const formData = ref({
  title: '',
  author: '',
  year: new Date().getFullYear(),
  category_id: '',
  numofbooks: '',
  image: 'no-image.jpg' // Set a default placeholder image name
})

// Get category name by ID
const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.type : 'Unknown'
}

// Load all books
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

// Load all categories
const loadCategories = async () => {
  try {
    const response = await api.get('/category')
    categories.value = response.data.sort((a, b) => a.type.localeCompare(b.type))
  } catch (err) {
    console.error('Error loading categories:', err)
  }
}

// Create a new book
const createBook = async () => {
  submitting.value = true
  modalError.value = null

  // Basic client-side validation
  if (
    !formData.value.title ||
    !formData.value.author ||
    !formData.value.year ||
    !formData.value.category_id ||
    !formData.value.numofbooks
  ) {
    modalError.value = 'All fields are required.'
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

// Update existing book
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

// Delete book
const deleteBook = async (bookId) => {
  if (!confirm('Are you sure you want to delete this book?')) return
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

// Open create book modal
const openCreateDialog = () => {
  isEditing.value = false
  modalError.value = null
  formData.value = {
    title: '',
    author: '',
    year: new Date().getFullYear(),
    category_id: '',
    numofbooks: '',
    image: 'no-image.jpg' // Set a default placeholder image name
  }
  showModal.value = true
}

// Open edit book modal
const openEditDialog = (book) => {
  isEditing.value = true
  editingBookId.value = book.id
  modalError.value = null
  
  // Set form data
  formData.value = {
    title: book.title,
    author: book.author,
    year: book.year,
    category_id: book.category_id,
    numofbooks: book.numofbooks,
    image: book.image || 'no-image.jpg' // Use existing image or default placeholder
  }
  
  showModal.value = true
}

// Close modal
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
