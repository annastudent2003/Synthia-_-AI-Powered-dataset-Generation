import os, glob, json
from typing import Dict, Any, List

from run_sam import run_sam_on_image
from extract_boxes import boxes_from_mask_paths
from run_midas import run_midas_on_image
from export_coco import build_coco, write_coco, get_image_hw
from utils import ensure_dir

def annotate_folder(
    img_dir: str,
    out_mask_dir: str,
    out_poly_dir: str,
    out_depth_dir: str,
    out_coco_json: str,
    sam_checkpoint_path: str,
    sam_model_type: str = "vit_b",
    category_name: str = "object",
) -> str:
    """
    Run SAM + Boxes + MiDaS on a folder of images and export COCO JSON.
    """
    ensure_dir(out_mask_dir)
    ensure_dir(out_poly_dir)
    ensure_dir(out_depth_dir)
    ensure_dir(os.path.dirname(out_coco_json))

    image_paths = sorted(glob.glob(os.path.join(img_dir, "*.*")))

    img_id, ann_id = 1, 1
    images_coco: List[Dict[str, Any]] = []
    annotations_coco: List[Dict[str, Any]] = []
    categories = [{"id": 1, "name": category_name}]

    for image_path in image_paths:
        base = os.path.splitext(os.path.basename(image_path))[0]
        print(f"[+] Processing {base}")

        # a) SAM
        sam_results = run_sam_on_image(
            image_path=image_path,
            out_mask_dir=out_mask_dir,
            out_poly_dir=out_poly_dir,
            sam_checkpoint_path=sam_checkpoint_path,
            model_type=sam_model_type,
        )

        # b) Boxes
        mask_paths = [r["mask_path"] for r in sam_results]
        boxes = boxes_from_mask_paths(mask_paths)

        # c) Depth
        run_midas_on_image(image_path, out_depth_dir=out_depth_dir, model_type="DPT_Large")

        # d) Add image entry
        h, w = get_image_hw(image_path)
        images_coco.append({
            "id": img_id,
            "file_name": os.path.basename(image_path),
            "height": h,
            "width": w,
        })

        # e) Build annotation entries
        for sam_inst, box_inst in zip(sam_results, boxes):
            x, y, w_box, h_box = box_inst["bbox"]
            if w_box <= 0 or h_box <= 0:
                continue

            annotations_coco.append({
                "id": ann_id,
                "image_id": img_id,
                "category_id": 1,
                "bbox": [int(x), int(y), int(w_box), int(h_box)],
                "area": int(box_inst["area"]),
                "iscrowd": 0,
                "segmentation": sam_inst["polygons"],
            })
            ann_id += 1

        img_id += 1

        import torch, gc
        torch.cuda.empty_cache()
        gc.collect()

    coco = build_coco(images_coco, annotations_coco, categories)
    write_coco(out_coco_json, coco)
    print(f"[OK] COCO saved at: {out_coco_json}")
    return out_coco_json

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    img_dir = os.path.join(base_dir, "..", "data", "input", "images")
    out_base = os.path.join(base_dir, "..", "data", "output")

    annotate_folder(
        img_dir=img_dir,
        out_mask_dir=os.path.join(out_base, "masks"),
        out_poly_dir=os.path.join(out_base, "polygons"),
        out_depth_dir=os.path.join(out_base, "depth"),
        out_coco_json=os.path.join(out_base, "coco", "annotations.json"),
        sam_checkpoint_path=os.path.join(base_dir, "sam_vit_b.pth"),
    )
