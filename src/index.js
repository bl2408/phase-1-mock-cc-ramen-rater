// write your code here
const formContainer = document.querySelector("#form-container");

formContainer.style.visibility = "hidden";

const ramenMenu = document.querySelector("#ramen-menu");
const ramenDetail = document.querySelector("#ramen-detail");
const form = document.querySelector("#new-ramen");
const endpoint = "http://localhost:3000/ramens";

ramenMenu.addEventListener("click",(e)=>{
    if(e.target.tagName === "IMG"){
        fetchReturnJson(`${endpoint}/${e.target.id}`)
        .then(data=>{
            displayData(data);
        });
    }   
});

document.body.addEventListener("click",(e)=>{
    if(e.target.tagName === "BUTTON"){

        if(e.target.classList.contains("btn-close")){
            toggleFormWindow(false);
        }else if(e.target.classList.contains("btn-add")){
            form.submitType.value = "add";
            displayDataToForm();
        }else if(e.target.classList.contains("btn-edit")){
            form.submitType.value = "edit";
            displayDataToForm();
        }else if(e.target.classList.contains("btn-delete")){
            deleteItem();
        }
    }
});

form.addEventListener("submit",e=>{
    e.preventDefault();

    let url = endpoint;

    const initObj = {
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
    };

    if(submitType.value === "edit"){
        url = `${endpoint}/${parseInt(dbId.value)}`
        initObj.method = "PATCH";
    }else{
        initObj.method = "POST";
    }

    fetchReturnJson(url, initObj)
    .then(data=>{
        if(data.id){
            imageLoad();
            toggleFormWindow(false);
        }else{
            alert("Error with proccess!");
        }
    });

});

function fetchReturnJson(ep, init={}){
    return fetch(ep, init)
    .then(res=>res.json());
}

function imageLoad(){
    fetchReturnJson(endpoint)
    .then(data => {
        ramenMenu.innerHTML = "";
        displayData(data[0]);
        data.forEach(img => {
            ramenMenu.innerHTML += imgTemplate(img);
        })
    });
}

imageLoad();





const imgTemplate = ({id, image}) => `<img id=${id} src="${image}" />`;

const toggleFormWindow = (open) => {
    formContainer.style.visibility = open ? "visible" : "hidden";
    form.reset();
};

const displayData = ({id, name, image, restaurant, rating, comment})=>{
    const img = ramenDetail.querySelector(".detail-image");
    img.src = image;
    img.alt = name;
    
    ramenDetail.querySelector(".name").textContent = name;
    ramenDetail.querySelector(".restaurant").textContent = restaurant;
    document.querySelector("#rating-display").textContent = rating;
    document.querySelector("#comment-display").textContent = comment;
    
    ramenDetail.querySelector("#dbId").value = id;
}

const displayDataToForm = ()=>{
    if(submitType.value === "edit"){
        form.querySelector("h4").textContent = "Edit Ramen";
        form.querySelector("input[type='submit']").value = "Save";
        

        const dbId = ramenDetail.querySelector("#dbId").value;
        fetchReturnJson(`${endpoint}/${dbId}`)
        .then(data=>{
            form.newName.value = data.name;
            form.newRestaurant.value = data.restaurant;
            form.newImage.value = data.image;
            form.newRating.value = data.rating;
            form.newComment.value =data.comment;
        });
    }else{
        form.querySelector("h4").textContent = "Add New Ramen";
        form.querySelector("input[type='submit']").value = "Create";
    }

    toggleFormWindow(true); 
};

const deleteItem = () =>{
    const dbId = ramenDetail.querySelector("#dbId").value;

    fetchReturnJson(`${endpoint}/${parseInt(dbId)}`, {
        method:"DELETE",
        headers:{
            "Content-Type": "application/json",
            "Accepts": "application/json"
        },
    })
    .then(data=>{
        if(data.id){
            alert("Error with proccess!"); 
        }else{
            imageLoad();
        }
    });

};