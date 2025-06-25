<template>
  <div
    class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 group"
    :aria-label="`Metric: ${title}`"
    role="region"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center space-x-2 mb-2">
          <div :class="`w-3 h-3 bg-${color}-400 rounded-full`" aria-hidden="true"></div>
          <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        </div>
        <p class="text-3xl font-bold text-gray-900 mb-2" v-if="value !== undefined">{{ formatNumber(value) }}</p>
        <div class="flex items-center space-x-2" v-if="change !== undefined">
          <span
            :class="`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`"
            role="status"
          >
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" :class="{ 'rotate-180': change < 0 }">
              <path
                fill-rule="evenodd"
                d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            {{ Math.abs(change) }}%
          </span>
          <span class="text-xs text-gray-500">from last year</span>
        </div>
        <div v-if="progress !== undefined" class="mt-3">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              :class="`bg-gradient-to-r from-${color}-500 to-${color === 'purple' ? 'pink' : color}-600 h-2 rounded-full transition-all duration-1000 ease-out`"
              :style="{ width: progress !== null && progress >= 0 && progress <= 100 ? progress + '%' : '0%' }"
              role="progressbar"
              :aria-valuenow="progress"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>Target</span>
            <span>{{ progress }}%</span>
          </div>
        </div>
        <p v-if="value === undefined" class="text-red-500 text-sm">Data unavailable</p>
      </div>
      <div :class="`w-12 h-12 bg-${color}-50 rounded-lg flex items-center justify-center group-hover:bg-${color}-100 transition-colors duration-200`">
        <svg
          class="w-6 h-6"
          :class="`text-${color}-500`"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            :d="
              color === 'blue'
                ? 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 006 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'
                : color === 'red'
                ? 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                : color === 'green'
                ? 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v2h5v-2c0-.656.126-1.283.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 1.857a5.002 5.002 0 01-4.288-3.714C2.117 11.784 2 10.91 2 10c0-5.523 4.477-10 10-10s10 4.477 10 10c0 .91-.117 1.784-.356 2.643'
                : 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
            "
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

defineProps({
  title: String,
  value: Number,
  change: [Number, undefined],
  progress: [Number, undefined],
  color: String
})

const formatNumber = (num) => {
  if (num === undefined || num === null) return 'N/A'
  return new Intl.NumberFormat().format(num)
}
</script>