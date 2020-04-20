(function () {
	var runMainJS = function () {
			//页面跳转
	$('.system_1').click(function () {
		window.location.href = "../labmonitorsystem/ventilationSystem.html";
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
                            } else if (network.href == 3) {
                                $('.system_3').click();
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
                            $('.system_3').click();
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




	//		var overviewData,batteryValue;

	var getGongDianRealData = function () {
		$.when(
			$.ajax({
				contentType: "application/json",
				url: '../../getGongDianRealData.api',
				type: 'POST',
				dataType: 'json'
			}),
			$.ajax({
				contentType: "application/json",
				url: '../../getUPSElectricity.api',
				type: 'POST',
				dataType: 'json'
			})
		).done(function (data1, data2) {
			// console.log(data1[0].data);
			// console.log(data2[0].data);
			ups(data2[0].data, data1[0].data);
		});

	};
	getGongDianRealData();

	//	格式化ups数据
	var formatUps = function (upsData, data) {
		// console.log(upsData, data);
		var nameArr = ['1#UPS  LC-MS/MS', '2#UPS  ICP-MS', '3#UPS  LC', '4#UPS  GC-MS', '5#UPS  GC-MS/MS', '6#UPS  ICP-OES'];
		var numChange = '输出电压 输入电压 电池电压 输入频率 温度';
		for (var i = 0; i < upsData.length; i++) {
			var upsName = upsData[i].name.substring(2, 10);
			//			console.log(upsName)
			for (var j = 0; j < data.length; j++) {
				
				if (data[j].sensorName.indexOf(upsName) > 0) {
					//					upsData[i]['upsName'] = upsName.split('_').join('');
					upsData[i].upsName = nameArr[i];
					
					// console.log(data[j].sensorName.split('_')[2]);
					if (numChange.indexOf(data[j].sensorName.split('_')[2]) > -1) {
						upsData[i][(data[j].sensorName.split('_')[2])] = setPoint(data[j].value);
					} else {
						upsData[i][(data[j].sensorName.split('_')[2])] = data[j].value;
					}

					
				}
			}
		}
		// console.log(upsData);
		return upsData;
	};

	// 格式化数据（保留一位小数,四舍五入）
	function setPoint(value) {
		var a;
		if (value.toString().indexOf('.') > -1) {
			a = value.toString().split('.');
			if (parseInt(a[1].substring(1, 2)) >= 5) {
				// return (a[0] + '.' + a[1].substring(0, 1));
				if (parseInt(a[1].substring(0, 1)) == 9) {
					return (parseInt(a[0]) + 1) + '.0';
				} else {
					return (a[0] + '.' + (parseInt(a[1].substring(0, 1)) + 1));
				}
				
			} else {
				return (a[0] + '.' + a[1].substring(0, 1));
			}
			
		} else {
			return value + '.0';
		}
	}

	//	ups系统填充
	var ups = function (upsData, data) {
		// console.log(upsData);
		var ups = formatUps(upsData, data);
		console.log(ups);

		var Ups = $('.ups-system .ups-section>ul>li');
		Ups.html('');
		// console.log(data);

		// 1、获取通讯失败报警数据
		var communicationMsg = [];
		for (let i = 0; i < data.length; i++) {
			if (data[i].sensorName.indexOf('通讯失败') > -1) {
				communicationMsg.push(data[i]);
			}

		}
		// console.log(communicationMsg);

		// 2、对通讯失败数据进行排序
		var communicationMsg1 = [];
		for (let i = 0; i < ups.length; i++) {
			for (let j = 0; j < communicationMsg.length; j++) {
				if (ups[i].name.indexOf(communicationMsg[j].sensorName.substring(0, 10)) > -1) {
					communicationMsg1.push(communicationMsg[j]);
				}

			}

		}
		// console.log(communicationMsg1);


		for (var i = 0; i < Ups.length; i++) {
			var HTML = '<div class="li-top" id="' + communicationMsg1[i].sensor + '">' + ups[i].upsName + '</div><div class="li-section"><div class="li-section-top"><p style="display:' + (ups[i]['故障'] == 0 ? "none" : "block") + '"><img src="" alt="" width="28px" height="28px" style=" background:  url(assets/icon/bicon.png) no-repeat  -185px -34px;display: inline-block;vertical-align: middle;margin-top: -8px;"/>负载有问题，请及时处理 </p><ul><li><span>正常</span><b class="' + (ups[i]['供电模式'] == 1 ? "green" : "") + ' ' + communicationMsg1[i].sensor + '"></b></li><li><span>电池</span><b class="' + (ups[i]['供电模式'] == 2 ? "orange" : "") + ' ' + communicationMsg1[i].sensor + '"></b></li><li><span>旁路</span><b class="' + (ups[i]['供电模式'] == 3 ? "orange" : "") + ' ' + communicationMsg1[i].sensor + '"></b></li><li><span>故障</span><b class="' + (ups[i]['供电模式'] == 4 ? "red" : "") + ' ' + communicationMsg1[i].sensor + '"></b></li></ul><ol><li><span>负载</span><div><ul><li style="width:' + ups[i]['输出负载率'] + '%;" class="' + communicationMsg1[i].sensor + '"></li></ul></div><p>' + ups[i]['输出负载率'] + '%</p></li><li><span>电压输出(V)</span><div>' + ups[i]['输出电压'] + ' </div></li><li style="display: none"><span>电量</span><div><ul><li style="width: ' + ups[i].value + '%;" class="' + communicationMsg1[i].sensor + '"></li><i></i></ul></div><p>' + ups[i].value + '%</p></li></ol></div><div class="li-section-bottom"><ul><li>输入电压:&nbsp;&nbsp;' + ups[i]['输入电压'] + 'V</li><li>电池电压:&nbsp;&nbsp;<span id=' + ups[i].code + '>' + ups[i]['电池电压'] + 'V</span></li><li>输入频率:&nbsp;&nbsp;' + ups[i]['输入功率'] + 'Hz</li><li>设备温度:&nbsp;&nbsp;' + ups[i]['温度'] + '℃</li></ul></div></div>';
			Ups.eq(i).append($(HTML));
			if (ups[i]['电池电压低'] == 1) {
				$('#' + ups[i].code).css('color', 'red');
			}
			if (communicationMsg1[i].value == 1) {
				$('.' + communicationMsg1[i].sensor).css('background', '#9F9F9F');
				$('#' + communicationMsg1[i].sensor).css('background', '#9F9F9F');
			}
		}

		//		console.dir($('.ups-section>ul>li'))
		//		Ups.append($('<div class="li-top">1#UPS LC-MS/MS</div><div class="li-section"><ul><li><span>正常</span><b class="green"></b></li><li><span>电池</span><b></b></li><li><span>旁路</span><b></b></li><li><span>故障</span><b></b></li></ul><ol><li><span>负载</span><div><ul><li></li></ul></div></li><li><span>电压输出</span><div>219</div></li><li><span>电量</span><div><ul><li></li><li></li><li></li><li></li><li></li><i></i></ul></div></li></ol></div>')) 
	};

	//	ups()
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