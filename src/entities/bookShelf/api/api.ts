import {homebranchApi} from "@/shared/api/rtk-query";
import type {BookShelfModel} from "@/entities/bookShelf";
import type {BookModel} from "@/entities/book";
import type {PaginationResult} from "@/shared/api/api_response";

export const bookShelvesApi = homebranchApi.injectEndpoints({
    endpoints: (build) => ({
        getBookShelves: build.query<BookShelfModel[], void>({
            query: () => ({url: `/book-shelves`}),
            transformResponse: (response: PaginationResult<BookShelfModel[]>) => response.data,
            providesTags: (result) =>
                result
                    ? [...result.map(({id}) => ({type: 'BookShelf' as const, id})), {type: 'BookShelf', id: 'LIST'}]
                    : [{type: 'BookShelf', id: 'LIST'}]
        }),
        getBookShelfBooks: build.query<PaginationResult<BookModel[]>, {bookShelfId: string; page: number}>({
            query: ({bookShelfId, page}) => ({url: `/book-shelves/${bookShelfId}/books?limit=${50}&offset=${page * 50}`}),
            providesTags: (_result, _error, {bookShelfId}) => [{type: 'BookShelf', id: bookShelfId}]
        }),
        createBookShelf: build.mutation<BookShelfModel, {title: string}>({
            query: (body) => ({url: `/book-shelves`, method: 'POST', body}),
            invalidatesTags: [{type: 'BookShelf', id: 'LIST'}]
        }),
    }),
});

export const {
    useGetBookShelvesQuery,
    useGetBookShelfBooksQuery,
    useCreateBookShelfMutation,
} = bookShelvesApi;
