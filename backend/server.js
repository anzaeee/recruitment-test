const express = require("express");
const { google } = require("googleapis");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Multer configuration for file upload
const upload = multer({ dest: "uploads/" });

const key = require("./key.json");

const auth = new google.auth.JWT(key.client_email, null, key.private_key, [
  "https://www.googleapis.com/auth/drive",
]);

const drive = google.drive({ version: "v3", auth });

const createFolder = async (folderName) => {
  try {
    const folderMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: ["1nzMuKsjuzXyxJw6wOd7-_MdRB4r0x3Mu"],
    };

    const response = await drive.files.create({
      resource: folderMetadata,
      fields: "id",
    });

    const folderId = response.data.id;
    console.log("Folder created successfully. Folder ID:", folderId);
    return folderId;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw new Error("Failed to create folder on Google Drive.");
  }
};

app.post("/create-folder", async (req, res) => {
  try {
    const { folderName } = req.body;

    if (!folderName) {
      return res.status(400).json({ error: "Folder name is required." });
    }

    const folderId = await createFolder(folderName);
    res.status(200).json({ folderId });
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).send("Failed to create folder.");
  }
});

const uploadFileToDrive = async (fileName, filePath, mimeType, folderId) => {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: mimeType,
        parents: [folderId],
      },
      media: {
        mimeType: mimeType,
        body: fs.createReadStream(filePath),
      },
    });

    console.log("File uploaded successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error.message);
    throw new Error("Failed to upload file to Google Drive.");
  }
};

app.post("/upload-video", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const filePath = file.path;
    const fileName = file.originalname;
    const mimeType = file.mimetype;
    const folderId = req.body.folderId; // Retrieve folderId from request body

    await uploadFileToDrive(fileName, filePath, mimeType, folderId);

    //Deleting from local storage
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete local file:", err);
      } else {
        console.log("Local file deleted successfully");
      }
    });

    res
      .status(200)
      .send("File uploaded and saved to Google Drive successfully.");
  } catch (error) {
    console.error("Error handling file upload:", error);
    res.status(500).send("Failed to upload file and save to Google Drive.");
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
