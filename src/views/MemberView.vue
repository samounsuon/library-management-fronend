<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6 flex justify-between items-center">
        <h2 class="text-3xl font-bold text-gray-900">Member List</h2>
        <button
          @click="openCreateForm"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold"
        >
          + Create Member
        </button>
      </div>

      <!-- Members List -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div v-if="members.length === 0" class="p-6 text-center text-gray-500">
          No members found.
        </div>
        <ul v-else>
          <li
            v-for="member in members"
            :key="member.id"
            class="flex justify-between items-center px-6 py-3 border-b last:border-b-0"
          >
            <div>
              <p class="font-semibold">{{ member.name }}</p>
              <p class="text-sm text-gray-600">{{ member.email }}</p>
            </div>
            <div class="space-x-2">
              <button
                @click="openEditForm(member)"
                class="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Edit
              </button>
              <button
                @click="deleteMember(member.id)"
                class="text-red-600 hover:text-red-800 font-semibold"
              >
                Delete
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Modal Form -->
      <div
        v-if="showForm"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md overflow-y-auto">
          <h3 class="text-xl font-semibold mb-4">
            {{ isEditing ? 'Edit Member' : 'Create New Member' }}
          </h3>
          <!-- Error Message -->
          <div v-if="errorMessage" class="text-red-600 mb-4">{{ errorMessage }}</div>

          <form @submit.prevent="isEditing ? updateMember() : createMember()" class="space-y-4">
            <div>
              <label class="block font-medium mb-1" for="name">Name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter name"
              />
            </div>

            <div>
              <label class="block font-medium mb-1" for="email">Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label class="block font-medium mb-1" for="phone">Phone</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                required
                pattern="[0-9\+\-]{10,15}"
                class="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter phone (e.g., +1234567890)"
              />
              <p v-if="form.phone && !phoneValid" class="text-red-600 text-sm mt-1">
                Phone must be 10-15 characters, using numbers, +, or - only.
              </p>
            </div>

            <div>
              <label class="block font-medium mb-1" for="gender">Gender</label>
              <select
                id="gender"
                v-model="form.gender"
                required
                class="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option disabled value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div v-if="!isEditing">
              <label class="block font-medium mb-1" for="password">Password</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                required
                minlength="6"
                class="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter password"
              />
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeForm"
                class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                :disabled="submitting || !phoneValid"
              >
                {{ submitting ? 'Submitting...' : isEditing ? 'Update' : 'Submit' }}
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
const showForm = ref(false);
const submitting = ref(false);
const errorMessage = ref('');
const isEditing = ref(false);
const editingMemberId = ref(null);

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

const fetchMembers = async () => {
  try {
    const response = await api.get('/member');
    members.value = response.data.members;
  } catch (err) {
    console.error('Failed to fetch members:', err.response?.data || err.message);
    errorMessage.value = 'Failed to load members. Please try again.';
  }
};

const deleteMember = async (id) => {
  if (!confirm('Are you sure you want to delete this member?')) return;
  try {
    await api.delete(`/v1/member/${id}`);
    await fetchMembers();
  } catch (err) {
    console.error('Failed to delete member:', err.response?.data || err.message);
    errorMessage.value = 'Failed to delete member. Please try again.';
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
    password: '', // Clear password as it's not updated
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
    console.log('Creating member payload:', payload);
    const res = await api.post('/member', payload);
    console.log('Create API response:', res.data);
    await fetchMembers();
    resetForm();
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
  errorMessage.value = '';
  try {
    const payload = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone.replace(/[\s\-\(\)]/g, ''),
      gender: form.value.gender,
    };
    console.log('Updating member with ID:', editingMemberId.value);
    console.log('Update payload:', payload);
    const res = await api.put(`/member/${editingMemberId.value}`, payload);
    console.log('Update API response:', res.data);
    await fetchMembers();
    resetForm();
    closeForm();
  } catch (err) {
    console.error('Update error:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
    });
    errorMessage.value = err.response?.data?.message || 'Failed to update member. Please check your input and try again.';
  } finally {
    submitting.value = false;
  }
};

onMounted(fetchMembers);
</script>