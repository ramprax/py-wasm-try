import io, base64
# import js
import qrcode


print('Module name = ', __name__)


def qr_code_gen(b64_input_text, **kwargs):
    # print(b64_input_text)
    # print(repr(b64_input_text))
    input_text = base64.b64decode(b64_input_text).decode('UTF-8')

    image = qrcode.make(input_text)
    buf = io.BytesIO()
    # copy the plot into the buffer
    image.save(buf, format='png')
    buf.seek(0)
    # encode the image as Base64 string
    img_str = base64.b64encode(buf.read()).decode('UTF-8')
    buf.close()
    return img_str


