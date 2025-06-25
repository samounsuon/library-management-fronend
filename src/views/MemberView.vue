<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Member List</h1>
          <p class="mt-2 text-sm text-gray-600">Manage your members with ease</p>
        </div>
        <button
          @click="openCreateForm"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center shadow-md hover:shadow-lg w-full sm:w-auto justify-center transform hover:-translate-y-0.5 ring-1 ring-blue-300"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Create Member
        </button>
      </div>

      <!-- Search Bar -->
      <div class="mb-6 bg-white rounded-lg shadow-sm p-4">
        <div class="relative flex-1">
          <svg class="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search members by name or email..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow-md p-12 text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p class="text-gray-600 font-medium">Loading members...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <div class="flex items-center">
          <svg class="w-6 h-6 text-red-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <div class="flex-1">
            <h3 class="text-base font-semibold text-red-800">Error</h3>
            <p class="text-sm text-red-600 mt-1">{{ errorMessage }}</p>
            <button @click="fetchMembers" class="mt-3 text-sm text-red-700 font-medium hover:text-red-800 transition-colors">
              Try Again
            </button>
          </div>
        </div>
      </div>

      <!-- Members Table -->
      <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
        <!-- Mobile Card View -->
        <div class="block sm:hidden">
          <div v-for="member in filteredMembers" :key="member.id" class="border-b border-gray-200 p-6 last:border-b-0">
            <div class="space-y-3">
              <h3 class="text-base font-semibold text-gray-900">{{ member.name }}</h3>
              <p class="text-sm text-gray-600">{{ member.email }}</p>
              <p class="text-sm text-gray-600">{{ member.phone }}</p>
              <p class="text-sm text-gray-600">{{ member.gender.charAt(0).toUpperCase() + member.gender.slice(1) }}</p>
              <div class="flex space-x-2 pt-4">
                <button
                  @click="openEditForm(member)"
                  :disabled="updating === member.id"
                  class="flex-1 bg-orange-500 text-white hover:bg-orange-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-md hover:shadow-lg ring-1 ring-orange-300"
                >
                  <svg v-if="updating === member.id" class="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Edit
                </button>
                <button
                  @click="deleteMember(member.id)"
                  :disabled="deleting === member.id"
                  class="flex-1 bg-red-500 text-white hover:bg-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center shadow-md hover:shadow-lg ring-1 ring-red-300"
                >
                  <svg v-if="deleting === member.id" class="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
          <!-- Mobile Empty State -->
          <div v-if="filteredMembers.length === 0 && !loading" class="p-12 text-center">
            <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
            </svg>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No Members Found</h3>
            <p class="text-gray-500">Try adjusting your search or add a new member.</p>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden sm:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black uppercase tracking-wider cursor-pointer" @click="sortMembers('name')">
                  Name
                  <svg v-if="sortKey === 'name'" class="inline w-4 h-4 ml-1" :class="{ 'rotate-180': sortOrder === 'desc' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold  text-black uppercase tracking-wider cursor-pointer" @click="sortMembers('email')">
                  Email
                  <svg v-if="sortKey === 'email'" class="inline w-4 h-4 ml-1" :class="{ 'rotate-180': sortOrder === 'desc' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold  text-black uppercase tracking-wider cursor-pointer" @click="sortMembers('phone')">
                  Phone
                  <svg v-if="sortKey === 'phone'" class="inline w-4 h-4 ml-1" :class="{ 'rotate-180': sortOrder === 'desc' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold  text-black uppercase tracking-wider cursor-pointer" @click="sortMembers('gender')">
                  Gender
                  <svg v-if="sortKey === 'gender'" class="inline w-4 h-4 ml-1" :class="{ 'rotate-180': sortOrder === 'desc' }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold  text-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="member in filteredMembers" :key="member.id" class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ member.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm  text-black">{{ member.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm  text-black">{{ member.phone }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm  text-black">{{ member.gender.charAt(0).toUpperCase() + member.gender.slice(1) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex space-x-2">
                    <button
                      @click="openEditForm(member)"
                      :disabled="updating === member.id"
                      class="h-8 px-4 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors font-medium shadow-sm flex items-center justify-center disabled:opacity-50 ring-1 ring-blue-300"
                      title="Edit member"
                    >
                      <svg v-if="updating === member.id" class="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Edit
                    </button>
                    <button
                      @click="deleteMember(member.id)"
                      :disabled="deleting === member.id"
                      class="bg-red-500 text-white hover:bg-red-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 disabled:opacity-50 flex items-center shadow-md hover:shadow-lg ring-1 ring-red-300"
                      title="Delete member"
                    >
                      <svg v-if="deleting === member.id" class="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Desktop Empty State -->
              <tr v-if="filteredMembers.length === 0 && !loading">
                <td colspan="5" class="px-6 py-16 text-center">
                  <svg class="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253z"></path>
                  </svg>
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">No Members Found</h3>
                  <p class=" text-black">Try adjusting your search or add a new member.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showForm" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
          <button
            @click="closeForm"
            class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <h3 class="text-xl font-bold text-gray-900 mb-6">
            {{ isEditing ? 'Edit Member' : 'Create New Member' }}
          </h3>

          <!-- Error in Modal -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p class="text-sm text-red-600 font-medium">{{ errorMessage }}</p>
          </div>

          <form @submit.prevent="isEditing ? updateMember() : createMember()" class="space-y-5">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all"
                placeholder="Enter name"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                pattern="[0-9\+\-]{10,15}"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all"
                placeholder="Enter phone (e.g., +1234567890)"
              />
              <p v-if="form.phone && !phoneValid" class="text-red-600 text-sm mt-1">
                Phone must be 10-15 characters, using numbers, +, or - only.
              </p>
            </div>

            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
              <select
                id="gender"
                v-model="form.gender"
                required
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all"
              >
                <option disabled value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div v-if="!isEditing">
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                minlength="6"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-all"
                placeholder="Enter password"
              />
            </div>

            <div class="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                @click="closeForm"
                :disabled="submitting"
                class="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg ring-1 ring-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submitting || !phoneValid"
                class="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center shadow-md hover:shadow-lg ring-1 ring-blue-300"
              >
                <svg v-if="submitting" class="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ submitting ? 'Processing...' : (isEditing ? 'Update' : 'Submit') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/plugins/axios';

const members = ref([]);
const loading = ref(false);
const errorMessage = ref('');
const showForm = ref(false);
const isEditing = ref(false);
const editingMemberId = ref(null);
const submitting = ref(false);
const updating = ref(null);
const deleting = ref(null);
const searchQuery = ref('');
const sortKey = ref('name');
const sortOrder = ref('asc');

const form = ref({
  name: '',
  email: '',
  phone: '',
  gender: '',
  password: '',
});

// Client-side phone validation
const phoneValid = computed(() => {
  const phoneRegex = /^[0-9\+\-]{10,15}$/;
  return phoneRegex.test(form.value.phone || '');
});

// Filtered and sorted members
const filteredMembers = computed(() => {
  let filtered = members.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(member =>
      member.name.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query)
    );
  }

  return filtered.sort((a, b) => {
    const valueA = a[sortKey.value];
    const valueB = b[sortKey.value];
    const modifier = sortOrder.value === 'asc' ? 1 : -1;

    if (typeof valueA === 'string') {
      return valueA.localeCompare(valueB) * modifier;
    }
    return (valueA - valueB) * modifier;
  });
});

const sortMembers = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const fetchMembers = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    const response = await api.get('/member');
    members.value = response.data.members;
  } catch (err) {
    console.error('Failed to fetch members:', err.response?.data || err.message);
    errorMessage.value = 'Failed to load members. Please try again.';
  } finally {
    loading.value = false;
  }
};

