import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"

type AccountInfoResponse = { address: string }

const getAccountInfo = async (): Promise<AccountInfoResponse> => {
	const url = `${BASE_API}/account/info`
	const options = {
		method: "GET",
		headers: { "content-type": "application/json" },
	}

	try {
		const response: Response = await fetch(url, options)
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()
		return { address: data.Address }
	} catch (error) {
		const errorMessage = formatApiError({ error, url, options })
		throw new Error(errorMessage)
	}
}

export default getAccountInfo
