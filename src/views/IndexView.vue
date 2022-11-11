<template>
	<div class="w-full min-h-[calc(100vh-160px)] text-left space-y-8">
		<div class="text-3xl font-bold">Офис в каком городе Вас интересует?</div>
		<div class="flex justify-between">
			<RouterLink class="w-[47%] p-8 pb-4 space-y-4 bg-gray-50" :to="`/office/${item.id}`"
			            v-for="item in offices" :key="item.id">

				<img class="w-full" :src="item.imageUrl" alt="office">
				<div class="text-2xl font-bold">{{ item.street }}</div>
			</RouterLink>
		</div>
	</div>
</template>

<script setup lang="ts">
import { offices } from '@/scripts/offices'
</script>
