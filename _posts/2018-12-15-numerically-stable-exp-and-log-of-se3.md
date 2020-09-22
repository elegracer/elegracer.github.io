---
layout: post
title: "Numerically stable exp and log of SE3"
categories: [Lie Group, Linear Algebra, SE3, SO3]
---

In the problem of SLAM, the pose of the camera is described as $\boldsymbol{\delta} = (\boldsymbol{\omega}, \boldsymbol{\upsilon}) \in \mathfrak{se}(3)$, with $\boldsymbol{\omega} = \theta \boldsymbol{u}$ as the 3-d angle-axis rotation vector, and $\boldsymbol{\upsilon}$ as the 3-d translation vector.

$\theta = \sqrt{\boldsymbol{\omega}^T \boldsymbol{\omega}}$ is the angle of rotation, and $\boldsymbol{u} = \boldsymbol{\omega}/\theta$ is the axis of rotation.

# Notations

## $\mathfrak{so}(3)$ and $\mathrm{SO}(3)$

$\mathrm{SO}(3)$: Rotations in 3D space. The elements of $\mathrm{SO}(3)$ are represented by orhogonal, inversible rotation matrices.

$$
\mathbf{R} \in \mathrm{SO}(3) \\
\mathbf{R}^{-1} = \mathbf{R}^T
$$

The Lie Algebra, $\mathfrak{so}(3)$ is the set of 3 $\times$ 3 skew-symmetric matrices. The generators of $\mathfrak{so}(3)$ correspond to the derivatives of rotation around each of the standard axes, evaluated at the identity.

$$
G_1 = \begin{pmatrix} 0 & 0 & 0 \\ 0 & 0 & -1 \\ 0 & 1 & 0 \end{pmatrix},
G_2 = \begin{pmatrix} 0 & 0 & 1 \\ 0 & 0 & 0 \\ -1 & 0 & 0 \end{pmatrix},
G_3 = \begin{pmatrix} 0 & -1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 0 \end{pmatrix}
$$

An element of $\mathfrak{so}(3)$ is the represented as a linear combination of the generators.

$$
\boldsymbol{\omega} \in \mathbb{R}^3 \\
\boldsymbol{\omega}_1 G_1 + \boldsymbol{\omega}_2 G_2 + \boldsymbol{\omega}_3 G_3 \in \mathfrak{so}(3)
$$

We simply denote $\boldsymbol{\omega} \in \mathfrak{so}(3)$ as a 3-d vector of the coefficients, and use $\boldsymbol{\omega}_\times$ to represent the corresponding skew-symmetric matrix.

## $\mathfrak{se}(3)$ and $\mathrm{SE}(3)$

$\mathrm{SE}(3)$: Rigid transformations in 3D space. The elements of $\mathrm{SE}(3)$ are represented by linear transformations on homogeneous 4-d vectors.

$$
\mathbf{R} \in \mathrm{SO}(3), \mathbf{t} \in \mathbb{R}^3 \\
C = \begin{pmatrix} \mathbf{R} & \mathbf{t} \\ \mathbf{0} & 1 \end{pmatrix} \in \mathrm{SE}(3)
$$

Some quick notes for reference:

$$
C_1, C_2 \in \mathrm{SE}(3) \\
C_1 \cdot C_2 = \begin{pmatrix} \mathbf{R}_1 & \mathbf{t}_1 \\ \mathbf{0} & 1 \end{pmatrix} \cdot \begin{pmatrix} \mathbf{R}_2 & \mathbf{t}_2 \\ \mathbf{0} & 1 \end{pmatrix} = \begin{pmatrix} \mathbf{R}_1 \mathbf{R}_2 & \mathbf{R}_1 \mathbf{t}_2 + \mathbf{t}_1 \\ \mathbf{0} & 1 \end{pmatrix} \\
C_1^{-1} = \begin{pmatrix} \mathbf{R}_1^T & - \mathbf{R}_1^T \mathbf{t} \\ \mathbf{0} & 1 \end{pmatrix}
$$

The Lie Algebra $\mathfrak{se}(3)$ is the set of 4 $\times$ 4 matrices corresponding to differential translations and rotations (as in $\mathfrak{so}(3)$). There are 6 generator s of the algebra.

