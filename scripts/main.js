function main() {
  /*==================================================
  事前処理
  引数から必要な情報を取得
  ==================================================*/
  const miro_board_url = "https://miro.com/app/board/uXjVOsf53CY=/"; //対象のmiroのボードURL
  const asana_projects_url = "https://app.asana.com/0/1202468375607037/list"; //対象のasanaプロジェクトのURL
  const miro_board_id = miro_board_url.replace(/https:\/\/miro.com\/app\/board\//,"").replace(/\/.*/g, "");

  /*==================================================
  事前処理
  必要な認証情報を取得
  ==================================================*/
  //const miro_api_token = "xxxxxxxxxxxxxxxxxxxxxxxxxxx"; //miroのboard read/write用のAPIトークンを指定
  //const asana_api_token = "xxxxxxxxxxxxxxxxxxxxxxxxxx"; //AsanaのAPIトークンを指定
  const miro_api_token = PropertiesService.getScriptProperties().getProperty("miro_api_token");
  const asana_api_token = PropertiesService.getScriptProperties().getProperty("asana_api_token");

  /*==================================================
  miroのボードに保管されている付箋情報を取得
  最終的に下記のようなdictを生成。
  {
    '1111122222222': { //<- 付箋のID
    content: '<p>付箋</p><p>の内容</p>', //<- 付箋の内容
    url: 'https://miro.com/app/board/xxxx/?moveToWidget=11111111' //<- 付箋のURL
    }
  }
  ==================================================*/
  const miro_dict_list =  get_miro_board_data({
    "miro_api_token": miro_api_token,
    "miro_board_id": miro_board_id
  });
  // const miro_board_data_dict_keys = Object.keys(miro_board_data_dict); //後続処理用にdictのキーをlist化する

  /*==================================================
  miroのボードに保管されている付箋の内容でasanaへのリンクが無いものを取得
  ==================================================*/
  let no_link_item_list = [];
  for (let i=0; i<miro_dict_list.length; i++) {
    let miro_dict = miro_dict_list[i];
    let miro_content = miro_dict["content"];
    if (! /.*<a href.*</.test(miro_content)){
      no_link_item_list.push(miro_dict);
    }
  }

  /*==================================================
  Asanaプロジェクトのカスタムフィールド情報を取得
  -> miroのURLを保存するために「miro_url」というカスタムフィールドを作成。
  (既に作成済であれば作成しないでスキップ)
  ==================================================*/
  let asana_custom_field_gid_for_miro;
  //既存のカスタムフィールド情報を取得
  const current_asana_custom_fields = get_asana_custom_fields({
    "asana_api_token": asana_api_token,
    "asana_projects_url": asana_projects_url
  });
  //既存に存在すればそれを取得。なければ作成。
  if ( current_asana_custom_fields["miro_url"] !== undefined ){
    //既にある場合
    asana_custom_field_gid_for_miro = current_asana_custom_fields["miro_url"];
  } else {
    //存在しない場合、作成
    console.log(`create Asana Custom Fields miro_url`);
    asana_custom_field_gid_for_miro = create_asana_custom_fields({
      "asana_api_token": asana_api_token,
      "asana_projects_url": asana_projects_url,
      "custom_fields_parameter_dict": {
        "miro_url": {
          "custom_fields_type": "text",
        }
      }      
    });
  }
  /*==================================================
  Asanaタスクを作成 & miro側の付箋をAsanaのリンクを付けた状態で更新
  ==================================================*/
  for (let i=0; i<no_link_item_list.length; i++) {
    //asanaタスクを作成するための必要情報を取得
    let no_link_item = no_link_item_list[i];
    let miro_id = no_link_item["id"];
    let miro_url = no_link_item["url"];
    let miro_content = no_link_item["content"];
    console.log(`miro_content -> ${miro_content}`);
    //asanaタスクを作成
    let asana_url = create_asana_task({
      "miro_content": miro_content,
      "asana_api_token": asana_api_token,
      "asana_projects_url": asana_projects_url,
      "asana_custom_field_dict": {
        [asana_custom_field_gid_for_miro]: miro_url
      },
    });
    //console.log(`asana_url -> ${asana_url}`);
    //miroの付箋を修正
    update_miro_sticky_notes({
      "miro_api_token": miro_api_token,
      "miro_content": miro_content,
      "asana_url": asana_url,
      "miro_id": miro_id,
      "miro_board_id": miro_board_id,
    });
  }
}