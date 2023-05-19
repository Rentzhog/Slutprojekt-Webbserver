const selectImage = document.querySelector("#upload-image");
const inputFile = document.querySelector("#file");

let currentImage = null

$(() =>{

    selectImage.addEventListener("click", function() {
        inputFile.click();
    })

    inputFile.addEventListener("change", function() {
        const image = this.files[0];
        
        let reader = new FileReader();
        if(image){
            reader.readAsDataURL(image);
        }

        reader.onload = (() => {
            currentImage = reader.result;
            selectImage.innerHTML = "";
            const imgUrl = reader.result;
            const img = document.createElement("img");
            img.src = imgUrl;
            selectImage.appendChild(img);
        })

    })


    $("#submit-post").click(() => {
        $.get("http://localhost:3000/profile", (user) => {
            if(user && createPost(user.id, $("#new-post-title").val(), $("#new-post-content").val(), currentImage)){
                window.location.replace("index.html");
            }
        })

    });

});




function createPost(userID, title, content, image=null){
    if(title != ""){
        $.post("http://localhost:3000/posts", {userID: userID, title: title, content: content, image: image});
        return true
    } else{
        return false
    }

}