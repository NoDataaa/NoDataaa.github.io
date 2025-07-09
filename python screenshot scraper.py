import pytesseract
from PIL import Image, ImageGrab
import re
import tkinter as tk
from tkinter import filedialog, messagebox
import os

pytesseract.pytesseract.tesseract_cmd = r'C:\Users\mulnel1\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'

def extract_info_from_image(image):
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

def show_result(image):
    result = extract_info_from_image(image)
    result_str = f"Name: {result['name']}\nFilament: {result['filament']}\nType: {result['type']}"
    messagebox.showinfo("Parsed Info", result_str)

def select_image():
    path = filedialog.askopenfilename(filetypes=[("Image files", "*.png;*.jpg;*.jpeg")])
    if path:
        image = Image.open(path)
        show_result(image)

def capture_screenshot():
    root.withdraw()
    messagebox.showinfo("Capture Screenshot", "Your screen will be captured now.")
    image = ImageGrab.grabclipboard() or ImageGrab.grab()
    root.deiconify()
    show_result(image)

# GUI Setup
root = tk.Tk()
root.title("3D Print Screenshot Parser")

frame = tk.Frame(root, padx=20, pady=20)
frame.pack()

title = tk.Label(frame, text="Drop Screenshot or Select Option", font=("Helvetica", 14))
title.pack(pady=10)

btn_select = tk.Button(frame, text="Select Image File", command=select_image)
btn_select.pack(pady=5)

btn_screenshot = tk.Button(frame, text="Capture Full Screenshot", command=capture_screenshot)
btn_screenshot.pack(pady=5)

root.mainloop()
