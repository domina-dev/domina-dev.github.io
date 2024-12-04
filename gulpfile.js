const gulp = require('gulp');
const terser = require('gulp-terser');
const rename = require('gulp-rename');

// Caminhos
const paths = {
    scripts: {
        src: 'src/views/js/test-file.js',
        dest: 'src/views/js/'
    }
};

// Minificação e Ofuscação
gulp.task('minify-and-obfuscate', function () {
    return gulp.src(paths.scripts.src, { allowEmpty: true })
        .pipe(terser({
            compress: {
                passes: 2, // Realiza múltiplas passagens para maior compressão
                drop_console: true // Remove `console.log` e outros comandos de depuração
            },
            mangle: {
                toplevel: true // Ofusca nomes no escopo superior
            }
        }).on('error', function (err) {
            console.error('Erro ao minificar o arquivo:', err.message);
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.scripts.dest))
        .on('end', function () {
            console.log('Arquivo minificado e ofuscado salvo com sucesso!');
        });
});
