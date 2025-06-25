<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 006 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Library Management Dashboard</h1>
              <p class="text-sm text-gray-500">Real-time library operations & analytics</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <span class="text-sm font-medium text-gray-700">Timeframe:</span>
              <select v-model="selectedTimeframe" class="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            
            <button @click="refreshData" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-sm">
              <svg class="w-4 h-4" :class="{ 'animate-spin': isRefreshing }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              <span>Refresh</span>
            </button>
            
            <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
              <span class="text-sm font-semibold text-white">JD</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="p-6">
      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Books Issued Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
                <p class="text-sm font-medium text-gray-600">Books Issued</p>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-2">{{ formatNumber(metrics.booksIssued) }}</p>
              <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  {{ metrics.booksIssuedChange }}%
                </span>
                <span class="text-xs text-gray-500">from last year</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
              <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 006 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Overdue Books Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-2 h-2 bg-red-400 rounded-full"></div>
                <p class="text-sm font-medium text-gray-600">Overdue Books</p>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-2">{{ formatNumber(metrics.overdueBooks) }}</p>
              <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  {{ metrics.overdueBooksChange }}%
                </span>
                <span class="text-xs text-gray-500">from last year</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors duration-200">
              <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Visitor Count Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray booze-200 p-6 hover:shadow-md transition-all duration-300 group">
          <div class="flex items-start justify-between">
           <div class="flex items-start justify-between">
  <div class="flex-1">
    <div class="flex items-center space-x-2 mb-2">
      <div class="w-2 h-2 bg-green-400 rounded-full"></div>
      <p class="text-sm font-medium text-gray-600">Visitor Count</p>
    </div>
    <p class="text-3xl font-bold text-gray-900 mb-2">{{ formatNumber(metrics.visitorCount) }}</p>
    <div class="flex items-center space-x-2">
      <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
        </svg>
        {{ metrics.visitorCountChange }}%
      </span>
      <span class="text-xs text-gray-500">from last year</span>
    </div>
  </div>
  <div class="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors duration-200">
    <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v2h5v-2c0-.656.126-1.283.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 1.857a5.002 5.002 0 01-4.288-3.714C2.117 11.784 2 10.91 2 10c0-5.523 4.477-10 10-10s10 4.477 10 10c0 .91-.117 1.784-.356 2.643"></path>
    </svg>
  </div>
