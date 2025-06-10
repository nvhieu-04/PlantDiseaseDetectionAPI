const express = require("express");
const router = express.Router();
const Dataset = require("../models/Dataset");

// Move datasets to a constant to avoid recreating the array on each request
const DATASETS = [
  {
    name: "A-Citrus-Fruits-and-Leaves-Dataset",
    id: "1",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/A-Citrus-Fruits-and-Leaves-Dataset.zip",
  },
  {
    name: "Citrus-Leaves-Prepared-Dataset",
    id: "2",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/Citrus-Leaves-Prepared-Dataset.zip",
  },
  {
    name: "Corn-Disease-Dataset",
    id: "3",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/Corn-Disease-Dataset.zip",
  },
  {
    name: "Corn-Leaf-Diseases-Dataset",
    id: "4",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/Corn-Leaf-Diseases-Dataset.zip",
  },
  {
    name: "Corn-Leaf-Infection-Dataset",
    id: "5",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/Corn-Leaf-Infection-Dataset.zip",
  },
  {
    name: "DiaMOS-Dataset",
    id: "6",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/DiaMOS-Dataset.zip",
  },
  {
    name: "LeLePhid-Dataset",
    id: "7",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/LeLePhid-Dataset.zip",
  },
  {
    name: "Red-Rot-Sugarcane-Disease-Leaf-Dataset",
    id: "8",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/Red-Rot-Sugarcane-Disease-Leaf-Dataset.zip",
  },
  {
    name: "Rice-Disease-Dataset",
    id: "9",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/Rice-Disease-Dataset.zip",
  },
  {
    name: "Rice-Diseases-Image-Dataset",
    id: "10",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/Rice-Diseases-Image-Dataset.zip",
  },
  {
    name: "Rice-Leaf-Disease-Image-Samples-Dataset",
    id: "11",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/Rice-Leaf-Disease-Image-Samples-Dataset.zip",
  },
  {
    name: "Rice-Leaf-Diseases-Dataset",
    id: "12",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/Rice-Leaf-Diseases-Dataset.zip",
  },
  {
    name: "RoCoLe-Dataset",
    id: "13",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/RoCoLe-Dataset.zip",
  },
  {
    name: "Sugarcane-Disease-Dataset",
    id: "14",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/Sugarcane-Disease-Dataset.zip",
  },
  {
    name: "The-Cotton-Leaf-Dataset",
    id: "15",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/The-Cotton-Leaf-Dataset.zip",
  },
  {
    name: "The-Cotton-Leaf-Disease-Dataset",
    id: "16",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/The-Cotton-Leaf-Disease-Dataset.zip",
  },
  {
    name: "The-Dhan-Shomadhan-Dataset",
    id: "17",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/The-Dhan-Shomadhan-Dataset.zip",
  },
  {
    name: "The-Potato-Leaf-Dataset",
    id: "18",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/The-Potato-Leaf-Dataset.zip",
  },
  {
    name: "The-Soybean-Leaf-Dataset",
    id: "19",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/The-Soybean-Leaf-Dataset.zip",
  },
  {
    name: "The-Tomato-Leaf-Image-Dataset",
    id: "20",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/The-Tomato-Leaf-Image-Dataset.zip",
  },
  {
    name: "Wheat-Disease-Detection-Dataset",
    id: "21",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/Wheat-Disease-Detection-Dataset.zip",
  },
  {
    name: "Wheat-Fungi-Diseases-Dataset",
    id: "22",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/Wheat-Fungi-Diseases-Dataset.zip",
  },
  {
    name: "Wheat-Leaf-Dataset",
    id: "23",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/Wheat-Leaf-Dataset.zip",
  },
  {
    name: "Yellow-Rush-19-Dataset",
    id: "24",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/Yellow-Rush-19-Dataset.zip",
  },
  {
    name: "iCassava-2019-Dataset",
    id: "25",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/iCassava-2019-Dataset.zip",
  },
  {
    name: "PlantVillage-Dataset",
    id: "26",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/PlantVillage-Dataset.zip",
  },
  {
    name: "An-Image-Dataset-for-Field-Crop-Disease-Identification",
    id: "27",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/An-Image-Dataset-for-Field-Crop-Disease-Identification.zip",
  },
  {
    name: "A-Data-Repository-of-Leaf-Images-Dataset",
    id: "28",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/A-Data-Repository-of-Leaf-Images-Dataset.zip",
  },
  {
    name: "Plant-Doc-Dataset",
    id: "29",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/Plant-Doc-Dataset.zip",
  },
  {
    name: "PDDB-Dataset",
    id: "30",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/PDDB-Dataset.zip",
  },
  {
    name: "XDB-Dataset",
    id: "31",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/XDB-Dataset.zip",
  },
  {
    name: "The-Plantraek-Dataset",
    id: "32",
    link: "http://s3-hcm-r1.longvan.net/iec-dataset/Plantraek-Dataset.zip",
  },
];

router.get("/link", (req, res) => {
  res.json(DATASETS);
});

router.post("/download", async (req, res) => {
  try {
    const { nameDataset, url } = req.body;
    
    // Add validation
    if (!nameDataset || !url) {
      return res.status(400).json({
        msg: "nameDataset and url are required",
      });
    }

    const dataset = new Dataset({
      nameDataset,
      url,
    });
    
    await dataset.save();
    
    return res.status(201).json({
      msg: "Dataset created",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error creating dataset",
      error: error.message,
    });
  }
});

router.get("/download", async (req, res) => {
  try {
    // Use query parameters instead of body for GET request
    const { nameDataset } = req.query;
    
    if (!nameDataset) {
      return res.status(400).json({
        msg: "nameDataset is required",
      });
    }

    const dataset = await Dataset.findOne({ nameDataset });
    
    if (!dataset) {
      return res.status(404).json({
        msg: "Dataset not found",
      });
    }
    
    return res.status(200).json({
      url: dataset.url,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error retrieving dataset",
      error: error.message,
    });
  }
});

router.delete("/download", async (req, res) => {
  try {
    const { nameDataset } = req.body;
    
    if (!nameDataset) {
      return res.status(400).json({
        msg: "nameDataset is required",
      });
    }

    const result = await Dataset.deleteOne({ nameDataset });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        msg: "Dataset not found",
      });
    }
    
    return res.status(200).json({
      msg: "Dataset deleted",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Error deleting dataset",
      error: error.message,
    });
  }
});

module.exports = router;
