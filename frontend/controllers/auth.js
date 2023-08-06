import { baseUrl, protectedUrl } from "../constants"
import { crossing, protectedCrossing } from "../utils"

const signInWithGoogle = async (accessToken) => {
	return await crossing(baseUrl + "/google-login", "POST", {},{ Authorization: "Bearer " + accessToken});
}


export {
	signInWithGoogle
}