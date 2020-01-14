module.exports = {

  /**
   * 信息提示
   */
  Toast(msg='success',time=1500,icon='none'){
    wx.showToast({
      title: msg,
      icon : icon,
      duration : time
    })
  },

}