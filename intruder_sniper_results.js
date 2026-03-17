var number_of_parallel_req = 5
var sniper_data = null;
var sniper_attack_results = []
var current_popup_tabid = null;

var result_index = 0;

chrome.runtime.onMessage.addListener(async (message, sender) => {

    // 1️⃣ Receive initial data from popup
    if (message.type === "SNIPER_DATA") {

        console.log("recieved msg :" , message.data);
        sniper_data = message.data;

        current_popup_tabid=message.data.new_popup_tabid;

        document.title = sniper_data.window_name;

        req_after_injection = await inject_payloads_in_req(sniper_data.req , sniper_data.payload);
        console.log("req after injection : " , req_after_injection)
        
        parsed_req_arr = await parse_request_from_str(req_after_injection);
        console.log("parsed req after injection : " , parsed_req_arr)


        // send messege to injected page tabid which is recieved in data
        //sending messege to sniper_attack_start.js
        console.log(message.data.injected_page_tabid)
        chrome.tabs.sendMessage(message.data.injected_page_tabid , {
        type: "START_INTRUDE",
        data: parsed_req_arr,
        parallel: number_of_parallel_req,

        recieved_from: message.data.new_popup_tabid,
        injected_page_tabid : message.data.injected_page_tabid,
    });

        // // 🔥 Send parsed requests to content script (lab page)
        // chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {

        //     if (tabs.length > 0) {
        //         chrome.tabs.sendMessage(tabs[0].id, {
        //             type: "START_INTRUDE",
        //             data: parsed_req_arr, 
        //             parallel: number_of_parallel_req
        //         });
        //     }
        // });

    }

    // 2️⃣ Receive results from content script
    if (message.type === "SNIPER_RESULT") {
        if(message.data.sent_by == current_popup_tabid){

        console.log("recieved data from content script" , message)

        // sniper_attack_results.push(message.data);

        // const resultsDiv = document.getElementById("results");

        // const line = document.createElement("div");
        // line.textContent = `${message.data.payload} | ${message.data.status} | ${message.data.length || ""}`;

        // resultsDiv.appendChild(line);

        result_index++;
        push_results(message)
        }
    }
});

async function parse_request_from_str(arr){

    let parsed_req = []

    for (let i = 0; i < arr.length ; i++){

        const urlMatch = arr[i].new_req.match(/fetch\s*\(\s*["']([^"']+)["']/);
        const url = urlMatch ? urlMatch[1] : null;

        const optionsMatch = arr[i].new_req.match(/fetch[\s\S]*?,\s*({[\s\S]*})\s*\)/);
        const options = optionsMatch ? JSON.parse(optionsMatch[1]) : null;

        parsed_req.push({
            url : url,
            options : options,
            payload : arr[i].payload
        })
    }

    return parsed_req;
}

async function inject_payloads_in_req(str_req , str_payload){

    req_after_injection = []

    let payload_parts = str_payload.split("\n")

    for (let i = 0; i <payload_parts.length ; i++){
        new_req = str_req.replace("$$" , payload_parts[i])

        req_after_injection.push({
            new_req : new_req,
            payload : payload_parts[i]
        })
    }

    return req_after_injection;
}


let dis_responses = []

function push_results(message){
    let row = document.createElement("tr")
    let resultsTable = document.getElementById("results_table")

    //dis = display ; which will be displayed in html
    let dis_payload = message.data.payload;
    let dis_status = message.data.status;
    let dis_length = message.data.length;
    let dis_response_string = message.data.response_string
    let dis_response_time = message.data.response_time

    row.innerHTML = `
    <td>${result_index}</td>
    <td>${dis_payload}</td>
    <td>${dis_status}</td>
    <td>${dis_length}</td>
    <td>${dis_response_time}</td>
    <td><button class="render_btn">Render</button></td>
    `


    resultsTable.append(row)

    // render button click
    row.querySelector(".render_btn").addEventListener("click", () => {
        openRenderPage(dis_response_string)
    });
    
    
}


function openRenderPage(html) {

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank", "width=1000,height=700");
}
