/*
 * @class   首页
 * @author  Jeff Tsui
 * @date    16.05.18
 * @mail    jeff.ccjie@gmail.com
*/


(function() {
  var $, $cartMenus, $menuClass, $menuClassLink, $menus, carTpl, com, iMenuClassTop, setCar;

  $ = require('base/js/jquery');

  com = require('base/js/common.coffee');

  com.test(666);

  $menuClass = $('#menuClass');

  $menuClassLink = $menuClass.children('a');

  $menus = $('#menus');

  iMenuClassTop = $menuClass.offset().top;

  $(document).on('scroll', function() {
    var iScrollTop;
    iScrollTop = $(this).scrollTop();
    if (iMenuClassTop <= iScrollTop) {
      $menuClass.css({
        position: 'fixed',
        width: $menuClass.width(),
        top: 0,
        left: $menuClass.offset().left
      });
      $menus.css({
        marginTop: $menuClass.outerHeight()
      });
    } else {
      $menuClass.removeAttr('style');
      $menus.removeAttr('style');
    }
    return $menuClassLink.each(function() {
      var $that, $thatContent;
      $that = $(this);
      $thatContent = $($that.attr('href'));
      if ($thatContent.length > 0 && iScrollTop > $thatContent.offset().top - 60) {
        return $that.addClass('active').siblings().removeClass('active');
      }
    });
  });

  $menuClass.on('click', 'a', function(event) {
    var $menusBox, $this, iMenusTop, sThisHref;
    event.stopPropagation();
    event.preventDefault();
    $this = $(this);
    sThisHref = $this.attr('href');
    $menusBox = $(sThisHref);
    iMenusTop = $menusBox.offset().top - 55;
    return $('html, body').animate({
      'scrollTop': iMenusTop
    }, 400);
  });

  $cartMenus = $('#cartMenus');

  carTpl = '<div class="menuTool"><input type="button" class="menuToolCut" value="-">\
              <input type="number" class="menuToolTxt" value="1" max="100" min="1"><input type="button" class="menuToolAdd" value="+" />\
          </div>';

  $('.menuAddBtn').on('click', function(event) {
    var $this;
    event.preventDefault();
    $this = $(this);
    $this.hide().after(carTpl);
    return setCar.init($this.parents('.menuAddBox').data('id'), 1);
  });

  $cartMenus.on('click', '.cMenusClose', function() {
    var $this, $thisParent, iThisId;
    $this = $(this);
    $thisParent = $this.parents('li');
    iThisId = $thisParent.data('id');
    $thisParent.remove();
    setCar.clearMenu($('.menuAddBox[data-id="' + iThisId + '"]'));
    return setCar.setCount();
  });

  $(document).on('click', '.menuToolAdd', function() {
    return setCar.init($(this).parents('.mToolBox').data('id'), 1);
  });

  $(document).on('click', '.menuToolCut', function() {
    return setCar.init($(this).parents('.mToolBox').data('id'), -1);
  });

  $(document).on('keyup', '.menuToolTxt', function() {
    var $this, iThisVal;
    $this = $(this);
    iThisVal = +$(this).val();
    if (iThisVal > 0) {
      return setCar.init($this.parents('.mToolBox').data('id'), iThisVal, !0);
    }
  });

  setCar = {
    /*
     * 创建购物车list dom
     * @param id 餐单id
     * @param tit 标题
     * @param price 单价
    */

    getListTpl: function(id, tit, price) {
      var tpl;
      tpl = '<li class="mToolBox" data-id="' + id + '" data-price="' + price + '">\
          <div class="cMenusTitle">' + tit + '</div>\
          <div class="menuTool cMenusTool">\
            <input type="button" class="menuToolCut" value="-">\
            <input type="number" class="menuToolTxt" value="1" max="100" min="1">\
            <input type="button" class="menuToolAdd" value="+">\
          </div>\
          <div class="cMenusPrice money">' + price + '</div>\
          <div class="cMenusClose">X</div>\
        </li>';
      return tpl;
    },
    /*
    * 绑定增减点餐数量事件
    * @param id 餐单id
    * @param num 加减/具体数值
    * @param isInput 是否输入值(如果为true,num取具体数值)
    */

    init: function(id, num, isInput) {
      var $menuParent, sPrice, sTitle;
      this.$cartMenu = $cartMenus.children('li[data-id="' + id + '"]');
      this.$menuAddBox = $('.menuAddBox[data-id="' + id + '"]');
      $menuParent = this.$menuAddBox.parents('li.contentBox');
      sTitle = $menuParent.find('.menuTitle').text();
      sPrice = $menuParent.find('.menuPrice').text();
      if (this.$cartMenu.length > 0) {
        this.setNum(num, isInput);
      } else {
        $cartMenus.append(this.getListTpl(id, sTitle, sPrice));
        this.$cartMenu = $('li[data-id="' + id + '"]');
      }
      return this.setCount();
    },
    /*
    * 设置表单数字
    * @param num 加减/具体数值
    * @param isInput 是否输入值(如果为true,num取具体数值)
    */

    setNum: function(num, isInput) {
      var $cartMenuTxt, $menuTxt, iThisVal;
      $cartMenuTxt = this.$cartMenu.find('.menuToolTxt');
      $menuTxt = this.$menuAddBox.find('.menuToolTxt');
      iThisVal = +$menuTxt.val();
      if (!isInput) {
        iThisVal += num;
      } else {
        iThisVal = num;
      }
      if (iThisVal < 1) {
        this.clearMenu(this.$menuAddBox);
        return this.$cartMenu.remove();
      } else {
        $cartMenuTxt.val(iThisVal);
        $menuTxt.val(iThisVal);
        return this.$cartMenu.children('.cMenusPrice').text(this.$cartMenu.data('price') * iThisVal);
      }
    },
    /*
    * 清空数量
    * @param obj 餐单list jquery对象
    */

    clearMenu: function(obj) {
      obj.children('.menuTool').remove();
      return obj.children('.menuAddBtn').show();
    },
    setCount: function() {
      var iAllCount, iAllPrice;
      iAllCount = 0;
      iAllPrice = 0;
      $cartMenus.children('li').each(function() {
        iAllCount += +$(this).find('.menuToolTxt').val();
        return iAllPrice += +$(this).find('.cMenusPrice').text();
      });
      $('#cCount').html(iAllCount);
      return $('#cPrice').html(iAllPrice);
    }
  };

  /*
    * 关闭弹窗
  */


  $(document).on('click', '.pClose', function() {
    return $(this).parents('.popupWindow').fadeOut(300);
  });

}).call(this);
