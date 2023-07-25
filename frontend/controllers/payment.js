import { baseUrl, protectedUrl } from "../constants"
import { protectedCrossing, crossing } from "../utils"

const getOnboardingLink = async () => {
    return await protectedCrossing(protectedUrl + "/paypal-onboarding-link");
}


export {
    getOnboardingLink
}