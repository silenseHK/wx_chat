// pages/login/login.js

const app = getApp();
const ws = require("../../utils/ws.js");
const http = require("../../utils/http.js");
const func = require("../../utils/func.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar : '/images/EXM.png',
    is_login: false,
    nickname: '????????'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if(app.globalData.client_id){
      wx.redirectTo({
        url: '/pages/friend/friend',
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  login(){
    // ws.wsConnect();
    wx.getUserInfo({
      complete: (res) => {
        console.log(res)
      },
    })
  },

  bindgetuserinfo(res){
    let [that, userInfo] = [this, res.detail.userInfo];
    let [avatar, nickname] = [userInfo.avatarUrl, userInfo.nickName];
    wx.login({
      complete: (res) => {
        let code = res.code;
        http.Post('/index/login',{code, avatar, nickname}).then((res)=>{
          console.log(res)
          let data = res.data
          if(res.data.status == 0){
            func.Toast(data.msg);
          }else{
            userInfo.uid = data.data.user_id
            app.globalData.userInfo =userInfo
            that.setData({avatar, is_login: true, nickname})

            ws.wsConnect();
            wx.onSocketMessage(function(res){
              let data = res.data;
              data = JSON.parse(data)
              let [type] = [data.type]
              console.log(data)
              switch(type){
                case 'LOGIN':
                  that.bindUidClientId(data)
                  break;
                case 'SUCCESS_RETURN':
                  wx.redirectTo({
                    url: '/pages/friend/friend',
                  })
                  break;
              }
            })
          }
          
        },(err)=>{
          console.log(err)
        })
      },
    })
    return false;
    app.globalData.userInfo =userInfo
    this.setData({avatar:userInfo.avatarUrl, is_login: true, nickname: userInfo.nickName})
    //连接swoole
    ws.wsConnect();
    wx.onSocketMessage(function(res){
      let data = res.data;
      data = JSON.parse(data)
      let [type] = [data.type]
      console.log(data)
      switch(type){
        case 'LOGIN':
          that.bindUidClientId(data)
          break;
      }
    })
  },

  /**
   * 设置client_id与uid绑定
   */
  bindUidClientId(data1){
    app.globalData.client_id = data1.client_id;
    console.log("client_id => " + data1.client_id)
    let userInfo = app.globalData.userInfo;
    let [uid, avatar, nickname] = [userInfo.uid, userInfo.avatarUrl, userInfo.nickName]
    let data = { type: 'BIND_UID', uid, nickname, avatar}
    data = JSON.stringify(data);
    ws.checkSocket(data)
  }

})