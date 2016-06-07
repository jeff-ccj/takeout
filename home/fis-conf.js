///* Mock 假数据模拟测试 */
//fis.match('/test/**', {
//    release: '$0'
//});
//
//fis.match('/test/server.conf', {
//    release: '/config/server.conf'
//});
//
//fis.set('project.files', ['test/**', 'frontEnd/**']);

/* 设置编译范围 */
//fis.set('project.files', ['frontEnd/**']);

/* 从构建中去除某些资源 */
fis.set('project.ignore', [
    '.git/**',
    '.svn/**',
    '.idea/**',
    'fis-conf.js',
    'base/*.jade'
]);

/*
 * 开启相对地址
 * https://github.com/fex-team/fis3/blob/master/doc/docs/fis2-to-fis3.md
 * npm install -g fis3-hook-relative
 */
fis.hook('relative');
/* 让所有文件，都使用相对路径 */
fis.match('**', { relative: true });



/* ===============
 * 模板语言编译
 * ===============*/

/*
 * 生成css文件
 * npm install -g fis-parser-node-sass 插件进行解析
 * npm install -g fis-postprocessor-autoprefixer 自动补全css私有前缀
*/
fis.match('*.{scss,sass}', {
    parser: fis.plugin('node-sass', {
        // options...
    }),
    rExt: '.css',
    postprocessor: fis.plugin('autoprefixer', {
        'browsers': ['last 2 version', '> 10%', '> 5% in CN', 'ie 8', 'ie 9', 'ie 10', 'Android 4.1', 'Android 4.3', 'Android 4.4.4'],
        'cascade': true,
        //"remove": true
    })
})

/*
 * 生成js文件
 * npm install -g fis-parser-coffee-script 插件进行解析
*/
fis.match('*.coffee', {
    parser: fis.plugin('coffee-script'),
    // .coffee 文件后缀构建后被改成 .js 文件
    rExt: '.js'
})

/*
* 生成html文件
* npm install -g fis-parser-jade 插件进行解析
*/
fis.match('*.jade', {
    parser: fis.plugin('jade', {
        pretty: true //不合并html文本,默认false
    }),
    // .jade 文件后缀构建后被改成 .html 文件
    rExt: '.html',
    loaderLang : 'html'
})


fis.match('/base/js/*', {
    packTo: 'static/js/base.js',
    release: ''
});

/* 将static里面的css 打包为base.css */
fis.match('/base/css/*', {
    packTo: 'static/css/base.css',
    release: ''
});


//使用模块化自动包装成 amd
//npm install -g fis3-hook-commonjs
fis.hook('commonjs', {
    // 配置项
    paths: {
        'jquery': '/base/js/jquery.js',
        'common': '/base/js/common.coffee',
    }
})
fis.match('/base/js/{jquery,common}.{js,coffee}', {
    isMod: true, //设置模块化,
    optimizer: fis.plugin('uglify-js')
})


/* 模块化加载器配置 */
fis.match('::package', {
    postpackager: fis.plugin('loader', {
        processor: {
            '.html': 'html',
            // 支持 jade 文档
            '.jade': 'html'
        }
    }),
    // 启用 fis-spriter-csssprites 插件
    spriter: fis.plugin('csssprites')
})

// 对 CSS 进行图片合并
fis.match('*.{scss,sass,css}', {
    // 给匹配到的文件分配属性 `useSprite`
    useSprite: true
})
    .match('*.js', {
        optimizer: fis.plugin('uglify-js'),
    })
    .match('*.{scss,sass,css}', {
        optimizer: fis.plugin('clean-css'),
    })


//已编译不再输出
fis.match('**', {
    deploy: [
        fis.plugin('skip-packed'),
        fis.plugin('local-deliver', {
            to: '../dist'
        })
    ]
})




fis.hook('relative');
/* 让所有文件，都使用相对路径 */
fis.match('**', { relative: true });



//fis.match('::package', {
//    deploy: [
//
//        fis.plugin(function(options, modified, total, next) {
//            console.log(total)
//            // 从 total 中根据文件名把没用的文件去掉
//            // arr.splice
//            // 处理完了记得调用 next
//            next()
//        }),
//
//        fis.plugin('zip', {
//            filename: 'templates.zip'
//        }),
//
//        fis.plugin('local-deliver', {
//            to: './output'
//        })
//    ]
//})