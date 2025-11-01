
# SYNTHIA Auto-Labeler Output (Role B)

This dataset contains automatically generated annotations.

Structure:
- masks/       (binary SAM masks, PNG)
- polygons/    (per-instance polygons, JSON)
- depth/       (MiDaS depth maps, 16-bit PNG)
- coco/        (COCO-format annotations.json)

COCO stats:
- Images: 8
- Annotations: 235
- Categories: [{'id': 1, 'name': 'object'}]

Model settings:
- SAM: vit_b checkpoint (points_per_side=8, pred_iou_thresh=0.9, min_mask_region_area=1000)
- MiDaS: DPT_Large
