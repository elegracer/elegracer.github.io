---
layout: post
title: "在球缺上均匀采样"
categories: [math, spherical cap, distribution, sample]
---

# 前言

[球缺（Spherical Cap）](https://en.wikipedia.org/wiki/Spherical_cap)就是在一个球上被切一刀，剩下的部分。

如下图所示，

![](/static/img/20201225/spherical_cap_diagram.png)
_Source: [Wikipedia](https://commons.wikimedia.org/wiki/File:Spherical_cap_diagram.tiff#/media/File:Spherical_cap_diagram.tiff)_

球缺就是途中浅蓝色部分。$r$是球体的半径，$a$是球缺的底面半径，$h$是球缺的高，$\theta$是球缺的极角（Polar Angle）。

|        | 用$r$和$h$                       | 用$a$和$h$                            | 用$r$和$\theta$                                                |
| ------ | -------------------------------- | ------------------------------------- | -------------------------------------------------------------- |
| 体积   | $V={\frac {\pi h^{2}}{3}}(3r-h)$ | $V={\frac {1}{6}}\pi h(3a^{2}+h^{2})$ | $V={\frac {\pi }{3}}r^{3}(2+\cos \theta )(1-\cos \theta )^{2}$ |
| 表面积 | $A = 2 \pi r h$                  | $A = \pi (a^2 + h^2)$                 | $A = 2 \pi r^2 (1 - \cos \theta)$                              |

# 在单位圆内均匀采样

在考虑球缺表面的均匀采样之前，我们先考虑在单位圆内均匀采样。[这篇文章](https://mathworld.wolfram.com/DiskPointPicking.html)介绍了一种在单位圆中均匀采样的算法。

在说明正确做法前，先来说说一个常用的错误做法。首先利用均匀采样，取得两个变量$r \in [0, 1]$和$\theta \in [-\pi, \pi]$。然后我们可以用它们表示在单位圆中的坐标为：

$$
(r \cos \theta, r \sin \theta)
$$

我们来考虑面积的分布。对单位圆的面积公式$A = \pi r^2$求微分，可以得到：

$$
dA = 2 \pi r dr
$$

从这个公式可以看出，$dA$和$dr$并不成线性关系，而是还有一个可变系数$r$，因此当固定角度时，在半径方向上对$r$的均匀采样并不能得到均匀的分布。因此这种采样将会获得下图的分布

![](/static/img/20201225/unit_disk_sample_1.png)

我们会发现，越靠近圆心，点越密集，这也证明了半径方向上分布不均。

如果我们把点坐标改为：

$$
(\sqrt{r} \cos \theta, \sqrt{r} \sin \theta)
$$

那么上面的微分就变为：

$$
dA = 2 \pi \sqrt{r} d \sqrt{r} = \pi dr
$$

$dA$和$dr$是线性关系，且$\sqrt{r} \in [0, 1], r \in [0, 1]$，所以我们得到了半径方向上的均匀分布。

而面积与角度同样是线性分布的，故最终采样的结果会像下图一样，在单位圆中均匀分布。

![](/static/img/20201225/unit_disk_sample_2.png)

下面我们的更复杂的采样，都会基于单位圆内的均匀采样，然后通过[等面积映射](https://en.wikipedia.org/wiki/Equal-area_map)，得到对应平面或曲面的均匀采样。

# 单位球面的均匀采样

> To Be Continued

# 球缺的均匀采样

> To Be Continued

# 三维旋转的均匀采样

> To Be Continued

# 参考资料

-   <https://en.wikipedia.org/wiki/Spherical_cap>
-   <https://marc-b-reynolds.github.io/distribution/2016/11/28/Uniform.html>
-   <https://marc-b-reynolds.github.io/distribution/2017/01/27/UniformRot.html>
-   <https://mathworld.wolfram.com/DiskPointPicking.html>
-   <https://projecteuclid.org/download/pdf_1/euclid.aoms/1177692644>
