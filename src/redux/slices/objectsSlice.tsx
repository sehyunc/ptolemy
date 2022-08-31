import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {
	createObject,
	getAllBucketContent,
	getBucketContent,
} from "../../service/objects"
import { arrayObjectDistinct } from "../../utils/object"
import { InewObject } from "../../utils/types"
import { RootState } from "../store"

export interface ObjectsState {
	list: Array<Record<string, any>>
	loading: boolean
	error: boolean
}

export const initialState: ObjectsState = {
	list: [],
	loading: false,
	error: false,
}

export const userCreateObject = createAsyncThunk(
	"objects/create",
	async ({ schemaDid, label, object }: InewObject, thunkAPI) => {
		try {
			const data = await createObject({ schemaDid, label, object })
			return data
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export const userGetAllBucketObjects = createAsyncThunk(
	"bucket/all/content",
	async ({ buckets }: { buckets: Array<string> }, thunkAPI) => {
		try {
			const data = await getAllBucketContent({ buckets })
			return data
		} catch (err) {
			return thunkAPI.rejectWithValue(err)
		}
	}
)

export const objectsSlice = createSlice({
	name: "objects",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(userCreateObject.pending, (state) => {
			state.loading = true
		})

		builder.addCase(userCreateObject.fulfilled, (state) => {
			state.loading = false
		})

		builder.addCase(userCreateObject.rejected, (state) => {
			state.error = true
			state.loading = false
		})

		builder.addCase(userGetAllBucketObjects.pending, (state) => {
			state.loading = true
		})

		builder.addCase(userGetAllBucketObjects.fulfilled, (state, action) => {
			const { payload } = action
			console.log("payload", payload)
			state.loading = false
			state.list = arrayObjectDistinct(payload, "cid")
		})

		builder.addCase(userGetAllBucketObjects.rejected, (state) => {
			state.error = true
			state.loading = false
		})
	},
})

export const selectObjectsLoading = (state: RootState) => {
	return state.objects.loading
}

export const selectObjectsError = (state: RootState) => {
	return state.objects.error
}

export const selectObjectsList = (state: RootState) => {
	return state.objects.list
}

export default objectsSlice.reducer
