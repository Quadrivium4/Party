import * as SecureStore from 'expo-secure-store';

const crossing = async (url, method = "GET", body = {}, headers = {}) => {
    console.log("using crossing", {body})
    await new Promise((resolve) => setTimeout(resolve, 0 * 1000));
    let result;
    if (method === "GET" || method === "DELETE") {
        result = await fetch(url, {
            method: method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
                ...headers
            }
        }).then(async res => {
            if (!res.ok) throw await res.json();
            return res.json()
        });
    } else if (method === "POST" || method === "PUT") {
        headers = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
            ...headers
        }
        console.log(headers["Content-Type"])
        result = await fetch(url, {
            method: method,
            headers,
            body: headers["Content-Type"] == "application/json"? JSON.stringify(body) : body
        }).then(async res => {
            if (!res.ok) throw await res.json();
            return res.json()
        });
    } else {
        console.log("invalid method")
    }
    return result
}
const protectedCrossing = async(url, method = "GET", body = {}, headers = {}) =>{
    const aToken = await SecureStore.getItemAsync("aToken");
    return await crossing(url, method, body, { "Authorization" : "Bearer " + aToken, ...headers});
}
const validateEmail = (email) => {
    const expression = /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])/i;
    return expression.test(String(email).toLowerCase());
}
const insertScriptHead = ({ name, src }) => {
    if (!document.querySelector(`#${name}`)) {
        const container = document.head || document.querySelector('head')
        const scriptElement = document.createElement('script')
        scriptElement.setAttribute('id', name)
        scriptElement.async = true
        scriptElement.src = src
        container.appendChild(scriptElement)
    }
}

const getDateFormatted = (d) =>{
    console.log("hello")
    date = new Date(d);
    let minutes = date.getMinutes() < 10?  `0${date.getMinutes()}`: date.getMinutes();
    const string =  date.getHours() + ":" +  minutes + "  " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + ((date.getFullYear() + "").substr(2,3)) 
    return string
}
const getDateDifference = (d1, d2) =>{
    d1 = new Date(d1).valueOf()
    d2 = new Date(d2).valueOf()
    return Math.abs(d2 - d1);
}

const loadPaypal = () => {
    return new Promise((resolve, reject) => {
        const container = document.head || document.querySelector('head')
        const scriptElement = document.createElement('script')
        scriptElement.setAttribute('id', "paypal")
        scriptElement.async = true
        scriptElement.src = "https://www.paypal.com/sdk/js?client-id=YAcKyPNW4iA1QGrSQulkhLy_v8hqupekmBNkZ6h0cg9WwWmg91L3dmKsN_d7GEe4LaDq_Ug4Pz5k7TpyF&components=buttons,hosted-fields,funding-eligibility";
        scriptElement.onload = () => {
            document.getElementById("led").innerHTML = "paypalled";
            resolve(window.paypal)

        }
        container.appendChild(scriptElement);
    })


}
export {
    crossing,
    protectedCrossing,
    insertScriptHead,
    getDateFormatted,
    getDateDifference,
    validateEmail
}