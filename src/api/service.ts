import type { Category, Product } from "@/components/Main.vue";
import type { AxiosResponse } from "axios";
import type { SortItem } from "vuetify/lib/components/VDataTable/composables/sort.mjs";
import { api } from "./api";
import { products } from "./entity";

export interface Service<T> {
    fetch: (
        itemsPerPage: number,
        page: number,
        search?: string,
        sort?: SortItem[]
    ) => Promise<AxiosResponse<{ content: T[]; totalElements: number }>>;
    save: (entity: T, edit: boolean) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

export class CategoryService implements Service<Category> {
    fetch = async (
        itemsPerPage: number,
        page: number,
        search?: string,
        sort?: SortItem[]
    ) => {
        const sortBy = sort
            ? sort.map((x) => `${x.key},${x.order ?? "asc"}`).join("&sort=")
            : "";
        const catRes = (
            await api.get(
                `/categorias?page=${
                    page - 1
                }&size=${itemsPerPage}&sort=${sortBy}&name=${search ?? ""}`
            )
        ).data;
        return catRes;
    };

    save = async (entity: Category, edit: boolean) => {
        if (edit) {
            await api.put(`/categorias/${entity.id}`, entity);
        } else {
            await api.post(`/categorias`, entity);
        }
    };

    delete = async (id: number) => {
        await api.delete(`/categorias/${id}`);
    };
}

export class ProductService implements Service<Product> {
    fetch = async (
        itemsPerPage: number,
        page: number,
        search?: string,
        sort?: SortItem[]
    ) => {
        const sortBy = sort
            ? sort.map((x) => `${x.key},${x.order ?? "asc"}`).join("&sort=")
            : "";
        const catRes = (
            await api.get(
                `/produtos?page=${
                    page - 1
                }&size=${itemsPerPage}&sort=${sortBy}&name=${search ?? ""}`
            )
        ).data;
        for (let i = 0; i < catRes.data.content.length; i++) {
            const item = catRes.data.content[i];
            item.categoryId = item.category?.id;
            try {
                const image = await api.get(`/produtos/${item.id}/image`, {
                    responseType: "blob",
                });
                item.image = image.data
                    ? URL.createObjectURL(image.data)
                    : null;
            } catch (e) {
                console.log(e);
            }
        }

        for (let i = 0; i < products.value.length; i++) {
            if (products.value[i].image) {
                URL.revokeObjectURL(products.value[i].image!);
            }
        }

        return catRes;
    };
    save = async (entity: Product, edit: boolean) => {
        const prod = { ...entity, category: { id: entity.categoryId } };
        if (edit) {
            await api.put(`/produtos/${entity.id}`, prod);
        } else {
            await api.post(`/produtos`, prod);
        }
    };
    delete = async (id: number) => {
        await api.delete(`/produtos/${id}`);
    };
}

export const productService = new ProductService();
export const categoryService = new CategoryService();
