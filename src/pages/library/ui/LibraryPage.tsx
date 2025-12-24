import {BookCard} from "@/entities/book";
import {Flex, For, Loader} from "@chakra-ui/react";
import InfiniteScroll from "react-infinite-scroll-component";
import {useCallback, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/app/hooks";
import {fetchBooksThunk, selectAll, selectBookStatus} from "@/entities/book/model/booksSlice";

export function LibraryPage() {
    const dispatch = useAppDispatch();
    const books = useAppSelector(state => selectAll(state.books));
    const total = useAppSelector(state => state.books.total);
    const status = useAppSelector(selectBookStatus);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchBooksThunk());
        }
    }, [dispatch, status]);

    const getNextPage = useCallback(async () => {
        const offset = books.length;
        // TODO: Uncomment after implementing pagination in redux
        // dispatch(fetchBooks({limit: '50', offset: offset.toString() }));
    }, [dispatch, books.length]);

    return (
        <InfiniteScroll
            next={getNextPage}
            hasMore={books.length < total}
            loader={<Loader/>}
            dataLength={books.length}
        >

        <Flex wrap={"wrap"} gap={8} justify={{base: 'center', md: 'start'}}>
            <For each={books}>
                {(book, _index) => (
                    <BookCard
                        book={book}
                    />
                )}
            </For>
        </Flex>
        </InfiniteScroll>
    );
}
