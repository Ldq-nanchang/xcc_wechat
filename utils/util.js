const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function arrayTransform(baseArray,n) {
  // let baseArray = [1, 2, 3, 4, 5, 6, 7, 8];
  let len = baseArray.length;
  // let n = 4; //假设每行显示4个
  let lineNum = len % 4 === 0 ? len / 4 : Math.floor((len / 4) + 1);
  let res = [];
  for (let i = 0; i < lineNum; i++) {
    // slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分浅拷贝到一个新数组对象。且原始数组不会被修改。
    let temp = baseArray.slice(i * n, i * n + n);
    res.push(temp);
  }
  return res;
}
/* 
..公共方法
*/
// 时间转换成倒计时
function timeTransform(time) {
  let _time = new Date()
  let time_ = parseInt(_time.valueOf() / 1000) - (new Date(time.replace(/-/g, '/'))).getTime() / 1000;
  let _time_ = '';
  if (time_ <= 15) {
    _time_ = '刚刚';
  } else if (time_ > 15 && time_ < 60) {
    _time_ = time_ + '秒前';
  } else if (time_ >= 60 && time_ < 3600) {
    _time_ = parseInt(time_ / 60) + '分钟前';
  } else if (time_ >= 3600 && time_ < 86400) {
    _time_ = parseInt(time_ / 3600) + '小时前'
  } else if (time_ >= 86400 && time_ < 2592000) {
    _time_ = (parseInt(time_ / 86400) + 1) + '天前'
  } else if (time_ >= 2592000) {
    _time_ = parseInt(time_ / 2592000) + '个月前'
  }

  return _time_;
}

function domH(dom,callback){
  var query = wx.createSelectorQuery();
  query.select(dom).boundingClientRect(function (rect) {
    if(typeof callback == 'function') {
      callback(rect)
    }
  }).exec();
}



module.exports = {
  formatTime: formatTime,
  arrayTransform: arrayTransform,
  timeTransform: timeTransform,
  domH
}
