---
layout: post
title: "在macOS下优雅地使用$\\LaTeX$"
categories: [LaTeX]
---

# 安装 LaTeX 环境

macOS 下，很简单，只需要安装一个 MacTeX 就可以了，下载地址：<https://tug.org/mactex/mactex-download.html>。

# 最简单的中文，无特定格式

`simple_latex.tex`:

```latex
\documentclass{article}
\usepackage{xeCJK}
\setCJKmainfont{STSong}
\begin{document}
hello    中文
\end{document}
```

## 使用方法

1. 直接用`XeLaTeX`编译，注意不是`XeTeX`：

```bash
xelatex simple_latex.tex
```

2. 配合 vscode 的 latex workshop 插件，和下面的配置使用：

```json
{
    "latex-workshop.view.pdf.viewer": "tab",
    "latex-workshop.latex.recipes": [
        {
            "name": "xelatex",
            "tools": ["xelatex"]
        },
        {
            "name": "pdflatex -> bibtex -> pdflatex*2",
            "tools": ["pdflatex", "bibtex", "pdflatex", "pdflatex"]
        },
        {
            "name": "xelatex -> bibtex -> xelatex*2",
            "tools": ["xelatex", "bibtex", "xelatex", "xelatex"]
        }
    ],
    "latex-workshop.latex.tools": [
        {
            "name": "xelatex",
            "command": "xelatex",
            "args": [
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "-output-directory=%OUTDIR%",
                "%DOC%"
            ]
        },
        {
            "name": "latexmk",
            "command": "latexmk",
            "args": [
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "-output-directory=%OUTDIR%",
                "%DOC%"
            ]
        },
        {
            "name": "pdflatex",
            "command": "pdflatex",
            "args": [
                "-synctex=1",
                "-interaction=nonstopmode",
                "-file-line-error",
                "-output-directory=%OUTDIR%",
                "%DOC%"
            ]
        },
        {
            "name": "bibtex",
            "command": "bibtex",
            "args": ["%OUTDIR%/%DOCFILE%"]
        }
    ]
}
```

# 使用特定格式（比如高校的毕业论文模板）

> 对于特定的格式，找到对应的模板使用就好了，一般可以直接使用的，只要装了 texlive

比如浙江大学的毕业论文，有一个很好用的模板，下载下来就可以直接用，GitHub 地址：<https://github.com/TheNetAdmin/zjuthesis>。
