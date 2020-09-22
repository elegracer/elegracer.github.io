---
layout: post
title: "Hello World"
categories: [KaTeX]
---

我又发现 Jekyll 使用 KaTeX 只要在`_config.yml`里面设置好

```yaml
kramdown:
    smart_quotes: apos,apos,quot,quot
```

然后在 html 的`</body>`之前加入下面这几行

```html
<link
    rel="stylesheet"
    href="//cdnjs.loli.net/ajax/libs/KaTeX/0.12.0/katex.min.css"
    integrity="sha384-AfEj0r4/OFrOo5t7NnNe46zW/tFgW6x/bCJG8FqQCEo3+Aro6EYUG4+cU+KJWu/X"
    crossorigin="anonymous"
/>
<script
    defer
    src="//cdnjs.loli.net/ajax/libs/KaTeX/0.12.0/katex.min.js"
    integrity="sha384-g7c+Jr9ZivxKLnZTDUhnkOnsh30B4H0rpLUpJ4jAIKs4fnJI+sEnkvrMWph2EDg4"
    crossorigin="anonymous"
></script>
<script
    defer
    src="//cdnjs.loli.net/ajax/libs/KaTeX/0.12.0/contrib/auto-render.min.js"
    integrity="sha384-mll67QQFJfxn0IYznZYonOWZ644AWYC+Pt2cHqMaRhXVrursRwvLnLaebdGIlYNa"
    crossorigin="anonymous"
></script>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        function stripcdata(x) {
            if (x.startsWith("% <![CDATA[") && x.endsWith("%]]>"))
                return x.substring(11, x.length - 4);
            return x;
        }
        document
            .querySelectorAll("script[type='math/tex']")
            .forEach(function (el) {
                el.outerHTML = "\\(" + stripcdata(el.textContent) + "\\)";
            });
        document
            .querySelectorAll("script[type='math/tex; mode=display']")
            .forEach(function (el) {
                el.outerHTML = "\\[" + stripcdata(el.textContent) + "\\]";
            });
        renderMathInElement(document.body, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false },
                { left: "\\[", right: "\\]", display: true },
                { left: "\\(", right: "\\)", display: false },
            ],
            output: "html",
        });
    });
</script>
```

就可以正常使用了。

值得注意的是，默认设置下，`display`模式也就是块状的公式，用`\\`分割的多行之间距离太小，
实际上在 html 中有一个`class="newline"`的元素隔开的，只需要在 css 里设置这个元素的高度就好了。

```css
.newline {
    height: 0.5em;
}
```

$\LaTeX$

$$\LaTeX$$
