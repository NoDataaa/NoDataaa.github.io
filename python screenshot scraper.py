import pytesseract
from PIL import Image, ImageGrab
import re
import tkinter as tk
from tkinter import filedialog, messagebox, simpledialog
import os
import datetime

pytesseract.pytesseract.tesseract_cmd = r'C:\Users\mulnel1\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'


# In-memory queue to store print jobs
print_queue = []  # List of dicts for easy manipulation

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
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "priority": simpledialog.askinteger("Priority", "Enter job priority (1 = highest):", minvalue=1, maxvalue=10)
    }

def add_to_queue(info):
    print_queue.append(info)
    print_queue.sort(key=lambda x: x['priority'])
    print(f"Added to queue: {info['name']} - Priority {info['priority']}")

def remove_job():
    if not print_queue:
        messagebox.showinfo("Queue", "Queue is empty.")
        return
    options = "\n".join([f"{i+1}. {j['name']} ({j['filament']}) - Priority {j['priority']}" for i, j in enumerate(print_queue)])
    idx = simpledialog.askinteger("Remove Job", f"Select a job to remove:\n{options}", minvalue=1, maxvalue=len(print_queue))
    if idx:
        removed = print_queue.pop(idx - 1)
        messagebox.showinfo("Removed", f"Removed: {removed['name']} - {removed['filament']}")

def reorder_job():
    if not print_queue:
        messagebox.showinfo("Queue", "Queue is empty.")
        return
    options = "\n".join([f"{i+1}. {j['name']} ({j['filament']}) - Priority {j['priority']}" for i, j in enumerate(print_queue)])
    idx = simpledialog.askinteger("Reorder Job", f"Select a job to reprioritize:\n{options}", minvalue=1, maxvalue=len(print_queue))
    if idx:
        new_priority = simpledialog.askinteger("New Priority", "Enter new priority:", minvalue=1, maxvalue=10)
        if new_priority:
            print_queue[idx - 1]['priority'] = new_priority
            print_queue.sort(key=lambda x: x['priority'])
            messagebox.showinfo("Updated", f"Updated priority for {print_queue[idx - 1]['name']}")

def show_result(image):
    result = extract_info_from_image(image)
    summary = f"Name: {result['name']}\nFilament: {result['filament']}\nType: {result['type']}\nPriority: {result['priority']}\nTimestamp: {result['timestamp']}"
    add_to_queue(result)
    messagebox.showinfo("Job Queued", summary)

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

def show_queue():
    if not print_queue:
        messagebox.showinfo("Queue", "Queue is empty.")
        return
    listing = "\n".join([
        f"{i+1}. {j['name']} - {j['filament']} ({j['type']}) | Priority {j['priority']} | {j['timestamp']}"
        for i, j in enumerate(print_queue)
    ])
    messagebox.showinfo("Print Queue", listing)

# GUI
root = tk.Tk()
root.title("3D Print Queue Manager")

frame = tk.Frame(root, padx=20, pady=20)
frame.pack()

tk.Label(frame, text="Screenshot to Print Queue", font=("Helvetica", 14)).pack(pady=10)

tk.Button(frame, text="Select Image File", command=select_image).pack(pady=5)
tk.Button(frame, text="Capture Screenshot", command=capture_screenshot).pack(pady=5)
tk.Button(frame, text="View Queue", command=show_queue).pack(pady=5)
tk.Button(frame, text="Remove Job", command=remove_job).pack(pady=5)
tk.Button(frame, text="Reorder Job Priority", command=reorder_job).pack(pady=5)

root.mainloop()