<template>
	<div/>
</template>

<style scoped>
div {
	display: flex;
	align-content: center;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 80px;
	color: white;
}

div:after {
	content: " ";
	display: block;
	width: 64px;
	height: 64px;
	margin: 8px;
	border-radius: 50%;
	border: 6px solid currentColor;
	border-color: currentColor transparent currentColor transparent;
	animation: lds-dual-ring 0.8s linear infinite;
}

@keyframes lds-dual-ring {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>