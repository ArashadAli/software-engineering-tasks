const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const mobileInput = document.getElementById("mobile");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");

const form = document.getElementById("registration-form");

const countrySelect = document.getElementById("country");
const stateSelect = document.getElementById("state");

const termsCheckbox = document.getElementById("terms");

const rememberMeCheckbox = document.getElementById("remember-me");


function showError(input, message) {
    const errorElement = document.getElementById(`${input.id}-error`);

    errorElement.textContent = message;
}

function clearError(input) {
    const errorElement = document.getElementById(`${input.id}-error`);

    errorElement.textContent = "";
}

function validateName() {
    const name = nameInput.value.trim();

    if (name === "") {
        showError(nameInput, "Name cannot be empty");
        return false;
    }

    if (name.length < 3) {
        showError(nameInput, "Name must contain at least 3 characters");
        return false;
    }

    clearError(nameInput);
    return true;
}


function validateEmail() {
    const email = emailInput.value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        showError(emailInput, "Email cannot be empty");
        return false;
    }

    if (!emailPattern.test(email)) {
        showError(emailInput, "Invalid email address");
        return false;
    }

    clearError(emailInput);
    return true;
}


function validateMobile() {
    const mobile = mobileInput.value.trim();

    const mobilePattern = /^[0-9]{10}$/;

    if (mobile === "") {
        showError(mobileInput, "Mobile number cannot be empty");
        return false;
    }

    if (!mobilePattern.test(mobile)) {
        showError(mobileInput, "Enter a valid 10 digit mobile number");
        return false;
    }

    clearError(mobileInput);
    return true;
}

function validatePassword() {
    const password = passwordInput.value;

    if (password.length < 8) {
        showError(passwordInput, "Password must contain at least 8 characters");
        return false;
    }

    if (!/[0-9]/.test(password)) {
        showError(passwordInput, "Password must contain at least one number");
        return false;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        showError(passwordInput, "Password must contain at least one special character");
        return false;
    }

    clearError(passwordInput);
    return true;
}

function validateConfirmPassword() {
    if (confirmPasswordInput.value === "") {
        showError(confirmPasswordInput, "Please confirm your password");
        return false;
    }

    if (confirmPasswordInput.value !== passwordInput.value) {
        showError(confirmPasswordInput, "Passwords do not match");
        return false;
    }

    clearError(confirmPasswordInput);
    return true;
}


async function loadCountries() {
    try {
        const response = await fetch(
            "https://countriesnow.space/api/v0.1/countries"
        );

        const result = await response.json();

        result.data.forEach(function (country) {
            const option = document.createElement("option");

            option.value = country.country;
            option.textContent = country.country;

            countrySelect.appendChild(option);
        });

    } catch (error) {
        console.log("Unable to load countries");
    }
}

async function loadStates(country) {
    stateSelect.innerHTML = '<option value="">Select State</option>';
    stateSelect.disabled = true;

    if (!country) {
        return;
    }

    try {
        const response = await fetch(
            "https://countriesnow.space/api/v0.1/countries/states",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    country: country
                })
            }
        );

        const result = await response.json();

        result.data.states.forEach(function (state) {
            const option = document.createElement("option");

            option.value = state.name;
            option.textContent = state.name;

            stateSelect.appendChild(option);
        });

        stateSelect.disabled = false;

    } catch (error) {
        console.log("Unable to load states");
    }
}


loadCountries();


countrySelect.addEventListener("change", function () {
    loadStates(this.value);
});

function togglePassword(input, button) {
    if (input.type === "password") {
        input.type = "text";
        button.textContent = "Hide";
    } else {
        input.type = "password";
        button.textContent = "Show";
    }
}

document.getElementById("password-toggle").addEventListener("click", function () {
    togglePassword(passwordInput, this);
});

document.getElementById("confirm-password-toggle").addEventListener("click", function () {
    togglePassword(confirmPasswordInput, this);
});

nameInput.addEventListener("input", validateName);

emailInput.addEventListener("input", validateEmail);

mobileInput.addEventListener("input", validateMobile);

passwordInput.addEventListener("input", function () {
    validatePassword();

    if (confirmPasswordInput.value !== "") {
        validateConfirmPassword();
    }
});

confirmPasswordInput.addEventListener("input", validateConfirmPassword);

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMobileValid = validateMobile();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();

    let isFormValid = true;

    if (!countrySelect.value) {
        showError(countrySelect, "Please select a country");
        isFormValid = false;
    } else {
        clearError(countrySelect);
    }

    if (!stateSelect.value) {
        showError(stateSelect, "Please select a state");
        isFormValid = false;
    } else {
        clearError(stateSelect);
    }

    if (!termsCheckbox.checked) {
        document.getElementById("terms-error").textContent =
            "Please accept the Terms & Conditions";

        isFormValid = false;
    } else {
        document.getElementById("terms-error").textContent = "";
    }

    if (
        isNameValid &&
        isEmailValid &&
        isMobileValid &&
        isPasswordValid &&
        isConfirmPasswordValid &&
        isFormValid
    ) {

        if (rememberMeCheckbox.checked) {

            const userData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                mobile: mobileInput.value.trim(),
                country: countrySelect.value,
                state: stateSelect.value
            }
            localStorage.setItem("userData", JSON.stringify(userData));
        }

        document.getElementById("success-message").textContent =
            "Registration successful!";

        form.reset();

        stateSelect.innerHTML = '<option value="">Select State</option>';
        stateSelect.disabled = true;
    }
})
