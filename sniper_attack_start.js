console.log("sniper_attack_start loaded")

var sniper_attack_results = []

chrome.runtime.onMessage.addListener(async (message, sender) => {

    if (message.type === "START_INTRUDE") {
        // console.log(message)
        const parsed_req_arr = message.data;
        const number_of_parallel_req = message.parallel;

        for (let i = 0; i < parsed_req_arr.length; i += number_of_parallel_req) {

            const chunk = parsed_req_arr.slice(i, i + number_of_parallel_req);

            await Promise.all(
                chunk.map(async (reqObj) => {
                    // console.log(reqObj)

                    try {

                        const response = await fetch(reqObj.url, {
                            ...reqObj.options,
                            credentials: "include",
                            redirect: "manual"
                        });

                        const text = await response.text();

                        chrome.runtime.sendMessage({
                            type: "SNIPER_RESULT",
                            data: {
                                url: reqObj.url,
                                status: response.status,
                                length: text.length,
                                payload : reqObj.payload,
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
});