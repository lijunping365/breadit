'use client'

import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { ExtendedPost } from '@/types/db'
import { useIntersection } from '@mantine/hooks'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { FC, useEffect, useRef } from 'react'
import Post from "./Post";

interface PostFeedProps {
  initialPosts: ExtendedPost[]
  subredditName?: string
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
  const lastPostRef = useRef<HTMLElement>(null)
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  })
  const { data: session } = {}

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['infinite-query'],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : '')

      const { data } = await axios.get(query)
      return data as ExtendedPost[]
    },

    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  )

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage() // Load more posts when the last post comes into view
    }
  }, [entry, fetchNextPage])

  // const posts = data?.pages.flatMap((page) => page) ?? initialPosts
  const posts = [{
    id: '1',
    title: 'Title 1',
    content: 'this is a content',
    createdAt: '2023-07-16',
    updatedAt: '2023-07-16',
    author: {
      id:'1',
      name: '张三',
      email: '123123',
      username: '234234233',
      image: ''
    },
    authorId: '1',
    subreddit: {
      id: '1',
      name: 'subreddit',
      createdAt: '2023-07-16',
      updatedAt: '2023-07-16',
      posts: [],
      creatorId: "string",
    },
    subredditId: '1',
    comments: [],
    votes: [],
  },
    {
      id: '2',
      title: 'Title 2',
      content: 'this is a content',
      createdAt: '2023-07-16',
      updatedAt: '2023-07-16',
      author: {
        id:'1',
        name: '张三',
        email: '123123',
        username: '234234233',
        image: ''
      },
      authorId: '2',
      subreddit: {
        id: '2',
        name: 'subreddit',
        createdAt: '2023-07-16',
        updatedAt: '2023-07-16',
        posts: [],
        creatorId: "string",
      },
      subredditId: '2',
      comments: [],
      votes: [],
    },
    {
      id: '3',
      title: 'Title 3',
      content: 'this is a content',
      createdAt: '2023-07-16',
      updatedAt: '2023-07-16',
      author: {
        id:'3',
        name: '张三',
        email: '123123',
        username: '234234233',
        image: ''
      },
      authorId: '3',
      subreddit: {
        id: '3',
        name: 'subreddit',
        createdAt: '2023-07-16',
        updatedAt: '2023-07-16',
        posts: [],
        creatorId: "string",
      },
      subredditId: '3',
      comments: [],
      votes: [],
    },
    {
      id: '4',
      title: 'Title 4',
      content: 'this is a content',
      createdAt: '2023-07-16',
      updatedAt: '2023-07-16',
      author: {
        id:'4',
        name: '张三',
        email: '123123',
        username: '234234233',
        image: ''
      },
      authorId: '4',
      subreddit: {
        id: '4',
        name: 'subreddit',
        createdAt: '2023-07-16',
        updatedAt: '2023-07-16',
        posts: [],
        creatorId: "string",
      },
      subredditId: '4',
      comments: [],
      votes: [],
    }]
  console.log('ssssssssssss', posts)
  return (
    <ul className='flex flex-col col-span-2 space-y-6'>
      {posts && posts.map((post, index) => {
        if (!post) return null;
        const votesAmt = post?.votes?.reduce((acc, vote) => {
          if (vote.type === 'UP') return acc + 1
          if (vote.type === 'DOWN') return acc - 1
          return acc
        }, 0)

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        )

        if (index === posts.length - 1) {
          // Add a ref to the last post in the list
          return (
            <li key={post.id} ref={ref}>
              <Post
                post={post}
                commentAmt={post.comments.length}
                subredditName={post.subreddit.name}
                votesAmt={votesAmt}
                currentVote={currentVote}
              />
            </li>
          )
        } else {
          return (
            <Post
              key={post.id}
              post={post}
              commentAmt={post.comments.length}
              subredditName={post.subreddit.name}
              votesAmt={votesAmt}
              currentVote={currentVote}
            />
          )
        }
      })}

      {isFetchingNextPage && (
        <li className='flex justify-center'>
          <Loader2 className='w-6 h-6 text-zinc-500 animate-spin' />
        </li>
      )}
    </ul>
  )
}

export default PostFeed
