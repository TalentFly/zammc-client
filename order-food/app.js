'use strict';

/**
 * API module
 * @type {Object}
 * 用于将微信官方`API`封装为`Promise`方式
 * > 小程序支持以`CommonJS`规范组织代码结构
 */
var wechat = require('./utils/wechat');
var Promise = require('./utils/bluebird');

App({
  /**
   * Global shared
   * 可以定义任何成员，用于在整个应用中共享
   */
  data: {
    name: 'WeApp Boilerplate',
    version: '0.1.0',
    userInfo: null
  },

  // 不是只能定义`data`，别的也可以
  other: 'other variables',

  /**
   * 获取用户信息
   * @return {Promise} 包含获取用户信息的`Promise`
   */
  getUserInfo: function getUserInfo() {
    var _this = this;

    return new Promise(function (resolve, reject) {
      if (_this.data.userInfo) return reject(_this.data.userInfo);
      wechat.login().then(function () {
        return wechat.getUserInfo();
      }).then(function (res) {
        return res.userInfo;
      }).then(function (info) {
        return _this.data.userInfo = info;
      }).then(function (info) {
        return resolve(info);
      }).catch(function (error) {
        return console.error('failed to get user info, error: ' + error);
      });
    });
  },

  globalData: {
    appid: 'wx0153b3ce8f036ea7',//appid需自己提供，此处的appid我随机编写  
    secret: '15bd07b532654e3b586203c754b1f558',//secret需自己提供，此处的secret我随机编写
  },  

  /**
   * 生命周期函数--监听小程序初始化
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function onLaunch() {
    console.log(' ========== Application is launched ========== ');
    var that = this
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};
    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.getUserInfo({
              success: function (res) {
                var objz = {};
                objz.avatarUrl = res.userInfo.avatarUrl;
                objz.nickName = res.userInfo.nickName;
                //console.log(objz);  
                wx.setStorageSync('userInfo', objz);//存储userInfo  
              }
            });
            var d = that.globalData;//这里存储了appid、secret、token串    
            var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
            wx.request({
              url: l,
              method: 'GET', 
              success: function (res) {
                var obj = {};
                obj.openid = res.data.openid;
                obj.expires_in = Date.now() + res.data.expires_in;
                console.log(obj);  
                wx.setStorageSync('user', obj);//存储openid
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
  },

  /**
   * 生命周期函数--监听小程序显示
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function onShow() {
    console.log(' ========== Application is showed ========== ');
  },

  /**
   * 生命周期函数--监听小程序隐藏
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function onHide() {
    console.log(' ========== Application is hid ========== ');
  }
});
//# sourceMappingURL=app.js.map
