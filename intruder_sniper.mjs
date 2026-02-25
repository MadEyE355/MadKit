const frontBtns = document.querySelectorAll(".front_btns")

const intruderMainBtn = document.getElementById("intruder_main_btn");
const intruderSubBtnsDiv = document.getElementById("intruder_sub_btns");
const sniperBtn = document.getElementById("intruder_sniper_btn");
const sniperInputs = document.getElementById("intruder_sniper_inputs");


intruderMainBtn.addEventListener("click", () => {
    intruderSubBtnsDiv.style.display = "block";

    frontBtns.forEach(e => {
        e.style.display = "none";
    })
})

sniperBtn.addEventListener("click", () => {
    sniperInputs.style.display = "block";

    sniperBtn.style.display = "none";
})