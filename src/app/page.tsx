'use client'
import { useInfiniteQuery } from "@tanstack/react-query"
import {useLayoutEffect, useRef} from "react";
import {useIntersection} from "@mantine/hooks";

const posts = [
  {id: 1, title: 'post 1'},
  {id: 2, title: 'post 2'},
  {id: 3, title: 'post 3'},
  {id: 4, title: 'post 4'},
  {id: 5, title: 'post 5'},
  {id: 6, title: 'post 6'},
  {id: 7, title: 'post 7'},
  {id: 8, title: 'post 8'},
  {id: 9, title: 'post 9'},
]
const fetchPost = async (page: number) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return posts.slice((page - 1) * 2, page * 2);
}
export default function Home() {
  const {data, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(
      ['posts'],
      async ({ pageParam = 1}) => {
        const response = await fetchPost(pageParam);
        return response
      },
      {
        getNextPageParam: (_, pages) => {
          return pages.length + 1
        },
        initialData: {
          pages: [posts.slice(0, 2)],
          pageParams: [1]
        }
      }
  )
    const lastPostRef = useRef<HTMLElement>(null)
    const {ref, entry} = useIntersection({
        root: lastPostRef.current,
        threshold: 1,
    })
    useLayoutEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage()
        }
    }, [entry])
    const _posts = data?.pages.flatMap((page) => page)
  return (
      <div>
        posts:
          {_posts?.map((post, i) => {
              if (i === _posts?.length - 1) return <div className={'h-[50vh] bg-amber-200 text-black'} key={post.id} ref={ref}>{post.title}</div>
              return <div className={'h-[50vh] bg-amber-200 text-black'} key={post.id}>{post.title}</div>
          })}
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading more ...' : (data?.pages.length ?? 0) < 3 ? 'Load More' : 'Nothing More to Load'}
        </button>
      </div>
  )
}
