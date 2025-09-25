<script setup lang="ts">
import { api } from "@/api/api";
import { ref } from "vue";
import { useRouter } from "vue-router";
const user = ref({ username: null, email: null, password: null });

const router = useRouter();
function login() {
    api.post(`/users/register`, user.value).then(() => {
        router.push("/login");
    });
}
const tab = ref(1);
</script>

<template>
    <v-app
        class="bg"
        style="
            --bg-color: hsl(0, 0%, 10%);
            background-position: 150px 50px !important;
            background-blend-mode: screen;
        "
    >
        <Header title="Product API">
            <v-tabs v-model="tab">
                <v-tab @click="() => router.push('/login')">Login</v-tab>
                <v-tab @click="() => router.push('/register')"
                    >Registrar
                </v-tab>
            </v-tabs>
        </Header>

        <BaseForm
            title="Registro"
            rounded="lg"
            style="margin: auto; width: 500px; max-width: 600px"
            class="login-card"
            ><template #fields>
                <v-text-field
                    label="Nome de Usuário"
                    v-model="user.username"
                    variant="outlined"
                    density="compact"
                />
                <v-text-field
                    label="Email"
                    v-model="user.email"
                    type="email"
                    variant="outlined"
                    density="compact"
                />
                <v-text-field
                    label="Senha"
                    v-model="user.password"
                    type="password"
                    variant="outlined"
                    density="compact"
                />
            </template>
            <template #actions>
                <v-btn
                    style="margin: 0px; margin-left: auto"
                    variant="outlined"
                    @click="login"
                    >Registrar</v-btn
                >
            </template>
        </BaseForm>
    </v-app>
</template>
