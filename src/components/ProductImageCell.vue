<script setup lang="ts">
defineProps<{ value: any }>();
</script>
<template>
    <v-img
        :src="value"
        width="70"
        height="70"
        rounded="lg"
        style="object-fit: contain; background-color: white; margin: 10px 0"
    />
</template>
