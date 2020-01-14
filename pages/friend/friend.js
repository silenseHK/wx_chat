// pages/friend/friend.js

const app = getApp();
const ws = require("../../utils/ws.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_list:[
      {
        'avatar' : 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKcOJZkwl1ZicU4Duw6vfia72gB81paeXibEtTSvhagiaObTw2Wk4U5Kvu0k8JBLUFBZIXz3nCtHZZNsw/132',
        'nickname' : '霞霞',
        'fd' : 0
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let data = { type: 'GET_USER_LIST'}
    data = JSON.stringify(data);
    ws.checkSocket(data)

    wx.onSocketMessage(function(res){
      let data = res.data;
      data = JSON.parse(data)
      let [type] = [data.type]
      console.log(data)
      switch(type){
        case 'USER_LIST':
          that.setData({user_list:data.data})
          break;
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let client_id = app.globalData.client_id
    if(!client_id){
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
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

  }
})