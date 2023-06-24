import * as SecureStore from 'expo-secure-store';

const crossing = async (url, method = "GET", body = {}, headers = {}) => {
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
        }).then(res => res.json());
    } else if (method === "POST" || method === "PUT") {
        result = await fetch(url, {
            method: method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
                ...headers
            },
            body: JSON.stringify(body)
        }).then(async res => {
            if (!res.ok) throw await res.json();
            return res.json()
        });
    } else {
        console.log("invalid method")
    }
    return result
}
const protectedCrossing = async(url, method = "GET", body = {}) =>{
    return await crossing(url, method, body, { "Authorization" : "Bearer " + await SecureStore.getItemAsync("aToken")});
}
export {
    crossing,
    protectedCrossing
}