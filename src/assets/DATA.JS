/*
 * @Author: diaochan
 * @Date: 2024-06-15 15:53:58
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-16 13:36:28
 * @Description: 
 */
// https://us-stock5.xpccdn.com/9db72648-b9e1-47cd-86bd-b92ff4ff3780.mp4
// https://stream7.iqilu.com/10339/upload_transcode/202002/18/20200218093206z8V1JuPlpe.mp4
const DATA = {
  name: '场景名称',
  desc: '场景描述',
  launchVideo: 'https://us-stock5.xpccdn.com/9db72648-b9e1-47cd-86bd-b92ff4ff3780.mp4', // 启动视频url
  launchAudio: '', // 启动音频url
  status: 1, // 状态 0:关闭 1:开启
  list:[{
    id: 1,
    template: 'template1', // template1:人物拍摄 template2:图文视频 template3:选项卡 template4:AI寄语
    title: '标题',
    maleText: '我是一位帅哥',
    femaleText: '我是一位美女',
    audio: 'https://pic.ibaotu.com/mp3Watermark_v3/17/88/84/31b5fd17a01953e7506ad3b570032415.mp3',
    bgUrl: '', // 背景图片
  }]
}

export default DATA;