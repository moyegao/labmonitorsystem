(function () {
	var runMainJS = function () {
		//页面跳转
		$('.system_1').click(function () {
			window.location.href = "../labmonitorsystem/ventilationSystem.html";
		});
		$('.system_2').click(function () {
			window.location.href = "../labmonitorsystem/upsSystem.html";
		});
		$('.system_3').click(function () {
			window.location.href = "../labmonitorsystem/supplySystem.html";
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
                            } else if (network.href == 3) {
                                $('.system_3').click();
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
                            $('.system_1').click();
                        }
                    }
                }
            });
        }
		getTime();
		setInterval(getTime, 1000);

		function getTime () {
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


		// 温湿度
		$.ajax({
			type: "POST",
			url: "../../getWenShiDuRealData.api",
			contentType: "application/json",
			dataType: "json",
			data: {},
			success: function (response) {
				// console.log(response);
				for (var i = 0; i < response.data.length; i++) {
					var code = response.data[i].sensor;
					var a;
					if (response.data[i].sensorName.indexOf('温度') > -1) {
						if (response.data[i].value) {
							if (response.data[i].value.toString().indexOf('.') > -1) {

								if (response.data[i].value.toString().indexOf('-') > -1) {
									a = response.data[i].value.toString().split('.');
									if (a[0].length > 1) {
										$('#' + code).text(response.data[i].value.toString().substring(0, 5) + '℃');
									} else {
										$('#' + code).text(response.data[i].value.toString().substring(0, 4) + '℃');
									}
								} else {
									a = response.data[i].value.toString().split('.');
									if (a[0].length > 1) {
										$('#' + code).text(response.data[i].value.toString().substring(0, 4) + '℃');
									} else {
										$('#' + code).text(response.data[i].value.toString().substring(0, 3) + '℃');
									}
								}
							} else {
								$('#' + code).text(response.data[i].value.toString() + '.0℃');
							}
						} else {
							$('#' + code).text('一一');
						}

					} else if (response.data[i].sensorName.indexOf('温湿度湿度') > -1) {
						if (response.data[i].value) {
							if (response.data[i].value.toString().indexOf('.') > -1) {

								if (response.data[i].value.toString().indexOf('-') > -1) {
									a = response.data[i].value.toString().split('.');
									if (a[0].length > 1) {
										$('#' + code).text(response.data[i].value.toString().substring(0, 5) + '%');
									} else {
										$('#' + code).text(response.data[i].value.toString().substring(0, 4) + '%');
									}
								} else {
									a = response.data[i].value.toString().split('.');
									if (a[0].length > 1) {
										$('#' + code).text(response.data[i].value.toString().substring(0, 4) + '%');
									} else {
										$('#' + code).text(response.data[i].value.toString().substring(0, 3) + '%');
									}
								}
							} else {
								$('#' + code).text(response.data[i].value.toString() + '.0%');
							}
						} else {
							$('#' + code).text('一一');
						}

					}

				}


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
			success: function (response) {
				// console.log(response);
				for (var i = 0; i < response.data.length; i++) {
					var code = response.data[i].code;
					var name = response.data[i].name.substring(0, 3);

					$('.' + name).css('background-color', 'red');
					$('.' + name).find('span').css('color', 'white');
					if (response.data[i].alarmType == 1) {
						
						// if (response.data[i].limitType == 1) {
						// 	$("." + code).append("<span>↑</span>");
						// 	// console.log('成功', '1');
						// } else {
						// 	$("." + code).append("<span>↓</span>");
						// 	// console.log('成功','2');
						// }
						$('.' + code).css('color', 'red');
						colorChange(code, response.data[i].limitType);
					} else {
						$('.' + code).css('color', 'gray');
						// console.log('离线');
						
					}
				}

				// 离线闪烁
				function colorChange(code, limitType) {
					if (limitType == 1) {
						$("." + code).append("↑");
						$("." + code).hide();
						$("." + code).show();
					} else {
						$("." + code).append("↓");
						$("." + code).hide();
						$("." + code).show();
					}

					// 立即执行（立即闪烁）
					setTimeout(function () {
						setTimeout(function () {
							$('.' + code).css('color', 'black');
						}, 1000);
						setTimeout(function () {
							$('.' + code).css('color', 'red');
						}, 2000);
					}, 0);
					setInterval(function () {
						setTimeout(function () {
							$('.' + code).css('color', 'black');
						}, 1000);
						setTimeout(function () {
							$('.' + code).css('color', 'red');
						}, 2000);
					}, 2000);
				}


			},
			error: function (e) {

			}
		});


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