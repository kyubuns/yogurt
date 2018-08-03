// 設定

enableTrim = true // トリミングするかどうか
outputInvisibleLayer = false // 非表示のレイヤーも書き出し
format = SaveDocumentType.PHOTOSHOP // 保存形式
fileName = "{layer_name}.psd" // 保存名
// fileNameの内容は以下のように置換されます
// - {layer_name} - レイヤー名
// - {index} - 01, 02, 03, ...という名前で出力されるようになる
// - {rindex} - indexの逆順(上のレイヤーから03, 02, 01, ...)
// - {file_name} - ファイル名

backgroundLayerNames = [] // 背景(必ず映し込む)用レイヤー名
folder = "" // 保存先(空白にしておくと保存先を指定するダイアログが表示される)


