<script lang="ts">
import { ref, type Ref } from "vue";
import type { Category, Product } from "./Main.vue";

export const category: Ref<Category> = ref({
    id: null,
    name: "",
    description: "",
});
export const product: Ref<Product> = ref({
    id: null,
    name: "",
    price: null,
    quantity: 0,
    categoryId: null,
    description: "",
});

export const products = ref<Product[]>([]);
export const categories = ref<Category[]>([]);
export const selectCategories = ref<Category[]>([]);
</script>
