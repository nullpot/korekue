<?php
function getXmlData($range){
    $RequestURL = 'http://api.gnavi.co.jp/RestSearchAPI/20150630/?';
    $APIkey     = 'keyid=14c383d2e30f47f282bd9b688c62eb22';
    $range      = '&range=' . $range;
    $latitude   = '&latitude=' . $_POST['lat'];
    $longitude  = '&longitude=' . $_POST['lng'];

    //XMLで情報を受け取る
    $ReqURL = $RequestURL . $APIkey . $range . $latitude . $longitude;
    $xml    = simplexml_load_file($ReqURL);
    return $xml;
}

$xml = getXmlData(1);

//もし店が見つからなかったら
if(isset($xml->error)){
    //見つかるまで探す
    for($i = 2; $i <= 5 && isset($xml->error);$i++){
        $xml = getXmlData($i);
    }
}

//それでも見つからなかったら
if(isset($xml->error)){
    var_dump("見つかりませんでした");exit;
}

//ランダムで抜き出すために一時的に配列に格納
foreach($xml->rest as $item){
    $shops[] = $item;
}

//ランダムでお店を選定
$rand      = mt_rand(0, count($shops) - 1);
$choseShop = get_object_vars($shops[$rand]);

//必要な情報をすべて格納する。
$data['name']      = $choseShop['name'];
$data['latitude']  = $choseShop['latitude'];
$data['longitude'] = $choseShop['longitude'];
$data['category']  = ($choseShop['category'] == ",") ? "未指定" : $choseShop['category'];
$data['tel']       = ($choseShop['tel'] == ",") ? "不明" : $choseShop['tel'];
$data['opentime']  = ($choseShop['opentime'] == ",") ? "不明" : strip_tags($choseShop['opentime']);
$data['lunch']     = (empty($choseShop['lunch'])) ? "不明" : $choseShop['lunch'];
$data['image_url'] = (empty(get_object_vars($choseShop['image_url'])['shop_image1'])) ? "./images/noimg.jpg" : get_object_vars($choseShop['image_url'])['shop_image1'];

$data = json_encode($data);
//JSONを返却
echo "[".$data."]";

$p = array("ぬるせんぱい","白井さん","こうた","ほりさん");
$rand = mt_rand(0, 3);
echo $p[$rand];