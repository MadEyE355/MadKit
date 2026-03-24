console.log("sniper_attack_start loaded 2")

// chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
//     console.log("CONTENT SCRIPT RECEIVED:", msg);
//     sendResponse("received");
// });
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === "START_INTRUDE") {

        startIntrude(message);

    }

    return true; // IMPORTANT
});


async function startIntrude(message){
    console.log(message)

    const parsed_req_arr = message.data;
    const number_of_parallel_req = message.parallel;

    for (let i = 0; i < parsed_req_arr.length; i += number_of_parallel_req) {

        const chunk = parsed_req_arr.slice(i, i + number_of_parallel_req);

        await Promise.all(
            chunk.map(async (reqObj) => {

                try {

                    const start_time = performance.now();

                    const response = await fetch(reqObj.url, {
                        ...reqObj.options,
                        credentials: "include",
                        redirect: "manual"
                    });

                    const text = await response.text();

                    const end_time = performance.now();
                    const response_time = Math.round(end_time - start_time);

                    chrome.runtime.sendMessage({
                        type: "SNIPER_RESULT",
                        data: {
                            response_string: text,
                            url: reqObj.url,
                            status: response.status,
                            length: text.length,
                            payload: reqObj.payload,
                            response_time: response_time,

                            requestOptions: reqObj.options,

                            sent_by : message.recieved_from,
                        }
                    });

                } catch (err) {

                    chrome.runtime.sendMessage({
                        type: "SNIPER_RESULT",
                        data: {
                            url: reqObj.url,
                            error: err.message,
                            payload: reqObj.payload,
                        }
                    });

                }

            })
        );
    }

}

// var sniper_attack_results = []

// chrome.runtime.onMessage.addListener(async (message, sender) => {
//     console.log(message)

//     if (message.type === "START_INTRUDE") {
//         console.log(message)
//         const parsed_req_arr = message.data;
//         const number_of_parallel_req = message.parallel;

//         for (let i = 0; i < parsed_req_arr.length; i += number_of_parallel_req) {

//             const chunk = parsed_req_arr.slice(i, i + number_of_parallel_req);

//             await Promise.all(
//                 chunk.map(async (reqObj) => {
//                     console.log(reqObj)

//                     try {

//                         const response = await fetch(reqObj.url, {
//                             ...reqObj.options,
//                             credentials: "include",
//                             redirect: "manual"
//                         });

//                         const text = await response.text();

//                         chrome.runtime.sendMessage({
//                             type: "SNIPER_RESULT",
//                             data: {
//                                 url: reqObj.url,
//                                 status: response.status,
//                                 length: text.length,
//                                 payload : reqObj.payload,
//                             }
//                         });

//                     } catch (err) {

//                         chrome.runtime.sendMessage({
//                             type: "SNIPER_RESULT",
//                             data: {
//                                 url: reqObj.url,
//                                 error: err.message,
//                                 payload: reqObj.payload,
//                             }
//                         });
//                     }

//                 })
//             );
//         }
//     }
// });