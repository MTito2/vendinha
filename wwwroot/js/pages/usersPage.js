import { UsersView } from "../services/usersController.js";
new Tablesort(document.getElementById('table'));

const usersView = new UsersView();
await usersView.loadUsers();

