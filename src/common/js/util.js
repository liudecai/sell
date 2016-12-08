// @target: 解析URL 获取queryString\
// @eg: http://localhost:8080/?id=12345&a=b#/seller
// @return Object {id:12345,a:b}
export function urlParse() {
  // "?id=12345&a=b"
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  // ['?id=12345','&a=b']
  let arr = url.match(reg);
  console.log(arr);
  if (arr) {
    arr.forEach((item) => {
      // ['id' => '12345'],['a' => 'b']
      let tempArr = item.substring(1).split('=');
      let key = tempArr[0];
      let val = tempArr[1];
      obj[key] = val;
    });
  }
  return obj;
};
