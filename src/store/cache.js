import localForage from 'localforage'

//从缓存中获取数据
export const get = (key) => {
  return new Promise((resolve, reject) => {
      localForage.getItem(key).then((value) => {
        let data = false
        if (value) {
          if (value.minutes > new Date().getTime() || value.minutes == 0) {
            data = value.data
          }
        }
        resolve(data)
      }).catch((err) => {
          reject(err)
      })
  })
}

export const set = (key, value, minutes = 0) => {
  return new Promise((resolve, reject) => {
      localForage.setItem(key, {
        data: value,
        minutes: expiryTime(minutes)
      }).then((value) => {
          resolve(value.data)
      }).catch((err) => {
          reject(err)
      })
  })
}
//确认项目是否存在
export const has = (key) => {
  return new Promise((resolve, reject) => {
      get(key).then((value) => {
          let has = value? true: false
          resolve(has)
      }).catch((err) => {
          reject(err)
      })
  })
}

//请求的数据不存在时，程序能为你存储默认值
export const remember = async (key, value, minutes = 0) => {
  if (await has(key)) {
    return get(key)
  }else{
    return set(key, value, minutes)
  }
}
// 永久存储
export const rememberForever = async (key, value) => {
  if (await has(key)) {
    return get(key)
  }else{
    return set(key, value, 0)
  }
}

// 过期时间
const expiryTime = (minutes) => {
  if (minutes) {
    return new Date().getTime() + minutes*60*1000
  }else{
    return minutes
  }

}
