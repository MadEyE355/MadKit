const endpointScanBtn = document.getElementById("endpoint_scan_btn");
const endpointScanInputs = document.getElementById("endpoint_scan_inputs");
const customEndpointsCheckbox = document.getElementById("custom_endpoints_checkbox");
const customEndpointsInputs = document.getElementById("custom_endpoints_inputs");
const endpointScanStartBtn = document.getElementById("endpoint_scan_start_btn");

const xssMainBtn = document.getElementById("xss_main_btn");


endpointScanBtn.addEventListener("click", () => {
    endpointScanInputs.style.display = "block";
    xssMainBtn.style.display = "none";
    endpointScanStartBtn.style.display = "block";
})

customEndpointsCheckbox.addEventListener("change", () => {
    if(customEndpointsCheckbox.checked){
        customEndpointsInputs.style.display = "block";
    }
    else{
        customEndpointsInputs.style.display="none";
    }
})