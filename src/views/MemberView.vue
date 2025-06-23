    <template>
    <div class="p-4">
        <h2 class="text-2xl font-bold mb-4">Member List</h2>
        <table class="table-auto border-collapse border border-gray-400 w-full">
        <thead>
            <tr class="bg-gray-100">
            <th class="border px-4 py-2">ID</th>
            <th class="border px-4 py-2">Name</th>
            <th class="border px-4 py-2">Email</th>
            <th class="border px-4 py-2">Phone</th>
            <th class="border px-4 py-2">Gender</th>
            <th class="border px-4 py-2">Created At</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(member, index) in members" :key="index">
            <td class="border px-4 py-2">{{ member.id }}</td>
            <td class="border px-4 py-2">{{ member.name }}</td>
            <td class="border px-4 py-2">{{ member.email }}</td>
            <td class="border px-4 py-2">{{ member.phone }}</td>
            <td class="border px-4 py-2">{{ member.gender }}</td>
            <td class="border px-4 py-2">{{ member.created_at }}</td>
            </tr>
        </tbody>
        </table>
    </div>
    </template>

    <script setup>
    import { onMounted, ref } from 'vue';
    import api from '@/plugins/axios';

    const members = ref([]);

    onMounted(async () => {
    try {
        const response = await api.get('/member');
        members.value = response.data.members;
        console.log(members.value);
    } catch (error) {
        console.error("Error loading members:", error);
    }
    });
    </script>
