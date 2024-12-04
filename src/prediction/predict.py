# Libraries
import torch
from transformers import AutoImageProcessor, AutoModelForObjectDetection
from PIL import Image
import sys
import json
import warnings
import cv2
import numpy as np
from PIL import ImageEnhance, ImageFilter


# Suppress warning
warnings.filterwarnings("ignore", message=".*max_size.*deprecated.*")

# Clothing categories based on ISO 9920:2007
outer_layer = ['jacket', 'coat']
mid_layer = ['sweater', 'cardigan', 'vest']
base_layer = ['dress', 'jumpsuit', 'shirt, blouse', 'top, t-shirt, sweatshirt']
lower_body = ['pants', 'skirt', 'tights, stockings', 'shorts']
accessories = ['hat', 'scarf', 'glove', 'shoe', 'bag, wallet', 'glasses', 'umbrella', 
               'headband, head covering, hair accessory']

# Class names 
class_names = [
    'shirt, blouse', 'top, t-shirt, sweatshirt', 'sweater', 'cardigan', 'jacket', 'vest',
    'pants', 'shorts', 'skirt', 'coat', 'dress', 'jumpsuit', 'cape', 'glasses', 'hat',
    'headband, head covering, hair accessory', 'tie', 'glove', 'watch', 'belt', 'leg warmer',
    'tights, stockings', 'sock', 'shoe', 'bag, wallet', 'scarf', 'umbrella', 'hood', 'collar',
    'lapel', 'epaulette', 'sleeve', 'pocket', 'neckline', 'buckle', 'zipper', 'applique', 'bead',
    'bow', 'flower', 'fringe', 'ribbon', 'rivet', 'ruffle', 'sequin', 'tassel'
]

# Warmth values for clothing based on ISO 9920:2007 standards 
clothing_warmth_values = {
    'jacket': 3, 'coat': 3, 'sweater': 2.5, 'cardigan': 2, 'vest': 1.5,
    'shirt, blouse': 1, 'top, t-shirt, sweatshirt': 1, 'dress': 2, 'jumpsuit': 2,
    'pants': 1.5, 'skirt': 1, 'tights, stockings': 1, 'shorts': 0.5,
    'hat': 1, 'scarf': 1, 'glove': 2, 'shoe': 0.5, 'bag, wallet': 0.5,
    'glasses': 0, 'umbrella': 0, 'headband, head covering, hair accessory': 0
}

def preprocess_image(image_path):
       # Open the image and convert to RGB
    image = Image.open(image_path).convert('RGB')
    return image

def detect_clothes_and_warmth(image_path):
    try:
        image = preprocess_image(image_path)

        # Load processor and model
        processor = AutoImageProcessor.from_pretrained("valentinafeve/yolos-fashionpedia")
        model = AutoModelForObjectDetection.from_pretrained("valentinafeve/yolos-fashionpedia")

        inputs = processor(images=image, return_tensors="pt")

        # Get model outputs
        with torch.no_grad():
            outputs = model(**inputs)

        # Post-process the outputs
        target_sizes = torch.tensor([image.size[::-1]]) 
        results = processor.post_process_object_detection(outputs, target_sizes=target_sizes, threshold=0.3)[0]

        # Initialize categories for detected clothes
        detected_clothes = {
            'outer': set(),
            'mid': set(),
            'base': set(),
            'lower_body': set(),
            'accessories': set()
        }

        # Classify detected objects into categories
        for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
            if label.item() < len(class_names):
                clothing_name = class_names[label.item()]
            else:
                continue

            if clothing_name in outer_layer:
                detected_clothes['outer'].add(clothing_name)
            elif clothing_name in mid_layer:
                detected_clothes['mid'].add(clothing_name)
            elif clothing_name in base_layer:
                detected_clothes['base'].add(clothing_name)
            elif clothing_name in lower_body:
                detected_clothes['lower_body'].add(clothing_name)
            elif clothing_name in accessories:
                detected_clothes['accessories'].add(clothing_name)

        # Convert sets to lists for JSON compatibility
        for category in detected_clothes:
            detected_clothes[category] = list(detected_clothes[category])

        # Calculate warmth values for each category
        warmth_values = {
            'outer': 0,
            'mid': 0,
            'base': 0,
            'lower_body': 0,
            'accessories': 0
        }

        # Sum warmth values based on detected clothes
        for category, items in detected_clothes.items():
            total_warmth = sum(clothing_warmth_values.get(item, 0) for item in items)
            warmth_values[category] = total_warmth

        # Total warmth index based on category weights
        W_total = (warmth_values['outer'] * 0.4) + \
                  (warmth_values['mid'] * 0.3) + \
                  (warmth_values['base'] * 0.2) + \
                  (warmth_values['lower_body'] * 0.2) + \
                  (warmth_values['accessories'] * 0.1)

        W_total = round(W_total, 2)

        return {
            "detected_clothes": detected_clothes,
            "warmth_index": W_total
        }

    except Exception as e:
        print(f"Error in detecting clothes and warmth: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python predict.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    result = detect_clothes_and_warmth(image_path)
    print(json.dumps(result))
