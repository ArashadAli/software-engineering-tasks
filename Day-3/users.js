const users = [
    {
        id: 1,
        name: "Arashad",
        email: "arashad@gmail.com",
        status: "Active"
    },
    {
        id: 2,
        name: "Abhishek",
        email: "abhishek@gmail.com",
        status: "Active"
    },
    {
        id: 3,
        name: "Aditya",
        email: "aditya@gmail.com",
        status: "Inactive"
    }
];

const userTableBody = document.getElementById("userTableBody");
const searchInput = document.getElementById("searchUser");

const editModal = document.getElementById("editModal");
const editUserForm = document.getElementById("editUserForm");

const editUserId = document.getElementById("editUserId");
const editName = document.getElementById("editName");
const editEmail = document.getElementById("editEmail");
const editStatus = document.getElementById("editStatus");

const cancelEdit = document.getElementById("cancelEdit");


function displayUsers(userList) {
    userTableBody.innerHTML = "";

    if (userList.length === 0) {
        userTableBody.innerHTML = `
            <tr>
                <td colspan="4">No users found.</td>
            </tr>
        `;
        return;
    }

    userList.forEach(function (user) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.status}</td>
            <td>
                <button class="edit-btn" onclick="openEditForm(${user.id})">
                    Edit
                </button>

                <button class="delete-btn" onclick="deleteUser(${user.id})">
                    Delete
                </button>
            </td>
        `;

        userTableBody.appendChild(row);
    });
}


searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.toLowerCase().trim();

    const filteredUsers = users.filter(function (user) {
        return (
            user.name.toLowerCase().includes(searchValue) ||
            user.email.toLowerCase().includes(searchValue)
        );
    });

    displayUsers(filteredUsers);
});


function deleteUser(id) {
    const user = users.find(function (user) {
        return user.id === id;
    });

    if (!user) {
        return;
    }

    const userIndex = users.findIndex(function (user) {
        return user.id === id;
    });

    users.splice(userIndex, 1);

    displayUsers(users);
}

function openEditForm(id) {
    const user = users.find(function (user) {
        return user.id === id;
    });

    if (!user) {
        return;
    }

    editUserId.value = user.id;
    editName.value = user.name;
    editEmail.value = user.email;
    editStatus.value = user.status;

    editModal.style.display = "flex";
}

editUserForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const id = Number(editUserId.value);

    const user = users.find(function (user) {
        return user.id === id;
    });

    if (!user) {
        return;
    }

    user.name = editName.value.trim();
    user.email = editEmail.value.trim();
    user.status = editStatus.value;

    editModal.style.display = "none";

    displayUsers(users);
});


cancelEdit.addEventListener("click", function () {
    editModal.style.display = "none";
});


editModal.addEventListener("click", function (event) {
    if (event.target === editModal) {
        editModal.style.display = "none";
    }
});


displayUsers(users);
