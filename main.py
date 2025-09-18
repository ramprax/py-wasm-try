# This is a sample Python script.
from pathlib import Path

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.
import qrcode


def print_hi(name):
    # Use a breakpoint in the code line below to debug your script.
    print(f'Hi, {name}')  # Press Ctrl+F8 to toggle the breakpoint.


def main():
    output_dir = Path('output')
    output_dir.mkdir(exist_ok=True)
    for v in range(40):
        qrcode.make('PyCharm', version=v+1).save(output_dir / f'qr-v{v+1}.png')
    # qrcode.make('PyCharm', version=12).save(f'qr2-v12.pbm')
    qrcode.make('⚠️Security Warning⚠️ PyCharm', version=v+1).save(Path('output') / f'qr-v{v+1}-warning.png')


# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    # print_hi('PyCharm')
    main()

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
