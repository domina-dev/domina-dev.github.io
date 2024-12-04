const gulp = require('gulp');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();

// Caminhos dos arquivos
const paths = {
    scripts: {
        src: 'src/views/js/test-file.js',     // Atualizado para refletir o novo local
        dest: 'src/views/js/'              // Pasta onde será salvo o min.js
    },
    html: {
        src: './*.html'              // Agora observando os arquivos HTML na raiz
    }
};

// Tarefa para ofuscar e gerar min.js
gulp.task('minify-and-obfuscate', function () {
    return gulp.src(paths.scripts.src, { allowEmpty: true }) // Lê o arquivo original definido em paths.scripts.src
        .pipe(terser({                // Minifica e ofusca o arquivo usando gulp-terser
            compress: true,           // Ativa a compressão do código
            mangle: { toplevel: true } // Ofusca identificadores no nível superior
        }))
        .pipe(gulp.dest(paths.scripts.dest)) // Salva o arquivo minificado no destino definido em paths.scripts.dest
        .pipe(browserSync.stream());        // Atualiza o navegador automaticamente
});
// gulp.task('minify-and-obfuscate', function () {
//     console.log('Iniciando processo de minificação');

//     return gulp.src(paths.scripts.src, { allowEmpty: true })
//         .on('data', function (file) {
//             console.log('Arquivo encontrado:', file.path);
//         })
//         .pipe(terser({
//             compress: true,
//             mangle: { toplevel: true }
//         }).on('error', function (err) {
//             console.error('Erro ao minificar o arquivo:', err.message);
//         }))
//         .pipe(gulp.dest(paths.scripts.dest))
//         .on('end', function () {
//             console.log('Arquivo minificado salvo com sucesso!');
//         });
// });

// Tarefa para iniciar o servidor
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: './',  // Diretório base atualizado para a raiz do projeto
        },
        port: 3000,
        logLevel: "debug" // Logs detalhados
    });

    gulp.watch(paths.scripts.src, gulp.series('minify-and-obfuscate')); // JS
    gulp.watch(paths.html.src).on('change', browserSync.reload);        // HTML
});

// Tarefa padrão
gulp.task('default', gulp.series('minify-and-obfuscate', 'serve'));
