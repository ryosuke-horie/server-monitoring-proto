# サーバー監視業務効率化サイト サンプル

## 概要
サーバーのバックアップ・Zabbixによるアラート有無・目視確認の３点を確認する業務を効率的に行うためのアプリケーションとなります。

毎朝業務開始時に３点の確認記録をExcelシート内のチェックシートに記載する必要があり、毎朝５分間ほど作業時間をとっていました。また、月に一度記録用のExcelシートを作成するために30分ほど使われるため、月当たり130分ほどの作業時間をとられる業務です。

監視記録データをデータベースを活用して管理し、効率的にデータを記録するためのUIを用意することで業務効率化を行います。
毎日1分で監視作業が済むようになり、Excelシートを作成する必要がなくなるため、約85%時間を削減することが可能です。

*社内で活用することを前提としたサイトのため、URLや画像の記載は控えさせていただきます。

## 使用技術
- TypeScript 4.9.5
- Next.js 13.4.12
- Vercel
- Nest.js 9.0.0
- PostgresQL
- Docker/Docker-compose
- AWS
  - VPC
  - Route53
  - EC2
- Github Actions
- Jest
- jwt

## アプリケーション構成図
[インフラ構成図.png](https://github.com/ryosuke-horie/server-monitoring-proto/blob/main/%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E6%A7%8B%E6%88%90%E5%9B%B3.png)

## 機能一覧
- ユーザーログイン機能・ユーザー登録機能(jwt passport passport-jwt bcrypt)
- サーバー監視記録機能
    - 更新
    - 作成
- サーバー監視記録 レポート一覧機能
- サーバー監視記録 月別レポート詳細画面表示機能

## テスト
- 単体テスト（Jest）
