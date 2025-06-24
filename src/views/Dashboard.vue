<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Manufacturing Unit Dashboard</h1>
              <p class="text-sm text-gray-500">Real-time production monitoring & analytics</p>
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
        <!-- Units Lost Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-2 h-2 bg-red-400 rounded-full"></div>
                <p class="text-sm font-medium text-gray-600">Units Lost</p>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-2">{{ formatNumber(metrics.unitsLost) }}</p>
              <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  {{ metrics.unitsLostChange }}%
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

        <!-- Units Produced YTD Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
                <p class="text-sm font-medium text-gray-600">Units Produced YTD</p>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-2">{{ formatNumber(metrics.unitsProduced) }}</p>
              <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  {{ metrics.unitsProducedChange }}%
                </span>
                <span class="text-xs text-gray-500">from last year</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors duration-200">
              <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Overall Plant Production Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                <p class="text-sm font-medium text-gray-600">Overall Plant Production</p>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-2">{{ metrics.plantProduction }}%</p>
              <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  {{ metrics.plantProductionChange }}%
                </span>
                <span class="text-xs text-gray-500">from last year</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center group-hover:bg-green-100 transition-colors duration-200">
              <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Unit Maintenance Cost Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
                <p class="text-sm font-medium text-gray-600">Unit Maintenance Cost</p>
              </div>
              <p class="text-3xl font-bold text-gray-900 mb-1">${{ metrics.maintenanceCost }}</p>
              <p class="text-xs text-gray-500 mb-3">Cost per unit</p>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out" :style="{ width: maintenanceProgress + '%' }"></div>
              </div>
              <div class="flex justify-between text-xs text-gray-500 mt-1">
                <span>Optimal</span>
                <span>{{ maintenanceProgress }}%</span>
              </div>
            </div>
            <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors duration-200">
              <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Units Lost by Machine Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Units Lost: Machine</h3>
              <p class="text-sm text-gray-500">Monthly breakdown by machine type</p>
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
            <div v-for="(month, index) in chartData.unitsLost" :key="index" class="flex-1 flex flex-col items-center space-y-1">
              <div class="w-full flex items-end justify-center space-x-1 h-48">
                <div 
                  v-for="(machine, machineIndex) in month.machines" 
                  :key="machineIndex"
                  class="w-3 rounded-t transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer"
                  :class="machine.color"
                  :style="{ height: (machine.value / 50) * 100 + '%' }"
                  :title="`${machine.name}: ${machine.value} units`"
                ></div>
              </div>
              <span class="text-xs text-gray-500 font-medium">{{ month.label }}</span>
            </div>
          </div>
          
          <div class="flex items-center justify-center space-x-6">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-indigo-600 rounded"></div>
              <span class="text-sm text-gray-600">Machine A</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-yellow-500 rounded"></div>
              <span class="text-sm text-gray-600">Machine B</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-purple-500 rounded"></div>
              <span class="text-sm text-gray-600">Machine C</span>
            </div>
          </div>
        </div>

        <!-- Productivity by Machine Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Productivity by Machine</h3>
              <p class="text-sm text-gray-500">Performance efficiency metrics</p>
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
            <div v-for="(month, index) in chartData.productivity" :key="index" class="flex-1 flex flex-col items-center space-y-1">
              <div class="w-full flex items-end justify-center space-x-1 h-48">
                <div 
                  v-for="(machine, machineIndex) in month.machines" 
                  :key="machineIndex"
                  class="w-3 rounded-t transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer"
                  :class="machine.color"
                  :style="{ height: machine.value + '%' }"
                  :title="`${machine.name}: ${machine.value}%`"
                ></div>
              </div>
              <span class="text-xs text-gray-500 font-medium">{{ month.label }}</span>
            </div>
          </div>
          
          <div class="flex items-center justify-center space-x-6">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-indigo-600 rounded"></div>
              <span class="text-sm text-gray-600">Machine A</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-yellow-500 rounded"></div>
              <span class="text-sm text-gray-600">Machine B</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-purple-500 rounded"></div>
              <span class="text-sm text-gray-600">Machine C</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Operators Available Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Operators Available</h3>
              <p class="text-sm text-gray-500">Staff availability trend</p>
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
                <linearGradient id="operatorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:0.3" />
                  <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:0" />
                </linearGradient>
              </defs>
              <polyline 
                :points="operatorLinePoints" 
                fill="none" 
                stroke="#f59e0b" 
                stroke-width="3"
                class="transition-all duration-1000 ease-out"
              />
              <polygon 
                :points="operatorAreaPoints" 
                fill="url(#operatorGradient)"
                class="transition-all duration-1000 ease-out"
              />
              <circle 
                v-for="(point, index) in operatorPoints" 
                :key="index"
                :cx="point.x" 
                :cy="point.y" 
                r="4" 
                fill="#f59e0b"
                class="hover:r-6 transition-all duration-200 cursor-pointer"
                :title="`${point.value} operators`"
              />
            </svg>
          </div>
          
          <div class="flex items-center justify-center mt-4">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-yellow-500 rounded"></div>
              <span class="text-sm text-gray-600">Available Operators</span>
            </div>
          </div>
        </div>

        <!-- Units Lost Causes Pie Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Units Lost: Causes</h3>
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
                  :stroke-dasharray="`${segment.length} 314.16`"
                  :stroke-dashoffset="segment.offset"
                  class="hover:opacity-80 cursor-pointer transition-all duration-300"
                  :title="`${segment.label}: ${segment.percentage}%`"
                />
                <circle cx="60" cy="60" r="20" fill="white" />
              </svg>
            </div>
            
            <div class="flex-1 ml-6 space-y-3">
              <div v-for="cause in causesData" :key="cause.label" class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 rounded" :style="{ backgroundColor: cause.color }"></div>
                  <span class="text-sm text-gray-700">{{ cause.label }}</span>
                </div>
                <span class="text-sm font-medium text-gray-900">{{ cause.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Overall Productivity YTD -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Overall Productivity: YTD</h3>
              <p class="text-sm text-gray-500">Year-to-date performance</p>
            </div>
            <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
              </svg>
            </button>
          </div>
          
          <div class="h-32 flex items-end justify-center space-x-8">
            <div v-for="machine in overallProductivity" :key="machine.name" class="flex flex-col items-center space-y-2">
              <div 
                class="w-12 rounded-t transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer"
                :class="machine.color"
                :style="{ height: (machine.value / 100) * 120 + 'px' }"
                :title="`${machine.name}: ${machine.value}%`"
              ></div>
              <span class="text-xs text-gray-600 font-medium">{{ machine.name }}</span>
              <span class="text-sm font-bold text-gray-900">{{ machine.value }}%</span>
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
  unitsLost: 342,
  unitsLostChange: -1.1,
  unitsProduced: 286094,
  unitsProducedChange: -6,
  plantProduction: 88.46,
  plantProductionChange: 4,
  maintenanceCost: 2.5
})

