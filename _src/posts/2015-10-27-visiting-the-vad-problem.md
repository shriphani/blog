    Title: Visiting the VAD Problem
    Date: 2015-10-27T02:06:03
    Tags: python, clojure, linux, VAD

In the recent past, I have received a lot of questions on voice activity detection.
About 5 years ago, I implemented a VAD algorithm in one of my projects.
It was a cute hack but it was nothing close to production-ready. The algorithm
is not robust enough to deploy in a production app.

Fortunately, the WebRTC project contains a very powerful VAD. Your favorite
language (hopefully) has an FFI that can communicate with the

<!-- more -->
