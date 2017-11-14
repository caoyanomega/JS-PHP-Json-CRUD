<?php

// // 生成一个PHP数组
// $data = array();
// $data['a'] = 'test';
// $data['b'] = 'bbb';
 
// // 把PHP数组转成JSON字符串
// $json_string = json_encode($data);
 
// // 写入文件
// file_put_contents('../json/test.json', $json_string);

// 从文件中读取数据到PHP变量
// $json_string = file_get_contents('../json/test.json');
 
// 把JSON字符串转成PHP数组
// $data = json_decode($json_string);
 
// 显示出来看看
/*$arr = array(0=>array('id'=>1,'name'=>'aaa'));
$arr = json_encode($arr);
$arr = json_decode($arr);
var_dump($arr);*/

/*全局函数数组转对象*/
function array2object($array) {
  if (is_array($array)) {
    $obj = new StdClass();
    foreach ($array as $key => $val){
      $obj->$key = $val;
    }
  }
  else { $obj = $array; }
  return $obj;
}
/*全局函数对象转数组*/
function object2array($object) {
  if (is_object($object)) {
    foreach ($object as $key => $value) {
      $array[$key] = $value;
    }
  }
  else {
    $array = $object;
  }
  return $array;
}

$operationCode=$_POST['operationCode'];
$pageNum=$_POST['pageNum'];
$pageNow=$_POST['pageNow'];

	// Sleep(1);

	if($operationCode=="test"){
		Sleep(3);
		echo '{"name":"'.$operationCode.'"}'; 
	}else if($operationCode=="refresh"){
		/*表格初始化即刷新-即一进来的行为*/
		$json_string = file_get_contents('../json/test.json');
		$json_obj=json_decode($json_string);
		$json_obj->rowsSum=count($json_obj->list);
		$json_obj->pageNow=$pageNow;
		$json_obj->list=array_slice($json_obj->list,($pageNow-1)*$pageNum,$pageNum);
		$new_json_string=json_encode($json_obj);
		echo '{"name":'.$new_json_string.'}';

	}else if($operationCode=="Add"){
		/*增加*/
		$usersData=json_decode($_POST['usersData']);

		$json_string = file_get_contents('../json/test.json');
		$json_obj=json_decode($json_string);
		$objList=$json_obj->list;
		/*处理一下该数组然后将其插入到json保存：处理分为id重构*/
		/*首先获取原数组最后的id:由于本人不会序列，这里只好使用i++代替了*/
		$fieldNameList=$json_obj->fieldNameList;
		$fieldNameListFirst=$fieldNameList[0];
		/*转为数组*/
		$fieldNameListFirstArr=object2array($fieldNameListFirst);
		/*获取第一个键的值*/
		$keyList=array_keys($fieldNameListFirstArr);
		$primarykey=$keyList[0];
		/*求出全部对象的长度*/
		$lastObjIndex=count($json_obj->list)-1;
		/*获取最后一个对象*/
		$lastObjIndex=null;
		$lastObj=null;
		$lastObjPK=null;
		if(count($json_obj->list)==0){
			$lastObjIndex=-1;
			$lastObj=array();
			$lastObjPK=0;
		}else{
			$lastObjIndex=count($json_obj->list)-1;
			$lastObj=($objList[$lastObjIndex]);
			/*获取最后一个对象的主键值*/
			$lastObjPK=$lastObj->$primarykey;
		}
		// php自增可以直接加1;对$usersData进行处理
		foreach ($usersData as $key => $value) {
			$lastObjPK=$lastObjPK+1;
			$value->$primarykey=$lastObjPK;
		}
		/*重新定义json数组:拼接起来*/
		$json_obj->list=array_merge($json_obj->list,$usersData);
		// var_dump($json_obj->list);
		/*将数据写会json文件*/
		 file_put_contents('../json/test.json',json_encode($json_obj));
		//var_dump($json_obj->list);
		
		echo '{"name":"success"}';
	}else if($operationCode=="Delete"){
		/*删除*/
		$json_string = file_get_contents('../json/test.json');
		$json_obj=json_decode($json_string);
		$objList=$json_obj->list;

		/*现获取主键*/
		$primaryValue=$_POST['operation'];
		/*处理一下该数组然后将其插入到json保存：处理分为id重构*/
		/*首先获取原数组最后的id:由于本人不会序列，这里只好使用i++代替了*/
		$fieldNameList=$json_obj->fieldNameList;
		$fieldNameListFirst=$fieldNameList[0];
		/*转为数组*/
		$fieldNameListFirstArr=object2array($fieldNameListFirst);
		/*获取第一个键的值*/
		$keyList=array_keys($fieldNameListFirstArr);
		$primarykey=$keyList[0];
		/*标记要修改字段所在的索引*/
		$flag=0;
		foreach ($objList as $key => $value) {
			/*+0将字符串变为int类型*/
			if($value->$primarykey+0==$primaryValue+0){
				$flag=$key+0;
				break;
			}
		}
		// var_dump($flag);
		array_splice($objList,$flag,1);
		$json_obj->list=$objList;
		// var_dump($objList);
		// exit;
		/*将数据写会json文件*/
		file_put_contents('../json/test.json',json_encode($json_obj));
		echo '{"name":"success"}';
	}else if($operationCode=="Update"){
		/*修改的时候获取数据*/
		$json_string = file_get_contents('../json/test.json');
		$json_obj=json_decode($json_string);
		/*现获取主键*/
		$primaryValue=$_POST['operation'];
		/*再去查找该字符串*/
		$list=$json_obj->list;

		/*获取第一个键的值*/
		$fieldNameList=$json_obj->fieldNameList;
		$fieldNameListFirst=$fieldNameList[0];
		/*转为数组*/
		$fieldNameListFirstArr=object2array($fieldNameListFirst);
		$keyList=array_keys($fieldNameListFirstArr);
		$primarykey=$keyList[0];

		$newList=array();
		foreach ($list as $key => $value) {
			if($value->$primarykey+0 ==$primaryValue+0){
				array_push($newList,$value);
			}
		}
		$json_obj->list=$newList;
		$json_obj->rowsSum=count($json_obj->list);
		$json_obj->pageNow=$pageNow;
		$new_json_string=json_encode($json_obj);
		echo '{"name":'.$new_json_string.'}';
	}else if($operationCode=="UpdateSave"){
		/*修改*/
		$usersData=json_decode($_POST['usersData']);

		$json_string = file_get_contents('../json/test.json');
		$json_obj=json_decode($json_string);
		$objList=$json_obj->list;
		/*处理一下该数组然后将其插入到json保存：处理分为id重构*/
		/*首先获取原数组最后的id:由于本人不会序列，这里只好使用i++代替了*/
		$fieldNameList=$json_obj->fieldNameList;
		$fieldNameListFirst=$fieldNameList[0];
		/*转为数组*/
		$fieldNameListFirstArr=object2array($fieldNameListFirst);
		/*获取第一个键的值*/
		$keyList=array_keys($fieldNameListFirstArr);
		$primarykey=$keyList[0];
		// php自增可以直接加1;对$usersData进行处理
		/*标记要修改字段所在的索引*/
		$flag=0;
		foreach ($objList as $key => $value) {
			/*+0将字符串变为int类型*/
			if($value->$primarykey+0==$usersData[0]->$primarykey+0){
				$flag=$key+0;
				break;
			}
		}
		$objList[$flag]=$usersData[0];
		$json_obj->list=$objList;
		// var_dump($objList);
		/*将数据写会json文件*/
		file_put_contents('../json/test.json',json_encode($json_obj));
		echo '{"name":"success"}';
	}else if($operationCode=="DeleteAll"){
		/*删除*/
		$json_string = file_get_contents('../json/test.json');
		$json_obj=json_decode($json_string);
		$objList=$json_obj->list;

		$arrNew=array();
		foreach ($objList as $key => $value) {
			array_push($arrNew,$value);
		}

		/*现获取主键*/
		$arrPK=json_decode($_POST['arrPK']);
		/*处理一下该数组然后将其插入到json保存：处理分为id重构*/
		/*首先获取原数组最后的id:由于本人不会序列，这里只好使用i++代替了*/
		$fieldNameList=$json_obj->fieldNameList;
		$fieldNameListFirst=$fieldNameList[0];
		/*转为数组*/
		$fieldNameListFirstArr=object2array($fieldNameListFirst);
		/*获取第一个键的值*/
		$keyList=array_keys($fieldNameListFirstArr);
		$primarykey=$keyList[0];

		/*标记要修改字段所在的索引*/
		/*我们定义一个递归方法来追个删除数组*/
		/*第一个变量是要被操作的数组,第二个变量是要删除变量的关键字段数组*/
		$flag=0;
		function deleteMore($main,$arrPK,$primarykey){
			foreach ($main as $key => $value) {
				/*+0将字符串变为int类型*/
				if($value->$primarykey+0==$arrPK[0]){
					$flag=$key+0;
					break;
				}
			}
			array_splice($main,$flag,1);
			array_shift($arrPK);
			if(count($arrPK)==0){
				return $main;
			}else{
				/*切记一定要加return，这个bug从4月27号到5月2号,蠢了。。。
				不加return会导致返回值异常*/
				return deleteMore($main,$arrPK,$primarykey);
			}
		}
		$output=deleteMore($arrNew,$arrPK,$primarykey);
		// var_dump($output);
		$json_obj->list=$output;
		/*将数据写会json文件*/
		file_put_contents('../json/test.json',json_encode($json_obj));
		echo '{"name":"success"}';		
	}else if($operationCode=="Select"){
		/*用户查询*/
		$json_string = file_get_contents('../json/test.json');
		$json_obj=json_decode($json_string);
		$objList=$json_obj->list;

		$keyWord=json_decode($_POST['keyWord']);
		
		
	}else if($operationCode=="select"){
		
	}
	
?> 