(function () {
	
	var runMainJS = function () {
				// 页面跳转
				$('.system_1').click(function () {
					window.location.href = "../labmonitorsystem/ventilationSystem.html";
				});
				$('.system_2').click(function () {
					window.location.href = "../labmonitorsystem/upsSystem.html";
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
                        if(network.control == 1) {  //手动
                            if (network.href == 1) {
                                $('.system_1').click();
                            } else if (network.href == 2) {
                                $('.system_2').click();
                            } else if (network.href == 4) {
                                $('.system_4').click();
                            }
                        }
                    }
                }
            });
        }

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
                            $('.system_4').click();
                        }
                    }
                }
            });
        }
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
		
				// 气瓶
				$.ajax({
					type: "POST",
					url: "../../getGongQiRealData.api ",
					contentType: "application/json",
					dataType: "json",
					data: {},
					success: function (response) {
						// console.log(response);
						for (var i = 0; i < response.data.length; i++) {
							var code = response.data[i].code;
							$('#' + code).attr({
								"height": response.data[i].value * 64 + '%',
								"y": 95.3 - response.data[i].value * 64 + '%'
							});
		
							// if (response.data[i].code != 'C020002001SGBB1AA06') {
							// 	if ((response.data[i].value * 64) >= 12.8) {
							// 		$('#' + code).attr("fill", '#00FF00');
							// 		$('#bar' + code).css('color', '#00FF00');
							// 	} else if ((response.data[i].value * 64) >= 4.7 && (response.data[i].value * 64) < 12.8) {
							// 		$('#' + code).attr("fill", '#FFFF00');
							// 		$('#bar' + code).css('color', '#FFFF00');
							// 	} else if ((response.data[i].value * 64) < 4.7) {
							// 		$('#' + code).attr("fill", 'red');
							// 		if ((response.data[i].value * 64) > 0) {
							// 			$('#bar' + code).css('color', 'red');
							// 		}
							// 	}
							// } else {
							// 	if ((response.data[i].value * 64) >= 21.3) {
							// 		$('#' + code).attr("fill", '#00FF00');
							// 		$('#bar' + code).css('color', '#00FF00');
							// 	} else if ((response.data[i].value * 64) >= 16 && (response.data[i].value * 64) < 21.3) {
							// 		$('#' + code).attr("fill", '#FFFF00');
							// 		$('#bar' + code).css('color', '#FFFF00');
							// 	} else if ((response.data[i].value * 64) < 16) {
							// 		$('#' + code).attr("fill", 'red');
							// 		if ((response.data[i].value * 64) > 0) {
							// 			$('#bar' + code).css('color', 'red');
							// 		}
							// 	}
							// }
		
							// console.log(response.data[i].value * 64);
							if (code == 'C020002001SGBB1AA03') {
								$('#yaqiping_2').attr({
									"height": response.data[i].value * 64 + '%',
									"y": 95.3 - response.data[i].value * 64 + '%'
								});
								$('#yaqiping_3').attr({
									"height": response.data[i].value * 64 + '%',
									"y": 95.3 - response.data[i].value * 64 + '%'
								});
		
								// if ((response.data[i].value * 64) >= 12.8) {
								// 	$('#yaqiping_2').attr("fill", '#00FF00');
								// 	$('#yaqiping_3').attr("fill", '#00FF00');
								// } else if ((response.data[i].value * 64) >= 4.7 && (response.data[i].value * 64) < 12.8) {
								// 	$('#yaqiping_2').attr("fill", '#FFFF00');
								// 	$('#yaqiping_3').attr("fill", '#FFFF00');
								// } else if ((response.data[i].value * 64) < 4.7) {
								// 	$('#yaqiping_2').attr("fill", 'red');
								// 	$('#yaqiping_3').attr("fill", 'red');
								// }
		
		
							}
							$('#bar' + code).text(response.data[i].BarValue.toString().substring(0, 5) + 'bar');
							if (response.data[i].value) {
								$('#bar' + code).css('color', '#00FF00');
							}
		
						}
		
		
					},
					error: function (e) {
		
					}
				});
		
				$.ajax({
					type: "POST",
					url: "../../getGongQiAlarm.api",
					contentType: "application/json",
					dataType: "json",
					data: {},
					success: function (res) {
						// console.log(res);
						for (var i = 0; i < res.data.length; i++) {
							if (res.data[i].name.indexOf('氦气压1') > -1) {
								colorChange(res.data[i], 'C020002001SGBB1AA01');
							} else if (res.data[i].name.indexOf('氦气压2') > -1) {
								colorChange(res.data[i], 'C020002001SGBB1AA02');
							} else if (res.data[i].name.indexOf('氩气压1') > -1) {
								colorChange(res.data[i], 'C020002001SGBB1AA03');
							} else if (res.data[i].name.indexOf('氩气压2') > -1) {
								colorChange(res.data[i], 'C020002001SGBB1AA04');
							} else if (res.data[i].name.indexOf('氮气压1') > -1) {
								colorChange(res.data[i], 'C020002001SGBB1AA05');
							} else if (res.data[i].name.indexOf('氮气压2') > -1) {
								colorChange(res.data[i], 'C020002001SGBB1AA06');
							} else if (res.data[i].name.indexOf('空气压') > -1) {
								colorChange(res.data[i], 'C020002001SGBB1AA07');
							}
		
						}
					},
					error: function (err) {
						console.log(err);
					}
				});
				var colorChange = function (data, id) {
		
					if (data.code.indexOf('I') > -1 && data.value == 1) {
						$('#' + id).attr("fill", 'purple');
						$('#bar' + id).css('color', 'purple');
					} else if (data.code.indexOf('H') > -1 && data.value == 1) {
						$('#' + id).attr("fill", 'red');
						$('#bar' + id).css('color', 'red');
					} else if (data.code.indexOf('J') > -1 && data.value == 1) {
						$('#' + id).attr("fill", 'orange');
						$('#bar' + id).css('color', 'orange');
					}
		
					if (id == 'C020002001SGBB1AA03') {
						if (data.code.indexOf('I') > -1 && data.value == 1) {
							$('#yaqiping_2').attr("fill", 'purple');
							$('#yaqiping_3').attr("fill", 'purple');
						} else if (data.code.indexOf('H') > -1 && data.value == 1) {
							$('#yaqiping_2').attr("fill", 'red');
							$('#yaqiping_3').attr("fill", 'red');
						} else if (data.code.indexOf('J') > -1 && data.value == 1) {
							$('#yaqiping_2').attr("fill", 'orange');
							$('#yaqiping_3').attr("fill", 'orange');
						}
					}
				};
		
		
				$.ajax({
					type: "POST",
					url: "../../getGongQiDeviceData.api ",
					contentType: "application/json",
					dataType: "json",
					data: {},
					success: function (response) {
						// console.log(response);
						for (var i = 0; i < response.data.length; i++) {
							var code = response.data[i].code;
							var a;
							if (response.data[i].name.indexOf('环境温湿度温度') > -1) {
								if (response.data[i].value.toString().indexOf('.') > -1) {
									a = response.data[i].value.toString().split('.');
									if (a[0].length > 1) {
										$('#' + code).text(response.data[i].value.toString().substring(0, 4) + '℃');
									} else {
										$('#' + code).text(response.data[i].value.toString().substring(0, 3) + '℃');
									}
								} else {
									$('#' + code).text(response.data[i].value.toString() + '.0℃');
								}
							} else if (response.data[i].name.indexOf('环境温湿度湿度') > -1) {
								if (response.data[i].value.toString().indexOf('.') > -1) {
									a = response.data[i].value.toString().split('.');
									if (a[0].length > 1) {
										$('#' + code).text(response.data[i].value.toString().substring(0, 4) + "%");
									} else {
										$('#' + code).text(response.data[i].value.toString().substring(0, 3) + "%");
									}
								} else {
									$('#' + code).text(response.data[i].value.toString() + ".0%");
								}
							} else if (response.data[i].name.indexOf('氧含量') > -1) {
								if (response.data[i].value.toString().indexOf('.') > -1) {
									a = response.data[i].value.toString().split('.');
									if (a[0].length > 1) {
										$('#' + code).text(response.data[i].value.toString().substring(0, 4) + "%");
									} else {
										$('#' + code).text(response.data[i].value.toString().substring(0, 3) + "%");
									}
								} else {
									$('#' + code).text(response.data[i].value.toString() + ".0%");
								}
		
							}
		
							if (response.data[i].code == 'C020002001SGAE1AB04') {
								if (response.data[i].value == '0') {
									$('.hand').text('时间控制');
								} else if (response.data[i].value == '1') {
									$('.hand').text('手动控制');
								}
							}
		
							if (response.data[i].code == 'C020002001SGAE1AH04') {
								if (response.data[i].value == '0') {
									$('#' + code).attr('src', './assets/icon/fengshanPNG.png');
								}
							}
		
		
		
						}
		
		
					},
					error: function (e) {
		
					}
				});
		
				// 温湿度、氧气报警
				$.ajax({
					type: "POST",
					url: "../../getAlarmRealTime.api ",
					contentType: "application/json",
					dataType: "json",
					data: {},
					success: function (response) {
						// console.log(response);
						var oxygenMsg = 'C020002001SGBA1AH01 C020002001SGBA1AG01 C020002001SGBA1AF01 C020002001SGBA1AI01';
						for (var i = 0; i < response.data.length; i++) {
							var code = response.data[i].code;
							if (oxygenMsg.indexOf(code) > -1) {
								$('.oxygen').css('color', 'red');
							} else {
								if (response.data[i].alarmType == 1) {
									$('.' + code).css('color', 'red');
									if (response.data[i].limitType == 1) {
										$("." + code).append("<span>↑</span>");
									} else {
										$("." + code).append("<span>↓</span>");
									}
								} else {
									$('.' + code).css('color', 'orange');
								}
							}
						}
					},
					error: function (err) {
		
					}
				});
		
		
		
				var defaultWidth = 1920;
				var defaultHeight = 500;
				var clientWidth = document.body.clientWidth;
				var clientHeight = document.body.clientHeight;
				var widthPercent = clientWidth / defaultWidth;
				var heightPercent = clientHeight / defaultHeight;
				var percent = Math.min(widthPercent, heightPercent);
				// 按最小百分比设置svg的宽和高
				$('.supplySystem-svg').css('width', 1314 * percent + 'px');
				$('.supplySystem-svg').css('height', 500 * percent + 'px');
		
				//		添加边角
				$('.has-side').append($('<span class="side-left-top"></span><span class="side-right-top"></span><span class="side-left-bottom"></span><span class="side-right-bottom"></span>'));
		
				//	设置字体大小
				var setFont = function () {
					var docEl = document.documentElement;
					var clientWidth = docEl.clientWidth;
					docEl.style.fontSize = 20 * (clientWidth / 1920) + 'px';
					// console.log(docEl.style.fontSize);
				};
				setFont();
		
				//	绘制界面标题事件
				var drowTitle = function () {
					var titleBox = document.querySelector('.main-title');
					var width = titleBox.clientWidth;
					var height = titleBox.clientHeight;
					// console.dir(titleBox);
					var c = document.getElementById("myCanvas");
					// console.dir(c);
					c.height = (height - 0) * 0.65;
					c.width = width;
					var ctx = c.getContext("2d");
					// console.log(document.documentElement.style.fontSize);
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