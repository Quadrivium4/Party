async function he() {
	const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
		headers: { Authorization: `Bearer hello` }
	}).then(res => res.json());
	console.log({res})
}
he()