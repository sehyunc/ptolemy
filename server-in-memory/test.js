import storage from "node-persist"
import server from "./server.js"
import supertest from "supertest"
const app = supertest(server)

expect.extend({
	toBeAddress: (str) => ({ pass: str.slice(0, 3) === "snr" }),
	toBeDid: (str) => ({ pass: str.slice(0, 8) === "did:snr:" }),
})
const addressToDid = (address) => `did:snr:${address.slice(3)}`

beforeAll(async () => {
	await storage.init({ dir: ".node-persist-test" })
})

beforeEach(async () => {
	await Promise.all([app.get("/logout"), storage.clear()])
})

it("creates an account", async () => {
	const { body } = await app.post("/api/v1/account/create")
	expect(body).toHaveProperty("Address")
	expect(body.Address).toBeAddress()
})

it("logs an account in", async () => {
	const response = await app.post("/api/v1/account/create").send({
		password: "123",
	})

	const { body: result } = await app.post("/api/v1/account/login").send({
		Address: response.body.Address,
		Password: "123",
	})
	expect(result).toHaveProperty("Address")
	expect(result.Address).toBeAddress()
})

it("checks for logged in account", async () => {
	const result1 = await app.get("/api/v1/account/info")
	expect(result1.status).toBe(500)

	const response = await app.post("/api/v1/account/create").send({
		password: "123",
	})
	await app.post("/api/v1/account/login").send({
		Address: response.body.Address,
		Password: "123",
	})

	const { body: result2 } = await app.get("/api/v1/account/info")
	expect(result2).toHaveProperty("Address")
	expect(result2.Address).toBe(response.body.Address)
})

it("creates a schema", async () => {
	const response = await app.post("/api/v1/account/create").send({
		password: "123",
	})
	const address = response.body.Address

	await app.post("/api/v1/account/login").send({
		Address: address,
		Password: "123",
	})

	const { body: result } = await app.post("/api/v1/schema/create").send({
		address,
		label: "Dinosaurs",
		fields: { name: 4 },
	})

	expect(result).toHaveProperty("whatIs")
	expect(result.whatIs).toHaveProperty("did")
	expect(result.whatIs.did).toBeDid()
	expect(result.whatIs).toHaveProperty("creator")
	expect(result.whatIs.creator).toBeDid()
	expect(result.whatIs.creator).toBe(addressToDid(address))

	expect(result).toHaveProperty("definition")
	expect(result.definition).toHaveProperty("creator")
	expect(result.definition.creator).toBe(addressToDid(address))
	expect(result.definition).toHaveProperty("label")
	expect(result.definition.label).toBe("Dinosaurs")
	expect(result.definition).toHaveProperty("fields")
	expect(result.definition.fields.length).toBe(1)
	expect(result.definition.fields[0]).toEqual({
		name: "name",
		field: 4,
	})
})

it("gets an individual schema", async () => {
	const response1 = await app.post("/api/v1/account/create").send({
		password: "123",
	})
	const address = response1.body.Address

	await app.post("/api/v1/account/login").send({
		Address: address,
		Password: "123",
	})

	const response2 = await app.post("/api/v1/schema/create").send({
		address,
		label: "Dinosaurs",
		fields: { name: 4 },
	})

	const { body: result } = await app.post("/api/v1/schema/get").send({
		address,
		creator: addressToDid(address),
		schema: response2.body.whatIs.did,
	})

	expect(result).toHaveProperty("creator")
	expect(result.creator).toBe(addressToDid(address))
	expect(result).toHaveProperty("label")
	expect(result.label).toBe("Dinosaurs")
	expect(result).toHaveProperty("fields")
	expect(result.fields.length).toBe(1)
	expect(result.fields[0]).toEqual({
		name: "name",
		field: 4,
	})
})

it("fetches a list of schemas", async () => {
	const { body: result1 } = await app.get("/proxy/schemas")
	expect(result1).toHaveProperty("pagination")
	expect(result1).toHaveProperty("what_is")
	expect(result1.what_is.length).toBe(0)

	const response1 = await app.post("/api/v1/account/create").send({
		password: "123",
	})
	const address = response1.body.Address
	await app.post("/api/v1/account/login").send({
		Address: address,
		Password: "123",
	})

	const { body: createBody } = await app.post("/api/v1/schema/create").send({
		address,
		label: "Dinosaurs",
		fields: { name: 4 },
	})
	const { body: result2 } = await app.get("/proxy/schemas")
	expect(result2.what_is.length).toBe(1)
	expect(result2.what_is[0].creator).toBe(addressToDid(address))
	expect(result2.what_is[0].did).toBe(createBody.whatIs.did)
	expect(result2.what_is[0].schema.did).toBe(createBody.whatIs.did)
	expect(result2.what_is[0].schema.label).toBe("Dinosaurs")
	expect(result2.what_is[0].schema.cid).toBe(createBody.whatIs.schema.cid)
})