$$
G_1 = \begin{pmatrix} 0 & 0 & 0 & 1 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{pmatrix},
G_2 = \begin{pmatrix} 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 1 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{pmatrix},
G_3 = \begin{pmatrix} 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 1 \\ 0 & 0 & 0 & 0 \end{pmatrix}, \\
G_4 = \begin{pmatrix} 0 & 0 & 0 & 0 \\ 0 & 0 & -1 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{pmatrix},
G_5 = \begin{pmatrix} 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 0 \\ -1 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{pmatrix},
G_6 = \begin{pmatrix} 0 & -1 & 0 & 0 \\ 1 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 0 \end{pmatrix}
$$

An element of $\mathfrak{se}(3)$ is the represented by multiplies of the generators.

$$
(\boldsymbol{\omega \ u})^T \in \mathbb{R}^6 \\
\boldsymbol{\upsilon}_1 G_1 + \boldsymbol{\upsilon}_2 G_2 + \boldsymbol{\upsilon}_3 G_3 + \boldsymbol{\omega}_1 G_4 + \boldsymbol{\omega}_2 G_5 + \boldsymbol{\omega}_3 G_6 \in \mathfrak{se}(3)
$$

For convenience, we denote $(\boldsymbol{\omega \ \upsilon})^T \in \mathfrak{se}(3)$, with multiplication against the generators implied.

# Numerically Stable Mapping

## $\mathrm{SO}(3)$ as rotation matrix

### $\mathrm{SE}(3)$ Exponential Map

$$
\boldsymbol\delta = (\boldsymbol\omega \ \boldsymbol \upsilon) \in \mathfrak{se}(3) \\
\exp(\boldsymbol\delta) = \exp
\begin{pmatrix}\boldsymbol\omega_\times & \boldsymbol \upsilon \\ \boldsymbol 0 & 0\end{pmatrix}=
\begin{pmatrix}\exp(\boldsymbol\omega_\times) & \boldsymbol{V\upsilon} \\ \boldsymbol 0 & 1\end{pmatrix}
$$

Some notations for convenience.

$$
\boldsymbol\omega, \boldsymbol \upsilon \in \mathbb{R}^3 \\
\theta = \sqrt{\boldsymbol\omega^T \boldsymbol\omega} \\
A = \frac{\sin\theta}{\theta} \\
B = \frac{1 - \cos\theta}{\theta^2} \\
C = \frac{1 - A}{\theta^2} \\
\boldsymbol{R} = \boldsymbol{I} + A \boldsymbol\omega_\times + B \boldsymbol\omega_\times^2 \\
\boldsymbol{V} = \boldsymbol{I} + B \boldsymbol\omega_\times + C \boldsymbol\omega_\times^2 \\
\exp \begin{pmatrix} \boldsymbol\omega \\ \boldsymbol \upsilon \end{pmatrix} = \begin{pmatrix} \boldsymbol{R} & \boldsymbol{V \upsilon} \\ \boldsymbol 0 & 1\end{pmatrix}
$$

For implementation purposes, Taylor expansions of $A$, $B$, and $C$ should be used when $\theta^2$ is small.

When $\theta$ is small, pratical implementation of the Rodrigues formula should use the Taylor expansions of the coefficients of the 2nd and 3rd terms.

$$
A = \frac{\sin\theta}{\theta} = 1 - \frac{\theta^2}{6} + \frac{\theta^4}{120} + O(\theta^6) \\
B = \frac{1 - \cos\theta}{\theta^2} = \frac{1}{2} - \frac{\theta^2}{24} + \frac{\theta^4}{720} + O(\theta^6) \\
C = \frac{1 - A}{\theta^2} = \frac{\theta - \sin\theta}{\theta^3} = \frac{1}{6} - \frac{x^2}{120} + \frac{x^4}{5040} + O(x^6)
$$

Taylor series expansion results from WolframAlpha:

1. <https://www.wolframalpha.com/input/?i=taylor+sin(x)%2Fx,+x%3D0>
2. <https://www.wolframalpha.com/input/?i=taylor+(1-cos(x))%2Fx%5E2,+x%3D0>

When $\theta$ is small, we preserve only the 1st term, then we get the approximated exponential map. Then we get the numerically stable solution for $\boldsymbol{R}$ and $\boldsymbol{V}$.

