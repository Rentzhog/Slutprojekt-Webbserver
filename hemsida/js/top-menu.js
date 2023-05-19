const accountDropdown = document.querySelector("#account-dropdown");
const accountIcon = document.querySelector("#account-icon");
const accountMenu = document.querySelector("#account-menu");

$.get("http://localhost:3000/profile", (user) => {
    if(user){
        accountIcon.src="images/account-icon2.png";
        accountMenu.removeChild(accountMenu.querySelector("[data-login]"))
        accountMenu.querySelector("[data-signup]").textContent = "Log Out"
        accountMenu.querySelector("[data-signup]").href = ""
        accountMenu.querySelector("[data-signup]").addEventListener("click", () => {
            $.post("http://localhost:3000/logout");
        })
    }
})

accountIcon.addEventListener('click', () => {
    accountDropdown.classList.toggle('open');
});

document.addEventListener('click', (event) => {
    if (!accountDropdown.contains(event.target)) {
        accountDropdown.classList.remove('open');
    }
});