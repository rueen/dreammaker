/*
 * @Author: diaochan
 * @Date: 2024-06-15 18:23:43
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-15 18:24:18
 * @Description: 
 */
export const debounce = (func, wait) => {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

export default {
  debounce,
}