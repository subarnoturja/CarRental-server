import imageKit from "../configs/imagekit.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";

// API to Change role of User
export const changeRoleToOwner = async (req, res) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { role: "owner" })
        res.json({ success: true, message: "Now you can list cars" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

// API to list Car
export const addCar = async (req, res) => {
    try {
        const { _id } = req.user;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        // upload image to imageKit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imageKit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/cars'
        })

        // optimization through imagekit URL transformation
        var optimizedImageUrl = imageKit.url({
            path: response.filePath,
            transformation: [
                {width: '1280'}, // Width resizing
                {quality: 'auto'}, // Auto compression
                {format: 'webp'} // convert to modern format
            ]
        })

        const image = optimizedImageUrl;
        await Car.create({...car, owner: _id, image})

        res.json({ success: true, message: "Car added" })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}