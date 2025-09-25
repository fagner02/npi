<script lang="ts" setup>
import { product, selectCategories } from "../api/entity";
import { emptyRule, priceRule, quantityRule } from "./rules";
import { categoryService } from "@/api/service";

const loadCategorySelectItems = async (search: string) => {
    const res = await categoryService.fetch(12, 0, search);
    selectCategories.value = res.data.content;
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
            product.quantity = Math.floor(product.quantity??0);
        }"
        :rules="[quantityRule]"
        label="Quantidade"
        required
        variant="outlined"
    ></v-text-field>
    <v-autocomplete
        item-value="id"
        item-title="name"
        v-model="product.categoryId"
        :items="selectCategories"
        variant="outlined"
        label="Categoria"
        :oninput="(e: any)=>{
            loadCategorySelectItems(e.target.value);
        }"
        :rules="[emptyRule]"
    >
    </v-autocomplete>
</template>
