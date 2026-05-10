<script setup lang="ts">
defineProps<{ value: string }>();
</script>
<template>
    <span :style="{ color: value ? 'inherit' : 'orange' }">
        {{ value ? value : "Sem categoria" }}
    </span>
</template>
