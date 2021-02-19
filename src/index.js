const GitHub = require('./GitHub')
const Qiita = require('./Qiita')
const fs = require('fs')

// max visible lines of the pinned gists.
const MAX_LINES = 5

const {
  GIST_ID,
  GH_TOKEN,
  QIITA_API_KEY,
  MARKDOWN_FILE
} = process.env

const main = async () => {
  const qiita = new Qiita(QIITA_API_KEY)
  const response = await qiita.fetchRecentPosts(MAX_LINES)
  if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`)

  const posts = await response.json()
  if (posts.length === 0) {
    return console.log('Qiitaの記事がありません')
  }

  const title = '📰 最近のQiita投稿記事 📰'
  if (GIST_ID) {
    const content = posts.map(toGistContent).join('\r\n')

    const gistBox = new GitHub(GH_TOKEN)

    const userid = posts[0].user.id

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
  if (MARKDOWN_FILE) {
    const content = posts.map(toMarkdownContent).join('  \r\n')
    updateMarkdown(`### ${title}`, content)
  }
}

const toGistContent = (post) => {
  const {
    title,
    updated_at: updatedAtStr
    // url
  } = post
  const date = new Date(updatedAtStr)
  const dateLabel = `📅 ${date.getMonth() + 1}/${date.getDate()}:`.padEnd(9)
  return `${dateLabel}${title}`
}

const toMarkdownContent = (post) => {
  const {
    title,
    updated_at: updatedAtStr,
    url
  } = post
  const date = new Date(updatedAtStr)
  const dateLabel = `📅 ${date.getMonth() + 1}/${date.getDate()}:`.padEnd(9)
  return `${dateLabel}[${title}](${url})`
}

const updateMarkdown = (title, contents) => {
  const markdown = fs.readFileSync(MARKDOWN_FILE, {
    encoding: 'utf-8'
  })

  const start = '<!-- qiita-box start -->'
  const end = '<!-- qiita-box end -->'
  const before = markdown.substring(0, markdown.indexOf(start) + start.length)
  const after = markdown.substring(markdown.indexOf(end))
  const newMarkdown = `
  ${before}  \n${title}  \n${contents}  \n${after}`

  fs.writeFileSync(MARKDOWN_FILE, newMarkdown, {
    encoding: 'utf-8'
  })
}

main()
