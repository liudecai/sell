// 通用商家信息的本地存储方案
// @id 商家id
// @key
// @value
export function saveToLocal(id, key, value) {
  // first time => undefined
  let seller = window.localStorage._seller_;
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    // 本地存储的为字符串
    // 需要转换成JSON对象才能进行操作
    seller = JSON.parse(seller);
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  // 存储在本地存储时再转换成字符串
  window.localStorage._seller_ = JSON.stringify(seller);
};

// @id 商家id
// @key 商家信息的key,比如'favorite'
// @def 如果没有获取到指定返回的默认值
export function loadFromLocal(id, key, def) {
  // 检查本地存储时候存在_seller_信息
  let seller = window.localStorage._seller_;
  if (!seller) {
    return def;
  }
  // 检查能否正确转换成JSON对象并且取到特定id的商家信息
  seller = JSON.parse(seller)[id];
  if (!seller) {
    return def;
  }
  // 如果有则获取对应信息,比如'favorite'
  let ret = seller[key];
  return ret || def;
};