// Chart data
const chartData = ref({
  unitsLost: [
    { label: 'Jan', machines: [
      { name: 'Machine A', value: 25, color: 'bg-indigo-600' },
      { name: 'Machine B', value: 15, color: 'bg-yellow-500' },
      { name: 'Machine C', value: 10, color: 'bg-purple-500' }
    ]},
    { label: 'Feb', machines: [
      { name: 'Machine A', value: 12, color: 'bg-indigo-600' },
      { name: 'Machine B', value: 8, color: 'bg-yellow-500' },
      { name: 'Machine C', value: 6, color: 'bg-purple-500' }
    ]},
    { label: 'Mar', machines: [
      { name: 'Machine A', value: 15, color: 'bg-indigo-600' },
      { name: 'Machine B', value: 10, color: 'bg-yellow-500' },
      { name: 'Machine C', value: 8, color: 'bg-purple-500' }
    ]},
    { label: 'Apr', machines: [
      { name: 'Machine A', value: 12, color: 'bg-indigo-600' },
      { name: 'Machine B', value: 8, color: 'bg-yellow-500' },
      { name: 'Machine C', value: 6, color: 'bg-purple-500' }
    ]},
    { label: 'May', machines: [
      { name: 'Machine A', value: 20, color: 'bg-indigo-600' },
      { name: 'Machine B', value: 12, color: 'bg-yellow-500' },
      { name: 'Machine C', value: 9, color: 'bg-purple-500' }
    ]},
    { label: 'Jun', machines: [
      { name: 'Machine A', value: 18, color: 'bg-indigo-600' },
      { name: 'Machine B', value: 10, color: 'bg-yellow-500' },
      { name: 'Machine C', value: 7, color: 'bg-purple-500' }
    ]}
  ],
  productivity: [
    { label: 'Jan', machines: [
      { name: 'Machine A', value: 75, color: 'bg-indigo-600' },
      { name: 'Machine B', value: 65, color: 'bg-yellow-500' },
      { name: 'Machine C', value: 70, color: 'bg-purple-500' }
    ]},
    { label: 'Feb', machines: [
      { name: 'Machine A', value: 68, color: 'bg-indigo-600' },
      { name: 'Machine B', value: 58, color: 'bg-yellow-500' },
      { name: 'Machine C', value: 63, color: 'bg-purple-500' }
    ]},
    { label: 'Mar', machines: [
      { name: 'Machine A', value: 72, color: 'bg-indigo-600' },
      { name: 'Machine B', value: 62, color: 'bg-yellow-500' },
      { name: 'Machine C', value: 67, color: 'bg-purple-500' }
    ]},
    { label: 'Apr', machines: [
      { name: 'Machine A', value: 70, color: 'bg-indigo-600' },
      { name: 'Machine B', value: 60, color: 'bg-yellow-500' },
      { name: 'Machine C', value: 65, color: 'bg-purple-500' }
    ]},
    { label: 'May', machines: [
      { name: 'Machine A', value: 78, color: 'bg-indigo-600' },
      { name: 'Machine B', value: 68, color: 'bg-yellow-500' },
      { name: 'Machine C', value: 73, color: 'bg-purple-500' }
    ]},
    { label: 'Jun', machines: [
      { name: 'Machine A', value: 75, color: 'bg-indigo-600' },
      { name: 'Machine B', value: 65, color: 'bg-yellow-500' },
      { name: 'Machine C', value: 70, color: 'bg-purple-500' }
    ]}
  ]
})

