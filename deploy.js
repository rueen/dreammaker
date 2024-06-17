/*
 * @Author: diaochan
 * @Date: 2024-06-17 09:51:13
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-17 09:55:56
 * @Description: 
 */
import ghpages from 'gh-pages';

ghpages.publish('dist', {
  repo: 'https://github.com/rueen/dreammaker.git',
  nojekyll: true,
}, function(err) {
  console.log(err)
});