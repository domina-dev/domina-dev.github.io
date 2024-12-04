import gulp from 'gulp';
import terser from 'gulp-terser';
import browserSync from 'browser-sync';
import rename from 'gulp-rename';
import { deleteAsync } from 'del';

const browserSyncInstance = browserSync.create();

// Caminhos dos arquivos
const paths = {
    scripts: {
        src: 'src/views/js/*.js',         // Todos os arquivos .js no diretório
        original: 'src/views/js/script.js', // O arquivo original específico
        dest: 'src/views/js/',
        minified: 'src/views/js/*.min.js' // Todos os arquivos minificados
    },
    html: {
        src: './*.html'
    }
};

// Tarefa para minificar e criar o arquivo `.min.js`
gulp.task('minify', function () {
    return gulp.src(paths.scripts.original, { allowEmpty: true })
        .pipe(terser({
            compress: true,
            mangle: { toplevel: true }
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.scripts.dest)) // Salva o arquivo minificado
        .pipe(browserSyncInstance.stream());
});

// Tarefa para apagar todos os arquivos `.js` exceto os `.min.js`
gulp.task('clean-js', async function () {
    await deleteAsync([
        `${paths.scripts.dest}*.js`,        // Apaga todos os arquivos .js
        `!${paths.scripts.dest}*.min.js`   // Exceto os arquivos minificados
    ]);
});

// Tarefa combinada para minificar e limpar
gulp.task('minify-and-obfuscate', gulp.series('minify', 'clean-js'));

// Tarefa para iniciar o servidor e observar mudanças nos arquivos
gulp.task('serve', function () {
    browserSyncInstance.init({
        server: {
            baseDir: './'
        },
        port: 3000
    });

    gulp.watch(paths.scripts.original, gulp.series('minify-and-obfuscate')); // Minifica e limpa
    gulp.watch(paths.html.src).on('change', browserSyncInstance.reload);   // Atualiza o HTML
});

// Tarefa padrão
gulp.task('default', gulp.series('minify-and-obfuscate', 'serve'));
