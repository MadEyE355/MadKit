const xssMainBtn = document.getElementById("xss_main_btn");
const xssSubBtns = document.getElementById("xss_sub_btns");
const customXssBtn = document.getElementById("custom_xss_btn");
const customXssInputs = document.getElementById("custom_xss_inputs");
const customXssStartBtn = document.getElementById("custom_xss_start_btn");
const customXssPayload = document.getElementById("custom_xss_payload");
const customXssIS = document.getElementById("custom_xss_input_selector");
// IS = input selector
const customXssSBS = document.getElementById("custom_xss_searchBtn_selector") 
// SBS = searchBtn selector
const xssStartBtns = document.querySelectorAll(".xss_start_btns");

xssStartBtns.forEach((btn)=>{
    btn.addEventListener("click", ()=>{
        btn.style.display = "none";
    })
})


xssMainBtn.addEventListener("click", () => {
    xssMainBtn.style.display = "none";
    xssSubBtns.style.display = "block";
})

customXssBtn.addEventListener("click", (e) => {
    customXssInputs.style.display = "block";
    customXssStartBtn.style.display = "block";
})


customXssStartBtn.addEventListener("click", async (e) => {

    const payload = customXssPayload.value;
    const attackSite_CXss = customXssIS.value;
    const searchBtn = customXssSBS.value;

    if(!payload.trim() || !attackSite_CXss.trim() || !searchBtn.trim()) {
        alert("fill all values") 
        return;
    }

        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [payload , attackSite_CXss , searchBtn],

        func: (param_payload , param_attackSite , param_searchBtn) => {
            var parts_payload = param_payload.split("\n")
            console.log(parts_payload);


        }

        })


})