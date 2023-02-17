const express = require("express");
const router = express.Router();

router.get("/link", function (req, res) {
  res.json([
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
  ]);
});

module.exports = router;
