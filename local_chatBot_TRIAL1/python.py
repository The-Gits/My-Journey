import tkinter as tk
from tkinter import messagebox

def on_button_click():
    messagebox.showinfo("Alert", "Hello world")

# Create the main windowpip
root = tk.Tk()
root.title("ChatBot Trial")
root.geometry("300x200")

# Create a frame for rounded corners
frame = tk.Frame(root, bg="white", bd=0, highlightbackground="black", highlightthickness=2)
frame.pack(fill=tk.BOTH, expand=True)

# Create a button with rounded corners
button = tk.Button(
    frame,
    text="Click Me",
    bg="yellow",
    fg="black",
    font=("Arial", 12),
    bd=0,
    padx=20,
    pady=10,
    activebackground="orange",
    activeforeground="black",
    command=on_button_click
)

# Customize rounded corners for the button
button["relief"] = "flat"
button["highlightthickness"] = 0

# Pack the button
button.pack(pady=20)

# Run the application
root.mainloop()