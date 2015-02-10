module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      my_target: {
        files: {
          'app/main.min.js': 'app/main.js',
        }
      }
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['assets/js/underscore.js', 'assets/js/backbone.js', 'app/main.min.js'],
        dest: 'prod/app/main.min.js',
      },
    },
    cssmin: {
      target: {
        files: {
          'css/main.min.css': 'css/main.css'
        }
      }
    },
    watch: {
      scripts: {
        files: 'app/main.js',
        tasks: ['jshint', 'uglify', 'concat', 'cssmin']
      }
    },
    jshint: {
      all: ['app/main.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['watch']);

};