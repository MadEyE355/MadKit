const frontBtns = document.querySelectorAll(".front_btns")

const intruderMainBtn = document.getElementById("intruder_main_btn");
const intruderSubBtnsDiv = document.getElementById("intruder_sub_btns");
const sniperBtn = document.getElementById("intruder_sniper_btn");
const sniperInputsDiv = document.getElementById("intruder_sniper_inputs");

// textareas and inputs
const sniperReqText = document.getElementById("intruder_sniper_req_text"); //request copied as fetch
const sniperPayload = document.getElementById("intruder_sniper_payload"); //payload to enter at site
const sniperWindowName = document.getElementById("intrude_sniper_window_name"); //title of intruder_sniper_results.html

intruderMainBtn.addEventListener("click", () => {
    intruderSubBtnsDiv.style.display = "block";

    frontBtns.forEach(e => {
        e.style.display = "none";
    })
})

sniperBtn.addEventListener("click", () => {
    sniperInputsDiv.style.display = "block";

    sniperBtn.style.display = "none";
})




document.getElementById("intruder_sniper_start_btn")
.addEventListener("click", async () => {

    const [activeTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    })
    const injected_pageid = activeTab.id
    console.log("injected page id : " , injected_pageid)



    const new_popup_winodw = await chrome.windows.create({
        url: chrome.runtime.getURL("intruder_sniper_results.html"),
        type: "popup",
        width: 1000,
        height: 700
    }) 

    const new_popup_tabid = new_popup_winodw.tabs[0].id;
    console.log(`${sniperWindowName.value} tabId : ${new_popup_tabid}`)
//

    const data_to_send = {
    req: sniperReqText.value,
    payload: sniperPayload.value,
    window_name: sniperWindowName.value,

    injected_page_tabid: injected_pageid,
    new_popup_tabid: new_popup_tabid,
    };


    // sending data to popup window (intruder_sniper_results.js)
        // Wait until tab fully loads
        chrome.tabs.onUpdated.addListener(function listener(updatedTabId, info) {

            if (updatedTabId === new_popup_tabid && info.status === "complete") {

                // Remove listener so it runs only once
                chrome.tabs.onUpdated.removeListener(listener);

                chrome.tabs.sendMessage(new_popup_tabid , {
                    type: "SNIPER_DATA",
                    data: data_to_send
                });
            }
        });

    });