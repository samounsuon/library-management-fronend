<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">Book Store</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="(book, index) in books"
          :key="index"
          class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <!-- Book Image -->
          <div class="h-64 overflow-hidden">
            <img 
              :src="book.image || '/placeholder.svg?height=256&width=192'"
              :alt="book.title"
              class="w-full h-full object-cover"
            />
          </div>
          
          <!-- Book Details -->
          <div class="p-4">
            <h2 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{{ book.title }}</h2>
            
            <div class="space-y-1 mb-4">
              <p class="text-gray-600 text-sm">
                <span class="font-medium">Author:</span> {{ book.author }}
              </p>
              <p class="text-gray-600 text-sm">
                <span class="font-medium">Year:</span> {{ book.year }}
              </p>
              <p class="text-gray-600 text-sm">
                <span class="font-medium">Category:</span> {{ book.category_id }}
              </p>
            </div>
            
            <!-- Created Date -->
            <div class="text-xs text-gray-400 mb-4 border-t pt-2">
              <p>Added: {{ formatDate(book.created_at) }}</p>
            </div>
            
            <!-- Borrow Button -->
            <button
              @click="borrowBook(book, index)"
              :disabled="book.borrowed"
              class="w-full py-2 px-4 rounded-md font-medium transition-colors duration-200"
              :class="book.borrowed 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'"
            >
              {{ book.borrowed ? 'Borrowed' : 'Borrow' }}
            </button>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="books.length === 0" class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No books available</h3>
        <p class="text-gray-500">Check back later for new additions to our collection.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const books = ref([])

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const borrowBook = (book, index) => {
  if (!book.borrowed) {
    books.value[index].borrowed = true
    console.log(`Borrowed: ${book.title}`)
    
    // Add your API call here to update the book status
    // Example: api.post(`/books/${book.id}/borrow`)
  }
}

onMounted(async () => {
  try {
    // Uncomment and use your actual API
    // const response = await api.get('/books')
    // books.value = response.data
    
    // Sample data for demonstration
    books.value = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        year: 1925,
        category_id: "Fiction",
        created_at: "2024-01-15T10:30:00Z",
        borrowed: false,
        image: "/placeholder.svg?height=256&width=192"
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        year: 1960,
        category_id: "Classic",
        created_at: "2024-01-10T14:20:00Z",
        borrowed: false,
        image: "/placeholder.svg?height=256&width=192"
      },
      {
        title: "1984",
        author: "George Orwell",
        year: 1949,
        category_id: "Dystopian",
        created_at: "2024-01-08T09:15:00Z",
        borrowed: true,
        image: "/placeholder.svg?height=256&width=192"
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        year: 1813,
        category_id: "Romance",
        created_at: "2024-01-12T16:45:00Z",
        borrowed: false,
        image: "/placeholder.svg?height=256&width=192"
      },
      {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        year: 1951,
        category_id: "Coming-of-age",
        created_at: "2024-01-14T11:30:00Z",
        borrowed: false,
        image: "/placeholder.svg?height=256&width=192"
      },
      {
        title: "Lord of the Flies",
        author: "William Golding",
        year: 1954,
        category_id: "Adventure",
        created_at: "2024-01-09T13:20:00Z",
        borrowed: false,
        image: "/placeholder.svg?height=256&width=192"
      }
    ]
    
    console.log(books.value)
  } catch (error) {
    console.error('Error loading books:', error)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>