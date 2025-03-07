import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx_preact.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import tailwindConfig from "./tailwind.config.mjs";
import postcss from "lume/plugins/postcss.ts";
import esbuild from "lume/plugins/esbuild.ts";
import picture from "lume/plugins/picture.ts";
import transformImages from "lume/plugins/transform_images.ts";

const site = lume({
    src: "site",
});

site.use(
    esbuild({
        options: {
            minify: false,
            splitting: true,
        },
    }),
);
site.use(jsx());
site.use(tailwindcss({
    options: tailwindConfig,
}));
site.use(picture());
site.use(transformImages());
site.use(postcss());

export default site;
