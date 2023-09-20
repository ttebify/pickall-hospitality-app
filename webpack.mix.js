const mix = require("laravel-mix");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

// No vendor css
mix.copy("resources/css/app.css", "public/css");
mix.copy("resources/css/vendor/**/*.css", "public/css/vendor");
mix.copy("resources/js/vendor/**/*.js", "public/js/vendor");

mix.js("resources/js/app.js", "public/js")
    .js("resources/js/custom.js", "public/js")
    .js("resources/js/infobox.js", "public/js")
    .js("resources/js/maps.js", "public/js")
    .js("resources/js/table-fixed-header.js", "public/js");

mix.copy("resources/images", "public/images");
mix.copy("resources/fonts", "public/fonts");

mix.browserSync({ proxy: "localhost:8000/" });
