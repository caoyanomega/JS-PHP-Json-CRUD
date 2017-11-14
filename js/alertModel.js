				window.alert=alertModel;
				/*函数开始*/
				function alertModel(value){
					var timer;
					var div
					    div=document.createElement("div");
						div.id="alertModel";
						div.innerHTML=value;
					/*var style="position:fixed;"
						+"top:50%;"
						+"left:50%;"
						+"z-index:1000;"
						+"-webkit-transformt:translate(-50%,-50%);"
						+"transform:translate(-50%,-50%);"
						+"text-align:center;"
						+"background:#5F5F5F;"
						+"-webkit-background:#5F5F5F;"
						+"color:#fff;"
						+"font-size:1rem;"
						+"line-height:1rem;"
						+"padding:0.5rem;"
						+"border-radius:0.25rem;";
						div.style=style;*/
						var existModel=document.getElementById("alertModel");
						if(!existModel){
							/*原生js不支持类似于淡入淡出fadeout的效果*/
							document.body.appendChild(div);
							timer=setTimeout(function(){
								try{
									document.body.removeChild(div);
								}catch(e){
								/*异常不处理,不在控制台打印,由于计时器是一步的,这里无法控制*/
								}
								
							},3000);
						}else{
							document.body.removeChild(existModel);
							document.body.appendChild(div);
							timer=setTimeout(function(){
								try{
									document.body.removeChild(div);
								}catch(e){
									
								}
							},3000);				
						}
			}
			/*函数结束*/