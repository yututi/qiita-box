#

<p align="center">
  <img width="400" src="https://user-images.githubusercontent.com/19887059/108340777-507dbb00-721c-11eb-8d98-97de5538067a.png">
  <h3 align="center">qiita-box</h3>
  <p align="center"><a href="https://qiita.com/">Qiita</a>に投稿した記事をもとに、定期的にGistまたはMarkdownを更新します。</p>
</p>

---  

## セットアップ
### 事前準備

1. 新しくpublic Gistを作成。(https://gist.github.com/)
1. `gist`スコープを許可したGithubトークンを作成。(https://github.com/settings/tokens/new)
1. `read_qiita`スコープを許可したQiita API Keyを作成。(https://qiita.com/settings/tokens/new)

### Gistを更新する場合

1. このリポジトリをフォークする。
2. `.github/workflows/schedule.yml`の環境変数を変更する。
    - GIST_ID: 事前準備で作成したGistのID。※Gistを表示した時のURLでわかります。例)`https://gist.github.com/yututi/{GistのID}`
3. リポジトリ>Settings>Secretsから、以下のRepository secretsを作成。
    - GH_TOKEN: 事前準備2で作成したトークン
    - QIITA_API_KEY: 事前準備3で作成したAPIKey

### Special RepositoryのREADME.mdを更新する場合
1. このリポジトリをフォークする。
1. [私のspecial repository](https://github.com/yututi/yututi)の`.github/workflows/qiita.yml`ファイルをコピーして自身のspecial repositoryに置く。
1. ymlの以下の項目を変更する。
    - GIST_ID: Gist更新しないなら消す。更新する場合はGistを更新する場合と同じです。
    - 25行目、cloneするリポジトリを1.でフォークしたリポジトリにしてください。
1. リポジトリ>Settings>Secretsから、以下のRepository secretsを作成。
    - GH_TOKEN: 事前準備2で作成したトークン※Gist更新しないなら不要です。
    - QIITA_API_KEY: 事前準備3で作成したAPIKey
1. 自信のspectial repositoryのREADME.mdで、記事一覧を表示したい場所に`<!-- qiita-box start --><!-- qiita-box end -->`のコメントを追記してください。

---

> This project is inspired by [awesome-pinned-gists](https://github.com/matchai/awesome-pinned-gists)
