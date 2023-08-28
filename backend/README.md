# サーバー監視業務効率化 バックエンド層

## 技術スタック
### 言語・フレームワーク・DB
- Nest.js v9.3.0
- TypeScript
- Postgres

### 依存ライブラリ
- bcrypt // 認証のでパスワードのエンクリプト・デクリプト用
  - @types/bcrypt // 型定義 
- @nestjs/jwt @nestjs/passport passport passport-jwt // jwt関連
  - @types/passport-jwt // 型定義 
- typeorm @nestjs/typeorm pg // # TypeORM/postgres

## 開発環境
DockerでPostgresqlデータベースを作成し、利用します。
```bash
docker-compose up -d
```
