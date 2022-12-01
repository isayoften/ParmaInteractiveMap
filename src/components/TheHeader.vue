<template>
	<header class="container w-full h-[120px] flex">
		<RouterLink class="h-max my-auto -space-y-1" :to="getUrl()">
			<div class="tracking-widest text-5xl text-red-500 font-bold">PARMA</div>
			<div class="text-[1.3rem] text-gray">technologies group</div>
		</RouterLink>

		<div class="px-4 py-2 my-auto ml-auto bg-red-50 text-white font-bold" v-show="currentOffice">
			{{ currentOffice && currentOffice.street }}
		</div>
	</header>
</template>

<script setup lang="ts">
import { currentOffice } from '@/scripts/offices'

const getUrl = () => currentOffice.value ? `/office/${currentOffice.value.id}` : '/'
</script>