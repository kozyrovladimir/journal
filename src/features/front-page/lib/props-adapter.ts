import { PostCardProps, PostType } from '@razrabs-ui/posts'
import { PostOnFrontPage } from 'shared/api'
import { parseDate } from 'shared/lib/parse-date'

export function propsAdapter(
  props: Partial<PostOnFrontPage['post']>,
): PostCardProps {
  return {
    type: PostType.Article,
    title: props.title || 'Инопланетяне похитили этот пост',
    preview: props.previewUrl || undefined,
    date: parseDate(props.createdAt) || '',
  }
}
