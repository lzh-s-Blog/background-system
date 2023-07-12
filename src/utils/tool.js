// 工具库函数

export function formatData(timeStamp) {
  let date = new Date(parseInt(timeStamp));

  let year = date.getFullYear(); //年
  let mouth = date.getMonth(); //月
  let day = date.getDate(); //日

  let hour = date.getHours(); // 时
  let minutes = date.getMinutes(); //分
  let seconds = date.getSeconds(); //秒

  let weekArr = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
  let week = weekArr[date.getDay()];

  // 9点 => 09:35:03  2021年09月03日
  //年
  if (year <= 9 && year >= 0) {
    year = '0' + year;
  }
  //月
  if (mouth <= 9 && mouth >= 0) {
    mouth = '0' + mouth;
  }
  //日
  if (day <= 9 && day >= 0) {
    day = '0' + day;
  }
  // 时
  if (hour <= 9 && hour >= 0) {
    hour = '0' + hour;
  }
  // 分
  if (minutes <= 9 && minutes >= 0) {
    minutes = '0' + minutes;
  }
  // 秒
  if (seconds <= 9 && seconds >= 0) {
    seconds = '0' + seconds;
  }

  return year + '-' + mouth + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds + ' ' + week;
}