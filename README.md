# 自己紹介カードメーカー

## 概要
X(Twitter)等のSNSでシェアできるオリジナルの自己紹介画像を作成するWebアプリケーションです。
URL: [https://self-intro-card.vercel.app/]

## 作成の背景・目的
ユーザーエンゲージメントを高めるツールとして、SNSでのバイラル（拡散）効果を狙った導線を設計・実装する経験を積むために個人開発しました。

## 使用技術
- **Frontend:** React (JavaScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **API/Library:** HTML5 Canvas API, lucide-react (Icons)
- **Deployment:** Vercel

## 工夫した点・UI/UXのこだわり
- ユーザーが自分好みにカスタマイズできるよう、文字サイズ・文字色の変更機能や、背景画像の位置（ズーム・移動）調整機能を実装しました。
- 作成した画像をワンクリックでダウンロードできるだけでなく、X（Twitter）の投稿画面をハッシュタグとサイトURL付きで動的に立ち上げる機能を組み込み、シームレスなシェア体験を実現しました。
- 画面遷移を伴わないSPA（シングルページアプリケーション）として構築し、Canvas APIを用いたリアルタイムな画像合成処理をクライアントサイドのみで完結させています。