const createMember = async () => {
  if (!phoneValid.value) {
    errorMessage.value = 'Please enter a valid phone number (10-15 characters, numbers, +, or - only).';
    return;
  }
  submitting.value = true;
  errorMessage.value = '';
  try {
    const payload = {
      ...form.value,
      phone: form.value.phone.replace(/[\s\-\(\)]/g, ''),
    };
    await api.post('/member', payload);
    await fetchMembers();
    closeForm();
  } catch (err) {
    console.error('Failed to create member:', err.response?.data || err.message);
    errorMessage.value = err.response?.data?.message || 'Failed to create member. Please check your input (e.g., unique email, valid phone) and try again.';
  } finally {
    submitting.value = false;
  }
};

const updateMember = async () => {
  if (!phoneValid.value) {
    errorMessage.value = 'Please enter a valid phone number (10-15 characters, numbers, +, or - only).';
    return;
  }
  submitting.value = true;
  updating.value = editingMemberId.value;
  errorMessage.value = '';
  try {
    const payload = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone.replace(/[\s\-\(\)]/g, ''),
      gender: form.value.gender,
    };
    await api.put(`/member/${editingMemberId.value}`, payload);
    await fetchMembers();
    closeForm();
  } catch (err) {
    console.error('Failed to update member:', err.response?.data || err.message);
    errorMessage.value = err.response?.data?.message || 'Failed to update member. Please check your input and try again.';
  } finally {
    submitting.value = false;
    updating.value = null;
  }
};

const deleteMember = async (id) => {
  if (!confirm('Are you sure you want to delete this member? This action cannot be undone.')) return;
  deleting.value = id;
  try {
    await api.delete(`/member/${id}`);
    await fetchMembers();
  } catch (err) {
    console.error('Failed to delete member:', err.response?.data || err.message);
    errorMessage.value = 'Failed to delete member. Please try again.';
  } finally {
    deleting.value = null;
  }
};

const openCreateForm = () => {
  resetForm();
  isEditing.value = false;
  editingMemberId.value = null;
  showForm.value = true;
};

const openEditForm = (member) => {
  form.value = {
    name: member.name || '',
    email: member.email || '',
    phone: member.phone || '',
    gender: member.gender || '',
    password: '',
  };
  isEditing.value = true;
  editingMemberId.value = member.id;
  errorMessage.value = '';
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  submitting.value = false;
  errorMessage.value = '';
  resetForm();
};

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
  };
  errorMessage.value = '';
};

onMounted(fetchMembers);
</script>