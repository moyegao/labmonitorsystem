(function () {


	var runMainJS = function () {

		function getKeyValue(dataList, keyName, key) {
			for (var i = 0; i < dataList.length; i++) {
				var jsondata = dataList[i];
				if (jsondata[keyName] == key) {
					return jsondata.value;
				}
			}
		}

		//绑定温度湿度数据
		var bindDeviceData = function (data) {
			// console.log(data);
			var ventModel = getKeyValue(data, "name", "气瓶间_排气扇_控制模式");
			var ventWork = getKeyValue(data, "name", "气瓶间_排气扇_启动输出");
			var temp = getKeyValue(data, "name", "气瓶间-环境温湿度温度");
			var hum = getKeyValue(data, "name", "气瓶间-环境温湿度湿度");
			var oxygen = getKeyValue(data, "name", "气瓶间_氧含量_浓度");

			
			// 温度，湿度， 氧气浓度列表
			var tabList = [temp, hum, oxygen];

			for (let i = 0; i < tabList.length; i++) {
				tabList[i] = tabList[i] + '';
				
			}
			console.log(typeof tabList[0]);

			for (let i = 0; i < tabList.length; i++) {
				if (tabList[i].indexOf('.') > -1) {
					var numList = tabList[i].toString().split('.');
					tabList[i] = numList[0] + '.' + numList[1].substring(0, 1);
				} else {
					tabList[i] = tabList[i] + '.0'
				}
				
			}
			temp = tabList[0];
			hum = tabList[1];
			oxygen = tabList[2];

			// var a = oxygen.toString().split('.');
			// if (a[0].length > 1) {
			// 	oxygen = oxygen.toString().substring(0, 4);
			// } else {
			// 	oxygen = oxygen.toString().substring(0, 3);
			// }

			var HTML0 = '<img src="' + (ventWork > 0 ? "assets/icon/fengshanGif.gif" : "assets/icon/fengshan.png") + '" alt=""/><h1>' + (ventModel > 0 ? "手动控制" : "时间控制") + '</h1>';
			var HTML = '<ul><li><p><img src="" alt="" width="20px" height="20px" style=" background: url(assets/icon/bicon.png) no-repeat 6px -40px;"/><span>温度</span></p><p><img src="" alt="" width="20px" height="20px" style=" background:  url(assets/icon/bicon.png) no-repeat -30px -41px;"/><span>湿度</span></p><p><img src="" alt="" width="20px" height="20px" style=" background:  url(assets/icon/bicon.png) no-repeat -230px -80px;"/><span>氧气</span></p></li><li><p id="TH620017052820_1">' + temp + '℃</p><p id="TH620017052820_2">' + hum + '%</p><p id="oxygen">' + oxygen + '%</p></li></ul>';
			$('.gas-system .right-bottom-right').html('');
			$('.gas-system .right-bottom-right').html(HTML);
			$('.gas-system .right-bottom-left').html('');
			$('.gas-system .right-bottom-left').html(HTML0);
		};


		//	value = getKeyValue(data[0],"UPS_电池模式数量");
		//	


		$(document).ready(function () {

			var overviewData, batteryValue;

			var getdeviceOverviewData = function () {
				$.when(
					$.ajax({
						contentType: "application/json",
						url: '../../getdeviceOverviewData.api',
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
					//				console.log(data2[0].data)
					overviewData = data1[0].data;
					upsData = data2[0].data;
					try {
						ventBind(overviewData[0]);
					} catch (e) {
						//TODO handle the exception
						console.log(e);

					}
					try {
						drowPie('pie-pic1', overviewData[0], '风机');
					} catch (e) {
						//TODO handle the exception
						console.log(e);
					}
					try {
						drowPie('pie-pic2', overviewData[0], '排风罩');
					} catch (e) {
						//TODO handle the exception
						console.log(e);
					}
					try {
						drowPie('pie-pic3', overviewData[0], '通风橱');
					} catch (e) {
						//TODO handle the exception
						console.log(e);
					}
					try {
						drawPress(overviewData[1]);
					} catch (e) {
						//TODO handle the exception
						console.log(e);
					}
					try {
						upsApppend(overviewData[2]);
					} catch (e) {
						//TODO handle the exception
						console.log(e);
					}
					try {
						appendElement(overviewData[3]);
					} catch (e) {
						//TODO handle the exception
						console.log(e);
					}

					//					drowPie('pie-pic1',overviewData[0],'风机')
					//					drowPie('pie-pic2',overviewData[0],'排风罩')
					//					drowPie('pie-pic3',overviewData[0],'通风橱')
					//					drawPress(overviewData[1])
					//					upsApppend(upsData,overviewData[2])
					//					appendElement(overviewData[3])
					addSide();
				});

			};
			getdeviceOverviewData();

			var oxygenData;
			//		获取含氧量数据
			var getHourOxygen = function () {
				var url = "../../getHourOxygen.api";
				$.ajax({
					type: "POST",
					url: url,
					contentType: "application/json",
					dataType: "json",
					data: {},
					success: function (response) {
						//					console.log(response)
						oxygenData = response.data;
						drawLine(oxygenData);
					},
					error: function (e) {

					}
				});
			};
			getHourOxygen();
			var DeviceData;
			//		控制模式，温湿度
			var getGongQiDeviceData = function () {
				var url = "../../getGongQiDeviceData.api";
				$.ajax({
					type: "POST",
					url: url,
					contentType: "application/json",
					dataType: "json",
					data: {},
					success: function (response) {
						//					console.log(response)
						DeviceData = response.data;
						bindDeviceData(DeviceData);

					},
					error: function (e) {

					}
				});
			};
			getGongQiDeviceData();


			//		获取报警信息数据
			var AlarmData;
			var getAlarmRealTime = function () {
				var url = "../../getAlarmRealTime.api";
				$.ajax({
					type: "POST",
					url: url,
					contentType: "application/json",
					dataType: "json",
					data: {},
					success: function (response) {
						AlarmData = [];
						AlarmData = response.data;
						// console.log(AlarmData);
						alarmMsgBind(AlarmData);

						// 温湿度、氧气报警
						var oxygenMsg = 'C020002001SGBA1AH01 C020002001SGBA1AG01 C020002001SGBA1AF01 C020002001SGBA1AI01';
						for (var i = 0; i < response.data.length; i++) {
							var code = response.data[i].code;
							if (oxygenMsg.indexOf(code) > -1) {
								$('#oxygen').css('color', 'red');
							} else {
								if (response.data[i].alarmType == 1) {
									$('#' + code).css('color', 'red');
								} else {
									$('#' + code).css('color', 'orange');
								}
							}
						}
						// 活性炭报警
						var huoxingtanMsg = "C020002001SGAG1AG01 C020002001SGAG1AH01 C020002001SGAG1AI01 C020002001SGAG1AF01";
						for (var i = 0; i < response.data.length; i++) {
							var code = response.data[i].code;

							if (huoxingtanMsg.indexOf(code) > -1 && response.data[i].value == 1) {

								$('#baojing').attr('fill', '#FA3232');
							} else {
								$('#baojing').attr('fill', '#07C260');
							}

						}


					},
					error: function (e) {}
				});
			};
			getAlarmRealTime();

			//		报警信息绑定
			var timer;
			var alarmMsgBind = function (data) {
				var a = 0;
				var HTML = '';
				clearInterval(timer);
				$('.alarm-msg').html('');
				for (var i = 0; i < data.length; i++) {
					HTML += '<li><div>' + data[i].name + '</div><p>' + data[i].time.split('.')[0] + '</p></li>';
				}
				$('.alarm-msg').html(HTML);

				// 消除报警信息最后一个数据的下划线
				// $('.alarm-msg').find('li').eq(5).css('border-bottom', 'none');

				// 报警信息栏滚动条的显示与隐藏
				if (data.length >= 7) {
					$(".alarm-msg").css("overflow-y", "hidden");
					$(".alarm-msg").hover(function () {
						$(".alarm-msg").css("overflow-y", "scroll");
					}, function () {
						$(".alarm-msg").css("overflow-y", "hidden");
					})
				} else {
					$(".alarm-msg").css("overflow-y", "hidden");
				}

				timer = setInterval(function () {

					if (a == 1) {
						clearInterval(timer);
					} else {
						var $firstLi = $('.alarm-msg li').splice(0, 1);
						$('.alarm-msg').append($firstLi);
					}
					a++;
					// 消除报警信息最后一个数据的下划线
					// for (var i = 0; i < data.length; i++) {
					// 	if (i == 5) {
					// 		$('.alarm-msg').find('li').eq(i).css('border-bottom', 'none');
					// 	} else {
					// 		$('.alarm-msg').find('li').eq(i).css('border-bottom', ' 1px solid #414860');
					// 	}

					// }

				}, 20000);


			};


			//	设置字体大小
			var setFont = function () {
				var docEl = document.documentElement;
				var clientWidth = docEl.clientWidth;
				docEl.style.fontSize = 20 * (clientWidth / 1920) + 'px';
				//			console.log(docEl.style.fontSize)
			};
			setFont();

			//	绘制界面标题事件
			var drowTitle = function () {
				var titleBox = document.querySelector('.main-title');
				if (!titleBox)
					return;
				var width = titleBox.clientWidth;
				var height = titleBox.clientHeight;
				//			console.dir(titleBox)
				var c = document.getElementById("myCanvas");
				//			console.dir(c)
				c.height = (height - 0) * 0.65;
				c.width = width;
				var ctx = c.getContext("2d");
				//			console.log(document.documentElement.style.fontSize)
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

			//		设置当前日期时间函数
			var getDaytime = function () {
				var dateNow = new Date();
				//			console.log(dateNow.getFullYear(),dateNow.getMonth(),dateNow.getDay(),dateNow.getTime(),dateNow.getHours(),dateNow.getMinutes(),dateNow.getSeconds())
				var nowDatetime = dateNow.getFullYear() + '-' + ((dateNow.getMonth() + 1) >= 10 ? (dateNow.getMonth() + 1) : '0' + (dateNow.getMonth() + 1)) + '-' + (dateNow.getDate() >= 10 ? dateNow.getDate() : '0' + dateNow.getDate()) + ' ' + (dateNow.getHours() >= 10 ? dateNow.getHours() : '0' + dateNow.getHours()) + ':' + (dateNow.getMinutes() >= 10 ? dateNow.getMinutes() : '0' + dateNow.getMinutes()) + ':' + (dateNow.getSeconds() >= 10 ? dateNow.getSeconds() : '0' + dateNow.getSeconds());
				//			console.log(nowDatetime)
				$('.main-screen .main-time').html(nowDatetime);
			};
			getDaytime();
			setInterval(function () {
				getDaytime();
			}, 1000);



			//		格式化饼图绑定数据
			var formatPie = function (data, title) {
				var outputData = {};
				outputData.title = title;
				outputData.name = [];
				outputData.value = [];
				for (var i = 0; i < data.length; i++) {
					if (data[i].sensorName.indexOf(title) > -1) {
						if (['报警数量', '停止数量', '运行数量'].indexOf(data[i].sensorName.split('_')[1]) > -1) {
							var itemName = data[i].sensorName.split('_')[1].substr(0, 2) + ':' + data[i].value + '台';
							//						console.log(itemName)
							outputData.name.push({
								name: itemName,
								icon: 'circle'
							});
							outputData.value.push({
								name: itemName,
								value: data[i].value
							});
						}
					}
				}
				//			console.log(outputData.name)
				return outputData;
			};

			//绘制饼图
			var drowPie = function (id, data, key) {
				var formatData = formatPie(data, key);
				var dom = document.getElementById(id);
				if (!dom)
					return;
				var myChart = echarts.init(dom);
				var app = {};
				option = null;
				app.title = '环形图';
				option = {
					//		    tooltip: {
					//		        trigger: 'item',
					//		        formatter: "{a} <br/>{b}: {c} ({d}%)"
					//		    },
					title: {
						x: 'center',
						y: '28%',
						show: true,
						text: formatData.title,
						textStyle: {
							color: '#999999',
							fontSize: '90%',
							align: 'center',
							fontWeight: 'normal'
						},
					},
					color: ['#07C260', '#808080', '#fa3232'],
					legend: {
						orient: 'vertical',
						x: 'center',
						y: 'bottom',
						itemGap: 2,
						textStyle: {
							color: '#999999',
							fontSize: '60%',
							align: 'center',
							fontWeight: 'normal'
						},
						data: formatData.name
						//		        data:['直接访问','邮件营销','联盟广告']
					},

					series: [{
						name: '访问来源',
						type: 'pie',
						radius: ['65%', '85%'],
						center: ['50%', '35%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: false,
								position: 'center'
							},
							emphasis: {
								show: false,
								textStyle: {
									fontSize: '30',
									fontWeight: 'bold'
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						data: formatData.value
					}]
				};
				if (option && typeof option === "object") {
					//			myChart.clear();
					myChart.setOption(option, true);
					myChart.resize();
				}
			};
			//格式化风车数据
			var formatVent = function (data) {
				var ventData = [{
					name: "424有机试剂柜"
				}, {
					name: "401试剂仓库"
				}, {
					name: "431配电室"
				}];
				for (var i = 0; i < data.length; i++) {
					if (data[i].sensorName.indexOf('排气扇') > 0) {
						if (data[i].sensorName.indexOf('424') > 0) {
							ventData[0][data[i].sensorName.split('_')[2]] = data[i].value;
						} else if (data[i].sensorName.indexOf('401') > 0) {
							ventData[1][data[i].sensorName.split('_')[2]] = data[i].value;
						} else if (data[i].sensorName.indexOf('431') > 0) {
							ventData[2][data[i].sensorName.split('_')[2]] = data[i].value;
						}
					}
				}
				//			console.log(ventData)
				return ventData;
			};

			//		风车数据绑定
			var ventBind = function (data) {
				// console.log(data);
				var ventData = formatVent(data);
				// console.log(ventData);
				var $ventLi = $('.vent-section ol');
				var HTML = '';
				for (var i = 0; i < ventData.length; i++) {
					HTML += '<li><img src="' + (ventData[i]['启动'] > 0 ? "assets/icon/fengshanGif.gif" : "assets/icon/fengshan.png") + '" alt=""/><p>' + ventData[i].name + '</p><h1>' + (ventData[i]['控制模式'] > 0 ? "手动控制" : "时间控制") + '</h1></li>';
				}

				$ventLi.html(HTML);

			};





			//绘制供气压力图
			var drawPress = function (data) {
				var nameData = [],
					valueData = [],
					value = [];

				for (var i = 0; i < data.length; i++) {
					if (data[i].name.indexOf('压力') > -1) {
						//nameData.push(data[i].name.split('_')[1])
						nameData.push(data[i].sensorName);
						valueData.push(parseInt(data[i].value * 100));
						value.push(parseInt(data[i].value * 100) + '%');
					}
				}
				nameData = nameData.reverse();
				valueData = valueData.reverse();
				value = value.reverse();
				var dom = document.querySelector('.gas-left');
				if (!dom)
					return;
				var myChart = echarts.init(dom);
				var app = {};
				option = null;
				//			定义基准颜色
				var baseColor = ['gray', 'red', 'orange', 'yellow', '#07C260'];


				$.ajax({
					type: "POST",
					url: "../../getGongQiAlarm.api",
					contentType: "application/json",
					dataType: "json",
					data: {},
					success: function (res) {
						console.log(res);
						var myColor = ['#07C260', '#07C260', '#07C260', '#07C260', '#07C260', 'gray', '#07C260'];
						var qipingColorChange = function (data, index) {

							if (data.code.indexOf('I') > -1 && data.value == 1) {
								myColor[index] = 'purple';
							} else if (data.code.indexOf('H') > -1 && data.value == 1) {
								myColor[index] = 'red';
							} else if (data.code.indexOf('J') > -1 && data.value == 1) {
								myColor[index] = 'orange';
							}
						};

						for (var i = 0; i < res.data.length; i++) {
							if (res.data[i].name.indexOf('氦气压1') > -1) {
								qipingColorChange(res.data[i], 6);
							} else if (res.data[i].name.indexOf('氦气压2') > -1) {
								qipingColorChange(res.data[i], 5);
							} else if (res.data[i].name.indexOf('氩气压1') > -1) {
								qipingColorChange(res.data[i], 4);
							} else if (res.data[i].name.indexOf('氩气压2') > -1) {
								qipingColorChange(res.data[i], 3);
							} else if (res.data[i].name.indexOf('氮气压1') > -1) {
								qipingColorChange(res.data[i], 2);
							} else if (res.data[i].name.indexOf('氮气压2') > -1) {
								qipingColorChange(res.data[i], 1);
							} else if (res.data[i].name.indexOf('空气压') > -1) {
								qipingColorChange(res.data[i], 0);
							}

						}


						function widthChange(name) {
							var screenH = window.screen.height; //获取屏幕高度
							if (screenH <= '768') {

								if (name == '条') {
									return 4;
								} else if (name == '白框') {
									return 10;
								} else if (name == '外框') {
									return 12;
								} else if (name == '外圆') {
									return 15;
								}
							} else {

								if (name == '条') {
									return 6
								} else if (name == '白框') {
									return 16;
								} else if (name == '外框') {
									return 18;
								} else if (name == '外圆') {
									return 20;
								}
							}
						};

						option = {
							//		    backgroundColor: '#0e2147',
							title: {
								x: 'center',
								y: '3%',
								show: true,
								text: '供气压力',
								textStyle: {
									color: '#fff',
									fontSize: '70%',
									align: 'center',
									fontWeight: 'normal'
								},
							},
							grid: {
								left: '11%',
								top: '12%',
								right: '8%',
								bottom: '0%',
								containLabel: true
							},
							xAxis: [{
								show: false,
							}],
							yAxis: [{
								axisTick: 'none',
								axisLine: 'none',
								offset: '27',
								axisLabel: {
									textStyle: {
										color: '#ffffff',
										fontSize: '70%',
									}
								},
								data: nameData
							}, {
								axisTick: 'none',
								axisLine: 'none',
								axisLabel: {
									textStyle: {
										color: '#ffffff',
										fontSize: '70%',
									}
								},
								data: value
							}, {
								name: '',
								nameGap: '50',
								nameTextStyle: {
									color: 'transparent',
									fontSize: '70%',
								},
								axisLine: {
									lineStyle: {
										color: 'rgba(0,0,0,0)'
									}
								},
								data: [],
							}],
							series: [{
									name: '条',
									type: 'bar',
									yAxisIndex: 0,
									data: valueData,
									barWidth: widthChange('条'),
									itemStyle: {
										normal: {
											color: function (params) {
												return myColor[params.dataIndex];
											},
										}
									},
									z: 2
								}, {
									name: '白框',
									type: 'bar',
									yAxisIndex: 1,
									barGap: '-100%',
									data: [99.5, 99.5, 99.5, 99.5, 99.5, 99.5, 99.5],
									barWidth: widthChange('白框'),
									itemStyle: {
										normal: {
											color: '#0e2147',
											barBorderRadius: 5,
										}
									},
									z: 1
								}, {
									name: '外框',
									type: 'bar',
									yAxisIndex: 2,
									barGap: '-100%',
									data: [100, 100, 100, 100, 100, 100, 100],
									barWidth: widthChange('外框'),
									itemStyle: {
										normal: {
											color: function (params) {
												// var num = myColor.length;
												return myColor[params.dataIndex];
											},
											barBorderRadius: 5,
										}
									},
									z: 0
								},
								{
									name: '外圆',
									type: 'scatter',
									hoverAnimation: false,
									data: [0, 0, 0, 0, 0, 0, 0],
									yAxisIndex: 1,
									symbolSize: widthChange('外圆'),
									itemStyle: {
										normal: {
											color: function (params) {
												// var num = myColor.length;
												return myColor[params.dataIndex];
											},
											opacity: 1,
										}
									},
									z: 2
								}
							]
						};
						if (option && typeof option === "object") {
							//			myChart.clear();
							myChart.setOption(option, true);
							myChart.resize();
						}


					},
					error: function (err) {
						console.log(err);
					}
				});

				//			通过数据处理颜色
				// for (var j = 0; j < valueData.length; j++) {
				// 	if (nameData[j] == "氮气瓶2") {
				// 		if (33.33 < valueData[j] && valueData[j] <= 100) {
				// 			myColor.push('#07C260');
				// 		} else if (25 < valueData[j] && valueData[j] <= 33.3) {
				// 			myColor.push('yellow');
				// 		} else if (valueData[j] == 0) {
				// 			myColor.push('gray');
				// 		} else {
				// 			myColor.push('red');
				// 		}
				// 	} else {
				// 		if (20 < valueData[j] && valueData[j] <= 100) {
				// 			myColor.push('#07C260');
				// 		} else if (7.3 < valueData[j] && valueData[j] <= 20) {
				// 			myColor.push('yellow');
				// 		} else if (valueData[j] == 0) {
				// 			myColor.push('gray');
				// 		} else {
				// 			myColor.push('red');
				// 		}
				// 	}
				// 	//				console.log(valueData[i])

				// 	//				var number;
				// 	//				number = valueData[i]/25;
				// 	//				number = number>0?Math.ceil(number):number
				// 	//				myColor.push(baseColor[number])
				// }
				//			console.log(myColor)
				//			var myColor = ['red', 'yellow', 'orange', '#07C260', 'gray', '#00e9db', '#00c0e9', '#0096f3', '#9F9F9F', '#33FFCC'];


			};



			var drawLine = function (data) {
				var safeData = [];
				var oxygenData = [];
				var time = [];
				for (var i = 0; i < data.length; i++) {
					safeData.push(20);
					oxygenData.push(data[i].value);
					time.push(data[i].time);
				}
				var dom = document.querySelector('.gas-right-top');
				if (!dom)
					return;
				var myChart = echarts.init(dom);
				var app = {};
				option = null;
				option = {
					title: {
						x: 'center',
						y: '6%',
						show: true,
						text: '气瓶间环境',
						textStyle: {
							color: '#fff',
							fontSize: '70%',
							align: 'center',
							fontWeight: 'normal'
						},
					},
					tooltip: {
						trigger: 'axis'
					},
					color: ['#fa840f', '#00d640', '#fa3232'],
					grid: {
						left: '11%',
						top: '24%',
						right: '4%',
						bottom: '6%',
						containLabel: true
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						axisLine: {
							lineStyle: {
								color: "#fff",
							}
						},
						data: time
					},

					yAxis: {
						name: '(O₂)',
						type: 'value',

						max: 25,
						min: 15,
						splitNumber: 2,

						axisLine: {
							lineStyle: {
								color: "#fff",
							}
						},
						axisLabel: {
							formatter: '{value}%'
						},
						splitLine: {
							show: false
						},
						data: [0, 10, 100]
					},
					//				 yAxis : [
					//			        {
					//			            type : 'category',
					//			            axisLine : {onZero: false},
					//			            axisLabel : {
					//			                formatter: '{value} km'
					//			            },
					//			            boundaryGap : false,
					//			            data : ['0', '20','100']
					//			        }
					//			    ],
					series: [{
							name: '氧含量',
							data: oxygenData,
							type: 'line',
							smooth: true
						},
						{
							name: '安全值',
							type: 'line',
							data: safeData,
							//			            lineStyle:{
							//			            	type:'dashed'
							//			            }
						}
					]
				};
				if (option && typeof option === "object") {
					//			myChart.clear();
					myChart.setOption(option, true);
					myChart.resize();
				}
			};



			//		温湿度监控系统li填充元素
			var appendElement = function (data) {
				var HTML = '<li class="has-side"><div class="li-top"><img src="" alt="" width="20px" height="20px" style=" background:  url(assets/icon/bicon.png) no-repeat -67px -39px;"/><span>' + data[0].sensorName + '</span></div><ol><li><div class="top ' + (data[0].normal > 0 ? "green" : "gray") + '">正常 </div><div class="bottom" style="color:' + (data[0].normal > 0 ? "#07C260" : "#fff") + '">' + data[0].normal + '</div></li><li><div class="top ' + (data[0].online > 0 ? "greenT" : "grayT") + '">在线 </div><div class="bottom" style="color:' + (data[0].online > 0 ? "#07C260" : "#fff") + '">' + data[0].online + ' </div></li><li><div class="top ' + (data[0].alarm > 0 ? "red" : "gray") + '">报警 </div><div class="bottom" style="color:' + (data[0].alarm > 0 ? "red" : "#fff") + '">' + data[0].alarm + '</div></li><li><div class="top ' + (data[0].offOnline > 0 ? "oragneT" : "grayT") + '">离线 </div><div class="bottom" style="color:' + (data[0].offOnline > 0 ? "#F68A0A" : "#fff") + '">' + data[0].offOnline + ' </div></li></ol></li><li class="has-side"><div class="li-top"><img src="" alt="" width="20px" height="20px" style=" background:  url(assets/icon/bicon.png) no-repeat -109px -41px;"/><span>' + data[1].sensorName + '</span></div><ol><li><div class="top ' + (data[1].normal > 0 ? "green" : "gray") + '">正常 </div><div class="bottom" style="color:' + (data[1].normal > 0 ? "#07C260" : "#fff") + '">' + data[1].normal + '</div></li><li><div class="top ' + (data[1].online > 0 ? "greenT" : "grayT") + '">在线 </div><div class="bottom" style="color:' + (data[1].online > 0 ? "#07C260" : "#fff") + '">' + data[1].online + ' </div></li><li><div class="top ' + (data[1].alarm > 0 ? "red" : "gray") + '">报警 </div><div class="bottom" style="color:' + (data[1].alarm > 0 ? "red" : "#fff") + '">' + data[1].alarm + '</div></li><li><div class="top ' + (data[1].offOnline > 0 ? "oragneT" : "grayT") + '">离线 </div><div class="bottom" style="color:' + (data[1].offOnline > 0 ? "#F68A0A" : "#fff") + '">' + data[1].offOnline + ' </div></li></ol></li><li class="has-side"><div class="li-top"><img src="" alt="" width="20px" height="20px" style=" background:  url(assets/icon/bicon.png) no-repeat -149px -40px;"/><span>' + data[2].sensorName + '</span></div><ol><li><div class="top ' + (data[2].normal > 0 ? "green" : "gray") + '">正常 </div><div class="bottom" style="color:' + (data[2].normal > 0 ? "#07C260" : "#fff") + '">' + data[2].normal + '</div></li><li><div class="top ' + (data[2].online > 0 ? "greenT" : "grayT") + '">在线 </div><div class="bottom" style="color:' + (data[2].online > 0 ? "#07C260" : "#fff") + '">' + data[2].online + ' </div></li><li><div class="top ' + (data[2].alarm > 0 ? "red" : "gray") + '">报警 </div><div class="bottom" style="color:' + (data[2].alarm > 0 ? "red" : "#fff") + '">' + data[2].alarm + '</div></li><li><div class="top ' + (data[2].offOnline > 0 ? "oragneT" : "grayT") + '">离线 </div><div class="bottom" style="color:' + (data[2].offOnline > 0 ? "#F68A0A" : "#fff") + '">' + data[2].offOnline + ' </div></li></ol></li>';
				$('.wet-section>ul').html('');
				$('.wet-section>ul').html(HTML);
				//		$('.wet-section ol li').html('');
				//		$('.wet-section ol li').append($('<div class="top">正常</div><div class="bottom" style="color:#07C260">8</div>'))
			};
			//	appendElement()

			//	格式化ups数据
			// var formatUps = function (upsData, data) {
			// 	var nameArr = ['1#UPS  LC-MS/MS', '2#UPS  ICP-MS', '3#UPS  LC', '4#UPS  GC-MS', '5#UPS  GC-MS/MS', '6#UPS  ICP-OES'];
			// 	for (var i = 0; i < upsData.length; i++) {
			// 		var upsName = upsData[i].name.substring(2, 10);
			// 		//			console.log(upsName)
			// 		for (var j = 0; j < data.length; j++) {
			// 			if (data[j].sensorName.indexOf(upsName) > 0) {
			// 				//					upsData[i]['upsName'] = upsName.split('_').join('');
			// 				upsData[i].upsName = nameArr[i];
			// 				upsData[i][(data[j].sensorName.split('_')[2])] = data[j].value;
			// 			}
			// 		}
			// 	}
			// 	console.log(upsData);
			// 	return upsData;
			// };
			// //	ups系统填充
			var upsApppend = function (data) {

				for (var i = 0; i < data.length; i++) {
					if (data[i].sensorName.indexOf('供电模式') > -1) {
						colorChange(data[i]);
					} else if (data[i].sensorName.indexOf('通讯失败') > -1) {
						console.log(data[i]);
						if (data[i].value == 1) {
							for (let j = 0; j < 4; j++) {
								$('.' + data[i].sensor).find("image:eq(" + j + ")").attr('xlink:href', './assets/icon/默认.png');
							}
						}
					}
				}

			};

			var colorChange = function (data) {
				var sensor = data.sensor;
				var value = data.value;
				for (let i = 0; i < 4; i++) {
					$('#' + sensor).find("image:eq(" + i + ")").attr('xlink:href', './assets/icon/默认.png');
				}
				if (value == 1) {
					$('#' + sensor).find("image:eq(0)").attr('xlink:href', './assets/icon/正常.png');
				} else if (value == 2) {
					$('#' + sensor).find("image:eq(1)").attr('xlink:href', './assets/icon/电池旁路.png');
				} else if (value == 3) {
					$('#' + sensor).find("image:eq(2)").attr('xlink:href', './assets/icon/电池旁路.png');
				} else if (value == 4) {
					$('#' + sensor).find("image:eq(3)").attr('xlink:href', './assets/icon/故障.png');
				}
			};


			//		添加边角
			var addSide = function () {
				var $hasSide = $('.has-side');
				for (var i = 0; i < $hasSide.length; i++) {
					//				console.log($hasSide.eq(i).find('.side-left-top')[0])
					if ($hasSide.eq(i).find('.side-left-top')[0]) {

					} else {
						$('.has-side').eq(i).append($('<sub class="side-left-top"></sub><sub class="side-right-top"></sub><sub class="side-left-bottom"></sub><sub class="side-right-bottom"></sub>'));
					}
				}


			};

			// 滚动条显示
			// $(".section-right").mouseout(function () {
			// 	console.log('显示');
			// 	$(".alarm-msg::-webkit-scrollbar-thumb").css("background", "gray");
			// });
			// // 滚动条隐藏
			// $(".section-right").mouseleave (function () {
			// 	console.log('隐藏');
			// 	$(".alarm-msg::-webkit-scrollbar-thumb").css("background", "#040D2E");
			// });

			//window添加监听窗口变化事件	
			$(window).resize(function () { //动态监听监听网页窗口变化
				setFont();
				//			drowTitle()
				drowPie('pie-pic1', overviewData[0], '风机');
				drowPie('pie-pic2', overviewData[0], '排风罩');
				drowPie('pie-pic3', overviewData[0], '通风橱');
				drawPress(overviewData[1]);
				// upsApppend(upsData, overviewData[2]);
				drawLine(oxygenData);
				bindDeviceData(DeviceData);
				addSide();
			});
		});
	};
	
	runMainJS();
	 var refresh = setInterval(function () {
	 	runMainJS();
	 }, 40000);
	 if (window.location.href.indexOf('upsSystem') > -1) {
	 	clearInterval(refresh);
	 }

})();