import torch
from transformers import AutoImageProcessor, AutoModelForObjectDetection
from PIL import Image
import sys
import json

import warnings

# Suppress specific deprecation warning
warnings.filterwarnings("ignore", message=".*max_size.*deprecated.*")


class_names = [
    'shirt, blouse', 'top, t-shirt, sweatshirt', 'sweater', 'cardigan', 'jacket', 'vest',
    'pants', 'shorts', 'skirt', 'coat', 'dress', 'jumpsuit', 'cape', 'glasses', 'hat',
    'headband, head covering, hair accessory', 'tie', 'glove', 'watch', 'belt', 'leg warmer',
    'tights, stockings', 'sock', 'shoe', 'bag, wallet', 'scarf', 'umbrella', 'hood', 'collar',
    'lapel', 'epaulette', 'sleeve', 'pocket', 'neckline', 'buckle', 'zipper', 'applique', 'bead',
    'bow', 'flower', 'fringe', 'ribbon', 'rivet', 'ruffle', 'sequin', 'tassel'
]

clothing_to_warmth = {
    'jacket': 3, 'coat': 3, 'sweater': 3, 'cardigan': 3, 'vest': 2, 'pants': 2,
    'skirt': 2, 'dress': 2, 'tights, stockings': 2, 'socks': 2, 'shorts': 1,
    'top, t-shirt, sweatshirt': 1, 'shirt, blouse': 1, 'jumpsuit': 2, 'hat': 2,
    'scarf': 2, 'glove': 3, 'shoe': 1, 'bag, wallet': 1, 'glasses': 1,
    'umbrella': 1, 'headband, head covering, hair accessory': 1
}

def detect_clothes_and_warmth(image_path):
    image = Image.open(image_path)
    processor = AutoImageProcessor.from_pretrained(
        "valentinafeve/yolos-fashionpedia")
    model = AutoModelForObjectDetection.from_pretrained("valentinafeve/yolos-fashionpedia")

    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)

    target_sizes = torch.tensor([image.size[::-1]])
    results = processor.post_process_object_detection(outputs, target_sizes=target_sizes, threshold=0.5)[0]

    detected_clothes = []
    total_warmth_level = 0
    warmth_count = 0

    for score, label, box in zip(results["scores"], results["labels"], results["boxes"]):
        if label.item() < len(class_names):
            clothing_name = class_names[label.item()]
        else:
            continue

        if clothing_name in clothing_to_warmth:
            detected_clothes.append(clothing_name)
            total_warmth_level += clothing_to_warmth[clothing_name]
            warmth_count += 1

    if warmth_count == 0:
        return {"detected_clothes": detected_clothes, "estimated_warmth": "Unable to estimate warmth"}

    avg_warmth = total_warmth_level / warmth_count

    if avg_warmth >= 2.5:
        warmth = "high"
    elif avg_warmth >= 1.5:
        warmth = "medium"
    else:
        warmth = "low"

    return {"detected_clothes": detected_clothes, "estimated_warmth": warmth}

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python predict.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    result = detect_clothes_and_warmth(image_path)
    print(json.dumps(result))
