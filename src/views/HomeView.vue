<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-semibold text-gray-900 mb-2">Library Collection</h1>
        <p class="text-gray-600">Browse and borrow from our book collection</p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-700">{{ error }}</p>
        <button @click="loadBooks" class="mt-2 text-red-600 underline">Try again</button>
      </div>

      <!-- No Books -->
      <div v-else-if="books.length === 0" class="text-center py-16">
        <h3 class="text-xl font-medium text-gray-900 mb-2">No books available</h3>
        <p class="text-gray-500">Check back later for new additions</p>
      </div>

      <!-- Book Cards (Text Only) -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="(book, index) in books" :key="index"
          class="p-4 border border-gray-300 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ book.title }}</h3>
          <p class="text-sm text-gray-700">Author: {{ book.author }}</p>
          <p class="text-sm text-gray-700">Year: {{ book.year }}</p>
          <p class="text-sm text-gray-700">Category: {{ getCategoryName(book.category_id) }}</p>
          <p class="text-sm" :class="book.numofbooks > 0 ? 'text-green-600' : 'text-red-600'">
            {{ book.numofbooks > 0 ? `${book.numofbooks} available` : 'Out of stock' }}
          </p>
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

// Get category name by ID
const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.type : 'Unknown'
}

// Load books
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

// Load categories
const loadCategories = async () => {
  try {
    const response = await api.get('/category')
    categories.value = response.data.sort((a, b) => a.type.localeCompare(b.type))
  } catch (err) {
    console.error('Error loading categories:', err)
  }
}

onMounted(() => {
  loadBooks()
  loadCategories()
})
</script>

<style scoped>
/* Optional: keep line clamp if you want to cut long titles */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
