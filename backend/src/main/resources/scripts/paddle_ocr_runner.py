import sys
import os
import json
import traceback

def run_paddle_ocr(image_path):
    result_data = {
        "status": "ERROR",
        "ocrEngine": "PaddleOCR v2.7+",
        "extractedText": "",
        "confidence": 0.0,
        "lines": []
    }

    if not os.path.exists(image_path):
        result_data["error"] = f"File not found: {image_path}"
        print(json.dumps(result_data))
        return

    try:
        from paddleocr import PaddleOCR
        
        # Initialize PaddleOCR engine for English receipt extraction
        ocr = PaddleOCR(use_angle_cls=True, lang='en', show_log=False)
        result = ocr.ocr(image_path, cls=True)

        extracted_lines = []
        confidences = []

        if result and len(result) > 0 and result[0]:
            # Sort detected boxes top-to-bottom, left-to-right based on bounding box Y coordinates
            boxes_text = result[0]
            boxes_text.sort(key=lambda item: (item[0][0][1], item[0][0][0]))

            for line in boxes_text:
                box, (text, conf) = line
                if text and text.strip():
                    extracted_lines.append(text.strip())
                    confidences.append(float(conf))

        full_text = "\n".join(extracted_lines)
        avg_conf = sum(confidences) / len(confidences) * 100 if confidences else 95.0

        result_data["status"] = "SUCCESS"
        result_data["extractedText"] = full_text
        result_data["confidence"] = round(avg_conf, 2)
        result_data["lines"] = extracted_lines

    except Exception as e:
        result_data["status"] = "FALLBACK"
        result_data["error"] = str(e)
        result_data["traceback"] = traceback.format_exc()

    print(json.dumps(result_data))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"status": "ERROR", "error": "Missing image path argument"}))
    else:
        run_paddle_ocr(sys.argv[1])
