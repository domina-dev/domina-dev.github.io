import gulp from 'gulp';
import terser from 'gulp-terser';
import browserSync from 'browser-sync';
import rename from 'gulp-rename';
import { deleteAsync } from 'del';
import javascriptObfuscator from 'gulp-javascript-obfuscator';

const browserSyncInstance = browserSync.create();

// Variável para determinar o ambiente (produção ou desenvolvimento)
const isProduction = process.env.NODE_ENV === 'production';

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
    if (isProduction) {
        console.log('Ambiente de produção: Minificação e ofuscação iniciadas.');
        return gulp.src(paths.scripts.original, { allowEmpty: true })
            .pipe(terser({
                compress: true,
                mangle: { toplevel: true }
            }))
            .pipe(javascriptObfuscator({
                compact: true, // Mantém o código o menor possível
                controlFlowFlattening: true, // Adiciona controle de fluxo para dificultar leitura
                deadCodeInjection: true, // Insere código "morto" para confundir
                renameGlobals: true, // Renomeia variáveis globais
                stringArrayEncoding: ['base64'] // Codifica strings para maior proteção
            }))
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest(paths.scripts.dest)) // Salva o arquivo minificado e ofuscado
            .pipe(browserSyncInstance.stream());
    } else {
        console.log('Ambiente de desenvolvimento: Minificação ignorada.');
        return gulp.src(paths.scripts.original)
            .pipe(gulp.dest(paths.scripts.dest));
    }
});

// Tarefa para apagar os arquivos `.js` com base no ambiente
gulp.task('clean-js', async function () {
    if (isProduction) {
        await deleteAsync([
            `${paths.scripts.dest}*.js`,        // Apaga todos os arquivos .js
            `!${paths.scripts.dest}*.min.js`   // Exceto os arquivos minificados
        ]);
        console.log('Ambiente de produção: Exclusão de arquivos executada.');
    } else {
        console.log('Ambiente de desenvolvimento: Exclusão de arquivos ignorada.');
    }
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
