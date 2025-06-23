<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 fixed w-full top-0 z-30">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center space-x-4">
            <button
              v-if="isAuthenticated"
              @click="sidebarOpen = !sidebarOpen"
              class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div class="hidden md:block">
                <h1 class="text-xl font-bold text-gray-900">Library Management</h1>
                <p class="text-xs text-gray-500">Professional Dashboard</p>
              </div>
            </div>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex space-x-1">
            <RouterLink
              to="/"
              class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50"
              :class="$route.path === '/' 
                ? 'text-blue-600 bg-blue-50 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Home
            </RouterLink>
            <RouterLink
              to="/about"
              class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50"
              :class="$route.path === '/about' 
                ? 'text-blue-600 bg-blue-50 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              About
            </RouterLink>
            <RouterLink
              to="/contact"
              class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50"
              :class="$route.path === '/contact' 
                ? 'text-blue-600 bg-blue-50 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Contact
            </RouterLink>
            <button
              @click="showAdminLogin = true"
              class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50"
              :class="isAuthenticated 
                ? 'text-green-600 bg-green-50 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Admin
              <span v-if="isAuthenticated" class="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
            </button>
          </nav>

          <!-- Mobile Menu Button -->
          <div class="lg:hidden">
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          <!-- Header Right Side - Desktop -->
          <div class="hidden lg:flex items-center space-x-3">
            <button class="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM9 7H4l5-5v5zm6 10V7a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h9a1 1 0 001-1z"></path>
              </svg>
            </button>
            <div class="relative">
              <button class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div class="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span class="text-sm font-semibold text-white">U</span>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div v-if="mobileMenuOpen" class="lg:hidden border-t border-gray-200 py-2">
          <div class="space-y-1">
            <RouterLink
              to="/"
              @click="mobileMenuOpen = false"
              class="block px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              :class="$route.path === '/' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              🏠 Home
            </RouterLink>
            <RouterLink
              to="/about"
              @click="mobileMenuOpen = false"
              class="block px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              :class="$route.path === '/about' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              ℹ️ About
            </RouterLink>
            <RouterLink
              to="/contact"
              @click="mobileMenuOpen = false"
              class="block px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              :class="$route.path === '/contact' 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              📧 Contact
            </RouterLink>
            <button
              @click="showAdminLogin = true; mobileMenuOpen = false"
              class="block w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
              :class="isAuthenticated 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              🔐 Admin
              <span v-if="isAuthenticated" class="ml-2 text-xs">(Logged in)</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Admin Login Modal -->
    <div v-if="showAdminLogin" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeAdminLogin"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
          <div>
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-5">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Admin Access</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">Enter admin password to access dashboard</p>
                <p class="text-xs text-gray-400 mt-1">Session will be saved for 7 days</p>
              </div>
            </div>
          </div>
          
          <form @submit.prevent="handleAdminLogin" class="mt-5 sm:mt-6">
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                v-model="adminPassword"
                type="password"
                placeholder="Enter admin password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': loginError }"
              />
              <p v-if="loginError" class="mt-2 text-sm text-red-600">{{ loginError }}</p>
            </div>
            
            <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
              <button
                type="submit"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm transition-colors duration-200"
              >
                Login
              </button>
              <button
                type="button"
                @click="closeAdminLogin"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="flex pt-16">
      <!-- Sidebar - Only show if authenticated -->
      <aside 
        v-if="isAuthenticated"
        class="fixed inset-y-0 left-0 z-20 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 pt-16 border-r border-gray-200"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <div class="flex flex-col h-full">
          <!-- Sidebar Header -->
          <div class="px-4 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-gray-800">Admin Panel</h2>
                <p class="text-sm text-gray-500">Manage your library</p>  
              </div>
              <div class="text-xs text-gray-400">
                <div class="flex items-center space-x-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{{ sessionTimeRemaining }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar Navigation -->
          <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <RouterLink
              to="/dashboard"
              @click="sidebarOpen = false"
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group"
              :class="$route.path === '/dashboard' 
                ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              <svg class="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Dashboard
            </RouterLink>
            
            <RouterLink
              to="/books"
              @click="sidebarOpen = false"
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group"
              :class="$route.path === '/books' 
                ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              <svg class="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              Books
              <span class="ml-auto bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">245</span>
            </RouterLink>
            
            <RouterLink
              to="/category"
              @click="sidebarOpen = false"
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group"
              :class="$route.path === '/category' 
                ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              <svg class="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"></path>
              </svg>
              Categories
              <span class="ml-auto bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">12</span>
            </RouterLink>
            
            <RouterLink
              to="/member"
              @click="sidebarOpen = false"
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group"
              :class="$route.path === '/member' 
                ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
            >
              <svg class="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
              Members
              <span class="ml-auto bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">89</span>
            </RouterLink>

            <div class="pt-4 mt-4 border-t border-gray-200">
              <RouterLink
                to="/settings"
                @click="sidebarOpen = false"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group"
                :class="$route.path === '/settings' 
                  ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'"
              >
                <svg class="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Settings
              </RouterLink>
            </div>
          </nav>

          <!-- Sidebar Footer -->
          <div class="p-4 border-t border-gray-200 bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span class="text-sm font-semibold text-white">A</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">Admin User</p>
                  <p class="text-xs text-gray-500 truncate">admin@library.com</p>
                </div>
              </div>
              <button 
                @click="logout"
                class="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200"
                title="Logout"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Overlay for mobile -->
      <div 
        v-if="sidebarOpen && isAuthenticated" 
        @click="sidebarOpen = false"
        class="fixed inset-0 z-10 bg-black bg-opacity-50 lg:hidden"
      ></div>

      <!-- Main Content -->
      <main class="flex-1" :class="isAuthenticated ? 'lg:ml-0' : ''">
        <div class="p-6">
          <!-- Route Protection: Check if current route requires authentication -->
          <div v-if="isProtectedRoute && !isAuthenticated" class="text-center py-12">
            <svg class="mx-auto h-16 w-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <h3 class="mt-4 text-xl font-semibold text-gray-900">Access Denied</h3>
            <p class="mt-2 text-gray-600">You need admin privileges to access this page.</p>
            <p class="mt-1 text-sm text-gray-500">Please login as admin to continue.</p>
            <div class="mt-6 space-x-3">
              <button
                @click="showAdminLogin = true"
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Admin Login
              </button>
              <RouterLink
                to="/"
                class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Go Home
              </RouterLink>
            </div>
          </div>
          
          <!-- Show RouterView only if route is public or user is authenticated -->
          <RouterView v-else />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const sidebarOpen = ref(false)
