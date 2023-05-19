

$(() =>{
    $(".login-button").click(() => {
        let emailField = document.querySelector("#email");
        let userField = document.querySelector("#username");
        let passField = document.querySelector("#password");
        let errorText = document.querySelector("#error-text");

        if(emailField.value == ""){
            errorText.textContent = "Email required!"
            return;
        }
        if(userField.value == ""){
            errorText.textContent = "Username required!"
            return;
        }
        if(passField.value == ""){
            errorText.textContent = "Password required!"
            return;
        }

        $.post("http://localhost:3000/users", {username: userField.value, password: passField.value, email: emailField.value}, (signedUp) => {
            if(signedUp){
                window.location.replace("login.html");
            } else{
                errorText.textContent = "Email or username already exists!"
            }
        })
    });

});


function createUser(username, password, email){
    $.post("http://localhost:3000/users", {username: username, password: password, email: email});
}