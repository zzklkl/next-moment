// TODO: 用户名称需修改为自己的名称
var userName = 'kl';
var uName = document.querySelector('.user-name');
uName.innerText = userName;
// 朋友圈页面的数据
var data = [{
  user: {
    name: '阳和', 
    avatar: './img/avatar2.png'
  }, 
  content: {
    type: 0, // 多图片消息
    text: '华仔真棒，新的一年继续努力！',
    pics: ['./img/reward1.png', './img/reward2.png', './img/reward3.png', './img/reward4.png'],
    share: {},
    timeString: '3分钟前'
  }, 
  reply: {
    hasLiked: false,
    likes: ['Guo封面', '源小神'],
    comments: [{
      author: 'Guo封面',
      text: '你也喜欢华仔哈！！！'
    },{
      author: '喵仔zsy',
      text: '华仔实至名归哈'
    }]
  }
}, {
  user: {
    name: '伟科大人',
    avatar: './img/avatar3.png'
  },
  content: {
    type: 1, // 分享消息
    text: '全面读书日',
    pics: [],
    share: {
      pic: 'http://coding.imweb.io/img/p3/transition-hover.jpg',
      text: '飘洋过海来看你'
    },
    timeString: '50分钟前'
  },
  reply: {
    hasLiked: false,
    likes: ['阳和'],
    comments: []
  }
}, {
  user: {
    name: '深圳周润发',
    avatar: './img/avatar4.png'
  },
  content: {
    type: 2, // 单图片消息
    text: '很好的色彩',
    pics: ['http://coding.imweb.io/img/default/k-2.jpg'],
    share: {},
    timeString: '一小时前'
  },
  reply: {
    hasLiked: false,
    likes:[],
    comments: []
  }
}, {
  user: {
    name: '喵仔zsy',
    avatar: './img/avatar5.png'
  },
  content: {
    type: 3, // 无图片消息
    text: '以后咖啡豆不敢浪费了',
    pics: [],
    share: {},
    timeString: '2个小时前'
  }, 
  reply: {
    hasLiked: false,
    likes:[],
    comments: []
  }
}];

// 相关 DOM
var $page = $('.page-moments');
var $momentsList = $('.moments-list');
var $enlargeImg = $('.enlarge-image');

/**
 * 点赞内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function likesHtmlTpl(likes) {
  if (!likes.length) {
    return '';
  }
  var  htmlText = ['<div class="reply-like"><i class="icon-like-blue"></i>'];
  // 点赞人的html列表
  var likesHtmlArr = [];
  // 遍历生成
  for(var i = 0, len = likes.length; i < len; i++) {
    likesHtmlArr.push('<a class="reply-who" href="#">' + likes[i] + '</a>');
  }
  // 每个点赞人以逗号加一个空格来相隔
  var likesHtmlText = likesHtmlArr.join(', ');
  htmlText.push(likesHtmlText);
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论内容 HTML 模板
 * @param {Array} likes 点赞人列表
 * @return {String} 返回html字符串
 */
