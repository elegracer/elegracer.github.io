---
layout: post
title: "在ArchLinux下编译Cuda+OpenCV"
categories: [ArchLinux,OpenCV]
---

写这篇文章主要是为了避免以后要编译新的版本的OpenCV或Cuda的时候忘记了这次遇到的坑

<!--more-->

# 安装Cuda

**Note**：上次整理这篇文章的时候还是8.0，后来发现最近升级到9.0了，后面有一些需要注意的地方。

官方源中已经有了二进制的包，只需要直接安装就好，前提是先装Nvidia的闭源驱动

```bash
sudo pacman -S nvidia
sudo pacman -S cuda
```

# 编译OpenCV

从Github上把`opencv`和`opencv_contrib`两个库都`git clone`下来

```bash
git clone https://github.com/opencv/opencv.git
git clone https://github.com/opencv/opencv_contrib.git
```

然后，先别急着编译，因为要编译出支持Cuda的OpenCV，是不能直接用ArchLinux的gcc的，因为它版本太高了，我在写这篇文章的时候，Cuda的版本是9.0，它要求gcc版本不能大于6，所以我们需要用到gcc 6.0，所以首先要安装`gcc-6`

```bash
sudo pacman -S gcc6
```

然后c编译器和c++编译器分别为`/usr/bin/gcc-6`和`/usr/bin/g++-6`，因为CMake会自动检测到高版本的gcc，所以我们需要在`opencv`目录中的`CMakeLists.txt`中手动指定`gcc-6`和`g++-6`，虽然`g++-6`的默认编译标准是`c++14`但是我们还是用`c++11`标准。因此我们在`CMakeLists.txt`中加入相应的语句。

```cmake
set(CMAKE_C_COMPILER /usr/bin/gcc-6)
set(CMAKE_CXX_COMPILER /usr/bin/g++-6)

set(CMAKE_CXX_FLAGS_RELEASE "${CMAKE_CXX_FLAGS_RELEASE} -std=c++11 ")
```

然后有一个特别需要主要的地方，就是编译OpenCV的时候会需要一个叫libtbb的库，这个本来可以通过`sudo pacman -S intel-tbb`来安装的，但是还是因为gcc版本的问题，需要自己再用`gcc-6`重新编译一份。所以先把这个删了，然后用`gcc-6`编译源码来作为替代。

[https://github.com/01org/tbb](https://github.com/01org/tbb)

同样的，这个也是直接`make`就行了，但是因为编译opencv指定编译器为`gcc-6`，为了保持一致性，避免出现问题，所以我们也用gcc6来编译libtbb。

```bash
make CC=/usr/bin/gcc-6 CXX=/usr/bin/g++-6
```

编译好了之后，还需要亲自把编译好的`.so`文件复制到`/usr/lib`中，同时把`include`目录下的`tbb`目录复制到`/usr/include`中。

但是光有这个还不行，注意下述命令中的`-D ENABLE_CXX11=ON`，需要把这个开关打开，上面指定标准才会生效。

```bash
cd opencv
mkdir build
cd build
cmake -D CMAKE_BUILD_TYPE=RELEASE \
    -D CMAKE_INSTALL_PREFIX=/usr/local \
    -D WITH_CUDA=ON \
    -D ENABLE_FAST_MATH=1 \
    -D CUDA_FAST_MATH=1 \
    -D WITH_CUBLAS=1 \
    -D WITH_OPENGL=ON \
    -D INSTALL_PYTHON_EXAMPLES=OFF \
    -D OPENCV_EXTRA_MODULES_PATH=../../opencv_contrib/modules \
    -D CUDA_NVCC_FLAGS="--std=c++11 --expt-relaxed-constexpr -I/usr/include/eigen3" \
    -D BUILD_EXAMPLES=OFF \
    -D BUILD_TESTS=OFF \
    -D BUILD_PERF_TESTS=OFF \
    -D ENABLE_CXX11=ON ..
```

在运行上述命令后，CMake会打印出当前有哪些库安装好了，哪些库没有安装，可以根据输出的信息，进行相应库的补充。

最后，当CMake构建完后，我们就直接运行`make -j8`来编译OpenCV了，`-j8`的意思就是用8个线程来编译，速度相对于不加这个参数会有非常大幅的提高。

在编译的过程中，会在某处卡住很久，不用担心，这并不是出现了什么问题，只需要耐心等待，最后就会编译完成。

编译完成后`sudo make install`就安装好了OpenCV了。

# `.so`文件无法找到？

在某些发行版本中，动态链接库默认不会添加`/usr/local/lib`，所以如果链接opencv库的时候出现找不到文件的问题，就把这个目录添加到动态链接库搜索路径中。

之前在网上搜到一些解决办法，是把`/usr/local/lib`添加到环境变量`LD_LIBRARY_PATH`里面。但是系统出于安全考虑，设置了`setuid`和`setgid`的程序会自动忽略这个环境变量。于是网友推荐直接在`/etc/ld.so.conf.d`目录下创建一个`local.conf`

```bash
$ cat /etc/ld.so.conf.d/local.conf
/usr/local/lib
```

这样问题就解决了，但是对于一些不是系统级别的动态链接库，最好不要在这里添加，而是应该临时添加，或者在`home`目录下的`.zshrc`里面设置环境变量。

# 参考资料

<https://www.pyimagesearch.com/2016/07/11/compiling-opencv-with-cuda-support>
