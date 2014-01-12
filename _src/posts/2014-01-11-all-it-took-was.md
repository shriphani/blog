    Title: All It Took Was An AHA!
    Date: 2014-01-11T21:55:13
    Tags: life, thoughts

I can clearly recall why I became a computer scientist. I was sitting
in a class and we were discussing how <code>cons</code> was
implemented. And then I saw this definition:

```racket
(define (cons a b)
    (lambda (x)
        (if (= x 1) a b)))
        
(define (first l)
    (l 1))
    
(define (rest l)
    (l 2))
```

The lambda calculus and the material in the little schemer kept in
the field and assured me that there would never be a dearth of aha!
moments in my education.

Good educators can deliver such aha! moments in every single lecture.
A good textbook can do it several times each chapter.

I have since tried to find material that delivers such aha! moments.

Hopefully, I will encounter them for the rest of my life in whatever I
do. 
