// write your code here
const ramenMenu = document.querySelector("#ramen-menu");
const ramenDetail = document.querySelector("#ramen-detail");
const form = document.querySelector("#new-ramen");
const endpoint = "http://localhost:3000/ramens";

ramenMenu.addEventListener("click",(e)=>{
    if(e.target.tagName === "IMG"){
        fetch(`${endpoint}/${e.target.id}`)
        .then(res=>res.json())
        .then(data=>{
            const img = ramenDetail.querySelector(".detail-image");
            img.src = data.image;
            img.alt = data.name;

            ramenDetail.querySelector(".name").textContent = data.name;
            ramenDetail.querySelector(".restaurant").textContent = data.restaurant;
            document.querySelector("#rating-display").textContent = data.rating;
            document.querySelector("#comment-display").textContent = data.comment;
        });
    }   
});

form.addEventListener("submit",e=>{
    e.preventDefault();

    fetch(endpoint, {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "Accepts": "application/json"
        },
        body: JSON.stringify({
            name: newName.value,
            restaurant: newRestaurant.value,
            image: newImage.value,
            rating: newRating.value,
            comment: newComment.value
        })
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.id){
            ramenMenu.innerHTML += `<img id=${data.id} src="${data.image}" />`;
            form.reset();
        }else{
            alert("Failed to add ramen!");
        }
    })

});

fetch(endpoint)
.then(res=>res.json())
.then(data => data.forEach(el => {
    ramenMenu.innerHTML += `<img id=${el.id} src="${el.image}" />`;
}));