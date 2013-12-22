    Title: Robust Principal Component Pursuit - Background Matrix Recovery
    Date: 2013-12-18T05:05:31
    Tags: matrix-decomposition, linear-algebra, incanter

I recently spent some time working on a simple linear algebra problem - decompose a matrix $ M $ into a [low-rank](http://en.wikipedia.org/wiki/Rank_(linear_algebra)) component $ L $ and a sparse component $ S $. The algorithm I used was very trivial to implement (and parallelize using map-reduce).

In this post, I will implement this very simple algorithm, explain the objective function and demonstrate its (amazing) effectiveness on a surveillance-camera dataset.

<!-- more -->

Given a matrix $ M $, we want to decompose it into $ L + S $ where $ L $ is a dense, low-rank matrix and $ S $ is a sparse matrix. The typical approach to solve these problems involves solving an optimization problem involving the nuclear norm.

Surprisingly, the PCP estimate fully recovers both these matrices. Its objective is $ \|\| L_{0} \|\|_{*} + \lambda\|\|S\|\|_{1} $ subject to $ L + S = M $. Essentially, the $ l1 $ norm enforces sparsity in S and the constraint is intuitive. This works because:

<strong>If the singular vectors are reasonably spread, they can be recovered with very high accuracy.</strong> This is clearly seen since a whole host of algorithms we use on a daily basis make use of this. The recovery is also not perturbed too much by slight corruptions (which is related to the sparse component). Thus, recovering the singular values while enforcing sparsity in the corruption matrix (the sparse matrix) is a sufficient condition for recovering the original matrix.

Also, the lambda component itself needs no tuning (!!!!). So no cross-validation component exists. $ \lambda $ is just set to $ \frac{1}{\sqrt{n}} $ where $ n $ is the dimension of the matrix.

The augmented Lagrangian problem works with the following:

$ l(L, S, Y) = \|\|L\|\|_{*} + \lambda\|\|S\|\|_{1} + \langle Y, M - L - S \rangle + \frac{\mu}{2} \|\|M - L - S\|\|_{F}^{2} $

where:

* The $ \|\|L\|\|_{*} $ is the nuclear norm and this ensures that the matrix $ L $ is low-rank
* The $ \|\|S\|\|_{1} $ is sparsity inducing $ l1 $ norm.
* The other two expressions drive the value $ L + S $ towards that of $ M $.

The iteration steps are:

```
init: S0 = Y0 = 0, mu > 0
while not converged {
 Li+1 = SVD_thresh(M - Si - (1/mu)Yi, mu);
 Si+1 = thresh(M - Li+1 + (1/mu)Yi, lambda * mu);
 Yi+1 = Yi + mu(M - Li+1 - Si+1);
}
return L, S
```

where <code>SVD_thresh</code> reconstructs a matrix by zero’ing out singular values that fall below a certain threshold and <code>thresh</code> zeros out matrix elements that fall below the specified threshold.

This simple algorithm accurately recovers the low-rank and sparse matrix components!

### Background Detection

A surveillance video camera emits a sequence of frames. Now, consider a matrix where one single row (or an individual column) is created using all the pixels of a frame (<strong>so a 160 x 130 video becomes a 20800 dimension vector</strong>). Since the background component is common across frames, the low-rank component is just a rank-1 matrix (the only basis vector is the background itself). The sparse component consists of the moving parts (people, escalators, walkways and so on).

Pasted below is the python version of the algorithm above (this is a port from the Matlab version shared by the authors [here](http://perception.csl.illinois.edu/matrix-rank/Files/RPCA_JACM.pdf) and uses the excellent PROPACK library to compute the partial SVD):


```python
#!/usr/bin/env python 
import sys, os
import argparse

import numpy as np
from pypropack import svdp;
from scipy.io import loadmat

MAX_ITERS = 1000
TOL = 1.0e-7

def process_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--mat-file',
        metavar = 'mat_file',
        help = 'Location to .mat file'
    )
    parser.add_argument(
        '--test',
        dest = 'test',
        default = False,
        action = 'store_true'
    )
    parser.add_argument(
        
    )

    return parser.parse_args()

def choose_svd(n, sv):
    return True

def converged(Z, d_norm):
    err = np.linalg.norm(Z, 'fro') / d_norm
    print 'ERR', err
    return err < TOL

def pcp(X):
    m, n = X.shape
    # Set params 
    lamda = 1./ np.sqrt(m);
    # Initialize
    Y = X;
    u, s, v = svdp(Y, k=1, which='L');
    norm_two = s[0]
    norm_inf = np.linalg.norm( Y[:], np.inf) / lamda;
    dual_norm = max(norm_two, norm_inf);
    Y = Y / dual_norm;

    A_hat = np.zeros((m, n));
    E_hat = np.zeros((m, n));
    mu = 1.25/norm_two 
    mu_bar = mu * 1e7
    rho = 1.5
    d_norm = np.linalg.norm(X, 'fro');

    num_iters = 0;
    total_svd = 0;
    stopCriterion = 1;
    sv = 10;
    while True:
        num_iters += 1;

        temp_T = X - A_hat + (1/mu)*Y;
        E_hat = np.maximum(temp_T - lamda/mu, 0);
        E_hat = E_hat + np.minimum(temp_T + lamda/mu, 0);

        u, s, v = svdp(X - E_hat + (1/mu)*Y, sv, which = 'L');

        diagS = np.diag(s);
        svp = len(np.where(s > 1/mu))
        
        if svp < sv:
            sv = min(svp + 1, n);
        
        else:
            sv = min(svp + round(0.05*n), n);
    
        A_hat = np.dot(
            np.dot(
                u[:,0:svp],
                np.diag(s[0:svp] - 1/mu)
            ), 
            v[0:svp,:]
        )

        total_svd = total_svd + 1;
    
        Z = X - A_hat - E_hat;
    
        Y = Y + mu*Z;
        mu = min(mu*rho, mu_bar);

        if converged(Z, d_norm) or num_iters >= MAX_ITERS:
            return A_hat, E_hat

if __name__ == '__main__': 
    args = process_args()
    # Load Data
    if not args.test:
        data = loadmat(args.mat_file)
        A_hat, E_hat = pcp(data['X'])
        print A_hat, E_hat
    else:
        data = (10*np.ones((10, 10))) + (-5 * np.eye(10))
        print data
        A_hat, E_hat = pcp(data)
        np.save('low_rank', A_hat)
        np.save('sparse', E_hat)

```

Next, let us deploy this on a dataset. I obtained a video from a surveillance camera (a few datasets are available [at this webpage](http://perception.i2r.a-star.edu.sg/bk_model/bk_index.html). I will use the Escalator dataset from that page).

The following script builds a <code>numpy</code> matrix from the bitmap image sequence:

```python
'''
Convert a bitmap sequence to matrix.
'''
import os
import numpy as np
import argparse
from PIL import Image

def bitmap_to_mat(bitmap_seq):
	matrix = []

	for bitmap_file in bitmap_seq:
		im = Image.open(bitmap_file).convert('L') # convert to grayscale
		pixels = list(im.getdata())
		matrix.append(pixels)

	return np.array(matrix)

if __name__ == '__main__':
	parser = argparse.ArgumentParser()

	parser.add_argument('--bmp-dir', dest = 'bmp_dir')
	parser.add_argument('--bmp-out', dest = 'bmp_out')

	parsed = parser.parse_args()

	bmp_seq = map(
		lambda s: os.path.join(parsed.bmp_dir, s),
		os.listdir(parsed.bmp_dir)
	)
	res = bitmap_to_mat(bmp_seq)
	np.save(parsed.bmp_out, res)
```

Next, let us run the decomposition and see what the convergence looks like:

```
➜  robust_pcp git:(master) python robust_pcp.py --input-file bmp_matrix.npy
ERR 0.799466063211
 WARNING: Maximum dimension of Krylov subspace exceeded prior to convergence. Try increasing KMAX.
 neig =            1
ERR 0.533151636032
 WARNING: Maximum dimension of Krylov subspace exceeded prior to convergence. Try increasing KMAX.
 neig =            1
ERR 0.580203519826
ERR 0.399795997647
 WARNING: Maximum dimension of Krylov subspace exceeded prior to convergence. Try increasing KMAX.
 neig =            1
ERR 0.526129524054
 WARNING: Maximum dimension of Krylov subspace exceeded prior to convergence. Try increasing KMAX.
 neig =            1
ERR 0.576362875779
ERR 0.438452861276
ERR 0.137666099277
 WARNING: Maximum dimension of Krylov subspace exceeded prior to convergence. Try increasing KMAX.
 neig =            1
ERR 0.526604907584
 WARNING: Maximum dimension of Krylov subspace exceeded prior to convergence. Try increasing KMAX.
 neig =            1
ERR 0.57572793864
ERR 0.45163686726
ERR 0.111636379698
ERR 0.0718803322749
ERR 0.048067444228
 WARNING: Maximum dimension of Krylov subspace exceeded prior to convergence. Try increasing KMAX.
 neig =            1
ERR 0.536409101582
ERR 0.373332905257
ERR 0.0414766101901
ERR 0.0264232708867
 WARNING: Maximum dimension of Krylov subspace exceeded prior to convergence. Try increasing KMAX.
 neig =            1
ERR 0.509857058194
ERR 0.341770886808
ERR 0.00828382155722
ERR 0.00369347648645
ERR 0.00224842770609
ERR 0.00133359512154
ERR 0.00076422430761
ERR 0.00043106684577
ERR 0.000242042207018
ERR 0.000134750434297
ERR 7.47073010806e-05
ERR 4.12146122072e-05
ERR 2.26314422366e-05
ERR 1.23645958329e-05
ERR 6.76884094823e-06
ERR 3.71124761483e-06
ERR 2.01918022651e-06
ERR 1.10232817344e-06
ERR 6.04773368406e-07
ERR 3.27599538767e-07
ERR 1.79967651854e-07
ERR 9.8752813134e-08
```

So in 40 iterations, the low-rank and sparse matrices are completely recovered.

Now, let us take a look at what the decomposition looks like. The following piece of code take one of those matrices we built (from the bitmaps) and animates them (i.e. iterates through the sequence):

```python
'''
Animate supplied npy files
'''
import argparse
import numpy as np
import time
import Tkinter
from PIL import Image, ImageTk

def animate(matrices, w, h):
	mats = [np.load(x) for x in matrices]

	tk_win = Tkinter.Toplevel()
	tk_win.title('Escalator')
	canvas = Tkinter.Canvas(tk_win, width=7*w, height=7*h)
	canvas.pack()
	tk_ims = [None for _ in mats]
	for i, row in enumerate(mats[0]):
		ims = [Image.new('L', (w, h)) for _ in mats]
		for j, im in enumerate(ims):
			im.putdata(map(float, list(mats[j][i])))
			tk_ims[j] = ImageTk.PhotoImage(im)
			canvas.create_image((j * w) + 200, h, image = tk_ims[j])
			canvas.update()


if __name__ == '__main__':
	parser = argparse.ArgumentParser()

	parser.add_argument(
		'width',
		type = int,
		help = 'frame width'
	)
	parser.add_argument(
		'height',
		type = int,
		help = 'frame width'
	)
	parser.add_argument(
		'--npy-files',
		dest = 'npy_files',
		nargs = '+',
		help = 'numpy matrices'
	)

	parsed = parser.parse_args()

	animate(parsed.npy_files, parsed.width, parsed.height)
```

And here’s a frame from the resulting animation. The first frame is the original image sequence (in grayscale), the second is the low-rank component (the background) and the sparse component consists of the people:

<image src="http://shriphani.com/pics/blog_frame.png" />

The algorithm is thus super-powerful and easy to implement.

The full source code is available in [this github repository](https://github.com/shriphani/robust_pcp).

References:

* Robust PCA: [http://perception.csl.illinois.edu/matrix-rank/Files/RPCA_JACM.pdf](http://perception.csl.illinois.edu/matrix-rank/Files/RPCA_JACM.pdf)
* PROPACK: [https://github.com/jakevdp/pypropack](https://github.com/jakevdp/pypropack)
