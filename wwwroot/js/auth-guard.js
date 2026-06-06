import api from './api/api.js';

async function checkAuth() {
    try {
        // 1. Valida se o usuário está autenticado
        const responseAuth = await api.get('/auth/me');
        const usuarioAuth = responseAuth.data;
        console.log("Usuário autenticado (Token):", usuarioAuth);

        // Remove a classe de bloqueio visual da página protegida
        document.body.classList.remove("protected-page");

        // Salva os dados iniciais do token no localStorage
        localStorage.setItem("userId", usuarioAuth.id);
        localStorage.setItem("userEmail", usuarioAuth.email || "");
        localStorage.setItem("userIsAdmin", usuarioAuth.isAdmin ? "Sim" : "Não");

        // 2. 👇 BUSCA OS DADOS EM TEMPO REAL DIRETO DO BANCO DE DADOS
        let nomeAtualizado = usuarioAuth.userName; // Valor padrão caso a busca falhe

        try {
            // Chamada para a rota que lista os usuários (traz dados novos do banco)
            const responseUsers = await api.get('/auth/users');
            const listaUsuarios = responseUsers.data;

            // Encontra você mesmo na lista através do ID
            const euMesmo = listaUsuarios.find(u => u.id === usuarioAuth.id);
            
            if (euMesmo && euMesmo.userName) {
                nomeAtualizado = euMesmo.userName;
            }
        } catch (errUsers) {
            console.warn("Não foi possível atualizar o username via banco (pode ser falta de privilégio de Admin):", errUsers);
        }

        // 3. 👇 ATUALIZA O LOCALSTORAGE E A ÂNCORA COM O NOME REAL DO BANCO
        localStorage.setItem("userUsername", nomeAtualizado || "");

        const usernameElement = document.getElementById("username-display");
        if (usernameElement) {
            usernameElement.textContent = nomeAtualizado || "Usuário";
        }

        // Listener para o botão "Editar Perfil"
        const btnEditProfile = document.getElementById("btn-edit-profile");
        if (btnEditProfile) {
            btnEditProfile.addEventListener("click", (event) => {
                event.preventDefault();
                
                // Força o localStorage a estar atualizado antes de ir para a tela de edição
                localStorage.setItem("userId", usuarioAuth.id);
                localStorage.setItem("userUsername", nomeAtualizado || "");
                localStorage.setItem("userEmail", usuarioAuth.email || "");
                localStorage.setItem("userIsAdmin", usuarioAuth.isAdmin ? "Sim" : "Não");

                window.location.href = "/pages/admin/users_edit.html";
            });
        }

        // Admin menu (caso exista outro)
        const adminMenu = document.getElementById('menu-admin');
        if (adminMenu) {
            adminMenu.style.display = usuarioAuth.isAdmin ? 'block' : 'none';
        }

        // Controle de visibilidade do menu "Usuários"
        const usersMenu = document.getElementById('menu-users');
        if (usersMenu) {
            usersMenu.style.display = usuarioAuth.isAdmin ? 'block' : 'none';
        }

        return usuarioAuth;

    } catch (error) {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("userId");
            localStorage.removeItem("userUsername");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userIsAdmin");
            
            window.location.replace('/pages/admin/login.html');
        } else {
            console.error("Erro ao verificar autenticação:", error);
        }
    }
}

checkAuth();