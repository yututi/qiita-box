const GitHub = require('./GitHub')
const Qiita = require('./Qiita')

// max visible lines of the pinned gists.
const MAX_LINES = 5

const {
  GIST_ID,
  GH_TOKEN,
  QIITA_API_KEY
} = process.env

const main = async () => {
  const qiita = new Qiita(QIITA_API_KEY)
  const response = await qiita.fetchRecentPosts(MAX_LINES)
  if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`)

  const posts = await response.json()

  const content = posts.map(toGistContent).join('\r\n')

  const gistBox = new GitHub(GH_TOKEN)
  const title = '最近のQiita投稿記事'

  const userid = posts.pop().user.id

  gistBox.updateGistWithComment(
    GIST_ID,
    {
      filename: title,
      description: title,
      content
    },
    `https://qiita.com/${userid}`
  )
}

const toGistContent = (post) => {
  const {
    title,
    updated_at: updatedAtStr
    // url
  } = post
  const date = new Date(updatedAtStr)
  const dateLabel = `📅${date.getMonth() + 1}/${date.getDate()}:`.padEnd(8)
  return `${dateLabel}${title}`
}

main()
