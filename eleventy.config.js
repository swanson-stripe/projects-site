import fs from "fs";
import matter from "gray-matter";
import { createRequire } from "module";
import MarkdownIt from "markdown-it";
import pluginWebc from "@11ty/eleventy-plugin-webc";
import htmlmin from "html-minifier-terser";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { IdAttributePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

const require = createRequire(import.meta.url);
const getMarkdownHighlighter = require("@11ty/eleventy-plugin-syntaxhighlight/src/markdownSyntaxHighlightOptions.js");
const highlightCode = getMarkdownHighlighter({});
const md = new MarkdownIt({
	html: true,
	highlight: (str, lang) => highlightCode(str, lang),
});
const isServe = process.argv.includes("--serve");

export default function(eleventyConfig)  {
    // Full page reload (no DOM diff) when HTML or data changes; watch dist CSS for Tailwind
    eleventyConfig.setServerOptions({
        watch: ["dist/**/*.css"],
        domDiff: true,
    });
    // Rebuild when quickstart markdown changes (index.webc uses that collection)
    eleventyConfig.addWatchTarget("src/quickstart/**/*.md");
    eleventyConfig.addWatchTarget("src/blog/**/*.md");
    eleventyConfig.addPlugin(pluginWebc, { components: "src/_components/**/*.webc"});
    eleventyConfig.addPassthroughCopy({"src/.well-known": ".well-known"});
    eleventyConfig.addPassthroughCopy({"src/assets/js": "assets/js"});
    eleventyConfig.addPassthroughCopy({"src/assets/images": "assets/images"});
    eleventyConfig.addPassthroughCopy({"src/assets/fonts": "assets/fonts"});
    // passthrough markdown.css
    eleventyConfig.addPassthroughCopy({"src/assets/css/markdown.css":"assets/css/markdown.css"});
    eleventyConfig.addPassthroughCopy({"src/llm.txt":"llm.txt"});
    eleventyConfig.addPassthroughCopy({"skill.md":"skill.md"});
    eleventyConfig.addPassthroughCopy({"skills.md":"skills.md"});

    // Minify HTML only in production build (skip in --serve for faster reloads)
    if (!isServe) {
        eleventyConfig.addTransform("htmlmin", function (content) {
            if ((this.page.outputPath || "").endsWith(".html")) {
                return htmlmin.minify(content, {
                    useShortDoctype: true,
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true,
                });
            }
            return content;
        });
    }

    // Quickstart collection: pre-render markdown so we avoid templateContent (render-order safe)
    eleventyConfig.addCollection("quickstart", (collection) => {
        const templates = collection.getFilteredByGlob("./src/quickstart/*.md");
        return templates
            .map((t) => {
                const { data, content } = matter(fs.readFileSync(t.inputPath, "utf-8"));
                return { data, content: md.render(content) };
            })
            .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0));
    });

    // Blog collection: pre-render markdown, sort by date descending
    eleventyConfig.addCollection("blog", (collection) => {
        const templates = collection.getFilteredByGlob("./src/blog/*.md");
        return templates
            .map((t) => {
                const { data, content } = matter(fs.readFileSync(t.inputPath, "utf-8"));
                const slug = t.inputPath.split("/").pop().replace(".md", "");
                const date = new Date(data.date);
                const postDate = date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
                return { data: { ...data, slug, postDate }, content: md.render(content) };
            })
            .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
    });

    // Syntax Highlighting
    eleventyConfig.addPlugin(syntaxHighlight);

    // Anchor links on heading tags
    eleventyConfig.addPlugin(IdAttributePlugin, {
		selector: "h1,h2,h3",
		decodeEntities: true,
		slugify: eleventyConfig.getFilter("slugify"),
	});

    // Image optimization
    eleventyConfig.addPlugin(eleventyImageTransformPlugin);

    return {
        htmlTemplateEngine: "webc",
        dir: {
            input: "src",
            output: "dist",
            includes: "_components",
            layouts: "_layouts",
            data: "_data",
        }
    }
};