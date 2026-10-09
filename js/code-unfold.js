// console.log('脚本启动');

var CODE_MAX_HEIGHT = 200;
// console.log('CODE_MAX_HEIGHT:', CODE_MAX_HEIGHT);

var containers = [];
// console.log('初始化containers数组');

// 展开
$('body').on('click', '.js_unfold_code_btn', function () {
  // console.log('点击展开按钮');
  $(this).closest('.js_highlight_container').addClass('on');
});

// 收起  
$('body').on('click', '.js_retract_code_btn', function () {
  // console.log('点击收起按钮');

  var $container = $(this).closest('.js_highlight_container').removeClass('on');

  var winTop = $(window).scrollTop();
  // console.log('当前滚动位置:', winTop);

  var offsetTop = $container.offset().top;
  // console.log('容器距离顶部位置:', offsetTop);

  $(this).css('top', 0);

  if (winTop > offsetTop) {
    // console.log('滚动至指定位置');
    // 滚动函数
    $('body, html').animate({
      scrollTop: $container.offset().top - CODE_MAX_HEIGHT
    }, 600);
  }

});

// 滚动事件
$(window).on('scroll', function() {
  // console.log('页面滚动');
  var temp = []; // 定义temp
  var scrollTop = $(window).scrollTop();
  // console.log('当前滚动位置:', scrollTop);

  // 循环容器数组
  for(let i = 0; i < containers.length; i++) {

    var item = containers[i];
    // console.log('当前容器信息:', item);
    var { $container, height, $hide, hasHorizontalScrollbar } = item;
        // 判断是否添加类名等
    if ($container.closest('body').length === 0) {
      // 如果 $container 元素已经不在页面上, 则删除该元素
      // 防止pjax页面跳转之后，元素未删除
      continue;
  }
   temp.push(item);
    if (!$container.hasClass('on')) {
      continue;
    }
  var offsetTop = $container.offset().top;
  var hideBtnHeight = $hide.outerHeight();
  // 减去按钮高度，减去底部滚动条高度
  var maxTop = parseInt(height - (hasHorizontalScrollbar ? 17 : 0) - hideBtnHeight);
  let top = parseInt(
    Math.min(
      Math.max(scrollTop - offsetTop, 0), // 如果小于 0 ，则取 0
      maxTop,// 如果大于 height ，则取 height
    )
  );
  // 根据 sin 曲线设置"收起代码"位置
  var halfHeight = parseInt($(window).height() / 2 * Math.sin((top / maxTop) * 90 * (2 * Math.PI/360)));
  $hide.css('top', Math.min(top + halfHeight, maxTop));
}
  containers = temp;
  // console.log('更新容器数组:', containers);

});

// 添加隐藏容器
function addCodeWrap($node) {

  // console.log('添加代码容器');

  var $container = $node.wrap('<div class="js_highlight_container highlight-container"><div class="highlight-wrap"></div></div>').closest('.js_highlight_container');

// 底部 "展开代码" 与 侧边栏 "收起代码"
  var $btn = $(`
  <div class="highlight-footer">
    <a class="js_unfold_code_btn show-btn" href="javascript:;">展开代码<i class="fa fa-angle-down" aria-hidden="true"></i></a>
  </div>
  <a class="js_retract_code_btn hide-btn" href="javascript:;"><i class="fa fa-angle-up" aria-hidden="true"></i>收起代码</a>
  `);


  $container.append($btn);

  return $container;

}

function codeUnfold() {

  // console.log('初始化代码块');

  $('.highlight').each(function() {

    // console.log('处理代码块:', this);
  // 防止重复渲染
  if (this.__render__ === true) {
    return true;
  }
  this.__render__ = true;
  var $this = $(this);
  var height = $(this).outerHeight();
  if (height > CODE_MAX_HEIGHT) {
    // 添加展开&收起容器
    var $container = addCodeWrap($this, height);
    containers.push({
      $container,
      height,
      $hide: $container.find('.js_retract_code_btn'),
      hasHorizontalScrollbar: this.scrollWidth > this.offsetWidth,
    });
  }
});
};
codeUnfold();

// console.log('脚本结束');