import {type Action, configureStore, type ThunkAction} from '@reduxjs/toolkit';

import booksReducer from '@/entities/book/model/booksSlice';
import {listenerMiddleware} from "@/app/listenerMiddleware";

export const store = configureStore({
    reducer: {
        books: booksReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware)
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;