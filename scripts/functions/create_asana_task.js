/*
Asanaのタスクを作成する

カスタムフィールドを指定する場合:
asana_custom_fields_dictという引数で下記のように指定
{
  "カスタムフィールドGID1": "カスタムフィールドに入れる値1",
  "カスタムフィールドGID2": "カスタムフィールドに入れる値2",
}

*/

function create_asana_task(params) {
  /*==================================================
  引数から必要情報を取得
  ==================================================*/
  const asana_api_token = params["asana_api_token"];
  const asana_projects_url = params["asana_projects_url"]; //miroの付箋内容
  const asana_custom_field_dict = params["asana_custom_field_dict"]; //カスタムフィールドのgid
  const miro_content = params["miro_content"]; //miroの付箋内容

  /*==================================================
  Asana送信情報の初期値を定義
  ==================================================*/
  let data = {};
  
  /*==================================================
  miroの付箋情報にはHTMLタグが含まれるので削除してからタスクの件名に利用
  ==================================================*/
  let asana_subject = miro_content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "");

  /*==================================================
  asana_projects_urlから該当プロジェクトのgidを得る
  ==================================================*/
  const asana_projects_gid = asana_projects_url.replace("https://app.asana.com/0/","")
                                               .replace(/\/.*/g, "");
  
  /*==================================================
  カスタムフィールドについての処理
  ==================================================*/
  if ( asana_custom_field_dict !== undefined ){
    data["custom_fields"] = asana_custom_field_dict;
  }

  /*==================================================
  タイトルを指定
  ==================================================*/
  data["name"] = asana_subject;

  /*==================================================
  プロジェクトGIDの指定
  ==================================================*/
  data["projects"] = [ asana_projects_gid ];

  /*==================================================
  タスク作成処理
  ==================================================*/
  const endpoint_url = "https://app.asana.com/api/1.0/tasks";
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
  const response = UrlFetchApp.fetch(endpoint_url, options);
  //エラー判定処理
  const response_code = response.getResponseCode();
  if ( response_code !== 201 ){
    throw new Error(`"create_asana_task"の処理でエラーになっています。(${JSON.stringify(response)})`);  
  }

  /*==================================================
  結果を返却(AsanaタスクのURLを返却)
  ==================================================*/
  const response_json = JSON.parse(response.getContentText());
  return response_json["data"]["permalink_url"];
}
