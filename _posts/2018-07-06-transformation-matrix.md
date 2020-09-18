---
layout: post
title: "Transformation Matrix"
categories: []
---

In computer vision, we often need to map a point from one coordinate system to another. For example, from camera coordinate system to world coordinate system.

We use homogeneous coordinates during transformation. A point is represented as a 4-d vector $p = (x, y, z, 1)$, and a transformation is a $4 \times 4$ matrix,

$$
\begin{bmatrix}
Transform_X.x & Transform_Y.x & Transform_Z.x & Translation.x \\
Transform_X.y & Transform_Y.y & Transform_Z.y & Translation.y \\
Transform_X.z & Transform_Y.z & Transform_Z.z & Translation.z \\
0 & 0 & 0 & 1
\end{bmatrix}
$$


The upper-left $3 \times 3$ part is the rotation matrix, whose columns are the $x, y, z$ axis orientation vectors of the old coordinate system, described in the new coordinate system. The upper-right 3-d column fector is the origin of the old coordinate system, described in the new coordinate system.

![img](../../images/matrix-transformation-teapot.png)

As illustrated above, in the Model Space, the coordinate of the point is $p = (0, 1, 0, 1)$ as a homogeneous coordinate. The 3 axis orientation vectors of the Model Space described in the World Space are $u = (0, 0, 1)$, $v = (0, -1, 0)$, $w = (1, 0, 0)$. The origin of the Model Space described in the World Space is $t = (1.5, 1.0, 1.5)$. Then the transformation matrix is

$$
\begin{bmatrix}
0 & 0 & 1 & 1.5 \\
0 & -1 & 0 & 1.0 \\
1 & 0 & 0 & 1.5 \\
0 & 0 & 0 & 1
\end{bmatrix}
$$

Then the point in the World Space is

$$
\begin{bmatrix}
0 & 0 & 1 & 1.5 \\
0 & -1 & 0 & 1.0 \\
1 & 0 & 0 & 1.5 \\
0 & 0 & 0 & 1
\end{bmatrix}
\times
\begin{bmatrix}
0 \\ 1 \\ 0 \\ 1
\end{bmatrix} =
\begin{bmatrix}
1.5 \\ 0 \\ 1.5 \\ 1
\end{bmatrix}
$$

In summary, given the 3 axis orientation vectors and the origin of the old coordinate system described in the new coordinate system, we can form the transformation matrix by putting these 4 column vectors in the upper $3 \times 4$ part of the $4 \times 4$ transformation matrix, and leave the lower $1 \times 4$ part as $(0, 0, 0, 1)$.

Then we can transform any point in the old coordinate system, described as a homogeneous coordinate, to the new coordinate system, by left-multiply it by the matrix, to get

$$
p' = X \cdot p
$$

# References

<http://www.codinglabs.net/article_world_view_projection_matrix.aspx>
