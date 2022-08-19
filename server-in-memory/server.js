import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import _ from "lodash"
import md5 from "md5"
import storage from "node-persist"

const generateAddress = () => `snr${md5(Math.random())}`
const generateDid = () => `did:snr:${md5(Math.random())}`
const generateCid = () => md5(Math.random())
const addressToDid = (address) => `did:snr:${address.slice(3)}`

const mountAccountStoreKey = (did) => `account${did}`
const mountSchemasStoreKey = (did) => `schemas${did}`

const app = express()
app.use(cors())
app.use(bodyParser.json())

let sessionDid = null

/// DEVELOPMENT

app.get("/dump", async (_, res) => {
	const data = await storage.values()
	res.json({ data })
})

app.get("/reset", async (_, res) => {
	await storage.clear()
	const length = await storage.length()
	res.json({ length })
})

app.get("/logout", (_, res) => {
	sessionDid = null
	res.status(200).send()
})

/// AUTHENTICATION

app.post("/api/v1/account/create", async ({ body }, res) => {
	const did = generateAddress()
	const password = body.password || ""

	const accountStoreKey = mountAccountStoreKey(did)
	await storage.setItem(accountStoreKey, {
		did,
		password,
	})

	const schemasStoreKey = mountSchemasStoreKey(did)
	await storage.setItem(schemasStoreKey, {
		schemas: [],
		schemasMetaData: {
			whatIs: [],
		},
	})

	res.json({ Address: did })
})

app.post("/api/v1/account/login", async ({ body }, res) => {
	const accountStoreKey = mountAccountStoreKey(body.Address)
	const account = await storage.getItem(accountStoreKey)

	if (!account || account.password !== body.Password) {
		res.status(500).send()
		return
	}

	sessionDid = account.did
	res.json({ Address: account.did })
})

app.get("/api/v1/account/info", async (_, res) => {
	if (!sessionDid) {
		res.status(500).send()
		return
	}

	res.json({ Address: sessionDid })
})

app.use((_, res, next) => {
	if (!sessionDid) {
		res.status(500).json({ message: "Not logged in" })
		return
	}
	next()
})

/// SCHEMAS

app.post("/api/v1/schema/create", async ({ body }, res) => {
	if (body.address !== sessionDid) {
		res.status(200).send()
		return
	}
	const schemasStoreKey = mountSchemasStoreKey(sessionDid)
	const session = await storage.getItem(schemasStoreKey)

	const did = generateDid()
	const creator = addressToDid(body.address)
	const fieldNames = _.keys(body.fields)

	const schemaMetaData = {
		did,
		schema: {
			did,
			label: body.label,
			cid: generateCid(),
		},
		creator: creator,
		timestamp: +new Date(),
		is_active: true,
	}

	const schema = {
		creator: creator,
		label: body.label,
		fields: _.map(fieldNames, (name) => ({ name, field: body.fields[name] })),
	}

	session.schemasMetaData.whatIs.push(schemaMetaData)
	session.schemas.push(schema)

	await storage.setItem(schemasStoreKey, session)

	res.json({
		definition: schema,
		whatIs: { did, creator },
	})
})

app.post("/api/v1/schema/get", async ({ body }, res) => {
	if (body.address !== sessionDid) {
		res.status(200).send()
		return
	}

	const schemasStoreKey = mountSchemasStoreKey(sessionDid)
	const session = await storage.getItem(schemasStoreKey)

	const schema = session.schemas.find((item) => item.creator === body.creator)
	if (!schema || body.creator !== schema.creator) {
		res.status(500).send()
		return
	}

	res.json(schema)
})

app.get("/api/v1/schema/getAll", async (_, res) => {
	const schemasStoreKey = mountSchemasStoreKey(sessionDid)
	const session = await storage.getItem(schemasStoreKey)

	res.json(session.schemasMetaData)
})

export default app
