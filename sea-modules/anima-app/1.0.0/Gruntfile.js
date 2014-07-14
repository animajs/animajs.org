'use strict';

module.exports = function(grunt){

    grunt.initConfig({
        concat: {
          js : {
            options: {
              stripBanners: true
            },
            files: [
              {
                src: [
                  'src/intro.js',
                  'src/core.js',
                  'src/history.js',
                  'src/router.js',
                  'src/log.js',
                  'src/event.js',
                  'src/content.js',
                  'src/state.js',
                  'src/page.js',
                  'src/navbar.js',
                  'src/plugin.js',
                  'src/init.js',
                  'src/device.js',
                  'src/outro.js',
                ],
                dest: './index.js'
              }
            ],
          }
        },
        watch: {
          src: {
            files: ['./src/**/*.js', './Gruntfile.js'],
            tasks: ['concat']
          }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');


    //注意copy要放到最后不然build只会有压缩代码且除了css,js外没有其他文件
    grunt.registerTask('default', ['concat']);

    //开发时启用的本地代理
    grunt.registerTask('dev', [ 'watch']);

};
