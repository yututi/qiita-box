const fetch = require('node-fetch')

const QIITA_BASE = 'https://qiita.com/api/v2'
module.exports = class Qiita {
  constructor (apiKey) {
    this.apiKey = apiKey
  }

  /**
   *
   * @param {number} maxResults
   * @returns {Promise<Response>} posts
   */
  fetchRecentPosts (maxResults) {
    return fetch(`${QIITA_BASE}/authenticated_user/items?${new URLSearchParams({
      page: 1,
      per_page: maxResults
    })}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` }
    })
  }
}
