import { combineReducers, configureStore } from "@reduxjs/toolkit"
import authenticationReducer, {
  initialState as authenticationInitialState,
} from "./slices/authenticationSlice"
import schemasReducer, {
  initialState as schemasInitialState,
} from "./slices/schemasSlice"
import objectsReducer, {
  initialState as objectsInitialState,
} from "./slices/objectsSlice"
import bucketReducer, {
  initialState as bucketInitialState,
} from "./slices/bucketSlice"
import {
  getAppStateFromLocalCache,
  syncAppStateToLocalCache,
} from "../utils/localStorage"
import { ROOT_INITIALIZE_FROM_CACHE, ROOT_RESET } from "../utils/constants"

const emptyState = {
  authentication: authenticationInitialState,
  schemas: schemasInitialState,
  objects: objectsInitialState,
  bucket: bucketInitialState,
}

const initialState = emptyState

const combinedReducer = combineReducers({
  authentication: authenticationReducer,
  schemas: schemasReducer,
  objects: objectsReducer,
  bucket: bucketReducer,
})

const rootReducer = (state: any, action: any) => {
  if (action.type === ROOT_RESET) {
    state = emptyState
  } else if (action.type === ROOT_INITIALIZE_FROM_CACHE) {
    state = getAppStateFromLocalCache()
  }
  return combinedReducer(state, action)
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  preloadedState: initialState,
})

store.subscribe(() => {
  syncAppStateToLocalCache(store.getState())
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
