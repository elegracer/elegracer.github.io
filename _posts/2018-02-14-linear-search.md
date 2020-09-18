---
layout: post
title: "Line Search Methods"
categories: []
---

Given a function, we want to find the minimum or maximum point. For simple functions, we can use *analytical* method to calculate the optimal point directly. But for complex functions, it's too expensive or infeasible to compute it directly. Then we need a *numerical* method.

2 main iterative methods are **line search** and **trust region**.

The update rule of line search is $x_{k+1} = x_k + \alpha_k \cdot d(x_k)$. We compute the direction $d(x_k)$ and step length $\alpha_k$ seperately.

# Categories

 * Descent Direction $d(x_k)$:
    * Gradient descent
    * Newton method
    * etc
 * Step Length $\alpha_k$:
    * Golden-section search
    * Wolfe conditions


# Descent Direction

To minimizing the objective function $f(x_k + \alpha p)$, where $x_k$ is the current point, $\alpha$ is the step length to compute, $p$ is the descent direction. From Taylor's theorem, we have

$$
f(x_k + \alpha p) = f(x_k) + \alpha p^T \nabla f_k + \frac{1}{2} \alpha^2 p^T \nabla^2 f(x_k + t p) p, \text{ for some } t \in (0, \alpha)
$$

## Gradient Descent

In Gradient Descent, we simply use the direction $p_k = - \nabla f_k$ as the descent direction at every step. Since at this time $p^T \nabla f_k = - \Vert\nabla f_k\Vert^2 \lt 0$ whenever $\Vert\nabla f_k\Vert \ne 0$, and if the second term is dominant over the third term, we can get a decrease of the objective function value along the gradient descent direction.

## Newton Method

If we set $\alpha$ to 1, and consider the second-order Taylor approximation of $f(x_k + p)$, then

$$
f(x_k = p) \approx f_k + p^T \nabla f_k + \frac{1}{2} p^T \nabla^2 f_k p = m_k (p)
$$

Assuming that the $\nabla^2 f_k$ is positive definite, by simply set the derivative of $m_k (p)$ to 0, we get the Newton direction:

$$
p_k^N = -(\nabla^2 f_k)^{-1} \nabla f_k
$$

In Newton Method, $\nabla^2 f_k$ must be positive definite, such that

$$
\nabla f_k^T p_k^N = - {p_k^N}^T \nabla^2 f_k p_k^N \le - \sigma_k \Vert p_k^N \Vert^2, \text{ for some } \sigma_k > 0
$$

which is a descent direction whenever $\nabla f_k \ne 0$.

Unlike gradient descent direction, we always set the step length to 1 in Newton Method.

## Quasi-Newton Methods

When $\nabla^2 f_k$ is not positive definite, the Newton direction may not be defined, because $(\nabla^2 f_k)^{-1}$ does not even exist. Even if it is defined, it may not be a descent direction.

In these situations, we can do some modifications to make use of the second-order information in the Taylor serires.

Quasi-Newton Methods, instead of using the true Hessian Matrix $\nabla^2 f_k$ like Newton Methods, compute an approximation of the Hessian $B_k$, and update it after each step. Thus the search direction is

$$
p_k = -B_k^{-1} \nabla f_k
$$

# Step Length

## Golden-Section Search

The golden-section search is only applicable for finding extremum in unimodel function $f(x)$.

First, we set an interval $[a,b]$ which contains the optimum, then compute 2 intermediate points $c, d$ using the golden ratio

$$
\phi = \frac{\sqrt{5} - 1}{2} \approx 1.618 \\
\phi^{-1} \approx 0.618
$$

For example, for the function $f(x)$, we want to find the minimum point. We first set the initial interval $[a, b] = [0, 1]$, then

$$
c = b - \phi \cdot (b - a) = 0.382 \\
d = a + \phi \cdot (b - a) = 0.618
$$

At this time $a < c < d < b$.

Then check the function values at $c, d$. If $f(c) > f(d)$, the interval in the next iteration becomes $[c, b]$. If $f(c) < f(d)$, the interval in the next interation becomes $[a, d]$. And we loop again, until the size of the interval becomes bigger than the threshold, or other conditions are satisfied.

Simple python program for golden-section search is the below one:

```python
gr = (math.sqrt(5) + 1) / 2

def gss(f, a, b, tol=1e-5):
    c = b - (b - a) / gr
    d = a + (b - a) / gr
    while abs(c - d) > tol:
        if f(c) > f(d):
            a = c
        else:
            b = d

        c = b - (b - a) / gr
        d = a + (b - a) / gr

    return (a + b) / 2
```

## Wolfe Conditions

The Wolfe Conditions contain 2 conditions:

$$
f(x_k + \alpha_k p_k) \le f(x_k) + c_1 \alpha_k p_k^T \nabla f(x_k) \\
-p_k^T \nabla f(x_k + \alpha_k p_k) \le -c_2 p_k^T \nabla f(x_k)
$$

where $0 < c_1 < c_2 < 1$, and usually $c_1 = 0.001, c_2 = 0.1$ or other values, but $c_1$ is set very small.

The 2 conditions are called **Armijo rule** and **curvature condition*. Armijo rule ensures sufficient decrease, and curvature condition ensures that the slope has been reduced sufficiently.

There's also a **strong** Wolfe Conditions, which replace the left side part of the 2nd inequality with

$$
\Vert p_k^T \nabla f(x_k + \alpha_k p_k)\Vert \le c_2 \Vert p_k^T \nabla f(x_k)\Vert = - c_2 p_k^T \nabla f(x_k)
$$

which forces $\alpha$ to lie close to where the derivative is close to 0.

My implementation for Wolfe Conditions are at [line_search_wolfe_conditions.py](https://github.com/soaph/numerical_optimization/blob/master/line_search_wolfe_conditions.py).

# References

<https://github.com/nlperic/line-search-tutorial>

<https://en.wikipedia.org/wiki/Wolfe_conditions>

"Numerical Optimization". J.Nocedal, S.J.Wright.
