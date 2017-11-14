<?php
	class Obj{
		var $id;
		var $name;
		function attack(){
			echo "attack";
		}
	}


	$n=null;
	$n=2;
	var_dump($n);
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

	// $o=new Obj();
	// $o->id=1;
	// $o->name="对象1";
	// $o->attack();
	// echo json_encode($o);
	// 
		$json_string = file_get_contents('../json/test.json');
		// $json_string = file_get_contents('../json/test.json');
		$json_obj=json_decode($json_string);
		// var_dump($o);
		$json_obj->list=array_slice($json_obj->list,0,3);
		$json_obj->timer="123";

		// var_dump($json_obj);
		$index=count($json_obj->list)-1;
		$list=$json_obj->list;
		$fieldNameList=$json_obj->fieldNameList;
		$primaryKey=$fieldNameList[0];
		var_dump($primaryKey);
		/*对象转数组*/

		var_dump($list[$index]->userId);
		$arr=object2array($primaryKey);
		$newList=array_keys($arr);
		var_dump($newList[0]);
		 // print_r(json_decode($json_string));
/*php递归测试*/
static $s=0;
function testDigui($n){
	if($n==1||$n==2){
		return 1;
	}else{
		var_dump($n);
		return testDigui($n-1)+testDigui($n-2);
	}
}
$n=19;
// var_dump(testDigui($n));

// $json = '{"a":1,"b":2,"c":3,"d":4,"e":5}';
// var_dump(json_decode($json));
?>