// const baseUrl = 'http://localhost:8089/'
const baseUrl = 'https://read.youngbird97.top/'
const pathArr = ['pages/index/index','pages/shop/shop/shop','pages/shop/product_detail/product_detail',
'pages/shop/cart/cart','pages/user/index/index',"pages/auth/login/login"]; // 不需要登录的路径
// const baseUrl = 'https://read.youngbird97.top/'
let isRefreshing = true; // 请求锁
let pendings = []; // 请求列表
// const loginPage = "/pages/auth/login/login";
const loginPage = "/pages/user/index/index";
const showToast = (title) => {
    uni.showToast({
        title: title,
        icon: 'none'
    })
}

/**请求接口
 * @method http
 * @param {String} url 接口地址
 * @param {Object} data 接口参数
 * @param {Object} option 接口配置信息，可选
 * @return {Object} Promise
 */
const http = (url, data = {}, option = {}) => {
    let hideLoading = option.hideLoading || false // 是否显示 loading
    let hideMsg = option.hideMsg || false // 是否隐藏错误提示
	let token =  uni.getStorageSync('Token') || '';
	const pages = getCurrentPages();
	const router = pages[pages.length - 1]['route']; // 当前路由
	option.needLogin = true;
	if (pathArr.indexOf(router) != -1) option.needLogin = false; // 当前路径是否需要登录
	
	// 需要登录 但是 token不存在 跳转登录
	if (token === '' && option.needLogin) {
		getApp().globalData.hasLogin = false;
		uni.reLaunch({
			url: loginPage,
		})
		return
	}
	
    if (!hideLoading) {
        uni.showLoading({
            title: '加载中...',
            mask: true
        })
    }
    return new Promise((resolve, reject) => {
        uni.request({
            url: baseUrl + url,
            method: option.method || 'POST', // 默认 post 请求
            header: {
                'Token': token,
            },
            data: data,
            success: res => { // 服务器成功返回的回调函数
                if (!hideLoading) uni.hideLoading()
				
				
                if (res.statusCode === 200 || res.statusCode === 201) {
                    let result = res.data
					console.info(result)
					if(result.code === -1){
						// 登陆信息过期
						showToast(result.msg )
						setTimeout(function() {
							uni.reLaunch({
								url: loginPage
							})
						}, 2000);
						return
					}
                    if (result.code === 200 || result.code === 404 || result.code === 40164) {
                        resolve(result)
                        return
                    }
                    reject(result.errmsg)
                    if (!hideMsg) showToast(result.errmsg)
                } else { // 返回值非 200，强制显示提示信息
                    showToast('[' + res.statusCode + '] 系统处理失败')
                    reject('[' + res.statusCode + '] 系统处理失败')
                }
            },
            fail: (err) => { // 接口调用失败的回调函数
				console.info(err)
                if (!hideLoading) uni.hideLoading()
                if (err.errMsg != 'request:fail abort') {
                    showToast('连接超时，请检查您的网络。')
                    reject('连接超时，请检查您的网络。')
                }
            }
        })
    })
}


//微信登录
export const wxLogin = (entUser) => {
	return new Promise((resolve, reject) => {
		let myApp = this;
		uni.login({
			provider: 'weixin',
			success: function(res) {
				console.info("weixinLogin"+res);
				http('wx/login', {
					'code': res.code,
					'encryptedData':entUser.encryptedData,
					'iv':entUser.iv,
					'signature':entUser.signature,
					'avatarUrl':myApp.customer.avatarUrl 
				}, {
					hideLoading: false, // 默认 false
					hideMsg: true, // 默认 false
					method: 'POST' // 默认 POST
				}).then(res => {
					myApp.hasLogin = true;
					//将openid存入本地缓存
					uni.setStorage({
						key: 'customer',
						data: res.data,
						success: function () {
							myApp.customer = res.data;
						},
					});
					uni.setStorageSync('Token',res.data.token);
				
				}).catch(err => {
					console.error(err)
				})
			}	
			,fail(e) {
				console.log(e);
			}
			,complete(e) {
				console.log(e);
			}
		});

	})
}

export default http
