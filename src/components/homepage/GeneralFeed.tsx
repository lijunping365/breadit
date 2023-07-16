import { db } from '@/lib/db'
import PostFeed from '../PostFeed'
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'

const GeneralFeed = async () => {
  const posts = [];

  return <PostFeed initialPosts={posts} />
}

export default GeneralFeed