// Operators data
const operatorsData = ref([20, 19, 18, 19, 19, 25, 21, 20, 21, 20, 19, 20])

// Causes data
const causesData = ref([
  { label: 'Tooling error', percentage: 40.5, color: '#1e40af' },
  { label: 'Operator damage', percentage: 21.4, color: '#3730a3' },
  { label: 'Physical damage', percentage: 21.4, color: '#a855f7' },
  { label: 'Power shutdown', percentage: 12.1, color: '#f59e0b' },
  { label: 'Other causes', percentage: 4.6, color: '#e5e7eb' }
])

// Overall productivity data
const overallProductivity = ref([
  { name: 'Machine A', value: 85, color: 'bg-indigo-600' },
  { name: 'Machine B', value: 70, color: 'bg-yellow-500' },
  { name: 'Machine C', value: 92, color: 'bg-purple-500' }
])

// Computed properties
const maintenanceProgress = computed(() => {
  return Math.round((metrics.value.maintenanceCost / 5) * 100)
})

const operatorPoints = computed(() => {
  return operatorsData.value.map((value, index) => ({
    x: (index * 25) + 20,
    y: 100 - (value * 3),
    value
  }))
})

const operatorLinePoints = computed(() => {
  return operatorPoints.value.map(point => `${point.x},${point.y}`).join(' ')
})

const operatorAreaPoints = computed(() => {
  const points = operatorPoints.value.map(point => `${point.x},${point.y}`).join(' ')
  const firstX = operatorPoints.value[0]?.x || 20
  const lastX = operatorPoints.value[operatorPoints.value.length - 1]?.x || 300
  return `${firstX},100 ${points} ${lastX},100`
})

const pieSegments = computed(() => {
  let currentOffset = 0
  return causesData.value.map(cause => {
    const length = (cause.percentage / 100) * 314.16
    const segment = {
      label: cause.label,
      percentage: cause.percentage,
      color: cause.color,
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