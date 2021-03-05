import numpy as np
from PIL import Image
from os import path
# import matplotlib.pyplot as plt
import os
import random

from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator


def grey_color_func(word, font_size, position, orientation, random_state=None,
                    **kwargs):
    #return "hsl(0, 0%%, %d%%)" % random.randint(60, 100)
    return "hsl(0, 0%, 0%)"


def make_wc_with_mask():
    # get data directory (using getcwd() is needed to support running example in generated IPython notebook)
    d = path.dirname(__file__) if "__file__" in locals() else os.getcwd()

    # read the mask image taken from
    # http://www.stencilry.org/stencils/movies/star%20wars/storm-trooper.gif
    mask = np.array(Image.open("C:\\Users\\rampr\\Pictures\\Ajit\\ajit_face_large_nobg_bw_ff.png"))
    # mask[mask > 223] = 255
    # mask[mask <= 223] = 0
    #mask[mask == 0] = 255
    #mask[mask == 1] = 0

    # mask = np.array(Image.open("C:\\Users\\rampr\\Pictures\\Ajit\\ajit_face_large_nobg_color_notrans.png"))

    #mask = np.array(Image.open("C:\\Users\\rampr\\Pictures\\alice_mask.png"))

    # for i, m in enumerate(mask):
    #    for j, n in enumerate(m):
    #        print(n)

    # movie script of "a new hope"
    # http://www.imsdb.com/scripts/Star-Wars-A-New-Hope.html
    # May the lawyers deem this fair use.
    # text = open(path.join(d, 'a_new_hope.txt')).read()

    # pre-processing the text a little bit
    # text = text.replace("HAN", "Han")
    # text = text.replace("LUKE'S", "Luke")
    text = '''ajit anu avyukt atiksh devanathan st muthu rickshaw 103 ttk Road 4996979 nes nps 45A 5C 23 3A hercules mtb bist'''

    # adding movie script specific stopwords
    stopwords = set() # set(STOPWORDS)
    # stopwords.add("int")
    # stopwords.add("ext")

    stopwords = set()

    wc = WordCloud(mask=mask, stopwords=stopwords, collocation_threshold=0, include_numbers=True, # margin=10,  # max_words=1000,
                   random_state=1, repeat=True, background_color='white', max_font_size=20).generate(text)
    # store default colored image
    wc.to_file('aj_default.png')
    default_colors = wc.to_array()
    # plt.title("Custom colors")
    # plt.imshow(
    wc.recolor(color_func=grey_color_func, random_state=3) #,
               # interpolation="bilinear")
    wc.to_file("aj_grey.png")
    # plt.axis("off")
    # plt.figure()
    # plt.title("Default colors")
    # plt.imshow(default_colors, interpolation="bilinear")
    # plt.axis("off")
    # plt.show()

    # create coloring from image
    image_colors = ImageColorGenerator(mask)

    wc.recolor(color_func=image_colors, random_state=3) #,
               # interpolation="bilinear")
    wc.to_file("aj_color.png")


if __name__ == '__main__':
    make_wc_with_mask()