const mobileMenuOpen = ref(false)
const showAdminLogin = ref(false)
const adminPassword = ref('')
const loginError = ref('')
const isAuthenticated = ref(false)
const sessionTimeRemaining = ref('')

const ADMIN_PASSWORD = 'Admin@2025'
const STORAGE_KEY = 'library_admin_auth'
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/books', '/category', '/member', '/settings']

// Check if current route is protected
const isProtectedRoute = computed(() => {
  return protectedRoutes.some(protectedRoute => 
    route.path.startsWith(protectedRoute)
  )
})

// LocalStorage functions
const saveAuthToStorage = () => {
  const authData = {
    isAuthenticated: true,
    loginTime: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(authData))
}

const loadAuthFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return false

    const authData = JSON.parse(stored)
    const now = Date.now()

    // Check if session has expired
    if (now > authData.expiresAt) {
      localStorage.removeItem(STORAGE_KEY)
      return false
    }

    return authData
  } catch (error) {
    console.error('Error loading auth from storage:', error)
    localStorage.removeItem(STORAGE_KEY)
    return false
  }
}

const clearAuthFromStorage = () => {
  localStorage.removeItem(STORAGE_KEY)
}

// Calculate remaining session time
const updateSessionTimeRemaining = () => {
  const authData = loadAuthFromStorage()
  if (!authData) {
    sessionTimeRemaining.value = ''
    return
  }

  const now = Date.now()
  const remaining = authData.expiresAt - now

  if (remaining <= 0) {
    // Session expired
    logout()
    return
  }

  const days = Math.floor(remaining / (24 * 60 * 60 * 1000))
  const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))

  if (days > 0) {
    sessionTimeRemaining.value = `${days}d ${hours}h`
  } else if (hours > 0) {
    sessionTimeRemaining.value = `${hours}h ${minutes}m`
  } else {
    sessionTimeRemaining.value = `${minutes}m`
  }
}

// Timer for updating session time
let sessionTimer = null

// Watch for route changes and redirect if accessing protected route without auth
watch(() => route.path, (newPath) => {
  if (protectedRoutes.some(protectedRoute => newPath.startsWith(protectedRoute)) && !isAuthenticated.value) {
    // Don't redirect, just show access denied message
    // This allows the URL to stay but shows protection message
  }
})

const handleAdminLogin = () => {
  if (adminPassword.value === ADMIN_PASSWORD) {
    isAuthenticated.value = true
    showAdminLogin.value = false
    adminPassword.value = ''
    loginError.value = ''
    
    // Save to localStorage
    saveAuthToStorage()
    
    // Start session timer
    startSessionTimer()
    
    // If user was trying to access a protected route, they can now see it
    // No need to redirect, the computed property will handle the display
  } else {
    loginError.value = 'Invalid password. Please try again.'
    adminPassword.value = ''
  }
}

const closeAdminLogin = () => {
  showAdminLogin.value = false
  adminPassword.value = ''
  loginError.value = ''
}

const logout = () => {
  isAuthenticated.value = false
  sidebarOpen.value = false
  
  // Clear from localStorage
  clearAuthFromStorage()
  
  // Stop session timer
  stopSessionTimer()
  
  // If user is on a protected route when logging out, redirect to home
  if (isProtectedRoute.value) {
    router.push('/')
  }
}

const startSessionTimer = () => {
  updateSessionTimeRemaining()
  sessionTimer = setInterval(updateSessionTimeRemaining, 60000) // Update every minute
}

const stopSessionTimer = () => {
  if (sessionTimer) {
    clearInterval(sessionTimer)
    sessionTimer = null
  }
  sessionTimeRemaining.value = ''
}

// Initialize authentication state on component mount
const initializeAuth = () => {
  const authData = loadAuthFromStorage()
  if (authData) {
    isAuthenticated.value = true
    startSessionTimer()
  }
}

onMounted(() => {
  initializeAuth()
})

// Cleanup timer on component unmount
onUnmounted(() => {
  stopSessionTimer()
})
</script>

<style scoped>
/* Custom scrollbar for sidebar */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: #f1f5f9;
}

nav::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
