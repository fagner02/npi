<script setup lang="ts">
import { api, username } from "@/api/api";
import { ref } from "vue";
import { useRouter } from "vue-router";
const user = ref({ username: null, email: null, password: null });

const router = useRouter();
function login() {
    api.post(`/users/login`, user.value).then((res) => {
        username.value = res.data.username;
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("authToken", res.data.token);
        router.push("/");
    });
}
const tab = ref(0);
</script>

<template>
    <v-app
        class="bg app"
        style="
            --bg-color: hsl(0, 0%, 10%);
            background-position: 150px 50px !important;
            background-blend-mode: screen;
        "
    >
        <Header title="Product API">
            <v-tabs v-model="tab">
                <v-tab @click="() => router.push('/login')">Login</v-tab>
                <v-tab :value="true" @click="() => router.push('/register')"
                    >Registrar</v-tab
                >
            </v-tabs>
        </Header>

        <v-card
            max-width="600"
            width="500px"
            rounded="lg"
            style="margin: auto; padding: 20px"
            class="bg login-card"
        >
            <v-card-title
                style="
                    text-align: center;
                    padding: 0;
                    margin-bottom: 20px;
                    color: hsl(0, 0%, 100%);
                "
                >Formulário de Login</v-card-title
            >
            <v-form
                style="
                    display: flex;
                    flex-direction: column;
                    justify-items: center;
                "
            >
                <v-text-field
                    label="Email"
                    v-model="user.email"
                    type="email"
                    variant="outlined"
                    density="compact"
                    bg-color="hsl(0, 0%, 100%, 20%)"
                />
                <v-text-field
                    label="Senha"
                    v-model="user.password"
                    type="password"
                    variant="outlined"
                    density="compact"
                    bg-color="hsl(0, 0%, 100%, 20%)"
                />
                <v-btn
                    style="margin: 0px; margin-left: auto"
                    variant="outlined"
                    @click="login"
                    >Login</v-btn
                >
            </v-form>
        </v-card>
    </v-app>
</template>

<style>
@media (max-width: 600px) {
    .login-card {
        width: auto !important;
        margin: auto 10px !important;
    }
}
</style>
