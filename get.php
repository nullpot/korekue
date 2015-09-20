<?php
$RequestURL = 'http://api.gnavi.co.jp/RestSearchAPI/20150630/?';
$APIkey     = 'keyid=14c383d2e30f47f282bd9b688c62eb22';
$range      = '&range=1';
$latitude   = '&latitude=35.670083';
$longitude  = '&longitude=139.763267';

$ReqURL     = $RequestURL.$APIkey.$range.$latitude.$longitude;
//simplexmlを使う
$xml        = simplexml_load_file($ReqURL);
echo "<pre>";

//ランダムで抜き出すために一時的に配列に格納
foreach($xml->rest as $item){
    $shops[] = $item;
}

//ランダムでお店を選定
$rand      = mt_rand(0, count($shops));
$choseShop = $shops[$rand];

//必要な情報をすべて格納する。
$data['name']      = $choseShop->name;
$data['latitude']  = $choseShop->latitude;
$data['longitude'] = $choseShop->longitude;
$data['category']  = $choseShop->category;

var_dump($choseShop->category);