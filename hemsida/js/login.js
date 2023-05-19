
$(() =>{
    $(".login-button").click(() => {
        let userField = document.querySelector("#username");;
        let passField = document.querySelector("#password");
        let errorText = document.querySelector("#error-text");

        if(userField.value == ""){
            errorText.textContent = "Username required!"
            return;
        }
        if(passField.value == ""){
            errorText.textContent = "Password required!"
            return;
        }

        let noError = false;
        $.post("http://localhost:3000/login", {username: userField.value, password: passField.value}).done(function() {
            window.location.replace("index.html");
            noError = true;
        }).fail(function() {
            errorText.textContent = "Invalid credentials!"
        })
    });

});

