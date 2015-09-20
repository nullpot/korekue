<?php
$RequestURL = 'http://api.gnavi.co.jp/RestSearchAPI/20150630/?';
$APIkey     = 'keyid=14c383d2e30f47f282bd9b688c62eb22';
$range      = '&range=1';
$latitude   = '&latitude='.$_POST['lat'];
$longitude  = '&longitude='.$_POST['lng'];

//XMLで情報を受け取る
$ReqURL     = $RequestURL.$APIkey.$range.$latitude.$longitude;
$xml        = simplexml_load_file($ReqURL);

//ランダムで抜き出すために一時的に配列に格納
foreach($xml->rest as $item){
    $shops[] = $item;
}

//ランダムでお店を選定
$rand      = mt_rand(0, count($shops) - 1);
$choseShop = $shops[$rand];

//必要な情報をすべて格納する。
$data['name']      = $choseShop->name;
$data['latitude']  = $choseShop->latitude;
$data['longitude'] = $choseShop->longitude;
$data['category']  = $choseShop->category;
$data['tel']       = $choseShop->tel;
$data['opentime']  = $choseShop->opentime;
$data['image_url']  = $choseShop->image_url->shop_image1;

if($data['image_url'] == null) {
if($data['image_url'] == "") {
    $data['image_url'] = "./images/noimg.jpg";
}

$data = json_encode($data);
echo $data;