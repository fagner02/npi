<script lang="ts" setup>
import { ref, type Ref } from "vue";
import { api } from "@/api";
import { product } from "./Entity.vue";
import { emptyRule, priceRule } from "./rules";
import type { Category } from "./Main.vue";

const selectItems: Ref<Category[]> = ref([]);
const loadCategorySelectItems = async (search: string) => {
    const res = (await api.get(`/categorias?name=${search}`)).data;
    selectItems.value = res.data.content;
};
loadCategorySelectItems("");
</script>

<template>
    <v-text-field
        v-model="product.name"
        label="Nome"
        :rules="[emptyRule]"
        required
        variant="outlined"
    ></v-text-field>
    <v-text-field
        v-model="product.description"
        label="Descrição"
        required
        variant="outlined"
    ></v-text-field>
    <v-text-field
        type="number"
        :rules="[priceRule]"
        v-model="product.price"
        label="Preço"
        required
        variant="outlined"
    ></v-text-field>
    <v-text-field
        type="number"
        v-model="product.quantity"
        :oninput="(e: any) => {
            product.quantity = Math.floor(product.quantity);
        }"
        label="Quantidade"
        required
        variant="outlined"
    ></v-text-field>
    <v-autocomplete
        item-value="id"
        item-title="name"
        v-model="product.categoryId"
        :items="selectItems"
        variant="outlined"
        label="Categoria"
        :oninput="(e: any)=>{
            loadCategorySelectItems(e.target.value);
        }"
        :rules="[emptyRule]"
    >
    </v-autocomplete>
</template>
