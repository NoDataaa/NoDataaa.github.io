import pytesseract
from PIL import Image
import re
import os
from tkinter import filedialog, Tk

pytesseract.pytesseract.tesseract_cmd = r'C:\Users\mulnel1\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'

def extract_info_from_image(image_path):
    if not os.path.exists(image_path):
        print(f"File not found: {image_path}")
        return

    image = Image.open(image_path)
    text = pytesseract.image_to_string(image)
    print("--- OCR Raw Output ---")
    print(text)
    print("----------------------")

    name = re.search(r"(?i)Name:\s*(.+)", text)
    filament = re.search(r"(?i)Filament:\s*(.+)", text)
    print_type = re.search(r"(?i)(Type|Purpose):\s*(.+)", text)

    return {
        "name": name.group(1).strip() if name else "Not found",
        "filament": filament.group(1).strip() if filament else "Not found",
        "type": print_type.group(2).strip() if print_type else "Not found",
        "raw_text": text
    }

# File picker using tkinter
if __name__ == "__main__":
    root = Tk()
    root.withdraw()  # Hide main window
    image_path = filedialog.askopenfilename(filetypes=[("Image files", "*.png;*.jpg;*.jpeg")])
    if image_path:
        result = extract_info_from_image(image_path)
        if result:
            print("\nParsed Result:")
            print(result)
    else:
        print("No file selected.")
