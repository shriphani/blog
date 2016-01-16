    Title: Voice Activity Detection in Python and SWIG
    Date: 2015-11-14T02:06:03
    Tags: python, linux, VAD

The WebRTC codebase contains a very solid voice activity detection (VAD)
algorithm. The project itself is a treasure-trove of solid solutions to
common problems in speech, audio and video streaming, encoding etc.

Recently, I was in need of a solid VAD I could use from Python. I wrote
one myself in college (and to be fair it was a bit shit).

In a few hours I was able to isolate the source code from the WebRTC project
and write a Python wrapper for it in SWIG.

A working VAD for Linux in Python on `x86_64` is available in [this repo](https://github.com/shriphani/vad_python).

The WebRTC VAD components are in [this repo](https://github.com/shriphani/VAD-py).

Some SWIG tips:

* C functions typically have the following signature:
```
int funcName(int *input_array, size_t array_size);
```
Numpy ships with a fantastic set of typemaps (defined in [numpy.i](http://docs.scipy.org/doc/numpy/reference/swig.interface-file.html)) for just this
sort of thing. Drop `numpy.i` into your directory and include it
in your SWIG setup.
* A lot of typemaps aren't defined in `numpy.i` - do not hesitate
to write a header. For instance, `numpy.i` doesn't have a typemap
involving a `const int *` - a small wrapper around your desired
function call it perfect and allows you to use existing typemaps.
