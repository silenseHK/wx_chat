// pages/chat/chat.js

const socketOpen = false
const socketMsgQueue = []



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
    ],
    images:['https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLJ7EnIXSN1DzqfxtGPpibs3kUicpCXg7N5Cdbyobmf6OT3cuicjsotHR3pcQeVjVOtNJDQlAc6QrkuA/132',
      'https://wx.qlogo.cn/mmopen/vi_32/ulAfJ2ls3WiarEV4aBJAUL3lbXafA8kjJmibmXD8icJqyq68Xok82z9SXoLhzT33EqnmC2AGy5dDhcKOSIV7ChhtQ/132',
      'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKcOJZkwl1ZicU4Duw6vfia72gB81paeXibEtTSvhagiaObTw2Wk4U5Kvu0k8JBLUFBZIXz3nCtHZZNsw/132',
      'https://wx.qlogo.cn/mmopen/vi_32/YO5UGlLK6DYSzy2KagRwD9VtINfFySCpAmics9QaGdlrj2NVqXkotdQNACzq6UXJdDZmEicPiacWYc1xhLdtvFPuw/132',
      'https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoiajdL5pSZem7zXRdhwFQARfL5XCVMiahTu1bLyFWlrm6woDyrCumJfJAybFZqBwbzodYRuvM18GicQ/132'
    ],
    members:[
      '234','123','321','543','678'
    ],
    shwoMemberList:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let uid = options.uid
    let that = this;
    this.setData({uid})
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    let that = this

    

    wx.connectSocket({
      url: 'ws://127.0.0.1:7272',
      header: {
        'content-type': 'application/json'
      },
      // protocols: ['protocol1'],
      method: 'GET',
    })

    wx.onSocketMessage(function(res){
      let reg = /^["|'](.*)["|']$/g;
      let data = res.data.replace(reg, '$1')
      data = JSON.parse(data)
      console.log(data)
      let [type] = [data.type]
      console.log(type)
      switch(type){
        case 'LOGIN':
          that.bindUidClientId(data.data)
          break;
        case 'TIP':
          return;
        case 'MESSAGE':
          that.addMessage(data.data)
          break;
        case 'INFO':
          wx.showToast({
            title:data.data,
            icon:'none',
            duration:2000
          })
          break;
        case 'MEMBERS':
          that.updateMember(data.data)
          break;
      }
    })
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
    let [message,list,uid] = [this.data.message,this.data.list,this.data.uid]
    if(!message)return
    let arr = {
      'is_me': true,
      'message': message
    }
    list = list.concat(arr)
    this.setData({list,message:''})
    let that = this
    let data = {type:'TALK',message}
    data = JSON.stringify(data)
    this.checkSocket(data)
  },

  /**
   * 检查socket
   */
  checkSocket(msg){
    this.sendSocketMessage(msg)
  },

  /**
   * 发送信息
   */
  sendSocketMessage(msg){
    wx.sendSocketMessage({
      data: msg
    })
  },

  /**
   * 设置client_id与uid绑定
   */
  bindUidClientId(data1){
    this.setData({ client_id: data1.client_id})
    let uid = this.data.uid
    console.log(12)
    let data = { type: 'BIND_UID', uid }
    data = JSON.stringify(data);
    this.checkSocket(data)
  },

  /**
   * 添加聊天信息
   */
  addMessage(data){
    if(data.uid == this.data.uid)
      return
    let [message,list] = [data.message,this.data.list]
    let arr = {
      'is_me': false,
      'message': message
    }
    list = list.concat(arr)
    this.setData({list})
  },

  /**
   * 关闭memberlist
   */
  closeMemberList(){
    const animation = wx.createAnimation({
      duration: 700,
      timingFunction: 'ease',
    })

    this.animation = animation
    animation.width('80rpx').step()
    this.setData({
      animationData: animation.export(),
      shwoMemberList:false
    })
  },

  /**
   * 开启memberList
   */
  openMemberList(){
    const animation = wx.createAnimation({
      duration: 700,
      timingFunction: 'ease',
    })

    this.animation = animation
    animation.width('750rpx').step()
    this.setData({
      animationData: animation.export(),
      shwoMemberList: true
    })
  },

  /**
   * 更新在心人数
   */
  updateMember(data){
    let members = data.members
    let members_new = [];
    for(var mem in members){
      members_new.push(mem);
    }
    this.setData({ members:members_new})
  },

  /**
   * 踢出成员
   */
  delMember(e){
    let member_client_id = e.currentTarget.dataset.index
    let client_id = this.data.client_id
    if(client_id == member_client_id)
      return;
    let data = { type: 'DEL_MEMBER', client_id: member_client_id }
    data = JSON.stringify(data);
    console.log(322323)
    this.checkSocket(data)
  },

})