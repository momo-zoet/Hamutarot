# 🐹 Tarotarot - 鼠鼠占卜

倉鼠塔羅小工具，純靜態網站（HTML / CSS / JS），不需要建置，可直接放 GitHub Pages。

## 功能

- **今日運勢**：每天一張牌，同一天重開還是同一張，隔天才換。附幸運指數與幸運零食。
- **一張牌占卜**：愛情、事業、學業、財運、身心、人際，抽一張牌看針對性解讀。
- **時間之流**：輸入問題（可留空），抽過去・現在・未來三張牌，依問題關鍵字判斷主題（愛情、事業等）並組出解讀，不需要 AI 或後端。
- **牌庫**：78 張牌可依大阿爾克那與四種花色瀏覽，點開看正逆位說明。

## 放牌面圖片

把圖片放進 `images/` 資料夾，**檔名 = 英文牌名 + `.png`**，例如：

```
images/The Fool.png
images/The High Priestess.png
images/Wheel of Fortune.png
images/Ace of Wands.png
images/Page of Pentacles.png
images/King of Cups.png
```

- 大阿爾克那 22 張：`The Fool`、`The Magician`、`The High Priestess`、`The Empress`、`The Emperor`、`The Hierophant`、`The Lovers`、`The Chariot`、`Strength`、`The Hermit`、`Wheel of Fortune`、`Justice`、`The Hanged Man`、`Death`、`Temperance`、`The Devil`、`The Tower`、`The Star`、`The Moon`、`The Sun`、`Judgement`、`The World`
- 小阿爾克那 56 張：`Ace / Two ... Ten / Page / Knight / Queen / King` + ` of ` + `Wands / Cups / Swords / Pentacles`（例：`Three of Cups.png`、`Knight of Swords.png`）
- 牌背（選填）：`images/back.png`，沒放就用內建的橘色花紋。
- 沒有圖片的牌會自動顯示佔位卡面，網站照常運作。
- GitHub Pages 的檔名**區分大小寫**，請完全照上面的拼法（每個單字開頭大寫，`of` 小寫）。
- 圖片建議比例約 7:12，寬約 600～800 像素就夠，單張最好壓到 300KB 以下（可用 TinyPNG 壓縮）。圖片越小，翻牌越快。

## 部署到 GitHub Pages

1. 把整個資料夾推到一個 GitHub repo。
2. Repo 的 Settings → Pages → Source 選 `main` 分支、根目錄 `/`。
3. 幾分鐘後即可在 `https://你的帳號.github.io/repo名稱/` 開啟。

## 修改文案

- 牌的關鍵字與說明在 `cards.js`（每行一張牌）。
- 各主題的解讀範本在 `app.js` 的 `TOPICS`，`{0}{1}{2}` 會替換成該牌的關鍵字。
- 逆位機率在 `app.js` 的 `REVERSED_CHANCE`（預設 1/2，想全正位就改成 0）。

> 僅供娛樂與自我反思，不能取代專業建議。
