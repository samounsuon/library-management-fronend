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
            <div class="flex space-x-4">
              <!-- Book Image -->
              <div class="flex-shrink-0">
                <img 
                  v-if="book.image" 
                  :src="getImageSrc(book.image)" 
                  :alt="book.title"
                  class="h-20 w-16 object-cover rounded-md shadow-sm border border-gray-200"
                  @error="handleImageError"
                />
                <div 
                  v-else 
                  class="h-20 w-16 bg-gray-200 rounded-md flex items-center justify-center"
                >
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              
              <!-- Book Info -->
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-medium text-gray-900 truncate">{{ book.title }}</h3>
                <p class="text-sm text-gray-500">{{ book.author }}</p>
                <p class="text-sm text-gray-500">{{ book.year }} • {{ getCategoryName(book.category_id) }}</p>
                
                <div class="flex items-center mt-2 space-x-2">
                  <span class="text-xs font-medium text-gray-900">Stock: {{ book.numofbooks || 0 }}</span>
                  <span 
                    :class="getStockStatusClass(book.numofbooks)"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ getStockStatus(book.numofbooks) }}
                  </span>
                </div>
                
                <div class="flex items-center justify-between mt-3">
                  <button
                    @click="borrowBook(book.id)"
                    :class="book.borrowed || (book.numofbooks <= 0)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'"
                    class="px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200"
                    :disabled="book.borrowed || (book.numofbooks <= 0)"
                  >
                    {{ book.borrowed ? 'Borrowed' : (book.numofbooks <= 0 ? 'Out of Stock' : 'Available') }}
                  </button>
                  
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
                </div>
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
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(book, index) in books" :key="index" class="hover:bg-gray-50">
                <!-- Book Image -->
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="flex-shrink-0 h-12 w-10">
                    <img 
                      v-if="book.image" 
                      :src="getImageSrc(book.image)" 
                      :alt="book.title"
                      class="h-12 w-10 object-cover rounded shadow-sm border border-gray-200"
                      @error="handleImageError"
                    />
                    <div 
                      v-else 
                      class="h-12 w-10 bg-gray-200 rounded flex items-center justify-center"
                    >
                      <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                </td>
                
                <!-- Book Title -->
                <td class="px-3 py-4">
                  <div class="text-sm font-medium text-gray-900 max-w-xs truncate" :title="book.title">
                    {{ book.title }}
                  </div>
                </td>
                
                <!-- Author -->
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ book.author }}</div>
                </td>
                
                <!-- Year -->
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ book.year }}</div>
                </td>
                
                <!-- Number of Books (Stock) -->
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span class="text-sm font-medium text-gray-900">{{ book.numofbooks || 0 }}</span>
                    <span 
                      :class="getStockStatusClass(book.numofbooks)"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1"
                    >
                      {{ getStockStatus(book.numofbooks) }}
                    </span>
                  </div>
                </td>
                
                <!-- Category -->
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ getCategoryName(book.category_id) }}
                  </div>
                </td>
                
                <!-- Added Date -->
                <td class="px-3 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(book.created_at) }}</div>
                </td>
                
                <!-- Status -->
                <td class="px-3 py-4 whitespace-nowrap">
                  <button
                    @click="borrowBook(book.id)"
                    :class="book.borrowed || (book.numofbooks <= 0)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'"
                    class="px-2 py-1 rounded text-xs font-medium transition-colors duration-200"
                    :disabled="book.borrowed || (book.numofbooks <= 0)"
                  >
                    {{ book.borrowed ? 'Borrowed' : (book.numofbooks <= 0 ? 'Out of Stock' : 'Available') }}
                  </button>
                </td>
                
                <!-- Actions -->
                <td class="px-3 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-1">
                    <button
                      @click="openEditDialog(book)"
                      :disabled="updating === book.id"
                      class="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 p-1.5 rounded transition-colors duration-200 disabled:opacity-50"
                      title="Edit book"
                    >
                      <svg v-if="updating === book.id" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      @click="deleteBook(book.id)"
                      :disabled="deleting === book.id"
                      class="bg-red-50 text-red-600 hover:bg-red-100 p-1.5 rounded transition-colors duration-200 disabled:opacity-50"
                      title="Delete book"
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
              
              <!-- Desktop Empty State -->
              <tr v-if="books.length === 0 && !loading">
                <td colspan="9" class="px-6 py-12 text-center">
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
      <div class="relative top-10 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white m-4">
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
              <label for="numofbooks" class="block text-sm font-medium text-gray-700 mb-1">Number of books</label>
              <input
                v-model.number="formData.numofbooks"
                type="number"
                id="numofbooks"
                required
                min="0"
                :disabled="submitting"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
            
            <div>
              <label for="imageFile" class="block text-sm font-medium text-gray-700 mb-2">Book Cover Image</label>
              
              <!-- File Upload Input -->
              <div class="relative">
                <input
                  type="file"
                  id="imageFile"
                  ref="fileInput"
                  accept="image/*"
                  @change="handleImageUpload"
                  :disabled="submitting"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              
              <!-- Upload Guidelines -->
              <p class="text-xs text-gray-500 mt-1">
                Supported formats: JPG, PNG, GIF. Max size: 2MB. Images will be saved to src/images folder.
              </p>
              
              <!-- Image Preview -->
              <div v-if="imagePreview" class="mt-3 flex justify-center">
                <div class="relative">
                  <img 
                    :src="imagePreview" 
                    alt="Book cover preview"
                    class="h-32 w-24 object-cover rounded-md border border-gray-200 shadow-sm"
                    @error="handleImageError"
                  />
                  <button
                    type="button"
                    @click="clearImage"
                    :disabled="submitting"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              </div>
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
const fileInput = ref(null)
const imagePreview = ref(null)
const selectedImageFile = ref(null)

