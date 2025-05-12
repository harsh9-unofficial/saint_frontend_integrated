import React, { useState, useEffect } from "react";
import axios from "axios";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const backendBaseUrl = "http://127.0.0.1:5000";

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(`${backendBaseUrl}/collections`);
        console.log(response.data);
        setCollections(response.data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };
    fetchCollections();
  }, []);

  return (
    <div>
      <h1>Collections</h1>
      {collections.map((collection) => {
        let images = [];

        // Handle various formats of `collection.images`
        if (Array.isArray(collection.images)) {
          images = collection.images;
        } else if (typeof collection.images === "string") {
          try {
            const parsed = JSON.parse(collection.images);
            images = Array.isArray(parsed) ? parsed : [collection.images];
          } catch (e) {
            images = [collection.images];
          }
        }

        // Clean image paths
        images = images.map((image) =>
          image.replace(/^"|"$/g, "").replace(/\\/g, "/")
        );

        return (
          <div key={collection.id} style={{ margin: "20px 0" }}>
            <h3>Collection Name: {collection.name}</h3>
            {/* <p>Category ID: {collection.categoryId}</p> */}
            <p>Category Name: {collection.Category.name}</p>
            <div>
              {images.length > 0 ? (
                images.map((imagePath, index) => (
                  <img
                    key={index}
                    src={`${backendBaseUrl}/${imagePath}`}
                    alt={`${collection.name} image ${index + 1}`}
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                  />
                ))
              ) : (
                <p>No images available</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Collections;
