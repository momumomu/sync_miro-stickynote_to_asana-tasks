/*Asanaの指定プロジェクトにカスタムフィールドを追加する
参考URL: https://forum.asana.com/t/updated-custom-fields/55153/6

指定するフォーマットは下記。
custom_fields_parameter_dictという引数で下記のように指定

"カスタムフィールド名": {
  "custom_fields_type": "text", <- カスタムフィールドの型を指定(特にこだわりがなければtextを指定)
}
*/

function create_asana_custom_fields(params) {
  /*==================================================
  引数から必要情報を得る
  ==================================================*/
  const asana_api_token = params["asana_api_token"];
  const asana_projects_url = params["asana_projects_url"]; //AsanaプロジェクトのURL
  const custom_fields_parameter_dict = params["custom_fields_parameter_dict"]; //作成したいカスタムフィールドの情報

  /*==================================================
  asana_projects_urlから該当プロジェクトのgidを得る
  ==================================================*/
  const asana_projects_gid = asana_projects_url.replace("https://app.asana.com/0/","")
                                               .replace(/\/.*/g, "");
  
  /*==================================================
  現状のカスタムフィールド一覧を取得する。
  ==================================================*/

  /*==================================================
  カスタムフィールド作成処理
  ==================================================*/
  let custom_fields_parameter_dict_keys = Object.keys(custom_fields_parameter_dict);
  for(let i=0; i<custom_fields_parameter_dict_keys.length; i++){
    const custom_fields_name = custom_fields_parameter_dict_keys[i];
    const custom_fields = custom_fields_parameter_dict[custom_fields_name];
    const custom_fields_type = custom_fields["custom_fields_type"];

    /*==================================================
    実際の作成処理
    ==================================================*/
    //新規に登録するカスタムフィールドを定義
    const data = {
      "custom_field": {
        "name": custom_fields_name,
        "resource_subtype": custom_fields_type
      }
    };
    //送信先URLを生成
    const endpoint_url = `https://app.asana.com/api/1.0/projects/${asana_projects_gid}/addCustomFieldSetting`;
    const headers = {
      'Authorization': `Bearer ${asana_api_token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    const payload_data = {
      "data": data
    };
    const options = {
      "method": "post",
      "headers": headers,
      "payload": JSON.stringify(payload_data),
    };
    //作成
    const response = UrlFetchApp.fetch(endpoint_url, options);
    const response_json = JSON.parse(response.getContentText());
    const response_code = response.getResponseCode();
    //エラー判定処理
    if ( response_code !== 200 ){
      throw new Error(`"create_asana_custom_fields"の処理でエラーになっています。(${JSON.stringify(response)})`);  
    }
    //作成結果(カスタムフィールドのGID)を返却
    return response_json["data"]["custom_field"]["gid"];
  }
}
