const gulp = require('gulp');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();

// Caminhos dos arquivos
const paths = {
    scripts: {
        src: 'src/views/js/script.js', // Arquivo JS original
        dest: 'src/views/js/'         // Pasta onde será salvo o min.js
    },
    html: {
        src: 'src/**/*.html'          // Arquivos HTML
    }
};

// Tarefa para ofuscar e gerar min.js
gulp.task('minify-and-obfuscate', function () {
    return gulp.src(paths.scripts.src)
        .pipe(terser({
            compress: true,
            mangle: { toplevel: true }
        }))
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream()); // Atualiza o navegador
});

// Tarefa para iniciar o servidor
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: './src/views',  // Diretório base do servidor
        },
        port: 3000,
        logLevel: "debug"     // Logs detalhados
    });

    gulp.watch(paths.scripts.src, gulp.series('minify-and-obfuscate')); // JS
    gulp.watch(paths.html.src).on('change', browserSync.reload);        // HTML
});

// Tarefa padrão
gulp.task('default', gulp.series('minify-and-obfuscate', 'serve'));
