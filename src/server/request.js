/*
 * @Author: diaochan
 * @Date: 2024-06-11 16:28:57
 * @LastEditors: diaochan
 * @LastEditTime: 2024-12-03 14:58:21
 * @Description: 
 */
import axios from 'axios';

// axios.defaults.baseURL = 'https://unidt.ontheway168.cn';
// axios.defaults.headers.post['Content-Type'] = 'application/json';

const get = async ({
  url,
  params = {}
}) => {
  const res = await axios({
    method: 'get',
    url,
    params,
    timeout: 25000,
  });
  if(res.status !== 200){
    alert(res.message || '出错啦！')
  }
  return res.data;
}

const post = async ({
  url,
  params = {}
}) => {
  const res = await axios({
    method: 'post',
    url,
    withCredentials: true,
    data: {
      ...params
    },
    timeout: 25000,
  });
  if(res.status !== 200){
    alert(res.message || '出错啦！')
  }
  return res.data;
}

export {get, post}