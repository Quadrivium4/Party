const { default: WebView } = require("react-native-webview")

const Checkout = ({price}) =>{
    const jsCode = `
    const hello = document.getElementById("led");
    let cocco =  document.getElementById("cocco");
    const loadPaypal = () => {
        
        return new Promise((resolve, reject) =>{
            const container = document.head || document.querySelector('head')
            const scriptElement = document.createElement('script')
            container.appendChild(scriptElement);
            scriptElement.setAttribute('id', "paypal")
            
            scriptElement.addEventListener("load", (e)=>{

                resolve("mtoo");
            });
            hello.innerHTML = "mot"
            scriptElement.src = "https://www.paypal.com/sdk/js?;client-id=YAcKyPNW4iA1QGrSQulkhLy_v8hqupekmBNkZ6h0cg9WwWmg91L3dmKsN_d7GEe4LaDq_Ug4Pz5k7TpyF&components=buttons,hosted-fields,funding-eligibility";
            
            
        })
    }
    loadPaypal().then(paypal =>{
        cocco.innerHTML = paypal
    })
    `
    return (
        <WebView
        style={{padding: 150}}
        injectedJavaScript={jsCode}
        originWhitelist={['*']}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        source={{
            html: `
                <h1 id="red">Hello</h1>
                <h1 id="red">Hello</h1>
                <h1 id="led">Hello</h1>
                <h1 id="cocco">Hello</h1>
            `
        }}
        >

        </WebView>
    )
}
export default Checkout