---
layout: post
title: "c++17的inline、static和inline static变量和函数"
categories: [c++, inline, static, variable]
---

# 前言

继上篇文章后，我很自然地会考虑到`inline`和`static`之间的区别，以及它们组合起来的效果。

像上一篇文章所说，在 c++17 中`inline`可以修饰变量，那么如果不考虑 c++17 之前是什么样，`inline`和`static`对变量和函数都有什么作用呢？

从 c++17 开始，`inline`这个关键字的意思从「建议编译器将函数内连」变成了「允许多个定义」，并且从只用于函数，扩展到了可以对变量进行修饰。

在下面的讨论中

1. 函数和变量都默认在`.h`头文件中，若在`.cpp`中会特别说明。
2. 所述成员变量，默认为类的成员变量。

# `inline`, `static`, `inline static` 变量

对于变量而言，我们从 3 种情况来考虑：局部变量、全局变量、成员变量。

**1. 局部变量**：

`inline`不能修饰局部变量。

`static`可以修饰局部变量。作用就是使得本应「在局部块尾部被销毁」的变量，变成「从程序开始运行就分配内存，在第一次运行到定义处被初始化，并在程序结束时被销毁」。

`inline static`因为有`inline`，也不能修饰局部变量。

```cpp
int main() {
    // inline int a = 1; // compile error
    static int b = 2;
    // inline static int c = 3; // compile error
}
```

**2. 全局变量**：

`inline`可以修饰全局变量。如同上一篇文章所说，可以使得所有包含其所在`.h`文件的编译单元都可以访问到同一个变量，且共享同一块内存。也就是说，它此时就是一个单例。

`static`可以修饰全局变量。与`inline`不同的是，所有包含其所在`.h`文件的编译单元，会单独有一块内存存储这个变量，即彼此完全独立。

`inline static`对全局变量的效果与`static`一样。

```cpp
// core.h
inline int a = 1;
static int b = 2;
inline static int c = 3; // same as `static int c = 3;`
```

**3. 成员变量**：

`inline`不能单独修饰成员变量。

`static`可以修饰成员变量。它使得这个变量脱离具体实例的控制，而依附于类本身，有一块独立于实例的内存空间。对于`struct A { static int a_int; } a;`，可以通过`A::a_int`和`a.a_int`两种方式访问到里面的静态成员变量。值得注意的是，对于`static`修饰的成员变量，需要对其在单独的`.cpp`文件里用`int A::a_int;`来定义它，否则`struct A`就是一个不完整的类型。同时，不能够直接在类的声明中对其赋初值。

`inline static`可以修饰成员变量。它的作用和`static`单独修饰差不多。区别在于，`static`成员变量不要求类的声明时，该成员是一个完整类型，而`inline static`成员变量要求该成员是一个完整类型。但方便地是，不要求在单独`.cpp`里定义。

```cpp
// A.h
struct A {
    // inline int a; // compile error
    static int b;
    // static int c = 3; // compile error
    inline static int d = 4;
};

// A.cpp
int A::b = 2;
```

# `inline`, `static`, `inline static` 函数

对于函数而言，函数中无法直接定义函数，而是往往通过 lambda 表达式、局部类、std::function 对象等来实现的，所以我们只考虑剩下的 2 种情况：全局函数、成员函数。

**1. 全局函数**：

`inline`可以修饰全局函数。和`inline`修饰的变量一样，可以使得所有包含其所在`.h`文件的编译单元都可以访问到同一个函数，且共享同一块内存。也就是说，可以直接在`.h`文件里把函数定义好，能够被任意数量的`.cpp`包含，也不用担心`函数重复定义`的编译错误。

`static`可以修饰全局函数。与`inline`不同的是，所有包含其所在`.h`文件的编译单元，会单独有一块内存存储这个函数的定义，即彼此完全独立。

`inline static`对全局变量的效果与`static`一样。

单看上去好像`static`全局函数在实际使用的时候和`inline`没有区别，然而一旦这个函数包含`static`变量，就可以体现出差别了。

由于`inline`全局函数共享一个定义，所以里面的`static`变量也是共享的，在一个地方调用这个函数并对这个`static`变量进行了修改，就会在下一次另一个地方调用这个函数的时候，受到其影响。而`static`全局函数并不会这样，彼此是完全独立的。

```cpp
// core.h

inline int return_int() {
    static int a = 5;
    return ++a;
}

static int return_another_int() {
    static int a = 5;
    return ++a;
}

inline static int return_yet_another_int() {
    static int a = 5;
    return ++a;
}

void invoke_inline_function();
void invoke_static_function();
void invoke_inline_static_function();
```

```cpp
// core.cpp

#include "core.h"
#include <iostream>

void invoke_inline_function() {
    std::cout << "return_int(): " << return_int() << std::endl;
}

void invoke_static_function() {
    std::cout << "return_another_int(): " << return_another_int() << std::endl;
}

void invoke_inline_static_function() {
    std::cout << "return_yet_another_int(): " << return_yet_another_int() << std::endl;
}
```

```cpp
// main.cpp

#include "core.h"
#include <iostream>

int main() {
    std::cout << "main: return_int(): " << return_int() << std::endl;

    std::cout << "main: return_another_int(): " << return_another_int() << std::endl;

    std::cout << "main: return_yet_another_int(): " << return_yet_another_int() << std::endl;

    invoke_inline_function();
    invoke_static_function();
    invoke_inline_static_function();

    return 0;
}
```

输出将会是

```bash
$ ./a.out
main: return_int(): 6
main: return_another_int(): 6
main: return_yet_another_int(): 6
return_int(): 7
return_another_int(): 6
return_yet_another_int(): 6
```

**2. 成员函数**：

对于成员函数来说，比较清晰的理解方式是，将`inline`和`static`看成独立的修饰符。

首先上面说过，从 c++17 开始，`inline`的意义就从「建议编译器将函数内连」变成了「允许多个定义」。

然后对于成员函数而言，如果在类的定义中，只给出声明的成员函数默认`non-inline`的，如果直接给出了完整的定义，则默认是`inline`的。

对于成员函数而言，`inline`的作用其实主要是规定了函数实现应处的位置。对于`non-inline`成员函数来说，其实现必须放在另一个`.cpp`文件里，否则当多个编译单元包含这个实现并且链接在一起时，链接器会报错。而`inline`成员函数的定义允许直接放在同一个`.h`文件里。

`static`成员变量的作用仅仅是让这个函数独立于类的实例，而依附于类本身存在。

```cpp
// A.h
struct A {
    inline static int how(); // #1
    static int can();        // #2
    inline int it();         // #3
};

inline int A::how() {        // #4
    return 10;
}

inline int A::it() {         // #5
    return 12;
}

// A.cpp

#include "A.h"

int A::can() {               // #6
    return 11;
}
```

```cpp
// main.cpp

#include "A.h"
#include <iostream>

int main() {
    std::cout << A::how() << std::endl;
    std::cout << A::can() << std::endl;
    std::cout << A().it() << std::endl;
    return 0;
}
```

值得注意的是，`#1`和`#4`中，只需要一处加上`inline`即可；`#3`和`#5`也是。但`#2`和`#6`中的`static`必须且只能放在`#2`中。

# 参考资料

-   <https://en.cppreference.com/w/cpp/language/inline>
-   <https://en.cppreference.com/w/cpp/language/static>
-   <https://stackoverflow.com/questions/22102919/static-vs-inline-for-functions-implemented-in-header-files>
-   <https://stackoverflow.com/questions/12836171/difference-between-an-inline-function-and-static-inline-function>
