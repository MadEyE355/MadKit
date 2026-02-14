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
const checkLastPayloadBtn = document.getElementById("check_last_payload");

checkLastPayloadBtn.addEventListener("click", () => {
    get_last_tested_payload()
})


xssMainBtn.addEventListener("click", () => {
    xssMainBtn.style.display = "none";
    xssSubBtns.style.display = "block";
})

customXssBtn.addEventListener("click", (e) => {
    customXssInputs.style.display = "block";
    customXssStartBtn.style.display = "block";
})

xssStartBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        btn.style.display = "none";
    })
})


customXssStartBtn.addEventListener(("click") , async (e) => {
    const payload = customXssPayload.value;
    const attackSite_CXss = customXssIS.value;
    const searchBtn = customXssSBS.value;

    if (!payload.trim() || !attackSite_CXss.trim() || !searchBtn.trim()) {
        alert("fill all values")
        return;
    }


    await start_xss(payload , attackSite_CXss , searchBtn)


})

async function start_xss(param_payload , param_attackSite , param_searchBtn) {
        let payload_parts = param_payload.split("\n");


        if(Number(sessionStorage.getItem("indx")) >= payload_parts.length){
            return;
        }
        else
        {
            let index = Number(sessionStorage.getItem("indx") || 0)
            sessionStorage.setItem("indx" , index+1)

            let payload_to_test = payload_parts[index]
            
            await set_last_tested_payload(payload_to_test)

            
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            chrome.scripting.executeScript({
            target: { tabId: tab.id },
            args: [payload_to_test, param_attackSite, param_searchBtn],
    
                func: async (payload_to_test, param_attackSite, param_searchBtn) => {
                    
                    console.log('testing : ' , payload_to_test)

                    const input_box = document.querySelector(param_attackSite);
                    const search_btn = document.querySelector(param_searchBtn);

                    if (!input_box || !search_btn) {
                    console.log("[XSS] Selector not found");
                    return;
                    }

                    input_box.value = payload_to_test;
                    input_box.dispatchEvent(new Event("input", { bubbles: true }));

                    search_btn.click()


                } 

            })

            await waitForTabLoad(tab.id)

            await start_xss(param_payload , param_attackSite, param_searchBtn)
        }
}

async function waitForTabLoad(tabId) {
    return new Promise((resolve) => {
        chrome.tabs.onUpdated.addListener(function listener(updatedTabId, info) {
            if (updatedTabId === tabId && info.status === "complete") {
                chrome.tabs.onUpdated.removeListener(listener);
                resolve();
            }
        });
    });
}



async function set_last_tested_payload(p){
    await chrome.storage.local.set({
  last_payload_tested: p
});
}

async function get_last_tested_payload(){
const { last_payload_tested } = await chrome.storage.local.get("last_payload_tested");
alert(last_payload_tested);
}