function update_miro_sticky_notes(params) {
  /*==================================================
  引数から必要情報を取得
  ==================================================*/
  const miro_api_token = params["miro_api_token"];
  const miro_content = params["miro_content"]; //miroの付箋内容
  const asana_url = params["asana_url"];
  const miro_board_id = params["miro_board_id"];
  const miro_id = params["miro_id"];
  
  /*==================================================
  miroの付箋の記載内容を取得＆asanaリンクを付けた形で書き換え
  (memo: miroは一行毎をpタグで表現しているよう。全行にリンクを書いてもいいが文字数が多くなっちゃうので最初に●をつけてそこにリンクを乗せる形にする)
  ==================================================*/
  let first_line_org_content = miro_content.match(/<p>.*?<\/p>/)[0]; //1行目の値を取得
  let first_line_new_content = first_line_org_content.replace(/<\/p>/,"</a></p>"); //miro用に1行目の末尾のpタグにaタグを追加
  first_line_new_content = first_line_new_content.replace(/<p>/, `<p><a href="${asana_url}">●</a>`); //miro用に1行目の箇所にasanaURL入のaタグを追加
  let update_miro_content = miro_content.replace(first_line_org_content, first_line_new_content); //miro付箋を更新する内容を生成
  
  /*==================================================
  miroの付箋を書き換え
  ==================================================*/
  const endpoint_url = `https://api.miro.com/v2/boards/${miro_board_id}/sticky_notes/${miro_id}`;
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${miro_api_token}`,
    'Content-Type': 'application/json'
  };
  const payload_data = {
    "data": {
      "content": update_miro_content,
      "shape": "square"
    }
  };
  const options = {
    "method": "patch",
    "headers": headers,
    "payload": JSON.stringify(payload_data),
  };
  const response = UrlFetchApp.fetch(endpoint_url, options);
  //エラー判定処理
  const response_code = response.getResponseCode();
  if ( response_code !== 200 ){
    throw new Error(`"update_miro_sticky_notes"の処理でエラーになっています。(${JSON.stringify(response)})`);  
  }
}