// Book form data - keeping your original structure
const formData = ref({
  title: '',
  author: '',
  image: '', // This will store only the filename
  numofbooks: '',
  year: new Date().getFullYear(),
  category_id: ''
})

// Function to get image source from filename
const getImageSrc = (filename) => {
  if (!filename) return null
  
  // If it's already a full URL or data URL, return as is
  if (filename.startsWith('http') || filename.startsWith('data:') || filename.startsWith('blob:')) {
    return filename
  }
  
  // Try to get from stored images first
  const storedImage = getStoredImage(filename)
  if (storedImage) {
    return storedImage
  }
  
  // Return path to src/images folder
  // Note: In production, you'd import these images or serve them from public folder
  try {
    return require(`@/images/${filename}`)
  } catch (e) {
    console.warn(`Image not found: ${filename}`)
    return null
  }
}

// Function to save image to src/images folder (simulated with localStorage)
const saveImageToSrcFolder = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = file.name.split('.').pop().toLowerCase()
      const filename = `book_${timestamp}_${randomString}.${extension}`
      
      // Read the file as data URL
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const dataUrl = e.target.result
          
          // Store the image data (simulating file save to src/images)
          // In a real application, you would:
          // 1. Send the file to your backend
          // 2. Backend saves it to src/images folder
          // 3. Return the filename
          
          // For demo purposes, store in localStorage
          localStorage.setItem(`src_image_${filename}`, dataUrl)
          
          // Also create a downloadable file (optional)
          downloadImageFile(filename, dataUrl)
          
          console.log(`Image saved to src/images/${filename}`)
          resolve(filename)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
      
    } catch (error) {
      reject(error)
    }
  })
}

// Function to create downloadable file (for manual saving to src/images)
const downloadImageFile = (filename, dataUrl) => {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  
  // Uncomment the next line if you want to auto-download the file
  // link.click()
  
  document.body.removeChild(link)
  
  // Show instruction to user
  console.log(`💡 To complete the setup, save the downloaded image to: src/images/${filename}`)
}

// Function to get stored image
const getStoredImage = (filename) => {
  return localStorage.getItem(`src_image_${filename}`)
}

