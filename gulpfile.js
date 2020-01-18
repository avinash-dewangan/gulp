// Initialize modules
//npm install --save-dev gulp gulp-sourcemaps gulp-sass gulp-concat gulp-uglify gulp-postcss autoprefixer cssnano gulp-replace

// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
var replace = require('gulp-replace');
const browsersync = require('browser-sync').create(); //npm i browser-sync
const cleanDir = require('gulp-clean'); //npm i gulp-clean-dir
const rename = require("gulp-rename");

// File paths
const files = { 
    scssPath: 'app/scss/editor/**/*.scss',
    scssPathOutput: 'app/scss/output/**/*.scss',
    scssPathCommon: 'app/scss/common/**/*.scss',
    jsPathEditor: 'app/js/editor/**/*.js',
    jsPathOutput: 'app/js/output/**/*.js',
    jsPathCommon: 'app/js/common/**/*.js',
}

// Sass task: compiles the style.scss file into style.css
function scssTask(){    
    return src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass().on('error', sass.logError)) // compile SCSS to CSS
        .pipe(rename({ suffix: ".min" }))
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest('dist/css/editor')
    ); // put final CSS in dist folder
}

// Sass task: compiles the style.scss file into style.css
function scssTaskOutput(){    
    return src(files.scssPathOutput)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass().on('error', sass.logError)) // compile SCSS to CSS
        .pipe(rename({ suffix: ".min" }))
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest('dist/css/output')
    ); // put final CSS in dist folder
}

// Sass task: compiles the style.scss file into style.css
function scssTaskCommon(){    
    return src(files.scssPathCommon)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass().on('error', sass.logError)) // compile SCSS to CSS
        .pipe(rename({ suffix: ".min" }))
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest('dist/css/common')
    ); // put final CSS in dist folder
}


// JS task: concatenates and uglifies JS files to script.js
function jsTask(){
    return src([
        files.jsPathEditor
        //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
        ])
        .pipe(concat('editor.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js/editor')
    );
}

// JS task: concatenates and uglifies JS files to script.js
function jsTaskOutput(){
    return src([
        files.jsPathOutput
        //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
        ])
        .pipe(concat('output.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js/output')
    );
}

function jsTaskCommon(){
    return src([
        files.jsPathCommon
        //,'!' + 'app/js/common/.js', // to exclude any specific files
        ])
        .pipe(concat('common.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js/common')
    );
}

// Cachebust
var cbString = new Date().getTime();
function cacheBustTask(){
    return src(['index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('.'));
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
    watch([files.scssPath, files.scssPathOutput, files.jsPathEditor, files.jsPathOutput, files.jsPathCommon], 
        series(
            parallel(scssTask, scssTaskOutput, scssTaskCommon, jsTask, jsTaskOutput, jsTaskCommon),
             cacheBustTask
        )
    ); 
    // browsersync.init({
    //     server:{
    //     //    opern : 'external',
    //     //    proxy : 'http:/localhost/',
    //     //    port : 8080,
    //      baseDir: './'
    //     }
    //   });
    //   //gulp.watch('./sass/**/*.scss', style);
    //   watch('./*.html').on('change', browsersync.reload);
    //   watch('*.js/**/*.js').on('change', browsersync.reload);             
}

function cleanDirectory(){
    return src([
        './dist'
    ])
    .pipe(cleanDir('./'))
    .pipe(dest('./'));
}



// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(
    parallel(cleanDirectory, scssTask, scssTaskOutput, scssTaskCommon, jsTask, jsTaskOutput, jsTaskCommon), 
    cacheBustTask, watchTask
);

