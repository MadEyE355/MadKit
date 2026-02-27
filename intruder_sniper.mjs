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
.addEventListener("click", () => {


    const data_to_send = {
        req: sniperReqText.value,
        payload: sniperPayload.value,
        window_name: sniperWindowName.value
    };

    chrome.windows.create({
        url: chrome.runtime.getURL("intruder_sniper_results.html"),
        type: "popup",
        width: 1000,
        height: 700
    }, (createdWindow) => {

        const tabId = createdWindow.tabs[0].id;

        // Wait until tab fully loads
        chrome.tabs.onUpdated.addListener(function listener(updatedTabId, info) {

            if (updatedTabId === tabId && info.status === "complete") {

                // Remove listener so it runs only once
                chrome.tabs.onUpdated.removeListener(listener);

                chrome.runtime.sendMessage({
                    type: "SNIPER_DATA",
                    data: data_to_send
                });
            }
        });

    });
});