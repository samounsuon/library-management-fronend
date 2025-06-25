<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6">
    <div class="max-w-full mx-auto">
      <!-- Header with Improved Borrow Button -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Borrowed Books</h1>
        <button
          @click="openBorrowDialog"
          class="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center w-full sm:w-auto justify-center shadow-md"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
          </svg>
          Borrow Book
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-md p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading borrowed books...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex">
          <svg class="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
            <button @click="loadBorrowedBooks" class="mt-2 text-sm text-red-800 underline hover:text-red-900">
              Try again
            </button>
          </div>
        </div>
      </div>

      <!-- Borrowed Books Table -->
      <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Mobile Card View -->
        <div class="block sm:hidden">
          <div v-for="(borrow, index) in borrowedBooks" :key="index" class="border-b border-gray-200 p-4">
            <div class="space-y-2">
              <div class="flex justify-between items-start">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  ID: {{ index + 1 }}
                </span>
              </div>
              <h3 class="text-sm font-medium text-gray-900">{{ getBookTitle(borrow.book_id) }}</h3>
              <p class="text-sm text-gray-500">by {{ getBookAuthor(borrow.book_id) }}</p>
              <p class="text-sm text-gray-500">Member: {{ getMemberName(borrow.member_id) }}</p>
              <p class="text-sm text-gray-500">Borrowed: {{ formatDate(borrow.borrow_date) }}</p>
              <p class="text-sm text-gray-500">Due: {{ formatDate(borrow.due_date) }}</p>
              
              <div class="flex space-x-2 pt-2">
                <button
                  @click="returnBook(borrow.id)"
                  :disabled="returning === borrow.id"
                  class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-sm"
                >
                  <svg v-if="returning === borrow.id" class="animate-spin w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Return
                </button>
              </div>
            </div>
          </div>
          
          <!-- Mobile Empty State -->
          <div v-if="borrowedBooks.length === 0 && !loading" class="p-8 text-center">
            <div class="text-gray-400 mb-4">
              <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No borrowed books</h3>
            <p class="text-gray-500">No books are currently borrowed.</p>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book Title</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrow Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(borrow, index) in borrowedBooks" :key="index" class="hover:bg-gray-50 transition-colors duration-200">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ index + 1 }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ getBookTitle(borrow.book_id) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ getBookAuthor(borrow.book_id) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ getMemberName(borrow.member_id) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(borrow.borrow_date) }}</div>
                </td>             
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="returnBook(borrow.id)"
                    :disabled="returning === borrow.id"
                    class="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-sm"
                    title="Return book"
                  >
                    <svg v-if="returning === borrow.id" class="animate-spin w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Return
                  </button>
                </td>
              </tr>
              
              <!-- Desktop Empty State -->
              <tr v-if="borrowedBooks.length === 0 && !loading">
                <td colspan="6" class="px-6 py-12 text-center">
                  <div class="text-gray-400 mb-4">
                    <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">No borrowed books</h3>
                  <p class="text-gray-500">No books are currently borrowed.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Enhanced Borrow Book Modal -->
    <div v-if="showBorrowModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">Borrow Book</h3>
            <button @click="closeBorrowModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <!-- Error in Modal -->
          <div v-if="modalError" class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div class="flex">
              <svg class="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-sm text-red-700">{{ modalError }}</p>
            </div>
          </div>
          
          <form @submit.prevent="borrowBook" class="space-y-6">
            <div>
              <label for="member" class="block text-sm font-medium text-gray-700 mb-2">Select Member</label>
              <select
                v-model="borrowFormData.member_id"
                id="member"
                required
                :disabled="submitting"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 transition-colors"
              >
                <option value="">Choose a member</option>
                <option v-for="member in members" :key="member.id" :value="member.id">
                  {{ member.name }}
                </option>
              </select>
            </div>
            
            <div>
              <label for="book" class="block text-sm font-medium text-gray-700 mb-2">Select Book</label>
              <select
                v-model="borrowFormData.book_id"
                id="book"
                required
                :disabled="submitting"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 transition-colors"
              >
                <option value="">Choose a book</option>
                <option v-for="book in availableBooks" :key="book.id" :value="book.id">
                  {{ book.title }} by {{ book.author }} ({{ book.numofbooks }} available)
                </option>
              </select>
            </div>

            <div>
              <label for="date" class="block text-sm font-medium text-gray-700 mb-2">Borrow Date</label>
              <input
                type="date"
                id="date"
                v-model="borrowFormData.date"
                required
                :disabled="submitting"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-gray-100 transition-colors"
              />
            </div>
            
            <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6">
              <button
                type="button"
                @click="closeBorrowModal"
                :disabled="submitting"
                class="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg flex items-center justify-center"
              >
                <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ submitting ? 'Processing...' : 'Borrow Book' }}
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

