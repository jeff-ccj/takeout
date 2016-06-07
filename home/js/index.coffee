###
 * @class   首页
 * @author  Jeff Tsui
 * @date    16.05.18
 * @mail    jeff.ccjie@gmail.com
###

$ = require 'jquery'
com = require 'common'
com.test(666)


#滚动条事件
$menuClass = $('#menuClass')
$menuClassLink = $menuClass.children('a')
$menus = $('#menus')
iMenuClassTop = $menuClass.offset().top
$(document).on 'scroll', ()->
  iScrollTop = $(@).scrollTop()

  #设置菜单类型位置
  if iMenuClassTop <= iScrollTop
    $menuClass.css({
      position: 'fixed'
      ,width: $menuClass.width()
      ,top: 0
      ,left: $menuClass.offset().left
    })
    $menus.css({
      marginTop: $menuClass.outerHeight()
    })
  else
    $menuClass.removeAttr('style')
    $menus.removeAttr('style')

  #判断选中
  $menuClassLink.each ->
    $that = $ @
    $thatContent = $($that.attr('href'))
    if $thatContent.length > 0 && iScrollTop > $thatContent.offset().top - 60
      $that.addClass('active')
        .siblings().removeClass('active')



#选中菜单类型
$menuClass.on 'click', 'a', (event)->

  event.stopPropagation()
  event.preventDefault()

  $this = $ @
  sThisHref = $this.attr('href')
  $menusBox = $ sThisHref
  iMenusTop = $menusBox.offset().top - 55
  $('html, body').animate({'scrollTop': iMenusTop}, 400)




$cartMenus = $('#cartMenus')
#加入购物车按钮
carTpl = '<div class="menuTool"><input type="button" class="menuToolCut" value="-">
              <input type="number" class="menuToolTxt" value="1" max="100" min="1"><input type="button" class="menuToolAdd" value="+" />
          </div>'
$('.menuAddBtn').on 'click', (event)->
  event.preventDefault()
  $this = $(@)
  $this.hide()
    .after carTpl
  setCar.init $this.parents('.menuAddBox').data('id'), 1


#购物车删除
$cartMenus.on 'click', '.cMenusClose', ->
  $this = $(@)
  $thisParent = $this.parents('li')
  iThisId = $thisParent.data('id')
  #删除
  $thisParent.remove()
  #重置菜单
  setCar.clearMenu $('.menuAddBox[data-id="'+iThisId+'"]')
  #设置总数
  setCar.setCount()


#数量add
$(document).on 'click', '.menuToolAdd', ()->
  setCar.init $(@).parents('.mToolBox').data('id'), 1

#数量cut
$(document).on 'click', '.menuToolCut', ()->
  setCar.init $(@).parents('.mToolBox').data('id'), -1

#数量文本框输入
$(document).on 'keyup', '.menuToolTxt', ->
  $this = $ @
  iThisVal = +$(@).val()
  if iThisVal > 0
    setCar.init $this.parents('.mToolBox').data('id'), iThisVal, !0



setCar = {

  ###
   * 创建购物车list dom
   * @param id 餐单id
   * @param tit 标题
   * @param price 单价
  ###
  getListTpl: (id, tit, price)->
    tpl = '<li class="mToolBox" data-id="' +id+ '" data-price="' +price+ '">
          <div class="cMenusTitle">' +tit+ '</div>
          <div class="menuTool cMenusTool">
            <input type="button" class="menuToolCut" value="-">
            <input type="number" class="menuToolTxt" value="1" max="100" min="1">
            <input type="button" class="menuToolAdd" value="+">
          </div>
          <div class="cMenusPrice money">' +price+'</div>
          <div class="cMenusClose">X</div>
        </li>'

    return tpl

  ###
  * 绑定增减点餐数量事件
  * @param id 餐单id
  * @param num 加减/具体数值
  * @param isInput 是否输入值(如果为true,num取具体数值)
  ###
  init: (id, num, isInput)->

    this.$cartMenu = $cartMenus.children('li[data-id="'+id+'"]')
    this.$menuAddBox = $('.menuAddBox[data-id="'+id+'"]')
    $menuParent = this.$menuAddBox.parents('li.contentBox')
    sTitle = $menuParent.find('.menuTitle').text()
    sPrice = $menuParent.find('.menuPrice').text()
    if(this.$cartMenu.length > 0)

      this.setNum num, isInput

    else

      $cartMenus.append  this.getListTpl(id, sTitle, sPrice)
      this.$cartMenu = $('li[data-id="'+id+'"]')

    this.setCount()

  ###
  * 设置表单数字
  * @param num 加减/具体数值
  * @param isInput 是否输入值(如果为true,num取具体数值)
  ###
  setNum: (num, isInput)->

    $cartMenuTxt = this.$cartMenu.find('.menuToolTxt')
    $menuTxt = this.$menuAddBox.find('.menuToolTxt')
    iThisVal = +$menuTxt.val()

    if !isInput
      iThisVal += num
    else
      iThisVal = num

    if iThisVal < 1
      this.clearMenu this.$menuAddBox
      this.$cartMenu.remove()

    else
      $cartMenuTxt.val iThisVal
      $menuTxt.val iThisVal
      this.$cartMenu.children('.cMenusPrice').text(
        this.$cartMenu.data('price') * iThisVal
      )


  ###
  * 清空数量
  * @param obj 餐单list jquery对象
  ###
  clearMenu: (obj)->

    obj.children('.menuTool').remove()
    obj.children('.menuAddBtn').show()

  #计算价格数量
  setCount: ()->
    iAllCount = 0
    iAllPrice = 0
    $cartMenus.children('li').each ->
      iAllCount += +$(@).find('.menuToolTxt').val()
      iAllPrice += +$(@).find('.cMenusPrice').text()
    $('#cCount').html iAllCount
    $('#cPrice').html iAllPrice
}

###
  * 关闭弹窗
  ###
$(document).on 'click', '.pClose', ->
  $(@).parents('.popupWindow').fadeOut(300)
