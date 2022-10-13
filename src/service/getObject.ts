import { BASE_API } from "../utils/constants"
import { SonrObject } from "../utils/types"

const getObject = async (
	schemaDid: string,
	objectCid: string
): Promise<SonrObject> => {
	try {
		// TODO add test for this on smoke detector
		const response = await fetch(`${BASE_API}/api/v1/object/get`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ schemaDid, objectCid }),
		})
		if (!response.ok) throw new Error(response.statusText)
		const data = await response.json()
		return {
			cid: data.object.cid,
			schemaDid: data.object.schema,
			data: {
				...data.object,
				cid: undefined,
				schema: undefined,
			},
		}
	} catch (error) {
		throw error
	}
}

export default getObject
