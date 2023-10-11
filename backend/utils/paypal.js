
// For a fully working example, please see:
// https://github.com/paypal-examples/docs-examples/tree/main/standard-integration
require("dotenv").config();
const urlModule = require("url");
const baseURL = process.env.NODE_ENV === "production" ?
    "https://api-m.paypal.com" :
    "https://api-m.sandbox.paypal.com";
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, API_URL } = process.env;


async function createPartner(id) {
    const accessToken = await generateAccessToken();
    const url = `${baseURL}/v2/customer/partner-referrals`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            tracking_id: id,
            operations: [
                {
                    operation: "API_INTEGRATION",
                    api_integration_preference: {
                        rest_api_integration: {
                            integration_method: "PAYPAL",
                            integration_type: "THIRD_PARTY",
                            third_party_details: {
                                features: [
                                    "PAYMENT",
                                    "REFUND",
                                    "PARTNER_FEE"
                                ]
                            }
                        }
                    }
                }
            ],
            products: [
                "PPCP"
            ],
            legal_consents: [
                {
                    type: "SHARE_DATA_CONSENT",
                    granted: true
                }
            ],
            partner_config_override: {
                return_url: API_URL + "/complete-onboarding-paypal"
            }
        }),
    });
    const data = await response.json();
    let link;
    for (let i in data.links) {
        if (data.links[i].rel === "action_url") {
            link = data.links[i].href;
            break;
        }
    }
    console.log({link})
    return link;
}
async function createOrder(price, merchant_id, custom_id) {
        const accessToken = await generateAccessToken();
        const url = `${baseURL}/v2/checkout/orders`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "eur",
                            value: price.toString(),
                            breakdown: {
                                item_total:{
                                    currency_code: "eur",
                                    value: price.toString()
                                }
                            }
                        },
                        payee: {
                            merchant_id
                        },
                        payment_instruction: {
                            platform_fees : [
                                {
                                    amount: {
                                        currency_code: "eur",
                                        value: "1.00"
                                    }
                                }
                            ]
                        },
                        custom_id
                    }
                ],
            }),
        });
        const data = await response.json();
        console.log({data})
        let link = extractPaypalLink(data.links, "approve");
        let id = data.id;
        //console.log({data, link, details: data.details})
        let {token} = urlModule.parse(link, true).query
        return { link, token, id};
}
function extractPaypalLink(links, rel){
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if(rel === link.rel) return link.href;
    }
}
// use the orders api to capture payment for an order
async function capturePayment(orderId) {
    const accessToken = await generateAccessToken();
    const url = `${baseURL}/v2/checkout/orders/${orderId}/capture`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data;
}
async function retrieveOrder(orderId){
    const accessToken = await generateAccessToken();
    const url = `${baseURL}/v2/checkout/orders/${orderId}`;
    console.log({url})
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const data = await response.json();
    return data;
}
// generate an access token using client id and app secret
async function generateAccessToken() {
    //console.log(PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)
    const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET).toString("base64");
    //console.log(auth)
    const response = await fetch(`${baseURL}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
        },
    });
    //console.log(response)
    const data = await response.json();
    //console.log({data})
    return data.access_token;
}
async function generateClientToken() {
    const accessToken = await generateAccessToken();
    const response = await fetch(`${baseURL}/v1/identity/generate-token`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Accept-Language": "en_US",
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    return data.client_token;
}
const sendPayment = async(paypalId, amountInEur)=>{
    console.log("sending payment...", paypalId, amountInEur)
    const accessToken = await generateAccessToken();
    console.log(`Bearer ${accessToken}`)
    const url = `${baseURL}/v1/payments/payouts`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            items: [
                {
                    receiver: paypalId,
                    amount: {
                        currency: "EUR",
                        value: amountInEur
                    },
                    recipient_type: "PAYPAL_ID",
                    note: "Thanks for your patronage!",
                }
            ],
            sender_batch_header: {
                //sender_batch_id: "Payouts_2020_100007",
                email_subject: "You have a payout!",
                email_message: "You have received a payout! Thanks for using our service!"
            }
        })
    })
    const data = await response.json();
    console.log({data})
}
const refund = async(sellerId, paymentId) =>{
    const accessToken = await generateAccessToken();
    const url = `${baseURL}/v2/payments/captures/${paymentId}/refund`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "PayPal-Auth-Assertion" : getAuthAssertionValue(sellerId)
        },
        body: JSON.stringify({}),
    });
    console.log(response)
    const data = await response.json();
    console.log(data)
}
function getAuthAssertionValue(sellerPayerId) {
    const auth1 = Buffer.from(JSON.stringify({ alg: "none" })).toString("base64");
    const auth2 = Buffer.from(JSON.stringify({ iss : PAYPAL_CLIENT_ID , payer_id: sellerPayerId})).toString("base64");
    const authAssertionHeader = `${auth1}.${auth2}.`;
    return authAssertionHeader;
}
//refund("R33KB35RFSEPG", "8N35000562703080S")
module.exports = {
    capturePayment,
    retrieveOrder,
    createOrder,
    sendPayment,
    createPartner,
    generateClientToken,
    extractPaypalLink,
    getAuthAssertionValue,
    refund
}