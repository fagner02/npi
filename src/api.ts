import axios from "axios";
import router from "./router";
import type { SortItem } from "vuetify/lib/components/VDataTable/composables/sort.mjs";
import type { Category, Product } from "./components/Main.vue";
import type { AxiosResponse } from "node_modules/axios/index.d.cts";
import { product } from "./components/Entity.vue";

export const API_URL = import.meta.env.VITE_API_URL;
export const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("authToken");
            router.push("/login");
        }
        return Promise.reject(error);
    }
);

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
        catRes.data.content = catRes.data.content.map((x: any) => ({
            ...x,
            categoryId: x.category?.id,
        }));
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
