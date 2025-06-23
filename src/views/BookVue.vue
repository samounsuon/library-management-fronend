<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header with Create Button -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Book Store</h1>
        <button
          @click="openCreateDialog"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center"
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
          <svg class="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <div>
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
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(book, index) in books" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ book.title }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ book.author }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ book.year }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ book.category_id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(book.created_at) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    @click="borrowBook(book.id)"
                    :class="book.borrowed 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'"
                    class="px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                    :disabled="book.borrowed"
                  >
                    {{ book.borrowed ? 'Borrowed' : 'Available' }}
                  </button>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="openEditDialog(book)"
                      :disabled="updating === book.id"
                      class="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 p-2 rounded-md transition-colors duration-200 disabled:opacity-50"
                    >
                      <svg v-if="updating === book.id" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      @click="deleteBook(book.id)"
                      :disabled="deleting === book.id"
                      class="bg-red-50 text-red-600 hover:bg-red-100 p-2 rounded-md transition-colors duration-200 disabled:opacity-50"
                    >
                      <svg v-if="deleting === book.id" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              
              <!-- Empty State -->
              <tr v-if="books.length === 0 && !loading">
                <td colspan="7" class="px-6 py-12 text-center">
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
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
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
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
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
                <option v-for="(category, index) in categories" :key="index" :value="category.id">{{ category.type }}</option>
              
              </select>
            </div>
            
            <div class="flex justify-end space-x-3 pt-4">
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
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 disabled:opacity-50 flex items-center"
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
const loading = ref(false)
const error = ref(null)
const modalError = ref(null)
const showModal = ref(false)
const isEditing = ref(false)
const editingBookId = ref(null)
const submitting = ref(false)
const updating = ref(null)
const deleting = ref(null)



const formData = ref({
  title: '',
  author: '',
  year: new Date().getFullYear(),
  category_id: ''
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Load books from API
const loadBooks = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/books')
    books.value = response.data
    // console.log('Books loaded:', books.value)
  } catch (err) {
    console.error('Error loading books:', err)
  } finally {
    loading.value = false
  }
}

const categories=ref([]);
    onMounted (async () => {
    try {
        const response = await api.get('/category')
        categories.value = response.data
        console.log(categories)
        // console.log('Books loaded:', books.value)
    } catch (err) {
        console.error('Error loading books:', err)
    } 
    
});
// Create new book via API
const createBook = async () => {
  submitting.value = true
  modalError.value = null
  try {
    const response = await api.post('/books', formData.value)
    console.log('Book created:', response.data)
    
    // Add the new book to the local array
    books.value.push(response.data.book)
    
    closeModal()
    
    // Show success message (optional)
    console.log(response.data.message)
  } catch (err) {
    console.error('Error creating book:', err)
    modalError.value = err.response?.data?.message || 'Failed to create book'
  } finally {
    submitting.value = false
  }
}

// Update book via API
const updateBook = async () => {
  submitting.value = true
  updating.value = editingBookId.value
  modalError.value = null
  try {
    const response = await api.put(`/books/${editingBookId.value}`, formData.value)
    console.log('Book updated:', response.data)
    
    // Update the book in the local array
    const bookIndex = books.value.findIndex(book => book.id === editingBookId.value)
    if (bookIndex !== -1) {
      books.value[bookIndex] = {
        ...books.value[bookIndex],
        ...formData.value
      }
    }
    
    closeModal()
    
    // Show success message (optional)
    if (response.data.status === 'success') {
      console.log('Book updated successfully')
    }
  } catch (err) {
    console.error('Error updating book:', err)
    modalError.value = err.response?.data?.message || 'Failed to update book'
  } finally {
    submitting.value = false
    updating.value = null
  }
}

// Delete book via API
const deleteBook = async (bookId) => {
  if (!confirm('Are you sure you want to delete this book?')) {
    return
  }
  
  deleting.value = bookId
  try {
    await api.delete(`/books/${bookId}`)
    console.log('Book deleted successfully')
    
    // Remove the book from the local array
    books.value = books.value.filter(book => book.id !== bookId)
  } catch (err) {
    console.error('Error deleting book:', err)
    error.value = err.response?.data?.message || 'Failed to delete book'
  } finally {
    deleting.value = null
  }
}

// Borrow book (local state only - you can add API call if needed)
const borrowBook = (bookId) => {
  const bookIndex = books.value.findIndex(book => book.id === bookId)
  if (bookIndex !== -1) {
    books.value[bookIndex].borrowed = !books.value[bookIndex].borrowed
    console.log(`${books.value[bookIndex].borrowed ? 'Borrowed' : 'Returned'}: ${books.value[bookIndex].title}`)
  }
}

const openCreateDialog = () => {
  isEditing.value = false
  modalError.value = null
  formData.value = {
    title: '',
    author: '',
    year: new Date().getFullYear(),
    category_id: ''
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
    category_id: book.category_id
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
})
</script>