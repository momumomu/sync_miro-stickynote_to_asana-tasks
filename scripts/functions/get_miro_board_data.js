function get_miro_board_data(params) {
  /*==================================================
  引数から必要情報を取得
  ==================================================*/
  const miro_api_token = params["miro_api_token"]; //miroのAPIトークン
  const miro_board_id = params["miro_board_id"]; //miroのボードID

  let miro_board_api_url = `http://api.miro.com/v2/boards/${miro_board_id}/sticky_notes?limit=50`; //初期値
  let miro_dict_list = []; //miroから取得したデータを扱いやすい形にするためその情報格納用のlistを生成

  //miroの取得最大値が50件までの付箋なので50件以上あった場合にそなえてループ処理
  while(miro_board_api_url !== undefined ){
    //miroからボード情報を取得
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${miro_api_token}`
    };
    const options = {
      "method": "get",
      "headers": headers,
    };
    const get_miro_data = UrlFetchApp.fetch(`${miro_board_api_url}`, options);
    //const response_code = response.getResponseCode();
    //取得したデータをjsonに変換
    const get_miro_data_json = JSON.parse(get_miro_data.getContentText());
    //エラー判定処理
    const response_code = get_miro_data.getResponseCode();
    if ( response_code !== 200 ){
      throw new Error(`"get_miro_board_data"の処理でエラーになっています。(${JSON.stringify(get_miro_data)})`);  
    }
    
    //事前に定義していたdictに値を格納
    for (let i=0; i<get_miro_data_json["data"].length; i++) {
      let item_data = get_miro_data_json["data"][i];  
      let id = item_data["id"];
      let content = item_data["data"]["content"];
      miro_dict_list.push({
        "id": id,
        "content": content,
        "url": `https://miro.com/app/board/${miro_board_id}/?moveToWidget=${id}`
      });
    }
    //次ページがあるかチェック
    miro_board_api_url = get_miro_data_json["links"]["next"];
  }
  return miro_dict_list;
}
