---
layout: post
title: 轨迹可视化
---

<style>
    body {
        max-width: 80%;
    }

    .parent-div {
        display: table;
        height: 400px;
        width: 100%;
        overflow: hidden;
    }

    #drop_zone {
        height: 75px;
        border: 1px solid #000;
        margin: 10px 5px 0 0;
        text-align: center;
        display: table-cell;
        vertical-align: middle;
    }

    #plots {
        text-align: center;
    }

    #to_top {
        display: none;
        position: fixed;
        bottom: 20px;
        right: 30px;
        z-index: 99;
        border: none;
        outline: none;
        background-color: rgb(41, 41, 41);
        color: white;
        cursor: pointer;
        padding: 10px 15px;
        border-radius: 5px;
        font-size: 18px;
    }

    #to_top:hover {
        background-color: #555;
    }
</style>

**使用说明**：点击按钮添加`tum`格式的轨迹文件，可以多选，也可以直接拖拽文件到下面的方框中。

<output id="plots"></output>

<input type="file" id="click_upload" name="files[]" multiple />
<div class="parent-div">
    <div id="drop_zone">
        Drop files here
    </div>
</div>

<button onclick="toTop()" id="to_top" title="Go to top">Top</button>
<script src="//cdnjs.loli.net/ajax/libs/plotly.js/1.57.1/plotly.min.js"></script>
<script src="{{site.baseurl}}/static/js/trajvis.js"></script>
