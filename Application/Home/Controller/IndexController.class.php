<?php
namespace Home\Controller;

use Think\Controller;

class IndexController extends BaseController {
    private $appid = 'wx81a4a4b77ec98ff4';
    private $acess_token = 'gh_68f0a1ffc303';

    public function index() {
        $this->display();
    }

    public function getQustion() {

    }

    public function getSelect() {
        $question = M('select')->order('rand()')->find();
        $id = $question['id'];
        $q = $question['question'];
        $answer = $question['answer'];

        unset($question['id']);
        unset($question['question']);
        unset($question['answer']);
        $select = array();
        foreach ($question as $v) {
            if ($v) {
                array_push($select, $v);
            }
        }
        $data = array(
            'id' => $id,
            'question' => $q,
            'select' => $select,
            'answer' => $answer,
        );
        return $data;
    }

    public function getFillBlank() {
        $question = M('select')->order('rand()')->find();

    }

    public function getJudge() {
        $question = M('judge')->order('rand()')->find();
        $question['isTrue'] = $question['answer'] == '正确' ? true:false;
        unset($question['answer']);
        var_dump($question);
    }

    private function getTicket() {
        $time = time();
        $str = 'abcdefghijklnmopqrstwvuxyz1234567890ABCDEFGHIJKLNMOPQRSTWVUXYZ';
        $string='';
        for($i=0;$i<16;$i++){
            $num = mt_rand(0,61);
            $string .= $str[$num];
        }
        $secret =sha1(sha1($time).md5($string)."redrock");
        $t2 = array(
            'timestamp'=>$time,
            'string'=>$string,
            'secret'=>$secret,
            'token'=>$this->acess_token,
        );
        $url = $this->oauthDomain.'/MagicLoop/index.php?s=/addon/Api/Api/apiJsTicket';
        return $this->curl_api($url, $t2);
    }

    public function JSSDKSignature(){
        $string = new String();
        $jsapi_ticket =  $this->getTicket();
        $data['jsapi_ticket'] = $jsapi_ticket['data'];
        $data['noncestr'] = $string->randString();
        $data['timestamp'] = time();
        $data['url'] = 'https://'.$_SERVER['HTTP_HOST'].__SELF__;//生成当前页面url
        $data['signature'] = sha1($this->ToUrlParams($data));
        return $data;
    }

    private function ToUrlParams($urlObj){
        $buff = "";
        foreach ($urlObj as $k => $v) {
            if($k != "signature") {
                $buff .= $k . "=" . $v . "&";
            }
        }
        $buff = trim($buff, "&");
        return $buff;
    }



}