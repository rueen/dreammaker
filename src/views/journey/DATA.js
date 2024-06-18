/*
 * @Author: diaochan
 * @Date: 2024-06-15 15:53:58
 * @LastEditors: diaochan
 * @LastEditTime: 2024-06-18 20:27:29
 * @Description: 
 */
// https://us-stock5.xpccdn.com/9db72648-b9e1-47cd-86bd-b92ff4ff3780.mp4
// https://stream7.iqilu.com/10339/upload_transcode/202002/18/20200218093206z8V1JuPlpe.mp4
const DATA = {
  name: '场景名称',
  desc: '场景描述',
  launchVideo: 'https://us-stock5.xpccdn.com/9db72648-b9e1-47cd-86bd-b92ff4ff3780.mp4', // 启动视频url
  launchAudio: '../assets/test/music.mp3', // 启动音频url
  status: 1, // 状态 0:关闭 1:开启
  list:[{
    id: 1,
    template: 'template1', // template1:人物拍摄 template2:图文视频 template3:选项卡 template4:AI寄语
    title: '标题',
    maleText: '我是一位超级大帅哥',
    femaleText: '我是一位美女',
    audio: 'https://pic.ibaotu.com/mp3Watermark_v3/17/88/84/31b5fd17a01953e7506ad3b570032415.mp3',
    bgUrl: 'https://gw.alicdn.com/imgextra/i2/O1CN01R8zDb51craBhnk9pQ_!!6000000003654-0-tps-7680-2400.jpg', // 背景图片
    nextId: 2
  }, {
    id: 2,
    template: 'template2',
    title: '我们的十年',
    content: '在70年代的十堰，你作为造车厂工人的身影烙印在了城市崛起的历程中。从组织劳动竞赛提升生产效率，担任车间主任后专注技能培训，你以实际行动点燃了工人们的热情，铸就了团队的坚实力量。预测着未来，你将引领十堰汽车工业迈向辉煌。你的名字将成为这座城市繁荣美丽的注脚。',
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
    options: [{
      id: 1,
      name: '成为工人',
      image: 'https://statics.seatent.com/statics/99cea281725792cfefc2737e7f5ecb3d/attachment/upload/image/20230914/5d6b2b02fbd74efc97a85c580e9f2749_small.jpg',
    },{
      id: 2,
      name: '成为医生',
      image: 'https://statics.seatent.com/statics/99cea281725792cfefc2737e7f5ecb3d/attachment/upload/image/20230914/c0e1cd7b3b3f44508203ab47365183f7_small.jpg',
    },{
      id: 3,
      name: '成为汽车手',
      image: 'https://statics.seatent.com/statics/99cea281725792cfefc2737e7f5ecb3d/attachment/upload/image/20220920/436880545f48423587c7a042a8986eeb_small.jpg',
    },{
      id: 4,
      name: '成为汽车手',
      image: 'https://statics.seatent.com/statics/99cea281725792cfefc2737e7f5ecb3d/attachment/upload/image/20220920/436880545f48423587c7a042a8986eeb_small.jpg',
    },{
      id: 5,
      name: '成为汽车手',
      image: 'https://statics.seatent.com/statics/99cea281725792cfefc2737e7f5ecb3d/attachment/upload/image/20220920/436880545f48423587c7a042a8986eeb_small.jpg',
    }]
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