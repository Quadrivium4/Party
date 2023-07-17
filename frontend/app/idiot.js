const hello = document.getElementById("led");
const loadPaypal = () => {
    hello.innerHTML = "red";
    return new Promise((resolve, reject) => {
        const container = document.head || document.querySelector('head')
        const scriptElement = document.createElement('script')
        scriptElement.setAttribute('id', "paypal")
        scriptElement.async = true
        scriptElement.src = "https://www.paypal.com/sdk/js?client-id=YAcKyPNW4iA1QGrSQulkhLy_v8hqupekmBNkZ6h0cg9WwWmg91L3dmKsN_d7GEe4LaDq_Ug4Pz5k7TpyF&components=buttons,hosted-fields,funding-eligibility";

        scriptElement.onload = () => {
            hello.innerHTML = "paypalled";
            resolve(window.paypal)

        }
        container.appendChild(scriptElement);
    })


}
const loadPaypl = () => {

    return new Promise((resolve, reject) => {
        const container = document.head || document.querySelector('head')
        const scriptElement = document.createElement('script')
        container.appendChild(scriptElement);
        scriptElement.setAttribute('id', "paypal")

        scriptElement.addEventListener("load", (e) => {

            resolve("mtoo");
        });
        hello.innerHTML = "mot"
        scriptElement.src = "https://www.paypal.com/sdk/js?;client-id=YAcKyPNW4iA1QGrSQulkhLy_v8hqupekmBNkZ6h0cg9WwWmg91L3dmKsN_d7GEe4LaDq_Ug4Pz5k7TpyF&components=buttons,hosted-fields,funding-eligibility";


    })
}
loadPaypal().then(paypal => {

})