function commentsHtmlTpl(comments) {
  if (!comments.length) {
    return '';
  }
  var  htmlText = ['<div class="reply-comment">'];
  for(var i = 0, len = comments.length; i < len; i++) {
    var comment = comments[i];
    htmlText.push('<div class="comment-item"><a class="reply-who" href="#">' + comment.author + '</a>：' + comment.text + '</div>');
  }
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 评论点赞总体内容 HTML 模板
 * @param {Object} replyData 消息的评论点赞数据
 * @return {String} 返回html字符串
 */
function replyTpl(replyData) {
  var htmlText = [];
  htmlText.push('<div class="reply-zone">');
  htmlText.push(likesHtmlTpl(replyData.likes));
  htmlText.push(commentsHtmlTpl(replyData.comments));
  htmlText.push('</div>');
  return htmlText.join('');
}
/**
 * 多张图片消息模版 （可参考message.html）
 * @param {Object} pics 多图片消息的图片列表
 * @return {String} 返回html字符串
 */
function multiplePicTpl(pics) {
  var htmlText = [];
  htmlText.push('<ul class="item-pic">');
  for (var i = 0, len = pics.length; i < len; i++) {
    htmlText.push('<img class="pic-item" src="' + pics[i] + '">')
  }
  htmlText.push('</ul>');
  return htmlText.join('');
}
/**
 * 分享消息模版
 * @param {object} share 分享的内容
 * @return {String} 返回html字符串
 */
function shareTpl(share) {
  var htmlText = [];
  htmlText.push('<a class="item-share" href="#">')
  htmlText.push('<img class="share-img" src="' + share.pic + 
  '" width="40" height="40" alt=""><p class="share-tt">' + share.text + '</p>');
  htmlText.push('</a>')
  return htmlText.join('');
}
/**
 * 单图片消息模版
 * @param {object} pics 图片
 * @return {String} 返回html字符串
 */
function singlePicTpl(pics) {
  var htmlText = [];
  htmlText.push('<img class="item-only-img" src="' + pics[0] + '">');
  return htmlText.join('');
}
/**
 * 循环：消息体 
 * @param {Object} messageData 对象
 */ 
function messageTpl(messageData) {
  var user = messageData.user;
  var content = messageData.content;
  var htmlText = [];
  htmlText.push('<div class="moments-item" data-index="' +  data.indexOf(messageData) + '">');
  // 消息用户头像
  htmlText.push('<a class="item-left" href="#">');
  htmlText.push('<img src="' + user.avatar + '" width="42" height="42" alt=""/>');
  htmlText.push('</a>');
  // 消息右边内容
  htmlText.push('<div class="item-right">');
  // 消息内容-用户名称
  htmlText.push('<a href="#" class="item-name">' + user.name + '</a>');
  // 消息内容-文本信息
  htmlText.push('<p class="item-msg">' + content.text + '</p>');
  // 消息内容-图片列表 
  var contentHtml = '';
  // 目前只支持多图片消息，需要补充完成其余三种消息展示
  switch(content.type) {
      // 多图片消息
    case 0:
      contentHtml = multiplePicTpl(content.pics);
      break;
    case 1:
      // TODO: 实现分享消息
      contentHtml = shareTpl(content.share);
      break;
    case 2:
      // TODO: 实现单张图片消息
      contentHtml = singlePicTpl(content.pics);
      break;
    case 3:
      // TODO: 实现无图片消息
      contentHtml = '';
      break;
  }
  htmlText.push(contentHtml);
  // 消息时间和回复按钮
  htmlText.push('<div class="item-ft">');
  htmlText.push('<span class="item-time">' + content.timeString + '</span>');
  htmlText.push('<div class="item-reply-btn">');
  htmlText.push('<div class="reply-btn-box"><div class="reply-btn like--btn"><i class="icon-like"></i><span>')
  if(messageData.reply.hasLiked){
    htmlText.push('取消');
  }else{
    htmlText.push('赞');
  }
  htmlText.push('</span></div><div class="reply-btn comment--btn"><i class="icon-comment"></i>评论</div></div>');
  htmlText.push('<span class="item-reply"></span>');
  htmlText.push('</div></div>');
  // 消息回复模块（点赞和评论）
  htmlText.push(replyTpl(messageData.reply));
  htmlText.push('</div></div>');
  return htmlText.join('');
}


/**
 * 页面渲染函数：render
 */
function render() {
  // TODO: 目前只渲染了一个消息（多图片信息）,需要展示data数组中的所有消息数据。
  var messageHtml = '';
  var i = 0;
  var len = data.length;
  for (; i < len; i++) {
    messageHtml += messageTpl(data[i]);
  }
  $momentsList.html(messageHtml);
  //隐藏遮盖图层
  $enlargeImg.hide();
}


/**
 * 页面绑定事件函数：bindEvent
 */
function bindEvent() {
  // TODO: 完成页面交互功能事件绑定
  // DOM 绑定
  var $replyBtnBox = $('.reply-btn-box');
  var $itemReplyBtn = $('.item-reply-btn');
  var $likeBtn = $('.like--btn');
  var $commentBtn = $('.comment--btn');
  var $inputText = $('.input-text');
  var $momentsInput = $('.moments-input');
  var $inputBtn = $('.moments-input button');
  var $image = $enlargeImg.find('img');

  // 回复按钮框绑定点击事件
  $itemReplyBtn.on('click', showReplyBtnBox);
  // 绑定隐藏回复按钮框事件
  $momentsList.on('click', hideReplyBtnBox);
  //绑定点赞事件
  $likeBtn.on('click', onLike);
  //绑定评论按钮点击事件
  $commentBtn.on('click', onComment);
  //绑定input的keyup事件
  $inputText.on('keyup', inputChange);
  //发送按钮的点击事件
  $inputBtn.on('click', sendComment);
  // 绑定图片点击事件
  $page.on('click', '.item-only-img,.pic-item', enlargeImg)
  // 绑定大图点击事件
  $enlargeImg.on('click', hideImg);

  //事件函数
  var index = null;
  /**
   * 隐藏点赞评论框: hideReplyBtnBox
   */
  function hideReplyBtnBox(e) {
    $replyBtnBox.removeClass('reply-box-out');
    if(e.currentTarget.className !== 'moments-input'&&'input-text') {
    $momentsInput.css('display','none');
    }
  };
  /**
   * 显示点赞评论框: showReplyBtnBox
   */
  function showReplyBtnBox() {
    var $thisBox = $(this).children('.reply-btn-box');
    $replyBtnBox.not($thisBox).removeClass('reply-box-out');
    $thisBox.toggleClass('reply-box-out');
    return false;
  };
  /**
   * 点赞: onLike
   */
  function onLike() {
    var index=$(this).parents('.moments-item').data('index');
    var $datathis=data[index].reply.likes;
    if($(this).text() === '取消'){
      $datathis.splice($datathis.indexOf(userName),1);
      $(this).text('点赞');
    }else{
      $datathis.push(userName);
      $(this).text('取消');
    }
    $('.reply-zone').eq(index).replaceWith(replyTpl(data[index].reply));
  };
  /**
   * 弹出评论框: onComment
   */
  function onComment(){
    index=$(this).parents('.moments-item').data('index');
    $inputText.val('');
    $inputBtn.addClass('forbid');
    $momentsInput.css('display','flex');
  };
  /**
   * 检测input keyup事件
   */
  function inputChange() {
    if($(this).val().trim() === ''){
      $inputBtn.addClass('forbid');
    }else{
      $inputBtn.removeClass('forbid');
    }
  };
  /**
   * 发送评论: sendComment
   */
  function sendComment() {
    var $datathis = data[index].reply.comments;
    if(!$(this).hasClass('forbid')){
      $datathis.push({author:userName,text:$inputText.val()});
      $inputText.val('');
      $(this).parent().css('display','none');
      $('.reply-zone').eq(index).replaceWith(replyTpl(data[index].reply));
      $(this).addClass('forbid');
    }
  };
  /**
   * 图片放大函数: enlargeimg
   */
  function enlargeImg() {
    var imgsrc = $(this).attr('src');
    $image.attr('src', imgsrc);
    $enlargeImg.show();
    $(document.body).css({
    'overflow': 'hidden'
    });
  }
  /**
   * 图片隐藏函数: hideImg
   */
  function hideImg() {
    $(this).hide();
    $(document.body).css({
      'overflow': 'auto'
      });
  }
}

/**
 * 页面入口函数：init
 * 1、根据数据页面内容
 * 2、绑定事件
 */
function init() {
  // 渲染页面
  render();
  bindEvent();
}

init();