$$
\boldsymbol{R} = \boldsymbol{I} + (\frac{\sin\theta}{\theta}) \boldsymbol\omega_\times + (\frac{1 - \cos\theta}{\theta^2}) \boldsymbol\omega_\times^2 \\
\approx \boldsymbol{I} + \boldsymbol{\omega}_\times + \frac{1}{2} \boldsymbol{\omega}_\times^2,
\text{when} \ \theta \ \text{is small}. \\
\boldsymbol{V} = \boldsymbol{I} + (\frac{1 - \cos\theta}{\theta^2}) \boldsymbol\omega_\times + (\frac{\theta - \sin\theta}{\theta^3}) \boldsymbol\omega_\times^2 \\
\approx \boldsymbol{I} + \frac{1}{2} \boldsymbol{\omega}_\times + \frac{1}{6} \boldsymbol{\omega}_\times^2,
\text{when} \ \theta \ \text{is small}.
$$

Then compute the exponential map of the translation part, $\boldsymbol t = \boldsymbol V \cdot \boldsymbol \upsilon$.

### $\mathrm{SE}(3)$ Logarithm Map

$$
\boldsymbol{R} \in \mathrm{SO}(3) \\
\theta = \arccos(\frac{\mathrm{tr}(\boldsymbol{R}) - 1}{2}) \\
\ln(\boldsymbol{R}) = \frac{\theta}{2\sin\theta} \cdot (\boldsymbol R - \boldsymbol R^T)
$$

The vector $\boldsymbol\omega$ is then taken from the off-diagonal elements of $\ln(\boldsymbol R)$. When $\frac{\theta}{2\sin\theta}$ is small, the Taylor expansions of it should be used.

$$
\frac{\theta}{2\sin\theta} = \frac{1}{2} + \frac{x^2}{12} + \frac{7x^4}{720} + \frac{31x^6}{30240} + O(x^7)
$$

Then,

$$
\ln(\boldsymbol{R}) \approx \frac{1}{2} \cdot (\boldsymbol R - \boldsymbol R^T),
\text{when} \ \frac{\theta}{2\sin\theta} \ \text{is small}.
$$

For the translation part $\boldsymbol u$, we have

$$
\boldsymbol{V}^{-1} = \boldsymbol{I} - \frac{1}{2} \boldsymbol\omega_\times + \frac{1}{\theta^2} (1 - \frac{A}{2B})\boldsymbol\omega_\times^2 \\
= \boldsymbol{I} - \frac{1}{2} \boldsymbol\omega_\times + (\frac{1}{\theta^2} - \frac{\sin\theta}{2 \theta (1 - \cos\theta)}) \boldsymbol\omega_\times^2 \\
\approx \boldsymbol{I} - \frac{1}{2} \boldsymbol\omega_\times + \frac{1}{12} \boldsymbol\omega_\times^2
$$

And $\boldsymbol \upsilon = \boldsymbol V^{-1} \cdot \boldsymbol t$.

## $\mathrm{SO}(3)$ stored as quaternion

There's actually another kind of exponential map, due to a different parameterization of the rotation. If we choose to use quaternion to describe the rotation instead of rotation matrix, we can get a different exponential map result, with the same effect.

$\boldsymbol{q} = (w, x, y, z)^T$ is the quaternion prarameterization of the rotation described as angle-axis rotation vector $\boldsymbol{\omega} = \theta \boldsymbol{u}$. The angle represented in a quaternion is a little different. In quaternion, the rotation angle is divided by 2, but the final result is the same, with the rotation result as the Hamilton product.

$$
\boldsymbol{x}' = \boldsymbol{q} \otimes \boldsymbol{x} \otimes \boldsymbol{q}^*
$$

where $\boldsymbol{x} = (p_x, p_y, p_z) = p_x \boldsymbol{i} + p_y \boldsymbol{j} + p_z \boldsymbol{k}$ is the original point in 3-d space, and $\boldsymbol{x}' = (p_x', p_y', p_z') = p_x' \boldsymbol{i} + p_y' \boldsymbol{j} + p_z' \boldsymbol{k}$ is the new position vector after the rotation.

### $\mathrm{SE}(3)$ Exponential Map

