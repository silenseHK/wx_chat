module.exports = {

  test: 'test',

  wsConnect:()=>{
    wx.connectSocket({
      url: 'ws://home.kiki12318.xyz:9502',
      header: {
        'content-type': 'application/json'
      },
      // protocols: ['protocol1'],
      method: 'GET',
      success(res){
        wx.showToast({
          title: '连接服务器成功'
        })
      },
      fail(res){
        wx.showToast({
          title: '连接服务器失败',
        })
      }
    })

    wx.onSocketMessage(function(res){
      // let reg = /^["|'](.*)["|']$/g;
      // let data = res.data.replace(reg, '$1')
      // data = JSON.parse(data)
      console.log(res);
      let data = res.data;
      data = JSON.parse(data)
      let [type] = [data.type]
      console.log(data)
      switch(type){
        case 'LOGIN':
          that.bindUidClientId(data)
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

  

}