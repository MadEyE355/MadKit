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
const clearEndpointScanResult = document.getElementById("clear_endpoint_scan_result");

const xssMainBtn = document.getElementById("xss_main_btn");


let concurrency = 5;

const concurrencySlider = document.getElementById("endpoint_scan_concurrency_slider");
const concurrencyValue = document.getElementById("endpoint_scan_concurrency_value");

concurrencySlider.addEventListener("input", () => {
    concurrency = parseInt(concurrencySlider.value);
    concurrencyValue.textContent = concurrency;
});



endpointScanBtn.addEventListener("click", () => {
    endpointScanInputs.style.display = "block";
    xssMainBtn.style.display = "none";
    endpointScanStartBtn.style.display = "block";
    show_result_history();
});

customEndpointsCheckbox.addEventListener("change", () => {
    if (customEndpointsCheckbox.checked) {
        customEndpointsInputs.style.display = "block";
    } else {
        customEndpointsInputs.style.display = "none";
    }
});

var result = [];

endpointScanStartBtn.addEventListener("click", async () => {

    result = [];
    endpointScanResultDisplayDiv.innerHTML = "";
    noOfEndpointsCheckedDiv.style.display = "block";

    const site = siteToScan.value.trim();

    if (!(site.includes("http") && site.includes("."))) {
        alert("enter site starting from https till .com");
        return;
    }
    

    let payload = `
/admin
/admin/login
/admin/dashboard
/admin/panel
/admin/users
/admin/settings
/admin/config
/admin/reports
/admin/roles
/admin/permissions
/login
/logout
/register
/signup
/signin
/auth
/auth/login
/auth/logout
/auth/register
/auth/refresh
/auth/verify
/auth/reset
/auth/forgot-password
/auth/change-password
/user
/user/profile
/user/settings
/user/account
/user/dashboard
/user/preferences
/user/notifications
/user/security
/user/avatar
/users
/users/list
/users/create
/users/update
/users/delete
/users/search
/users/export
/profile
/profile/edit
/profile/update
/account
/account/login
/account/logout
/account/settings
/account/billing
/account/subscription
/account/security
/account/delete
/dashboard
/home
/index
/api
/api/v1
/api/v2
/api/status
/api/health
/api/login
/api/logout
/api/register
/api/users
/api/user
/api/user/profile
/api/user/update
/api/user/delete
/api/products
/api/products/list
/api/products/create
/api/products/update
/api/products/delete
/api/orders
/api/orders/list
/api/orders/create
/api/orders/update
/api/orders/delete
/api/cart
/api/cart/add
/api/cart/remove
/api/cart/update
/api/checkout
/api/payment
/api/payment/intent
/api/payment/confirm
/api/invoice
/api/invoice/list
/api/messages
/api/notifications
/api/search
/api/upload
/api/download
/api/files
/api/files/upload
/api/files/delete
/api/reports
/api/admin
/api/admin/users
/api/admin/settings
/settings
/settings/profile
/settings/account
/settings/security
/settings/notifications
/settings/privacy
/settings/billing
/config
/config/app
/config/system
/system
/system/status
/system/health
/system/logs
/system/info
/logs
/logs/access
/logs/error
/logs/debug
/reports
/reports/daily
/reports/monthly
/reports/annual
/reports/export
/search
/help
/support
/contact
/feedback
/terms
/privacy
/about
/status
/health
/metrics
/docs
/docs/api
/docs/swagger
/swagger
/swagger/index
/openapi
/graphql
/graphql/playground
/webhook
/webhooks
/webhooks/stripe
/webhooks/github
/callback
/oauth
/oauth/authorize
/oauth/token
/oauth/callback
/integrations
/integrations/slack
/integrations/github
/integrations/google
/plugins
/modules
/themes
/assets
/static
/public
/private
/uploads
/downloads
/backup
/backups
/backup/db
/backup/files
/cron
/jobs
/queue
/worker
/monitor
/monitoring
/analytics
/stats
/debug
/test
/dev
/staging
/beta
/demo
/sandbox
/internal
/private/api
/v1/users
/v1/orders
/v1/products
/v1/auth
/v2/users
/v2/orders
/v2/products
/mobile
/mobile/api
/app
/app/api
/client
/portal
/console
/manage
/administrator
/superadmin
/root
/data
/database
/db
/db/admin
/cache
/cache/clear
/session
/sessions
/token
/tokens
/verify
/activate
/resend-verification
/reset-password
/change-password
/two-factor
/2fa
/mfa
`;


    if (customEndpointsCheckbox.checked) {
        payload = customEndpointsPayload.value;
        if (!payload.trim()) {
            alert("enter payload");
            return;
        }
    }

    let payload_parts = payload
        .split("\n")
        .map(e => e.trim())
        .filter(e => e !== "");

    let payload_length = payload_parts.length;


    let completed = 0;

    for (let i = 0; i < payload_parts.length; i += concurrency) {

        const chunk = payload_parts.slice(i, i + concurrency);

        await Promise.all(
            chunk.map(async (endpoint) => {

                try {
                    const res = await fetch(site + endpoint);
                    result.push({
                        endpoint: endpoint,
                        status: res.status,
                        full_link: site + endpoint
                    });
                } catch (err) {
                    result.push({
                        endpoint: endpoint,
                        status: "ERR",
                        full_link: site + endpoint
                    });
                }

                completed++;
                noOfEndpointsCheckedDiv.innerHTML =
                    `${completed} / ${payload_length}`;
            })
        );
    }

    endpointScanResultBtn.style.display = "block";
});

endpointScanResultBtn.addEventListener("click", () => {

    endpointScanResultDisplayDiv.style.display = "block";
    endpointScanResultDisplayDiv.innerHTML = "";

    result.sort((a, b) => {
        if (a.status === "ERR") return 1;
        if (b.status === "ERR") return -1;
        return a.status - b.status;
    });

    for (const r of result) {

        const row = document.createElement("div");
        const link = document.createElement("a");
        link.href = r.full_link;
        link.textContent = " Link";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        const text = document.createElement("span");
        text.textContent = `[${r.status}] ${r.endpoint}`;

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

    set_result_history(endpointScanResultDisplayDiv.innerHTML);
});

async function set_result_history(html) {
    await chrome.storage.local.set({
        history_html: html
    });
}

async function show_result_history() {
    endpointScanResultDisplayDiv.style.display = "block";
    let history_data = await chrome.storage.local.get("history_html");
    endpointScanResultDisplayDiv.innerHTML = history_data.history_html || "";
}

clearEndpointScanResult.addEventListener("click", async () => {
    await chrome.storage.local.remove("history_html");
    endpointScanResultDisplayDiv.innerHTML = "";
});