const app = getApp();
Page({
	data: {
		error: '',
		dialogShow: false,
		buttons: [{ text: '开球' }],
		date: '1990-06-15',
		user: {
			_id: '',
			openid: '',
			name: '',
			height: '',
			weight: '',
			birthday: new Date(),
			foot: true,
			positional: []
		},
		lstPosition: [
			{ name: '前锋 ST', value: 'ST', },
			{ name: '边锋 LW/RW', value: 'LW/RW' },
			{ name: '前腰 CAM', value: 'CAM' },
			{ name: '中前卫 CM', value: 'CM' },
			{ name: '边前卫 LM/RM', value: 'LM/RM' },
			{ name: '后腰 CDM', value: 'CDM' },
			{ name: '边翼卫 LWB/RWB', value: 'LWB/RWB' },
			{ name: '中后卫 CB', value: 'CB' },
			{ name: '边后卫 LB/RB', value: 'LB/RB' },
			{ name: '守门员 GK', value: 'GK' },
		],
		rules: [
			{ name: '_id', rules: { required: false } },
			{ name: 'openid', rules: { required: true, message: '未能取得openid' } },
			{ name: 'playerid', rules: { required: false } },
			{ name: 'name', rules: { required: true, message: '姓名必填' } },
			{
				name: 'height', rules: [
					{ required: true, message: '身高必填' },
					{ range: [50, 250], message: '身高不正确' }]
			},
			{
				name: 'weight', rules: [
					{ required: true, message: '体重必填' },
					{ range: [30, 150], message: '体重不正确' }],
			},
			{ name: 'birthday', rules: { required: true, message: '生日必填' } },
			{ name: 'foot', rules: { required: false } },
			{ name: 'positional', rules: { required: false } },
			{ name: 'createtime', rules: { required: false } },
			{ name: 'updater', rules: { required: false } },
			{ name: 'updatetime', rules: { required: false } }
		]
	},
  /**
   * 生命周期函数--监听页面加载
   */
	onLoad: function () {
		wx.showLoading({
			title: '',
			mask: true
		})
		// 获取首页
		let pages = getCurrentPages();
		let indexPage = pages[0];
		let user = indexPage.data.user;
		if (user._id) {
			// 用户已登录，使用首页的用户信息
			let lstPosition = this.getInitPositional(user.positional);
			this.setData({
				date: app.formatDate(user.birthday, 'yyyy-MM-dd'),
				lstPosition: lstPosition,
				user: user
			})
			wx.hideLoading();
		} else {
			// 用户未登录，根据openid查询用户信息
			let openid = indexPage.data.openid;
			wx.cloud.callFunction({
				name: 'yun',
				data: {
					controller: 'user',
					action: 'getByOpenid',
					data: {
						openid: openid
					}
				}
			}).then(res => {
				console.log('获取用户信息成功', res);
				if (res.result.data.length > 0) {
					// 用户信息存在，使用用户信息
					user = res.result.data[0];
					let lstPosition = this.getInitPositional(user.positional);
					this.setData({
						date: app.formatDate(user.birthday, 'yyyy-MM-dd'),
						lstPosition: lstPosition,
						user: user
					})
				} else {
					// 用户信息不存在，只给openid赋值
					this.setData({
						[`user.openid`]: openid
					})
				}
				wx.hideLoading();
			}).catch(err => {
				console.log('获取用户信息失败', err);
				wx.hideLoading();
			})
		}
	},
	// 文本框输入事件
	formInputChange: function (e) {
		const { field } = e.currentTarget.dataset
		this.setData({
			[`user.${field}`]: e.detail.value
		})
	},
	// 擅长位置选择事件
	bindPositionChange: function (e) {
		let lstPosition = this.data.lstPosition;
		let selValues = e.detail.value;
		lstPosition.forEach(position => {
			position.checked = false;
			if (selValues.indexOf(position.value) > -1) {
				position.checked = true;
				return;
			}
		});
		this.setData({
			lstPosition: lstPosition
		});
	},
	// 生日选择事件
	bindDateChange: function (e) {
		this.setData({
			date: e.detail.value,
			[`user.birthday`]: e.detail.value
		})
	},
	// 性别选择事件
	bindFootChange: function (e) {
		this.setData({
			[`user.foot`]: e.detail.value ? true : false
		})
	},
	// 初始化擅长位置
	getInitPositional(positional) {
		let lstPosition = this.data.lstPosition;
		lstPosition.forEach(position => {
			positional.forEach(userPosition => {
				if (position.value === userPosition.position) {
					position.checked = true;
				}
			});
		});
		return lstPosition;
	},
	// 保存
	submitForm() {
		this.selectComponent('#form').validate((valid, errors) => {
			if (!valid) {
				const firstError = Object.keys(errors)
				if (firstError.length) {
					this.setData({
						error: errors[firstError[0]].message
					})
				}
			} else {
				wx.showLoading({
					title: '',
					mask: true
				})
				// 统计擅长位置
				let lstPosition = [];
				this.data.lstPosition.forEach(position => {
					if (position.checked) {
						lstPosition.push({ 'position': position.value, 'name': position.name });
					}
				});
				this.setData({
					[`user.positional`]: lstPosition
				})
				if (this.data.user._id) {
					// 更新用户
					this.setData({
						[`user.updater`]: this.data.user.playerid
					})
					wx.cloud.callFunction({
						name: 'yun',
						data: {
							controller: 'user',
							action: 'update',
							data: this.data.user
						}
					}).then(res => {
						// 正确的执行结果
						console.log('更新用户成功', res);
						wx.navigateBack({
							delta: 1
						})
						wx.hideLoading();
					}).catch(err => {
						// 错误的执行结果
						console.log('更新用户失败', err);
						wx.hideLoading();
					})
				} else {
					// 新增用户
					wx.cloud.callFunction({
						name: 'yun',
						data: {
							controller: 'user',
							action: 'add',
							data: this.data.user
						}
					}).then(res => {
						console.log('新增用户成功', res);
						this.setData({
							dialogShow: true
						})
						wx.hideLoading();
					}).catch(err => {
						console.log('新增用户失败', err);
						wx.hideLoading();
					})
				}
			}
		})
	},
	// 保存成功弹窗按钮点击事件
	tapDialogButton(e) {
		wx.navigateBack({
			delta: 2
		})
	}
});