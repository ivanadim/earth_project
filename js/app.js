const countryExplorer = document.getElementById("countryExplorer");
const button = document.getElementById("startExploringBtn");
const videoContainer = document.getElementsByClassName("videoContainer")[0];

button.addEventListener("click", () => {
    videoContainer.classList.add("hide")
    countryExplorer.classList.remove("hide");

})