import {createEntityAdapter, createSlice, type EntityState} from "@reduxjs/toolkit";
import {type BookModel, fetchBooks} from "@/entities/book";
import {type RootState} from '@/app/store';
import {axiosInstance} from "@/shared";
import type {AppStartListening} from "@/app/listenerMiddleware";
import {createAppAsyncThunk} from "@/app/withTypes";

interface BooksState extends EntityState<BookModel, string> {
    total: number;
    status: 'idle' | 'pending' | 'succeeded' | 'failed';
    error: string | null;
}

const booksAdapter = createEntityAdapter<BookModel>({});

const initialState: BooksState = booksAdapter.getInitialState({
    total: 0,
    status: 'idle',
    error: null
});

// TODO: Implement pagination
export const fetchBooksThunk = createAppAsyncThunk(
    'books/fetchBooks',
    async () => {
        return await fetchBooks({limit: '50', offset: '0'});
    },
    {
        condition(arg, thunkApi){
            const booksStatus = selectBookStatus(thunkApi.getState());
            if (booksStatus !== 'idle') {
                return false;
            }
        }
    }
)

const addNewBook = createAppAsyncThunk(
    'books/addNewBook',
    async (initialBook: BookModel) => {
        const response = await axiosInstance.post<BookModel>('/books', initialBook);
        return response.data;
    },
);

export const bookSlice = createSlice({
    name: 'books',
    initialState: initialState,
    reducers: create => {
        return {
            bookUpdated: create.reducer<BookModel>((state, action) => {
                const {id, ...rest} = action.payload;
                booksAdapter.updateOne(state, {id, changes: rest});
            }),
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchBooksThunk.pending, (state, _) => {
                state.status = 'pending'
            })
            .addCase(fetchBooksThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.total = action.payload.total;
                booksAdapter.setAll(state, action.payload.data);
            })
            .addCase(fetchBooksThunk.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Unknown Error'
            })
            .addCase(addNewBook.fulfilled, booksAdapter.addOne);
        // TODO: Add logout case to clear state
    },
});

export const selectBookStatus = (state: RootState) => state.books.status;

export const addBooksListeners = (startAppListening: AppStartListening) => {
    startAppListening({
        actionCreator: addNewBook.fulfilled,
        effect: async (action, listenerApi) => {
            // TODO: Display toast
        }
    })
}

export const {
    selectAll,
    selectById,
    selectEntities,
    selectTotal,
    selectIds,
} = booksAdapter.getSelectors();
export default bookSlice.reducer;
