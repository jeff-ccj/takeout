/*
 分页插件类
 @param options {Object}
 {
     nowPage : 当前页
     size : 每页条数
     count : 总数
     url : url地址
 }
 @return  options {Object}
 */
function paginate(options){

    var option = {
        nowPage: options.nowPage || 1
        , size: options.size || 10
        , count: options.count
        , url: options.url
    }



    var pageQuery = {
        pageList: []
        , first: 1
        , last: 1
        , prev: 1
        , next: 1
        , maxPage: 1
        , nowPage: option.nowPage
        , url: option.url
    }

    pageQuery.maxPage = Math.ceil(option.count / option.size)

    ;(function(){

        //当前页面-4,如果少于0则后段-负数得出后段
        var pageI = +option.nowPage - 5,
            pageLen = +option.nowPage + 5,
            oPageList

        if (pageI < 1){
            pageLen -= pageI
            pageI = 1
        }

        if(pageLen > pageQuery.maxPage){
            pageI -= (pageLen - pageQuery.maxPage)
            pageLen = pageQuery.maxPage
            if (pageI < 1) pageI = 1
        }

        for(pageI; pageI <= pageLen; pageI++){

            oPageList = {
                num: pageI
                , url: option.url + '/' + pageI
            }

            if(pageI == option.nowPage)
                oPageList['isThis'] = !0

            pageQuery.pageList.push(oPageList)

        }

        //上下一页
        pageQuery.prev = pageI - 1 < 1 ? !1 : pageI - 1
        pageQuery.next = pageI + 1 > pageQuery.maxPage ? !1 : pageI + 1

        //最后一页
        pageQuery.last = pageQuery.maxPage

    })(global)

    return pageQuery

}

module.exports = paginate;
