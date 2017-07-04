var gulp 					 = require('gulp'), 
		browserSync 	 = require('browser-sync'),
		sass 					 = require('gulp-sass'),
		pug 					 = require('gulp-pug'),
		concat 				 = require('gulp-concat'),
		uglify 				 = require('gulp-uglify'),
		rename 				 = require('gulp-rename'),
		mainBowerFiles = require('main-bower-files'),
		postcss 			 = require('gulp-postcss'),
		autoprefixer 	 = require('autoprefixer'),
		svgSprite 		 = require('gulp-svg-sprite'),
		svgmin 				 = require('gulp-svgmin'),
		replace				 = require('gulp-replace'),
		cheerio				 = require('gulp-cheerio'),
		tinypng 			 = require('gulp-tinypng'),
		cssmin 				 = require('gulp-cssmin'),
		ttf2woff 			 = require('gulp-ttf2woff'),
		ttf2woff2			 = require('gulp-ttf2woff2');

var processors = [autoprefixer({browsers: ['last 5 versions', '> 1%']})];

gulp.task('pug', function(){
	gulp.src('app/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('./dist'))
		.pipe(browserSync.stream());
})

// sass
gulp.task('sass', function() {
	gulp.src('app/sass/*.sass')
		.pipe(sass())
    .pipe(postcss(processors)) 
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

// js
gulp.task('js', function() {
	gulp.src('app/js/*.js')
		.pipe(gulp.dest('dist/js'))
		.pipe(
			browserSync.stream());
});

// Libs.
gulp.task('libs', function() {
    gulp.src(mainBowerFiles())
    	.pipe(gulp.dest('app/libs'));
});
// CSS libs.
gulp.task('pluginsCss', function () {
    gulp.src('app/libs/*.css')
    	.pipe(concat('plugins.css'))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});
// JS libs.
gulp.task('pluginsJs', function () {
    gulp.src('app/libs/*.js')
    	.pipe(concat('plugins.js'))
      .pipe(gulp.dest('dist/js'))
		  .pipe(browserSync.stream());
});

 // images.
gulp.task('images', function(){
	gulp.src('app/images/*')
		.pipe(gulp.dest('dist/images'))
		.pipe(browserSync.stream());
});

//  fonts.
gulp.task('fonts', function() {
	gulp.src('app/fonts/*')
		.pipe(gulp.dest('dist/fonts'))
		.pipe(browserSync.stream());
})

// SVG-sprite.
gulp.task('svgSpriteBuild', function () {
	gulp.src('app/icons/*.svg')
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				// $('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {xmlMode: true}
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "../sprite.svg",
					svg: {
						xmlDeclaration: false
					}
				}
			}
		}))
		.pipe(gulp.dest('dist/icons'))
		.pipe(browserSync.stream());
});

// // Deploy tasks // //
// images optimization.
gulp.task('tinypng', function () {
    gulp.src('app/images/*.{jpg, jpeg, png}')
        .pipe(tinypng('cMTvqZcj47gx4AlPzQLCZSF8vlKv9z_B'))
        .pipe(gulp.dest('dist/images'));
});
// ttf2woff.
gulp.task('ttf2woff', function(){
	gulp.src(['app/fonts/*.ttf'])
		.pipe(ttf2woff())
		.pipe(gulp.dest('dist/fonts'));
});
// ttf2woff2.
gulp.task('ttf2woff2', function(){
	gulp.src(['app/fonts/*.ttf'])
		.pipe(ttf2woff2())
		.pipe(gulp.dest('dist/fonts'));
});
// CSS minification.
gulp.task('cssMin', function(){
	gulp.src(['dist/css/*.css'])
		.pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/css'));
});
// JS minification.
gulp.task('jsMin', function(){
	gulp.src(['dist/js/*.js'])
		.pipe(uglify())
        .pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/js'));
});

// browserSync
gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'dist'
		},
		notify: false
	});
}); 


// // Default.
gulp.task('default', ['browser-sync', 'libs', 'pug', 'sass',  'js', 'pluginsJs', 'pluginsCss', 'images', 'fonts', 'svgSpriteBuild', 'watch']);

// WATCH
gulp.task('watch', function(){
	gulp.watch('app/*.pug', ['pug']);
	gulp.watch('app/pug/*.pug', ['pug']);
	gulp.watch('app/sass/*.sass', ['sass']);
	gulp.watch('app/js/*.js', ['js']);
	gulp.watch('app/images/*', ['images']);
	gulp.watch('app/fonts/*', ['fonts']);
	gulp.watch('app/icons/*', ['svgSpriteBuild']);

});

// Deploy.
gulp.task('deploy', function(){
	gulp.start('ttf2woff');
	gulp.start('ttf2woff2');
	gulp.start('tinypng');
	gulp.start('cssMin');
	gulp.start('jsMin');
});