const borrowedBooks = ref([])
const books = ref([])
const members = ref([])
const loading = ref(false)
const error = ref(null)
const modalError = ref(null)

// Modal states
const showBorrowModal = ref(false)
const submitting = ref(false)
const returning = ref(null)

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  return new Date().toISOString().split('T')[0]
}

// Form data for borrowing with automatic date setting
const borrowFormData = ref({
  member_id: '',
  book_id: '',
  date: getTodayDate()
})

// Computed property for available books (books with numofbooks > 0)
const availableBooks = computed(() => {
  return books.value.filter(book => book.numofbooks > 0)
})

// Helper functions
const getBookTitle = (bookId) => {
  const book = books.value.find(b => b.id === bookId)
  return book ? book.title : 'Unknown Book'
}

const getBookAuthor = (bookId) => {
  const book = books.value.find(b => b.id === bookId)
  return book ? book.author : 'Unknown Author'
}

const getMemberName = (memberId) => {
  const member = members.value.find(m => m.id === memberId)
  return member ? member.name : 'Unknown Member'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}

// Load borrowed books
const loadBorrowedBooks = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await api.get('/borrow')
    borrowedBooks.value = response.data
    console.log('Borrowed books:', borrowedBooks.value)
  } catch (err) {
    console.error('Error loading borrowed books:', err)
    error.value = err.response?.data?.message || 'Failed to load borrowed books'
  } finally {
    loading.value = false
  }
}

// Load all books
const loadBooks = async () => {
  try {
    const response = await api.get('/books')
    books.value = response.data
    console.log('Books:', books.value)
  } catch (err) {
    console.error('Error loading books:', err)
  }
}

// Load all members
const loadMembers = async () => {
  try {
    const response = await api.get('/member')
    members.value = response.data.members || response.data
    console.log('Members:', members.value)
  } catch (err) {
    console.error('Error loading members:', err)
  }
}

// Handle borrow book with proper date handling
const borrowBook = async () => {
  submitting.value = true
  modalError.value = null

  if (!borrowFormData.value.member_id || !borrowFormData.value.book_id) {
    modalError.value = 'Please select both a member and a book.'
    submitting.value = false
    return
  }

  if (!borrowFormData.value.date) {
    modalError.value = 'Please select a borrow date.'
    submitting.value = false
    return
  }

  try {
    // Prepare the data with all required fields including dates
    const borrowData = {
      member_id: parseInt(borrowFormData.value.member_id),
      book_id: parseInt(borrowFormData.value.book_id),
      date: borrowFormData.value.date
    }

    console.log('Sending borrow data:', borrowData)

    const response = await api.post('/borrow', borrowData)
    console.log('Borrow response:', response.data)
    
    alert('Book borrowed successfully!')
    closeBorrowModal()
    loadBorrowedBooks() // Reload borrowed books
    loadBooks() // Reload books to update available count
  } catch (err) {
    console.error('Error borrowing book:', err)
    modalError.value = err.response?.data?.message || 'Failed to borrow book. Please check if all required fields are provided.'
  } finally {
    submitting.value = false
  }
}

// Return book - CHANGED TO USE DELETE API AS REQUESTED
const returnBook = async (borrowId) => {
  if (!confirm('Are you sure you want to return this book?')) return
  
  returning.value = borrowId
  try {
    // CHANGED: Using api.delete instead of api.put as requested
    await api.delete(`/borrow/${borrowId}`)
    loadBorrowedBooks() // Reload borrowed books
    loadBooks() // Reload books to update available count
    alert('Book returned successfully!')
  } catch (err) {
    console.error('Error returning book:', err)
    error.value = err.response?.data?.message || 'Failed to return book'
  } finally {
    returning.value = null
  }
}

// Open borrow modal
const openBorrowDialog = () => {
  modalError.value = null
  borrowFormData.value = {
    member_id: '',
    book_id: '',
    date: getTodayDate()
  }
  showBorrowModal.value = true
}

// Close borrow modal
const closeBorrowModal = () => {
  showBorrowModal.value = false
  modalError.value = null
}

onMounted(() => {
  loadBorrowedBooks()
  loadBooks()
  loadMembers()
})
</script>