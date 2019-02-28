// pages/chat/chat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:'',
    list:[
      {
        'is_me':false,
        'message':'如果运行过程中有新的Gateway服务注册到Register（一般是分布式部署加机器），则将新的Gateway内部通讯地址列表将广播给所有BusinessWorker，BusinessWorker收到后建立连接'
      },
      {
        'is_me': true,
        'message': 'BusinessWorker进程得到所有的Gateway内部通讯地址后尝试连接Gateway'
      },
      {
        'is_me': true,
        'message': '如果有Gateway下线，则Register服务会收到通知，会将对应的内部通讯地址删除，然后广播新的内部通讯地址列表给所有BusinessWorker，BusinessWorker不再连接下线的Gateway'
      },
      {
        'is_me': false,
        'message': '如果运行过程中有新的Gateway服务注册到Register（一般是分布式部署加机器），则将新的Gateway内部通讯地址列表将广播给所有BusinessWorker，BusinessWorker收到后建立连接'
      },
      {
        'is_me': true,
        'message': '如果'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.connectSocket({
      url: 'ws://127.0.0.1:7272',
      header: {
        'content-type': 'application/json'
      },
      // protocols: ['protocol1'],
      method: 'GET'
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

  /**
   * getMessage
   */
  getMessage(e){
    let message = e.detail.value
    this.setData({message})
  },

  /**
   * 发送信息
   */
  sendMessage(){
    let [message,list] = [this.data.message,this.data.list]
    if(!message)return
    let arr = {
      'is_me': true,
      'message': message
    }
    list = list.concat(arr)
    this.setData({list,message:''})
  },
})