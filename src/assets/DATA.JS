/*
 * @Author: diaochan
 * @Date: 2024-06-15 15:53:58
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-16 14:35:22
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
    maleText: '我是一位超级大帅哥',
    femaleText: '我是一位美女',
    audio: 'https://pic.ibaotu.com/mp3Watermark_v3/17/88/84/31b5fd17a01953e7506ad3b570032415.mp3',
    bgUrl: 'https://statics.seatent.com/statics/99cea281725792cfefc2737e7f5ecb3d/attachment/upload/image/20220105/6add979b6dd84f91970b07b406fa3b60.jpg', // 背景图片
    nextId: 2
  }, {
    id: 2,
    template: 'template2',
    title: '标题',
    content: '',
    audio: '',
    video: '',
    bgUrl: 'https://seatent.com/img/fxpage/cloud-bg.jpg', // 背景图片
    nextId: 3
  }, {
    id: 3,
    template: 'template3',
    title: '标题',
    bgUrl: '', // 背景图片
    audio: '',
    optionNum: 3, // 选项数量
    optionType: 1, // 选项功能 1：文字图片 2: 预生成内容
    nextId: 4,
  }, {
    id: 4,
    template: 'template4',
    title: '标题',
    bgUrl: '', // 背景图片
    messageType: 1, // 寄语类型 1: prompt 2: 剧情选项
    prompt: ''
  }]
}

export default DATA;