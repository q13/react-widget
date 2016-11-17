/**
* @Date:   2016-08-25T11:12:41+08:00
* @Last modified time: 2016-11-17T15:49:15+08:00
*/
/**
 * Drag and drop
 */
import uiStyle from './dnd.css';

var isIE = (document.all) ? true : false;

var Dnd = function(selector, options) {
  var elEl = $(selector);
  if (!elEl.data('dnd')) {
    this.initialize(selector, options);
    elEl.data('dnd', this);
  } else {
    return elEl.data('dnd');
  }
};
Object.assign(Dnd.prototype, {
  //拖放对象
  initialize: function(selector, options) {
    this.core = $(selector); //拖放对象
    this.x = this.y = 0; //记录鼠标相对拖放对象的位置
    this.marginLeft = this.marginTop = 0; //记录margin
    //事件对象(用于绑定移除事件)
    this.start_ = this.start.bind(this);
    this.move_ = this.move.bind(this);
    this.stop_ = this.stop.bind(this);
    this.setOptions(options);
    this.limit = !!this.options.limit;
    this.maxLeft = parseInt(this.options.maxLeft, 10);
    this.maxRight = parseInt(this.options.maxRight, 10);
    this.maxTop = parseInt(this.options.maxTop, 10);
    this.maxBottom = parseInt(this.options.maxBottom, 10);
    this.lockX = !!this.options.lockX;
    this.lockY = !!this.options.lockY;
    this.lock = !!this.options.lock;
    this.onStart = this.options.onStart;
    this.onMove = this.options.onMove;
    this.onStop = this.options.onStop;
    this.handler = this.options.handler ? $(this.options.handler, this.core) : this.core;
    this.container = this.options.container ? $(this.options.container) : null;
    //保持原来的定位方式，设置绝对定位
    this.originPosition = this.core.css('position');
    this.originCursor = this.core.css('cursor');
    //设置拖拽十字坐标
    this.handler.css({
      cursor: 'move'
    });
    //修正范围
    //this.repair();
    this.handler.on('mousedown', this.start_);
  },
  //设置默认属性
  setOptions: function(options) {
    this.options = { //默认值
      handler: "", //设置触发对象（不设置则使用拖放对象）
      limit: false, //是否设置范围限制(为true时下面参数有用,可以是负数)
      maxLeft: 0, //左边限制
      maxRight: 9999, //右边限制
      maxTop: 0, //上边限制
      maxBottom: 9999, //下边限制
      container: "", //指定限制在容器内
      lockX: false, //是否锁定水平方向拖放
      lockY: false, //是否锁定垂直方向拖放
      lock: false, //是否锁定
      transparent: false, //是否透明
      onStart: function() {}, //开始移动时执行
      onMove: function() {}, //移动时执行
      onStop: function() {} //结束移动时执行
    };
    Object.assign(this.options, options || {})
  },
  //准备拖动
  start: function(evt) {
    if (this.lock) {
      return;
    }
    this.core.css({
      position: this.originPosition === 'fixed' ? 'fixed' : 'absolute'
    });
    //透明
    if (isIE && !!this.options.transparent) {
      //填充拖放对象
      if (this.handler.css('position') === 'static') {
        this.handler.css({
          position: 'relative'
        });
      }
      this.handler.append('<div class="transparent-layer" style="width: 100%; height: 100%; background-color: #ffffff; filter: alpha(opacity: 0); font-size: 0;"></div>');
    }
    this.repair();
    //记录鼠标相对拖放对象的位置
    this.x = evt.clientX - this.core[0].offsetLeft;
    this.y = evt.clientY - this.core[0].offsetTop;
    //记录margin
    this.marginLeft = parseInt(this.core.css('marginLeft'), 10) || 0;
    this.marginTop = parseInt(this.core.css('marginTop'), 10) || 0;
    //mousemove时移动 mouseup时停止
    $(document).on('mousemove', this.move_);
    $(document).on('mouseup', this.stop_);
    if (isIE) {
      //焦点丢失
      this.handler.on('losecapture', this.stop_);
      //设置鼠标捕获
      this.handler[0].setCapture();
    } else {
      //焦点丢失
      $(window).on('blur', this.stop_);
      //阻止默认动作
      evt.preventDefault();
    };
    //附加程序
    this.onStart();
  },
  //修正范围
  repair: function() {
    if (this.limit) {
      //修正错误范围参数
      this.maxRight = Math.max(this.maxRight, this.maxLeft + this.core[0].offsetWidth);
      this.maxBottom = Math.max(this.maxBottom, this.maxTop + this.core[0].offsetHeight);
      //如果有容器必须设置position为relative来相对定位，并在获取offset之前设置
      !this.container || this.container.css('position') === "relative" || (this.container.css('position', 'relative'));
    }
  },
  //拖动
  move: function(evt) {
    //判断是否锁定
    if (this.lock) {
      this.stop();
      return;
    };
    //清除选择
    window.getSelection
      ? window.getSelection().removeAllRanges()
      : document.selection.empty();
    //设置移动参数
    var iLeft = evt.clientX - this.x,
      iTop = evt.clientY - this.y;
    //设置范围限制
    if (this.limit) {
      //设置范围参数
      var maxLeft = this.maxLeft,
        maxRight = this.maxRight,
        maxTop = this.maxTop,
        maxBottom = this.maxBottom;
      //如果设置了容器，再修正范围参数
      if (!!this.container) {
        maxLeft = Math.max(maxLeft, 0);
        maxTop = Math.max(maxTop, 0);
        maxRight = Math.min(maxRight, this.container[0].clientWidth);
        maxBottom = Math.min(maxBottom, this.container[0].clientHeight);
      };
      //修正移动参数
      iLeft = Math.max(Math.min(iLeft, maxRight - this.core[0].offsetWidth), maxLeft);
      iTop = Math.max(Math.min(iTop, maxBottom - this.core[0].offsetHeight), maxTop);
    }
    //设置位置，并修正margin
    if (!this.lockX) {
      this.core.css({
        left: iLeft - this.marginLeft + "px"
      });
    }
    if (!this.lockY) {
      this.core.css({
        top: iTop - this.marginTop + "px"
      });
    }
    //附加程序
    this.onMove();
  },
  //停止拖动
  stop: function() {
    //移除事件
    $(document).off('mousemove', this.move_);
    $(document).off('mouseup', this.stop_);
    if (isIE) {
      this.handler.off('losecapture');
      this.handler[0].releaseCapture();
      if (!!this.options.transparent) {
        $('.transparent-layer', this.handler).remove();
      }
    } else {
      $(window).off('blur', this.stop_);
    };
    this.core.css({
      position: this.originPosition
    });
    //附加程序
    this.onStop();
  },
  destroy: function () {
    this.handler.off();
    $(window).off('blur', this.stop_);
    this.handler.css({
      cursor: this.originCursor
    });
    this.handler = null;
    this.core.css({
      position: this.originPosition
    }).removeData('dnd');
    this.core = null;
  }
});
export default Dnd;
