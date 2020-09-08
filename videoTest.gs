var api_url = "https://api.videoindexer.ai/"; //Video Indexer API URL
var location = "trial";
var AzureSK = "d4cf76ac9e934f2bbb4c9c3de2ee434d";        // For Microsoft Azure Portal Subscription Key
var VideoIndexerSK = "055580a9bf564933b817e0df14028904"; //For Video Indexer Portal Subscription Key
var accountID = "59969001-ccc4-44a1-a7fb-43e88f021215";  // For Video Indexer API

//アプリケーションのURLにアクセスされた時に自動的に実行される関数
function doGet() {
  
  var html = HtmlService.createTemplateFromFile('test');
  
  //Logger.log(e);
  //getで送信された値を指定して取得する(index.htmlファイルのname="url"部分)
  //var url = e.parameter.url;
  //getで送信された値を指定して取得する(index.htmlファイルのname="radio"部分)
  //var params = e.parameter.radio;
  //postVideo(url);
  //index.htmlにurlを返す
  //html.urlName = url;
  return html.evaluate(); 
}

//フォームに入力されたURLの値を引数として使う関数
function doPost(postdata){
  
  var videoURL = postdata.parameters.Videourl.toString();
  videoURL = videoURL.replace("dl=0", "dl=1");
  //Logger.log(videoURL);
  
  var videoID = postVideo(videoURL);
  Logger.log(videoID);
  Utilities.sleep(1000);
  
  var result_page = HtmlService.createTemplateFromFile('result');
  
  result_page.videoid = videoID;
  return result_page.evaluate();
}

function getAccountAccessToken() {
  
  var params = {
    "method" : "get",
    "headers" : {
      "Authorization" : "Bearer " + AzureSK, //Use AzureSK for Authorization
      "Ocp-Apim-Subscription-Key" : VideoIndexerSK //Use VideoIndexerSK for SubscriptionKey
    },
    //"location" : location,
    //"accountId" : accountID
  };
  
  var request_url = api_url + "/Auth/" + location + "/Accounts/" + accountID + "/AccessToken?allowEdit=true"
  //Logger.log(request_url);
  var response = UrlFetchApp.fetch(request_url, params).getContentText();
  //Logger.log(response);
  
  let regex = /\"/g;
  var account_AT = response.replace(regex,"");
  
  return account_AT;
}

function postVideo(url) {
  
  var videoURL = url;
  //Logger.log(videoURL);
  var params = {
    "method" : "post",
    "headers" : {
      "Authorization" : "Bearer " + AzureSK,
      "Ocp-Apim-Subscription-Key" : VideoIndexerSK
    },
  };
  
  var userAccessToken = getAccountAccessToken();
  //Logger.log(userAccessToken);
  
  var request_url = api_url + location + "/Accounts/" + accountID + "/Videos?name=Tsuda&privacy=Public&videoUrl=" + videoURL + "&accessToken=" + userAccessToken;
  //Logger.log(request_url);
  
  var response = UrlFetchApp.fetch(request_url, params).getContentText().toString();
  let regex = /"id":".{10}"/;
  var videoID = response.match(regex).toString();
  Logger.log(videoID);
  videoID = videoID.match("[a-z0-9]{10}").toString();
  Logger.log(videoID);
  
  return videoID;
}

function getVideoWidget(videoID){
  
  var params = {
    "method" : "get",
    "headers" : {
      "Authorization" : "Bearer " + AzureSK,
      "Ocp-Apim-Subscription-Key" : VideoIndexerSK
    },
  };
  
  var videoAccessToken = getVideoAccessToken();
  var request_url = api_url + location + "/Accounts/" + accountID + "/Videos/57b46d2da5/PlayerWidget?accessToken=" + videoAccessToken;
  
  Logger.log(request_url);
  var response = UrlFetchApp.fetch(request_url, params).getContentText().toString();
  Logger.log(response);
}

function getVideoAccessToken(){
  
  var params = {
    "method" : "get",
    "headers" : {
      "Authorization" : "Bearer " + AzureSK,
      "Ocp-Apim-Subscription-Key" : VideoIndexerSK
    },
  };
  
  var request_url = api_url + "/Auth/" + location + "/Accounts/" + accountID + "/Videos/57b46d2da5/AccessToken?allowEdit=True";
  var response = UrlFetchApp.fetch(request_url, params).getContentText().toString();
  
  let regex = /\"/g;
  var video_AT = response.replace(regex,"");
  
  Logger.log(video_AT);
  
  return video_AT;

}