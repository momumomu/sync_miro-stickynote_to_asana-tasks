/*==================================================
asanaの指定されたプロジェクトに登録されているカスタムフィールド名のリストをdict形式で返却する。

参考URL：
https://forum.asana.com/t/api-getting-multiple-custom-fields/26367

こんな形のデータが返ってくるのでcustom_fieldsのnameを取得してリストで返す
{
  data: [
    {
      gid: '1111111111111111', <- タスクのgid
      custom_fields: [
        {
          gid: '2222222222222222', <- カスタムフィールドのgid
          enabled: true,
          name: 'TEST',
          created_by: {
            gid: '3333333333333333',
            name: 'TEST-USER',
            resource_type: 'user'
          },
          display_value: null,
          resource_subtype: 'text',
          resource_type: 'custom_field',
          text_value: null,
          type: 'text'
        },
      ]
    }
  ]
}
==================================================*/

function get_asana_custom_fields(params) {
  /*==================================================
  引数から必要情報を得る
  ==================================================*/
  const asana_api_token = params["asana_api_token"];
  const asana_projects_url = params["asana_projects_url"]; //取得対象のAsanaプロジェクトのURL
  
  /*==================================================
  asana_projects_urlから該当プロジェクトのgidを得る
  ==================================================*/
  let asana_projects_gid = asana_projects_url.replace("https://app.asana.com/0/","")
                                             .replace(/\/.*/g, "");
  
  /*==================================================
  Asanaから情報取得
  ==================================================*/
  //endpointURLを生成
  const endpoint_url = `https://app.asana.com/api/1.0/projects/${asana_projects_gid}/tasks?opt_fields=custom_fields`;  
  //headerを定義
  const headers = {
    'Authorization': 'Bearer ' + asana_api_token,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
  const options = {
    "method": "get",
    "headers": headers,
  };
  //取得
  const get_asana_data = UrlFetchApp.fetch(endpoint_url, options);
  //エラー判定処理
  const response_code = get_asana_data.getResponseCode();
  if ( response_code !== 200 ){
    throw new Error(`"get_asana_custom_fields"の処理でエラーになっています。(${JSON.stringify(get_asana_data)})`);  
  }
  //取得したデータをjsonに変換
  const get_asana_data_json = JSON.parse(get_asana_data.getContentText());

  /*==================================================
  取得した情報を整形
  {
    "カスタムフィールド名": "カスタムフィールドgid",
  }
  という形式で作成
  ==================================================*/
  let return_dict = []; //カスタムフィールド情報を格納するdictの初期値
  for(let i=0; i<get_asana_data_json["data"].length; i++){
    let data = get_asana_data_json["data"][i];
    for(let j=0; j<data["custom_fields"].length; j++){
      let custom_fields = data["custom_fields"][j];
      let custom_fields_name = custom_fields["name"];
      let custom_fields_gid = custom_fields["gid"];
      if ( return_dict[custom_fields_name] === undefined ){
        return_dict[custom_fields_name] = custom_fields_gid;
      }
    }
  }  
  //値を返却
  return return_dict;
}