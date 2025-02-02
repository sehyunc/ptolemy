import { BASE_API } from "../utils/constants"
import { formatApiError } from "../utils/errors"
import { SchemaMeta } from "../utils/types"

type SchemaFieldsPayload = Record<string, number>

const createSchema = async (
  label: string,
  fields: SchemaFieldsPayload
): Promise<SchemaMeta> => {
  const url = `${BASE_API}/api/v1/schema/create`
  const options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ label, fields }),
  }

  try {
    const response: Response = await fetch(url, options)
    if (!response.ok) throw new Error(response.statusText)
    const data = await response.json()
    return {
      did: data.what_is.schema.did,
      label: data.what_is.schema.label,
      fields: Object.keys(fields).map((fieldName: string) => ({
        name: fieldName,
        type: fields[fieldName],
      })),
    }
  } catch (error) {
    const errorMessage = formatApiError({ error, url, options })
    throw new Error(errorMessage)
  }
}

export default createSchema
