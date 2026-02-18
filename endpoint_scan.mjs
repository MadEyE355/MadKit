const endpointScanBtn = document.getElementById("endpoint_scan_btn");
const endpointScanInputs = document.getElementById("endpoint_scan_inputs");
const customEndpointsCheckbox = document.getElementById("custom_endpoints_checkbox");
const customEndpointsInputs = document.getElementById("custom_endpoints_inputs");
const endpointScanStartBtn = document.getElementById("endpoint_scan_start_btn");
const customEndpointsPayload = document.getElementById("custom_endpoints_paylaod");
const siteToScan = document.getElementById("site_to_scan_for_endpoints");
const endpointScanResultBtn = document.getElementById("endpoint_scan_result_btn");

const noOfEndpointsCheckedDiv = document.getElementById("no_of_endpoints_checked");

const endpointScanResultDisplayDiv = document.getElementById("endpoint_scan_result_display");

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


var result = []

endpointScanStartBtn.addEventListener("click", async (e) => {
    noOfEndpointsCheckedDiv.style.display = "block";

    const site = siteToScan.value;
    if(!(site.trim().includes("http") && site.trim().includes("."))) {
        alert("enter site starting from https till .com")
        return;
    }


let payload = `
/admin
/admin/login
/admin/dashboard
/admin/panel
/admin.php
/login
/logout
/register
/signup
/signin
/user
/users
/user/login
/user/profile
/user/settings
/profile
/account
/account/login
/account/settings
/settings
/config
/config.php
/config.json
/api
/api/v1
/api/v1/users
/api/v1/login
/api/v1/register
/api/v2
/api/auth
/api/status
/api/health
/status
/health
/healthcheck
/ping
/test
/debug
/dev
/staging
/beta
/old
/backup
/backups
/db
/database
/db.sql
/dump
/.env
/.git
/.git/config
/.htaccess
/.htpasswd
/server-status
/phpinfo.php
/info.php
/install
/setup
/setup.php
/upgrade
/reset
/password
/password/reset
/forgot-password
/search
/query
/results
/upload
/uploads
/files
/images
/assets
/static
/css
/js
/vendor
/public
/private
/tmp
/temp
/log
/logs
/error
/errors
/404
/500
/contact
/about
/help
/support
/docs
/documentation
/blog
/news
/forum
/shop
/store
/cart
/checkout
/payment
/payments
/invoice
/orders
/webhook
/webhooks
/graphql
/robots.txt
/sitemap.xml
/cpanel
/phpmyadmin
/mysql
/console
/monitor
/metrics
/actuator
/actuator/health
/actuator/info
/swagger
/swagger-ui
/openapi.json
/internal
/secure
`;


    if (customEndpointsCheckbox.checked){
        payload = customEndpointsPayload.value;
        if(!payload.trim()){
            alert("enter payload")
        }
    }

    let payload_parts = payload.split("\n");
    let payload_length = payload_parts.length;

    let checked = 0;


    while(checked < payload_parts.length){
        const response_status = await start_endpoint_scan(payload_parts[checked] , site)
        
        result.push({
            endpoint : payload_parts[checked],
            status : response_status,
            full_link : site+payload_parts[checked]
        })
        
        noOfEndpointsCheckedDiv.innerHTML = `${checked+1} / ${payload_length}`
        checked++;

    }

    endpointScanResultBtn.style.display = "block";
    

})



async function start_endpoint_scan(single_endpoint , param_site) {
    const res = await fetch(param_site+single_endpoint)
    const status = res.status
    return status
}




endpointScanResultBtn.addEventListener("click", () => {
    endpointScanResultDisplayDiv.style.display = "block";

    // Clear old results first
    endpointScanResultDisplayDiv.innerHTML = "";

    for (const r of result) {

        const row = document.createElement("div");
        const link = document.createElement("a");
        link.href = r.full_link;
        link.textContent = "Link";
        link.target = "_blank"; // open in new tab
        link.rel = "noopener noreferrer"; // security best practice


        // Create text part
        const text = document.createElement("span");
        text.textContent = `[${r.status}] ${r.endpoint} `;

        // Color based on status
        if (r.status >= 200 && r.status < 300) {
            row.style.color = "green";
        } 
        else if (r.status >= 300 && r.status < 400) {
            row.style.color = "orange";
        } 
        else if (r.status >= 400 && r.status < 500) {
            row.style.color = "red";
        } 
        else if (r.status >= 500) {
            row.style.color = "darkred";
        } 
        else {
            row.style.color = "gray";
        }

        row.appendChild(text);
        row.appendChild(link);

        endpointScanResultDisplayDiv.appendChild(row);
    }

});
