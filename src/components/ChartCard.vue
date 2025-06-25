<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300" :aria-label="`Chart: ${title}`">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        <p class="text-sm text-gray-500">{{ subtitle }}</p>
      </div>
      <button class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200" aria-label="Chart options">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
        </svg>
      </button>
    </div>
    <div v-if="type === 'line'" class="h-32 relative">
      <svg viewBox="0 0 300 120" class="w-full h-full">
        <defs>
          <linearGradient :id="`gradient-${color}`" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" :style="`stop-color:#${color};stop-opacity:0.3`" />
            <stop offset="100%" :style="`stop-color:#${color};stop-opacity:0`" />
          </linearGradient>
        </defs>
        <polyline :points="linePoints" fill="none" :stroke="`#${color}`" stroke-width="3" class="transition-all duration-1000 ease-out" />
        <polygon :points="areaPoints" :fill="`url(#gradient-${color})`" class="transition-all duration-1000 ease-out" />
        <circle v-for="(point, index) in points" :key="index" :cx="point.x" :cy="point.y" r="4" :fill="`#${color}`" class="hover:r-6 transition-all duration-200 cursor-pointer" :title="formatTitle('Staff', point.value, unit)" />
      </svg>
    </div>
    <div v-else-if="type === 'pie'" class="flex items-center justify-between">
      <div class="w-32 h-32">
        <svg viewBox="0 0 120 120" class="w-full h-full transform -rotate-90">
          <circle v-for="segment in pieData" :key="segment.id" cx="60" cy="60" r="50" :fill="segment.color" stroke="white" stroke-width="2" :stroke-dasharray="[segment.length, 314.16]" :stroke-dashoffset="segment.offset" class="hover:opacity-80 cursor-pointer transition-all duration-300" :title="formatTitle(segment.label, segment.percentage, unit)" />
          <circle cx="60" cy="60" r="20" fill="white" />
        </svg>
      </div>
      <div class="flex-1 ml-6 space-y-3">
        <div v-for="item in data" :key="item.label || item.name || crypto.randomUUID()" class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 rounded" :style="{ backgroundColor: item.color || `var(--color-${colors[index % colors.length]})` }"></div>
            <span class="text-sm text-gray-700">{{ item.label || item.name }}</span>
          </div>
          <span class="text-sm font-medium text-gray-900">{{ item.percentage || item.value }}</span>
        </div>
      </div>
    </div>
    <div v-else class="h-32 flex items-end justify-center space-x-8">
      <div v-for="(category, index) in data" :key="index" class="flex flex-col items-center space-y-2">
        <div class="w-12 rounded-t transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer" :class="`bg-${colors[index % colors.length]}`" :style="{ height: (category.value / 1000) * 120 + 'px' }" :title="formatTitle(category.name, category.value, unit)" />
        <span class="text-xs text-gray-600 font-medium">{{ category.name }}</span>
        <span class="text-sm font-bold text-gray-900">{{ category.value }}</span>
      </div>
    </div>
    <div v-if="type !== 'pie' && data.length" class="flex items-center justify-center space-x-6 mt-4">
      <div v-for="(color, index) in colors" :key="index" class="flex items-center space-x-2">
        <div :class="`w-3 h-3 bg-${color} rounded`"></div>
        <span class="text-sm text-gray-600">{{ data[index]?.name || data[index]?.label || 'Unknown' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

defineProps({
  title: String,
  subtitle: String,
  data: Array,
  unit: String,
  colors: { type: [Array, String], default: 'indigo-600' },
  type: { type: String, default: 'bar' }
})

const points = computed(() => data.value.map((value, index) => ({
  x: (index * 25) + 20,
  y: 100 - (value * 5),
  value
})))

const linePoints = computed(() => points.value.map(point => `${point.x},${point.y}`).join(' '))

const areaPoints = computed(() => {
  const pointsData = points.value.map(point => `${point.x},${point.y}`).join(' ')
  const firstX = points.value[0]?.x || 20
  const lastX = points.value[points.value.length - 1]?.x || 300
  return `${firstX},100 ${pointsData} ${lastX},100`
})

const pieData = computed(() => {
  let currentOffset = 0
  return data.value.map(item => {
    const length = (item.percentage / 100) * 314.16
    const result = { ...item, length, offset: -currentOffset, id: crypto.randomUUID() }
    currentOffset += length
    return result
  })
})

const formatTitle = (name, value, unit) => `${name}: ${value} ${unit}`
</script>