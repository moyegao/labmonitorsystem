(function () {
	var runMainJS = function () {
				//通风橱数据列表
				var paifengchuDataList = [];


				//页面跳转
				$('.system_2').click(function () {
					window.location.href = "../labmonitorsystem/upsSystem.html";
				});
				$('.system_3').click(function () {
					window.location.href = "../labmonitorsystem/supplySystem.html";
				});
				$('.system_4').click(function () {
					window.location.href = "../labmonitorsystem/humitureSystem.html";
				});


        		setInterval(function () {  //手机端切屏
                    getCutScreenStatus();
				}, 3000);

        		setInterval(function () {  //控制模式：自动还是手动
					getCutScreenStatus1();
				}, 30000);

				getTime();
				setInterval(getTime, 1000);
		
				function getTime() {
					function getNow(s) {
						return s < 10 ? '0' + s : s;
					}
		
					var myDate = new Date();
					//获取当前年
					var year = myDate.getFullYear();
					//获取当前月
					var month = myDate.getMonth() + 1;
					//获取当前日
					var date = myDate.getDate();
					var h = myDate.getHours(); //获取当前小时数(0-23)
					var m = myDate.getMinutes(); //获取当前分钟数(0-59)
					var s = myDate.getSeconds();
		
					var now = year + '-' + getNow(month) + "-" + getNow(date) + " " + getNow(h) + ':' + getNow(m) + ":" + getNow(s);
		
					$('.main-time').text(now);
				}


			function getCutScreenStatus(){
				$.ajax({
					type: "GET",
					url: "../../getCutScreenStatus.api",
					contentType: "application/json",
					data:{},
					error: function (request) {
					},
					success: function (data) {
						var obj = jQuery.parseJSON(data);
						if (obj.resultCode == 1) {
							var network = obj.data
                            if(network.control == 1){  //手动
                                if(network.href == 2){
                                    $('.system_2').click();
                                }else if(network.href == 3)
                                {
                                    $('.system_3').click();
                                }else if(network.href == 4){
                                    $('.system_4').click();
                                }
							}
						}
					}
				});
			}

//------------------------

        function getCutScreenStatus1(){
            $.ajax({
                type: "GET",
                url: "../../getCutScreenStatus.api",
                contentType: "application/json",
                data:{},
                error: function (request) {
                },
                success: function (data) {
                    var obj = jQuery.parseJSON(data);
                    if (obj.resultCode == 1) {
                        var network = obj.data
                        if(network.control == 0){
                            console.log("zidong")
                            // $('.system_2').click();
                        }
                    }
                }
            });
        }
				//通风橱
				$.ajax({
					type: "POST",
					url: "../../getAirFumeRealData.api",
					contentType: "application/json",
					dataType: "json",
					data: {},
					success: function (response) {
						paifengchuDataList = response.data;
		
						for (var i = 0; i < paifengchuDataList.length; i++) {
		
							var code = paifengchuDataList[i].sensor;
							var name = paifengchuDataList[i].sensorName;
		
							if (name.indexOf('运行') > -1) {
								if (paifengchuDataList[i].value == '1') {
									$('#' + code).show();
								} else {
									$('#' + code).hide();
								}
							} else if (name.indexOf('风量') > -1) {
								if (response.data[i].value.toString().split('.')) {
									var a = response.data[i].value.toString().split('.');
									$('#' + code).text(a[0]);
								} else {
									$('#' + code).text(paifengchuDataList[i].value.toString());
								}
							} else {
								$('#' + code).text(paifengchuDataList[i].value.toString());
							}
						}
		
						for (let i = 0; i < paifengchuDataList.length; i++) {
							var code = paifengchuDataList[i].sensor;
							if ((paifengchuDataList[i].sensor.toString().substring(0, 17) == 'C020002001SGAC1AG' || paifengchuDataList[i].sensor.toString().substring(0, 17) == 'C020002001SGAF1AQ' || paifengchuDataList[i].sensor.toString().substring(0, 17) == 'C020002001SGAC1AH') && paifengchuDataList[i].value == 1) {
								// console.log(paifengchuDataList[i].sensorName, code);
								
								$('.' + code).attr('fill', 'red');
								paifengchucolorChange(code);
							}
		
						}
		
					},
					error: function (e) {
		
					}
				});
		
				function paifengchucolorChange(code) {
					// 立即执行（立即闪烁）
					setTimeout(function () {
						setTimeout(function () {
							$('.' + code).show()
						}, 1000);
						setTimeout(function () {
							$('.' + code).hide()
						}, 2000);
					}, 0);
					setInterval(function () {
						setTimeout(function () {
							$('.' + code).show();
						}, 1000);
						setTimeout(function () {
							$('.' + code).hide();
						}, 2000);
					}, 2000);
				}
		
				// 活性炭阻值
				$.ajax({
					type: "POST",
					url: "../../getAirActiveRealData.api",
					contentType: "application/json",
					dataType: "json",
					data: {},
					success: function (response) {
						// console.log(response);
						$('#huoxingtan').text(response.data[0].value.toString() + ' Pa');
		
		
					},
					error: function (e) {
		
					}
				});
		
				// 报警
				$.ajax({
					type: "POST",
					url: "../../getAlarmRealTime.api",
					contentType: "application/json",
					dataType: "json",
					data: {},
					success: function (res) {
						var huoxingtanMsg = "C020002001SGAG1AG01 C020002001SGAG1AH01 C020002001SGAG1AI01 C020002001SGAG1AF01";
						var msg;
						for (var i = 0; i < res.data.length; i++) {
							var code = res.data[i].code;
		
							if (huoxingtanMsg.indexOf(code) > -1 && res.data[i].value == 1) {
		
								msg = code;
								break;
							}
		
						}
						if (huoxingtanMsg.indexOf(msg) > -1) {
							$('#huoxingtan').css('color', 'red');
							// setTimeout (立即闪烁)
							setTimeout(colorChange, 0);
							setInterval(colorChange, 2000);
						}
		
		
		
					},
					error: function (e) {
		
					}
				});
				// 活性炭数值闪烁
				function colorChange() {
					setTimeout(function () {
						$('#huoxingtan').css('color', 'black');
					}, 1000);
					setTimeout(function () {
						$('#huoxingtan').css('color', 'red');
					}, 2000);
				}
		
				// 风机
				$.ajax({
					type: "POST",
					url: "../../getAirFanRealData.api",
					contentType: "application/json",
					dataType: "json",
					data: {},
					success: function (response) {
						// console.log(response);
						for (var i = 0; i < response.data.length; i++) {
							var code = response.data[i].sensor;
							if (response.data[i].value == '0') {
								$('#' + code).attr('src', './assets/icon/fengji1.png');
							}
							// response.data[i].value == '0' ? $('#' + code).attr('src', './assets/icon/fengji1.png') : $('#' + code).attr('./assets/icon/fengji1.png');
		
		
						}
		
		
					},
					error: function (e) {
		
					}
				});
		
				// 排风罩
				$.ajax({
					type: "POST",
					url: "../../getAirHoodRealData.api",
					contentType: "application/json",
					dataType: "json",
					data: {},
					success: function (response) {
		
						// console.log(response);
						for (var i = 0; i < response.data.length; i++) {
							var code = response.data[i].sensor;
							if (response.data[i].value == '1') {
								$('#' + code).attr('xlink:href', './assets/icon/排风罩绿.png');
							}
		
						}
		
		
					},
					error: function (e) {
		
					}
				});
		
				// 风扇
				$.ajax({
					type: "POST",
					url: "../../getAirExhaustRealData.api",
					contentType: "application/json",
					dataType: "json",
					data: {},
					success: function (response) {
		
						// console.log(response);
						for (var i = 0; i < response.data.length; i++) {
							var code = response.data[i].sensor;
							if (response.data[i].value == '0') {
								$('#' + code).attr('xlink:href', './assets/icon/feng.png');
							}
						}
		
		
					},
					error: function (e) {
		
					}
				});
		
		
		
		
		
		
		
		
				var defaultWidth = 1920;
				var defaultHeight = 440;
				var clientWidth = document.body.clientWidth;
				var clientHeight = document.body.clientHeight;
				var widthPercent = clientWidth / defaultWidth;
				var heightPercent = clientHeight / defaultHeight;
				var percent = Math.min(widthPercent, heightPercent);
				// 按最小百分比设置svg的宽和高
				$('.ventilationSystem-svg').css('width', 1800 * percent + 'px');
				$('.ventilationSystem-svg').css('height', 440 * percent + 'px');
		
				//		添加边角
				// $('.has-side').append($('<span class="side-left-top"></span><span class="side-right-top"></span><span class="side-left-bottom"></span><span class="side-right-bottom"></span>'));
		
				//	设置字体大小
				var setFont = function () {
					var docEl = document.documentElement;
					var clientWidth = docEl.clientWidth;
					docEl.style.fontSize = 20 * (clientWidth / 1920) + 'px';
					// console.log(docEl.style.fontSize)
				};
				setFont();
		
				//	绘制界面标题事件
				var drowTitle = function () {
					var titleBox = document.querySelector('.main-title');
					var width = titleBox.clientWidth;
					var height = titleBox.clientHeight;
					// console.dir(titleBox)
					var c = document.getElementById("myCanvas");
					// console.dir(c)
					c.height = (height - 0) * 0.65;
					c.width = width;
					var ctx = c.getContext("2d");
					// console.log(document.documentElement.style.fontSize)
					ctx.font = "1.9rem Verdana";
					// 创建渐变
					var gradient = ctx.createLinearGradient(0, 0, 0, c.height);
					//		gradient.addColorStop("0","magenta");
					gradient.addColorStop("0", "#53B7FF");
					gradient.addColorStop("1.0", "#3A7CFD");
					// 用渐变填色
					//		ctx.strokeStyle=gradient;
					ctx.fillStyle = gradient;
					ctx.textBaseline = "top";
					ctx.textAlign = "center";
					//		ctx.strokeText("实验室监控系统",(width-0)/2,10);	
					ctx.fillText("实验室监控系统", (width - 0) / 2, 10);
				};
				// drowTitle()
		
		
				//window添加监听窗口变化事件	
				$(window).resize(function () { //动态监听监听网页窗口变化
					setFont();
					// drowTitle()
				});
	}
	
	
	runMainJS();
	
	/*$.ajax({
		type: "POST",
		url: "../../checkDataBase.api",
		contentType: "application/json",
		dataType: "json",
		data: {},
		success: function (res) {
			if (res.resultCode == 1) {
				runMainJS();
			} else {
				$('.dataMsg').css('display', 'block');
				$('#failMsg').text('数据库连接失败');
			}
		},
		error: function (err) {
			console.log(err);
		}
	});*/

})();