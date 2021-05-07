const urlInput = document.querySelector("#long-url");
const submitBtn = document.querySelector("#submit");
const errorMsg = document.querySelector("#error");

let errorTimeout;

submitBtn.addEventListener("click", (event) => {
    if (!urlInput.validity.valid) {
        event.preventDefault();
        formValidation();
        errorTimeout = setTimeout(clearError, 3000);
    }
});

function formValidation() {
    clearTimeout(errorTimeout);

    errorMsg.classList.add("visible");
    errorMsg.classList.remove("hidden");

    if (urlInput.validity.valueMissing) {
        errorMsg.textContent = "Please enter a URL";
    } else if (urlInput.validity.typeMismatch) {
        errorMsg.textContent =
            "Invalid URL. URLs must start with http:// or https:// followed by a web address";
    }
}

function clearError() {
    errorMsg.classList.remove("visible");
    errorMsg.classList.add("hidden");
    errorMsg.textContent = "";
}
