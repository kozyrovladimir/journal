import { PostRow, PostType } from '@razrabs-ui/posts'
import { useIsMobile } from '@razrabs-ui/responsive'
import type { GetServerSideProps, NextPage } from 'next'
import Link from 'next/link'
import {
  FeedContainer,
  FeedSelector,
  GetFeeds,
  GetFeedsQuery,
} from 'features/feeds'
import { GetPostsByFeed, GetPostsByFeedQuery } from 'entities/posts'
import { client, FeedItem, Post } from 'shared/api'
import { Helmet } from 'shared/lib/helmet'
import { parseDate } from 'shared/lib/parse-date'

type Props = {
  postsByFeed: Pick<Post, 'uid' | 'title' | 'previewUrl' | 'createdAt'>[]
  currentFeedUid: string
  feeds: Pick<FeedItem, 'uid' | 'name'>[]
}

const FeedPage: NextPage<Props> = ({ postsByFeed, currentFeedUid, feeds }) => {
  const smallRow = useIsMobile()

  return (
    <>
      <Helmet />

      <FeedSelector activeFeedUid={currentFeedUid} feeds={feeds} />

      <FeedContainer small={smallRow}>
        {postsByFeed.map((post) => (
          <Link key={post.uid} passHref href={`/post/${post.uid}`}>
            <PostRow
              as='a'
              date={parseDate(post.createdAt as unknown as string) ?? ''}
              preview={post.previewUrl ?? ''}
              small={smallRow}
              title={post.title}
              type={PostType.Article}
            />
          </Link>
        ))}
      </FeedContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const currentFeedUid: string = query.uid?.toString() ?? ''

  const {
    data: {
      postsByFeed: { items: postsByFeed },
    },
  } = await client.query<GetPostsByFeed>({
    variables: { uid: currentFeedUid },
    query: GetPostsByFeedQuery,
    fetchPolicy: 'no-cache',
  })

  const {
    data: { feeds },
  } = await client.query<GetFeeds>({
    query: GetFeedsQuery,
    fetchPolicy: 'no-cache',
  })

  return {
    props: {
      postsByFeed,
      feeds: feeds.slice(0, 10),
      currentFeedUid,
    },
  }
}

export default FeedPage