// Format created_at date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Get category name by ID
const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.type : 'Unknown'
}

// Get stock status
const getStockStatus = (numofbooks) => {
  if (numofbooks <= 0) return 'Out of Stock'
  if (numofbooks <= 5) return 'Low Stock'
  return 'In Stock'
}

// Get stock status CSS class
const getStockStatusClass = (numofbooks) => {
  if (numofbooks <= 0) return 'bg-red-100 text-red-800'
  if (numofbooks <= 5) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

// Handle image loading errors
const handleImageError = (event) => {
  event.target.style.display = 'none'
}

// Handle image file upload - stores in src/images folder
const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Clear previous error
  modalError.value = null
  
  try {
    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error('Image file size must be less than 2MB')
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file (JPG, PNG, GIF)')
    }
    
    // Store the selected file for later processing
    selectedImageFile.value = file
    
    // Set preview image
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
    
  } catch (error) {
    console.error('Error processing image:', error)
    modalError.value = error.message || 'Error processing the image file'
    event.target.value = ''
  }
}

// Clear image
const clearImage = () => {
  selectedImageFile.value = null
  formData.value.image = ''
  imagePreview.value = null
  // Clear file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
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

// Create a new book - saves image to src/images and stores filename in database
const createBook = async () => {
  submitting.value = true
  modalError.value = null

  // Basic client-side validation
  if (
    !formData.value.title ||
    !formData.value.author ||
    !formData.value.numofbooks ||
    !formData.value.year ||
    !formData.value.category_id
  ) {
    modalError.value = 'Title, Author, Number of Books, Year, and Category are required.'
    submitting.value = false
    return
  }

  try {
    // Save image to src/images folder if one was selected
    if (selectedImageFile.value) {
      const filename = await saveImageToSrcFolder(selectedImageFile.value)
      formData.value.image = filename
    }

    // Send data to API - formData.image contains only the filename
    const response = await api.post('/books', formData.value)
    console.log('Book created:', response.data)
    books.value.push(response.data.book)
    closeModal()
  } catch (err) {
    console.error('Error creating book:', err)
    modalError.value = err.response?.data?.message || 'Failed to create book'
  } finally {
    submitting.value = false
  }
}

// Update existing book - saves image to src/images and stores filename in database
const updateBook = async () => {
  submitting.value = true
  updating.value = editingBookId.value
  modalError.value = null
  
  try {
    // Save new image to src/images folder if one was selected
    if (selectedImageFile.value) {
      const filename = await saveImageToSrcFolder(selectedImageFile.value)
      formData.value.image = filename
    }

    // Send data to API - formData.image contains only the filename
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

// Toggle borrowed status (local only)
const borrowBook = (bookId) => {
  const bookIndex = books.value.findIndex(book => book.id === bookId)
  if (bookIndex !== -1) {
    books.value[bookIndex].borrowed = !books.value[bookIndex].borrowed
  }
}

// Open create book modal
const openCreateDialog = () => {
  isEditing.value = false
  modalError.value = null
  imagePreview.value = null
  selectedImageFile.value = null
  formData.value = {
    title: '',
    author: '',
    image: '',
    numofbooks: '',
    year: new Date().getFullYear(),
    category_id: ''
  }
  showModal.value = true
}

// Open edit book modal
const openEditDialog = (book) => {
  isEditing.value = true
  editingBookId.value = book.id
  modalError.value = null
  selectedImageFile.value = null
  
  // Set form data
  formData.value = {
    title: book.title,
    author: book.author,
    image: book.image,
    numofbooks: book.numofbooks,
    year: book.year,
    category_id: book.category_id
  }
  
  // Set preview for existing image
  if (book.image) {
    imagePreview.value = getImageSrc(book.image)
  } else {
    imagePreview.value = null
  }
  
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
  isEditing.value = false
  editingBookId.value = null
  modalError.value = null
  imagePreview.value = null
  selectedImageFile.value = null
  // Clear file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

onMounted(() => {
  loadBooks()
  loadCategories()
})
</script>