$$
\boldsymbol{\omega} = \theta \boldsymbol{u} \\
\boldsymbol{q} = \exp(\frac{\theta}{2} \boldsymbol{u}) = \cos\frac{\theta}{2} + \boldsymbol{u} \sin\frac{\theta}{2} \\
= (\cos\frac{\theta}{2}, \boldsymbol{u} \sin\frac{\theta}{2})^T \\
= (\cos\frac{\theta}{2}, \boldsymbol{\omega} \frac{\sin\frac{\theta}{2}}{\theta})^T
$$

When $\theta$ is small, we use the Taylor series expansions of them, and take only the first 3 terms.

$$
\cos\frac{\theta}{2} = 1 - \frac{\theta^2}{8} + \frac{\theta^4}{384} - \frac{\theta^6}{46080} + O(\theta^7) \\
\approx 1 - \frac{\theta^2}{8} + \frac{\theta^4}{384} \\
\frac{\sin\frac{\theta}{2}}{\theta} = \frac{1}{2} - \frac{\theta^2}{48} + \frac{\theta^4}{3840} + O(\theta^6) \\
\approx \frac{1}{2} - \frac{\theta^2}{48} + \frac{\theta^4}{3840}
$$

For the translation part, it's the same as when $\mathrm{SO}(3)$ is stored as rotation matrix.

We compute $\boldsymbol{V}$, and compute $\boldsymbol t = \boldsymbol V \cdot \boldsymbol \upsilon$.

### $\mathrm{SE}(3)$ Logarithm Map

$$
\theta = 2 \arctan({\|\boldsymbol{q}_v\|/ q_w}) \\
\boldsymbol{u} = \boldsymbol{q}_v/\|\boldsymbol{q}_v\|
$$

For the axis vector part $\boldsymbol{u}$, just compute it as the equation above. But for the angle part, there are 4 situations.

1. When only $\|\boldsymbol{q}_v\|$ is small, we use the Taylor expansion of $\arctan(\|\boldsymbol{q}_v\|/q_w)$ and take the first 2 terms as the approximate solution.

$$
\arctan(x) = x - \frac{x^3}{3} + \frac{x^5}{5} + O(x^7) \\
\theta = 2 \arctan(\|\boldsymbol{q}_v\|/ q_w) \\
\approx 2 \frac{\boldsymbol{q}_v}{q_w} \Big( 1 - \frac{\|\boldsymbol{q}_v\|^2}{3 q_w^2} \Big)
$$

2. When $\|\boldsymbol{q}_v\|$ is small, $q_w$ should be close to 1. So, in this case, the result is the same as the first case.

3. When only $q_w$ is small,

$$
\theta \approx
\begin{cases}
2 \cdot \frac{\|\boldsymbol{q}_v\|}{q_w} \cdot (\frac{\pi}{2}) = \frac{\|\boldsymbol{q}_v\|}{q_w} \cdot \pi & \quad \text{if } q_w \text{is close to 0 from the positive side.} \\
2 \cdot \frac{\|\boldsymbol{q}_v\|}{q_w} \cdot (- \frac{\pi}{2}) = - \frac{\|\boldsymbol{q}_v\|}{q_w} \cdot \pi & \quad \text{if } q_w \text{is close to 0 from the negative side.}
\end{cases}
$$

4. When both $\|\boldsymbol{q}_v\|$ and $q_w$ are not small, just compute the result as the original equation.

And $\boldsymbol \upsilon = \boldsymbol V^{-1} \cdot \boldsymbol t$.

> This article will be continued later

# References

1. <https://www.wolframalpha.com/input/?i=taylor+sin(x)%2Fx,+x%3D0>
2. <http://ethaneade.com/lie.pdf>
3. <http://www.iri.upc.edu/people/jsola/JoanSola/objectes/notes/kinematics.pdf>
4. <http://ethaneade.com/lie_groups.pdf>
5. <https://arxiv.org/pdf/1107.1119.pdf>
6. <https://github.com/RainerKuemmerle/g2o/blob/master/g2o/types/slam3d/se3quat.h>
7. <https://github.com/strasdat/Sophus/blob/master/sophus/so3.hpp>
8. <https://github.com/strasdat/Sophus/blob/master/sophus/se3.hpp>
9. <https://en.wikipedia.org/wiki/Axis%E2%80%93angle_representation#Relationship_to_other_representations>
