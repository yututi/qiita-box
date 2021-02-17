const {
  GistBox,
  // MAX_LENGTH, // 63ははみ出る...
  MAX_LINES
} = require('gist-box')
const Qiita = require('./Qiita')
const MAX_LENGTH = 54

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
  const dateLabel = `📅 ${date.getMonth() + 1}/${date.getDate()}`.padStart(7)
  const titleByteLen = byteLen(title)
  let contentLenth = titleByteLen + dateLabel.length
  let title4Update = title
  if (contentLenth > MAX_LENGTH) {
    title4Update = truncate(title, MAX_LENGTH - dateLabel.length, '...')
  }
  contentLenth = byteLen(title4Update) + dateLabel.length
  const remain = MAX_LENGTH - contentLenth

  return `${title4Update}${dateLabel.padStart(remain + dateLabel.length)}`
}

function truncate (text, max, trailer) {
  let byteLen = 0
  for (let i = 0; i < text.length; i++) {
    byteLen += text.charCodeAt(i) <= 255 ? 1 : 2
    if (byteLen > max - trailer.length) {
      return text.substr(0, i) + trailer
    }
  }
  return text
}

function byteLen (text) {
  let byteLen = 0
  for (let i = 0; i < text.length; i++) {
    byteLen += text.charCodeAt(i) <= 255 ? 1 : 2
  }
  return byteLen
}

main()
