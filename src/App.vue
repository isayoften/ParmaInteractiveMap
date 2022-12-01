<template>
	<TheHeader/>
	<main class="min-h-[calc(100vh-240px)]">
		<section class="min-h-[inherit]">
			<div class="container py-4 flex flex-col justify-evenly min-h-[inherit]">
				<RouterView/>
			</div>
		</section>
	</main>
	<div class="fixed left-0 top-0 w-screen h-screen flex bg-black/50 z-40 pointer-events-none transition-opacity"
	     :class="isLoaderShowed || 'opacity-0'">
		<Spinner class="m-auto scale-150"/>
	</div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
import Spinner from './components/elements/Spinner.vue'
import router from '@/router'
import { ref } from 'vue'

const isLoaderShowed = ref(false)

router.beforeEach(() => isLoaderShowed.value = true)
router.afterEach(() => isLoaderShowed.value = false)
</script>
