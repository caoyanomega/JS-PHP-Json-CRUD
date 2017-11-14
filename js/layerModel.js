
/*	Date:20170409
	Author:曹言
	Discription:该版本为jquery版本主要为了解决浏览器兼容性问题。
	做css和js代码分离主要我发现了一个问题，就是如果把css代码都放到js里面
	有些浏览器不支持(没有效果，不是兼容问题),但是一旦分离就好了。
*/


	/*可以选择覆盖系统的alert或者直接调用该方法*/
	/*1.弹黑色提示窗*/
	 // window.alert=alertModel;
	/*2.弹出透明大背景提示框*/
	window.alert2=alertModel2;

	/*3.弹出大背景提示框*/
	// window.confirm=confirmModel;

	/*alertModel函数开始*/
	function alertModel(value){
		var timer;
		var div
		    div=document.createElement("div");
			div.className="alertModel";
			div.innerHTML=value;
			var existModel=$(".alertModel")[0];
			if(!existModel){
				/*原生js不支持类似于淡入淡出fadeout的效果*/
				$("body").append(div);
				timer=setTimeout(function(){
					try{
						/*注意remove不能紧跟着fadeOut做链式编程(亲测无效),只能放在回调函数里面*/
						$(div).fadeOut(500,function(){
							$(div).remove();
						});
					}catch(e){
					/*异常不处理,不在控制台打印,由于计时器是一步的,这里无法控制*/
					}
					
				},2000);
			}else{
				$(existModel).remove();
				$("body").append(div);
				timer=setTimeout(function(){
					$(div).fadeOut(500,function(){
							$(div).remove();
						});
				},2000);				
			}
	}
    /*alertModel函数结束*/

    /*alertModel2函数开始*/
	function alertModel2(value){
		/*下面代码其实还是可以进一步优化的，比如避免dom操作改用字符串拼接比较好，最后一步使用
		innerHTML的方式赋值。
		*/

			/*首先添加半透明背景*/
		   	var divBg=document.createElement("div");
			divBg.className="alertModel2Bg";
			$("body").append(divBg);

			var divDialog=document.createElement("div");
			divDialog.className="alertModel2Dialog";
			$(divBg).append(divDialog);

			/*添加内部disc标签*/
			var divDisc=document.createElement("div");
			divDisc.className="alertModle2Disc";
			divDisc.innerHTML=value;
			$(divDialog).append(divDisc);
		
			/*添加内部button*/
			var divBtn=document.createElement("div");
			divBtn.className="alertModel2Btn";
			/*这里可以修改按钮上的value*/
			divBtn.innerHTML="确定";
			$(divDialog).append(divBtn);
			divBtn.onclick=function(){
				$(divBg).remove();
			}		
	}
    /*alertModel2函数结束*/

        /*confirmModel函数开始*/
	function confirmModel(value){
		var flag;
		/*下面代码摒弃了DOM操作,改为字符串拼接+innerHTML*/

			/*首先添加半透明背景*/
		   	var divBg=document.createElement("div");
			divBg.className="confirmModelBg";
			$("body").append(divBg);
			divBg.innerHTML="<div class='confirmModelDialog'>"
			+"<div class='confirmModelTop'>提示</div>"
			+"<div class='confirmModleDisc'>"+value+"</div>"
			+"<div class='confirmModelBottom'>"
			+"<button class='confirmModelBottomYes'>确定</button>"
			+"<button class='confirmModelBottomNo'>取消</button>"
			+"</div>"
			+"</div>";

			$(".confirmModelBottomYes").click(function(){
					flag=true;
				});
			$(".confirmModelBottomNo").click(function(){
				flag=false;
			});
			

			// while(true){
			// 	if(flag==true){
			// 		$(divBg).remove();
			// 		return true;
			// 	}
			// 	if(flag==false){
			// 		$(divBg).remove();
			// 		return false;
			// 	}

			// }


	}
    /*confirmModel函数结束*/