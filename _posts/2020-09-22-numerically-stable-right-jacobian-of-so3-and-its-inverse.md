---
layout: post
title: "数值稳定的 SO3 Right Jacobian Matrix 及其逆"
categories: [Lie Group, Linear Algebra, SO3]
---

根据材料[^1]的推导，给定旋转向量$\boldsymbol{\theta} \in \mathbb{R}^3$，它对应的旋转矩阵为$\mathbf{R} \in \mathbb{R}^{3\times3} = \text{Exp}(\boldsymbol{\theta}) = \text{exp}([\boldsymbol{\theta}]_{\times})$。定义$\boldsymbol{\theta}$的 Right Jacobian Matrix 为：

$$
\mathbf{J}_r(\boldsymbol{\theta}) \overset{\Delta}{=} \frac{\partial\text{Exp}(\boldsymbol{\theta})}{\partial\boldsymbol{\theta}}
$$

材料[^1]同时给出了它和它的逆的展开式：

$$
\mathbf{J}_r(\boldsymbol{\theta}) = \mathbf{I} - \frac{1 - \cos\|\boldsymbol{\theta}\|}{\|\boldsymbol{\theta}\|^2} [\boldsymbol{\theta}]_{\times} + \frac{\|\boldsymbol{\theta}\| - \sin\|\boldsymbol{\theta}\|}{\|\boldsymbol{\theta}\|^3} [\boldsymbol{\theta}]_{\times}^2 \\
\mathbf{J}^{-1}_r(\boldsymbol{\theta}) = \mathbf{I} + \frac{1}{2} [\boldsymbol{\theta}]_{\times} + \Big(\frac{1}{\|\boldsymbol{\theta}\|^2} - \frac{1 + \cos\|\boldsymbol{\theta}\|}{2\|\boldsymbol{\theta}\|\sin\|\boldsymbol{\theta}\|}\Big) [\boldsymbol{\theta}]_{\times}^2
$$

一般情况下，把对应的旋转向量带入即可，但是当旋转角度$\theta = \|\boldsymbol{\theta}\|$太小的时候，就需要将上式进行泰勒展开。

根据上式几个项的泰勒展开：

1. <https://www.wolframalpha.com/input/?i=taylor(1-cos(x))%2Fx%5E2%2Cx%3D0>
2. <https://www.wolframalpha.com/input/?i=taylor(x-sin(x))%2Fx%5E3%2Cx%3D0>
3. <https://www.wolframalpha.com/input/?i=taylor(1%2Fx%5E2-(1%2Bcos(x))%2F(2xsin(x)))%2Cx%3D0>

忽略泰勒展开后的二次方及以上的项，可以得到：

$$
\mathbf{J}_r(\boldsymbol{\theta}) \approx \mathbf{I} - \frac{1}{2} [\boldsymbol{\theta}]_{\times} + \frac{1}{6} [\boldsymbol{\theta}]_{\times}^2 \\
\mathbf{J}^{-1}_r(\boldsymbol{\theta}) \approx \mathbf{I} + \frac{1}{2} [\boldsymbol{\theta}]_{\times} + \frac{1}{12} [\boldsymbol{\theta}]_{\times}^2
$$

# References

[^1]: J. Solà, “Quaternion kinematics for the error-state Kalman filter,” arXiv:1711.02508 [cs], Nov. 2017, Accessed: Nov. 17, 2019. [Online]. Available: http://arxiv.org/abs/1711.02508.

# Links

1. <https://en.wikipedia.org/wiki/Axis%E2%80%93angle_representation#Relationship_to_other_representations>
2. <http://ethaneade.com/lie.pdf>
3. <http://www.iri.upc.edu/people/jsola/JoanSola/objectes/notes/kinematics.pdf>
4. <http://ethaneade.com/lie_groups.pdf>
