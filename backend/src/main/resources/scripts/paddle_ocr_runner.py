import sys
import os
import json
import traceback

class SuppressStderr:
    def __enter__(self):
        self._err = sys.stderr
        sys.stderr = open(os.devnull, 'w')
    def __exit__(self, exc_type, exc_val, exc_tb):
        try:
            sys.stderr.close()
        except Exception:
            pass
        sys.stderr = self._err

def extract_from_pdf_direct(file_path):
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(file_path)
        extracted_text = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                extracted_text.append(t.strip())
        full_text = "\n".join(extracted_text)
        if len(full_text.strip()) > 15:
            lines = [l.strip() for l in full_text.splitlines() if l.strip()]
            return {
                "status": "SUCCESS",
                "ocrEngine": "PyPDF2 Direct Extraction",
                "extractedText": "\n".join(lines),
                "confidence": 99.0,
                "lines": lines
            }
    except Exception:
        pass
    return None

def extract_pdf_page_image(file_path):
    try:
        import pypdfium2
        pdf = pypdfium2.PdfDocument(file_path)
        if len(pdf) > 0:
            page = pdf[0]
            pil_image = page.render(scale=2.5).to_pil()
            temp_img_path = file_path + "_page0.png"
            pil_image.save(temp_img_path)
            return temp_img_path
    except Exception:
        pass
    return None

def run_image_ocr(image_path):
    result_data = {
        "status": "ERROR",
        "ocrEngine": "EasyOCR + Multi-Pass OpenCV Engine",
        "extractedText": "",
        "confidence": 0.0,
        "lines": []
    }

    if not os.path.exists(image_path):
        result_data["error"] = f"File not found: {image_path}"
        return result_data

    try:
        import cv2
        import numpy as np
        import easyocr

        img = cv2.imread(image_path)
        if img is None:
            result_data["error"] = "Unable to decode image file"
            return result_data

        reader = easyocr.Reader(['en'], gpu=False)
        all_lines = []

        # Pass 1: Raw / Standard Image
        with SuppressStderr():
            r1 = reader.readtext(img)
            for box, text, conf in r1:
                if conf > 0.1 and text and text.strip():
                    all_lines.append((text.strip(), float(conf)))

        # Pass 2: Upscaled + CLAHE (Contrast Enhancement for thermal/hand bills)
        h, w = img.shape[:2]
        scaled = cv2.resize(img, (int(w * 2.2), int(h * 2.2)), interpolation=cv2.INTER_CUBIC)
        gray = cv2.cvtColor(scaled, cv2.COLOR_BGR2GRAY)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        enhanced = clahe.apply(gray)
        
        with SuppressStderr():
            r2 = reader.readtext(enhanced)
            for box, text, conf in r2:
                if conf > 0.1 and text and text.strip():
                    all_lines.append((text.strip(), float(conf)))

        # Deduplicate & Sort Lines
        seen = set()
        final_lines = []
        confidences = []

        for text, conf in all_lines:
            clean_key = text.lower().strip()
            # Filter UI chrome text if user uploads full desktop screenshot
            if clean_key in ["original receipt document", "extracted information", "save receipt changes", "full file", "expense category", "payment mode", "expense classification"]:
                continue
            if clean_key not in seen:
                seen.add(clean_key)
                final_lines.append(text)
                confidences.append(conf * 100)

        full_text = "\n".join(final_lines)
        avg_conf = sum(confidences) / len(confidences) if confidences else 90.0

        result_data["status"] = "SUCCESS"
        result_data["extractedText"] = full_text
        result_data["confidence"] = round(avg_conf, 2)
        result_data["lines"] = final_lines

    except Exception as e:
        result_data["status"] = "FALLBACK"
        result_data["error"] = str(e)
        result_data["traceback"] = traceback.format_exc()

    return result_data

def run_ocr(file_path):
    if not os.path.exists(file_path):
        print(json.dumps({"status": "ERROR", "error": f"File not found: {file_path}"}))
        return

    # 1. Digital PDF Direct Text Extraction
    if file_path.lower().endswith(".pdf"):
        pdf_res = extract_from_pdf_direct(file_path)
        if pdf_res:
            print(json.dumps(pdf_res))
            return
        
        # Scanned PDF: Render page to image
        temp_img = extract_pdf_page_image(file_path)
        if temp_img:
            res = run_image_ocr(temp_img)
            if os.path.exists(temp_img):
                try: os.remove(temp_img)
                except Exception: pass
            print(json.dumps(res))
            return

    # 2. Image OCR (PNG, JPG, JPEG, BMP, etc.)
    res = run_image_ocr(file_path)
    print(json.dumps(res))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"status": "ERROR", "error": "Missing image path argument"}))
    else:
        run_ocr(sys.argv[1])
