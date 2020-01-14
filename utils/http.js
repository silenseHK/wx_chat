const config = require('./config.js');

module.exports = {

 /**
   * promise post
   */
  Post: (url, data = {})=>{
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${config.host}index.php/api${url}`,
        data: data,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: res => {
          wx.hideLoading()
          //console.log(res)
          resolve(res)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  },

}