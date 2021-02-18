const { request } = require('@octokit/request')

module.exports = class GitHub {
  constructor (token) {
    this.token = token
  }

  /**
   * @typedef GistFile
   * @property {filename} filename
   * @property {string} content
   */

  /**
   *
   * @param {string} gistId
   * @param {GistFile} file
   * @param {string} comment
   */
  async updateGistWithComment (gistId, file, comment) {
    // update gist
    const old = await request('GET /gists/{gist_id}', {
      gist_id: gistId,
      headers: {
        authorization: `token ${this.token}`
      }
    })

    const firstFile = Object.keys(old.data.files).shift()

    await request('PATCH /gists/{gist_id}', {
      gist_id: gistId,
      files: {
        [firstFile]: file
      },
      headers: {
        authorization: `token ${this.token}`
      }
    })

    // craete or update gist comment
    const comments = await request('GET /gists/{gist_id}/comments', {
      gist_id: gistId,
      headers: {
        authorization: `token ${this.token}`
      }
    })
    if (comments.data.length > 0) {
      await request('PATCH /gists/{gist_id}/comments/{comment_id}', {
        gist_id: gistId,
        comment_id: comments.data.shift().id,
        body: comment,
        headers: {
          authorization: `token ${this.token}`
        }
      })
    } else {
      await request('POST /gists/{gist_id}/comments', {
        gist_id: gistId,
        body: comment,
        headers: {
          authorization: `token ${this.token}`
        }
      })
    }
  }
}
