---
layout: post
title: "用c++17的inline变量作为全局配置变量"
categories: [c++, singleton, inline, variable]
---

# 前言

我想找到一个优雅的办法来放一些全局配置变量。

看到的前人的做法，要么是像 c 一样，用`extern`来实现：

```cpp
// config.h

extern size_t MAX_BUFFER_BYTE_SIZE;

// config.cpp

size_t MAX_BUFFER_BYTE_SIZE = 4096;
```

这种，很丑，我很不喜欢，我尤其讨厌`extern`，而且我还得写两遍！我跳转过去还看不到初始值是多少！

而且貌似在某些情况下，这个东西可能会出错（具体我就不想细究了，可以看下面的参考资料）。

比较 c++ 的方法是使用 c++11 的`Meyer's singleton`：

```cpp
// config.h

static size_t& g_MAX_BUFFER_BYTE_SIZE() {
    static size_t g_size = 4096;
    return g_size;
}

static size_t& MAX_BUFFER_BYTE_SIZE = g_MAX_BUFFER_BYTE_SIZE();
```

可以把多个`size_t`封装在`struct`里，形成一个`config`的单例。

但是还是很丑，而且还有性能问题。

# c++17 inline variable

在 c++17 中，变量可以用`inline`修饰，并且链接器必须满足：不论多少个编译单元包含这个`.h`文件，
在这个`.h`里声明的`inline`变量只能有一个实例。

也就是说所有编译单元中的这个变量都指向同一块内存，在一个`.cpp`里改了这个变量的值，
在另一个`.cpp`里就可以看到变化。说得再直白点，`inline`修饰的变量就是单例。

事情就变得非常简单了：用`c++17`及以上标准编译并链接代码，然后把全局变量写在`.h`文件里，
并且用`inline`修饰，包含这个`.h`文件，在这里写它，然后在另外的地方读它。

```cpp
// config.h

inline size_t MAX_BUFFER_BYTE_SIZE = 4096;

void modify_and_print();

// config.cpp

#include "config.h"
#include <iostream>

void modify_and_print() {
    MAX_BUFFER_BYTE_SIZE = 2048;
    std::cout << MAX_BUFFER_BYTE_SIZE << std::endl;
}
```

```cpp
// main.cpp

#include "config.h"
#include <iostream>

int main(int argc, char const *argv[]) {

    std::cout << MAX_BUFFER_BYTE_SIZE << std::endl;

    modify_and_print();
    std::cout << MAX_BUFFER_BYTE_SIZE << std::endl;

    MAX_BUFFER_BYTE_SIZE = 1024;
    std::cout << MAX_BUFFER_BYTE_SIZE << std::endl;

    modify_and_print();
    std::cout << MAX_BUFFER_BYTE_SIZE << std::endl;

    return 0;
}
```

输出会是：

```bash
$ ./a.out
4096
2048
2048
1024
2048
2048
```

完美。

# 参考资料

-   <https://stackoverflow.com/a/47502744>
-   <https://www.youtube.com/watch?v=xVT1y0xWgww>
