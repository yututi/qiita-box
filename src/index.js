const {
  GistBox,
  // MAX_LENGTH, // 63ははみ出る...
  MAX_LINES
} = require('gist-box')
const Qiita = require('./Qiita')

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

  const gistBox = new GistBox({
    id: GIST_ID,
    token: GH_TOKEN
  })
  const title = '最近のQiita投稿記事'
  gistBox.update({
    filename: title,
    description: title,
    content: content
  })
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