</div>
            <div class="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors duration-200">
              <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v2h5v-2c0-.656.126-1.283.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 1.857a5.002 5.002 0 01-4.288-3.714C2.117 11.784 2 10.91 2 10c0-5.523 4.477-10 10-10s10 4.477 10 10c0 .91-.117 1.784-.356 2.643"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Digital Resource Usage Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
                <p class="text-sm font-medium text-gray-600">Digital Resource Usage</p>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-1">{{ formatNumber(metrics.digitalUsage) }}</p>
              <p class="text-xs text-gray-500 mb-3">Accesses per month</p>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out" :style="{ width: digitalUsageProgress + '%' }"></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>Target</span>
                <span>{{ digitalUsageProgress }}%</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors duration-200">
              <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Books Issued by Category Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Books Issued: Category</h3>
              <p class="text-sm text-gray-500">Monthly breakdown by book category</p>
            </div>
            <div class="flex items-center space-x-2">
              <select class="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Yearly</option>
                <option>Monthly</option>
              </select>
              <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="h-64 flex items-end justify-between space-x-2 mb-4">
            <div v-for="(month, index) in chartData.booksIssued" :key="index" class="flex-1 flex flex-col items-center space-y-1">
              <div class="w-full flex items-end justify-center space-x-1 h-48">
                <div 
                  v-for="(category, categoryIndex) in month.categories" 
                  :key="categoryIndex"
                  class="w-3 rounded-t transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer"
                  :class="category.color"
                  :style="{ height: (category.value / 500) * 100 + '%' }"
                  :title="formatTitle(category.name, category.value, 'books')"
                ></div>
              </div>
              <span class="text-xs text-gray-500 font-medium">{{ month.label }}</span>
            </div>
          </div>
          
          <div class="flex items-center justify-center space-x-6">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-indigo-600 rounded"></div>
              <span class="text-sm text-gray-600">Fiction</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-yellow-500 rounded"></div>
              <span class="text-sm text-gray-600">Non-Fiction</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-purple-500 rounded"></div>
              <span class="text-sm text-gray-600">Academic</span>
            </div>
          </div>
        </div>

        <!-- Visitor Trends Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Visitor Trends</h3>
              <p class="text-sm text-gray-500">Daily visitor statistics</p>
            </div>
            <div class="flex items-center space-x-2">
              <select class="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Yearly</option>
                <option>Monthly</option>
              </select>
              <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="h-64 flex items-end justify-between space-x-2 mb-4">
            <div v-for="(month, index) in chartData.visitors" :key="index" class="flex-1 flex flex-col items-center space-y-1">
              <div class="w-full flex items-end justify-center space-x-1 h-48">
                <div 
                  v-for="(category, categoryIndex) in month.categories" 
                  :key="categoryIndex"
                  class="w-3 rounded-t transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer"
                  :class="category.color"
                  :style="{ height: (category.value / 400) * 40 + '%' }"
                  :title="formatTitle(category.name, category.value, 'visitors')"
                ></div>
              </div>
              <span class="text-xs text-gray-500 font-medium">{{ month.label }}</span>
            </div>
          </div>
          
          <div class="flex items-center justify-center space-x-6">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-indigo-600 rounded"></div>
              <span class="text-sm text-gray-600">Students</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-yellow-500 rounded"></div>
              <span class="text-sm text-gray-600">Faculty</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-purple-500 rounded"></div>
              <span class="text-sm text-gray-600">Guests</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Staff Availability Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Staff Availability</h3>
              <p class="text-sm text-gray-500">Librarian availability trend</p>
            </div>
            <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
              </svg>
            </button>
          </div>
          
          <div class="h-32 relative">
            <svg viewBox="0 0 300 120" class="w-full h-full">
              <defs>
                <linearGradient id="staffGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:0" />
                </linearGradient>
              </defs>
              <polyline 
                :points="staffLinePoints" 
                fill="none" 
                stroke="#f59e0b" 
                stroke-width="3"
                class="transition-all duration-1000 ease-out"
              />
              <polygon 
                :points="staffAreaPoints" 
                fill="url(#staffGradient)"
                class="transition-all duration-1000 ease-out"
              />
              <circle 
                v-for="(point, index) in staffPoints" 
                :key="index"
                :cx="point.x" 
                :cy="point.y" 
                r="4" 
                fill="#f59e0b"
                class="hover:r-6 transition-all duration-200 cursor-pointer"
                :title="formatTitle('Staff', point.value, 'staff')"
              />
            </svg>
          </div>
          
          <div class="flex items-center justify-center mt-4">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-yellow-500 rounded"></div>
              <span class="text-sm text-gray-600">Available Staff</span>
            </div>
          </div>
        </div>

        <!-- Overdue Reasons Pie Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Overdue Reasons</h3>
              <p class="text-sm text-gray-500">Root cause analysis</p>
            </div>
            <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
              </svg>
            </button>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="w-32 h-32">
              <svg viewBox="0 0 120 120" class="w-full h-full transform -rotate-90">
                <circle 
                  v-for="(segment, index) in pieSegments" 
                  :key="index"
                  cx="60" 
                  cy="60" 
                  r="50" 
                  :fill="segment.color" 
                  stroke="white" 
                  stroke-width="2"
                  :stroke-dasharray="[segment.length, 314.16]"
                  :stroke-dashoffset="segment.offset"
                  class="hover:opacity-80 cursor-pointer transition-all duration-300"
                  :title="formatTitle(segment.label, segment.percentage, '%')"
                />
                <circle cx="60" cy="60" r="20" fill="white" />
              </svg>
            </div>
            
            <div class="flex-1 ml-6 space-y-3">
              <div v-for="reason in reasonsData" :key="reason.label" class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 rounded" :style="{ backgroundColor: reason.color }"></div>
                  <span class="text-sm text-gray-700">{{ reason.label }}</span>
                </div>
                <span class="text-sm font-medium text-gray-900">{{ reason.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Collection Usage YTD -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Collection Usage: YTD</h3>
              <p class="text-sm text-gray-500">Year-to-date borrowing trends</p>
            </div>
            <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
              </svg>
            </button>
          </div>
          
          <div class="h-32 flex items-end justify-center space-x-8">
            <div v-for="category in collectionUsage" :key="category.name" class="flex flex-col items-center space-y-2">
              <div 
                class="w-12 rounded-t transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer"
                :class="category.color"
                :style="{ height: (category.value / 5000) * 100 + 'px' }"
                :title="formatTitle(category.name, category.value, 'books')"
              ></div>
              <span class="text-xs text-gray-600 font-medium">{{ category.name }}</span>
              <span class="text-sm font-bold text-gray-900">{{ category.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Reactive data
const selectedTimeframe = ref('yearly')
const isRefreshing = ref(false)

// Metrics data
const metrics = ref({
  booksIssued: 12500,
  booksIssuedChange: 5.2,
  overdueBooks: 342,
  overdueBooksChange: -1.1,
  visitorCount: 15600,
  visitorCountChange: 3.5,
  digitalUsage: 4500
})

// Chart data
const chartData = ref({
  booksIssued: [
    { label: 'Jan', categories: [
      { name: 'Fiction', value: 300, color: 'bg-indigo-600' },
      { name: 'Non-Fiction', value: 200, color: 'bg-yellow-500' },
      { name: 'Academic', value: 150, color: 'bg-purple-500' }
    ]},
    { label: 'Feb', categories: [
      { name: 'Fiction', value: 280, color: 'bg-indigo-600' },
      { name: 'Non-Fiction', value: 180, color: 'bg-yellow-500' },
      { name: 'Academic', value: 140, color: 'bg-purple-500' }
    ]},
    { label: 'Mar', categories: [
      { name: 'Fiction', value: 320, color: 'bg-indigo-600' },
      { name: 'Non-Fiction', value: 210, color: 'bg-yellow-500' },
      { name: 'Academic', value: 160, color: 'bg-purple-500' }
    ]},
    { label: 'Apr', categories: [
      { name: 'Fiction', value: 290, color: 'bg-indigo-600' },
      { name: 'Non-Fiction', value: 190, color: 'bg-yellow-500' },
      { name: 'Academic', value: 145, color: 'bg-purple-500' }
    ]},
    { label: 'May', categories: [
      { name: 'Fiction', value: 310, color: 'bg-indigo-600' },
      { name: 'Non-Fiction', value: 200, color: 'bg-yellow-500' },
      { name: 'Academic', value: 155, color: 'bg-purple-500' }
    ]},
    { label: 'Jun', categories: [
      { name: 'Fiction', value: 300, color: 'bg-indigo-600' },
      { name: 'Non-Fiction', value: 195, color: 'bg-yellow-500' },
      { name: 'Academic', value: 150, color: 'bg-purple-500' }
    ]}
  ],
  visitors: [
    { label: 'Jan', categories: [
      { name: 'Students', value: 1200, color: 'bg-indigo-600' },
      { name: 'Faculty', value: 300, color: 'bg-yellow-500' },
      { name: 'Guests', value: 150, color: 'bg-purple-500' }
    ]},
    { label: 'Feb', categories: [
      { name: 'Students', value: 1100, color: 'bg-indigo-600' },
      { name: 'Faculty', value: 280, color: 'bg-yellow-500' },
      { name: 'Guests', value: 140, color: 'bg-purple-500' }
    ]},
    { label: 'Mar', categories: [
      { name: 'Students', value: 1300, color: 'bg-indigo-600' },
      { name: 'Faculty', value: 320, color: 'bg-yellow-500' },
      { name: 'Guests', value: 160, color: 'bg-purple-500' }
    ]},
    { label: 'Apr', categories: [
      { name: 'Students', value: 1150, color: 'bg-indigo-600' },
      { name: 'Faculty', value: 290, color: 'bg-yellow-500' },
      { name: 'Guests', value: 145, color: 'bg-purple-500' }
    ]},
    { label: 'May', categories: [
      { name: 'Students', value: 1250, color: 'bg-indigo-600' },
      { name: 'Faculty', value: 310, color: 'bg-yellow-500' },
      { name: 'Guests', value: 155, color: 'bg-purple-500' }
    ]},
    { label: 'Jun', categories: [
      { name: 'Students', value: 1200, color: 'bg-indigo-600' },
      { name: 'Faculty', value: 300, color: 'bg-yellow-500' },
      { name: 'Guests', value: 150, color: 'bg-purple-500' }
    ]}
  ]
})

// Staff data
const staffData = ref([10, 9, 11, 10, 12, 10, 11, 10, 9, 11, 10, 12])

// Overdue reasons data
const reasonsData = ref([
  { label: 'Late Returns', percentage: 45.5, color: '#1e40af' },
  { label: 'Lost Books', percentage: 25.4, color: '#3730a3' },
  { label: 'Damaged Books', percentage: 15.4, color: '#a855f7' },
  { label: 'System Error', percentage: 10.1, color: '#f59e0b' },
  { label: 'Other', percentage: 3.6, color: '#e5e7eb' }
])

// Collection usage data
const collectionUsage = ref([
  { name: 'Fiction', value: 4500, color: 'bg-indigo-600' },
  { name: 'Non-Fiction', value: 3000, color: 'bg-yellow-500' },
  { name: 'Academic', value: 2000, color: 'bg-purple-500' }
])

// Computed properties
const digitalUsageProgress = computed(() => {
  return Math.round((metrics.value.digitalUsage / 6000) * 100)
})

const staffPoints = computed(() => {
  return staffData.value.map((value, index) => ({
    x: (index * 25) + 20,
    y: 100 - (value * 5),
    value
  }))
})

const staffLinePoints = computed(() => {
  return staffPoints.value.map(point => `${point.x},${point.y}`).join(' ')
})

const staffAreaPoints = computed(() => {
  const points = staffPoints.value.map(point => `${point.x},${point.y}`).join(' ')
  const firstX = staffPoints.value[0]?.x || 20
  const lastX = staffPoints.value[staffPoints.value.length - 1]?.x || 300
  return `${firstX},100 ${points} ${lastX},100`
})

const pieSegments = computed(() => {
  let currentOffset = 0
  return reasonsData.value.map(reason => {
    const length = (reason.percentage / 100) * 314.16
    const segment = {
      label: reason.label,
      percentage: reason.percentage,
      color: reason.color,
      length,
      offset: -currentOffset
    }
    currentOffset += length
    return segment
  })
})

// Methods
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num)
}

const formatTitle = (name, value, unit) => {
  return `${name}: ${value} ${unit}`
}

const refreshData = async () => {
  isRefreshing.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  isRefreshing.value = false
}

// Lifecycle
onMounted(() => {
  // Initialize any animations or data loading
})
</script>

<style scoped>
/* Custom animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in-up {
  animation: slideInUp 0.6s ease-out;
}
</style>