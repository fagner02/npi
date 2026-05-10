<script setup lang="ts">
import { productService } from "@/api/service";
import { onBeforeMount, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps<{ id: number; value?: string | null }>();
let url = ref<string | undefined>();

const load = async () => {
    if (url.value) {
        URL.revokeObjectURL(url.value);
    }
    url.value = await productService.fetchImage(props.id);
};
onBeforeMount(async () => {
    load();
});

watch(
    () => props.value,
    () => {
        console.log(props.value);
        load();
    },
);
onBeforeUnmount(() => {
    if (url.value) {
        URL.revokeObjectURL(url.value);
    }
});
</script>
<template>
    <v-img
        :src="url"
        width="70"
        height="70"
        rounded="lg"
        style="
            place-self: center end;
            object-fit: contain;
            background-color: white;
            margin: 10px 0;
        "
    />
</template>
