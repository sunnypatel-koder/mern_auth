import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import axios from "axios";

const Profile = () => {
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercentage, setImagePercentage] = useState("");
  const [imageError, setImageError] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  console.log(formData);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercentage(Math.round(progress));
        setImageError(false);
      },
      (error) => {
        console.error("Error uploading file:", error.message);
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            setFormData((prevData) => ({
              ...prevData,
              profilePicture: downloadURL,
            }));
          })
          .catch((error) => {
            console.error("Error getting download URL:", error.message);
          });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = currentUser._id;

    console.log(userId);

    try {
      const res = await fetch(
        `http://localhost:3000/api/user/update/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      console.log("hello", data);
    } catch (err) {
      // console.log(err);
    }
  };

  return (
    <>
      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center my-7">
          Profile Section
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            ref={fileRef}
            type="file"
            id="profileImgInput"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            hidden
          ></input>
          <img
            className="rounded-full h-24 w-24 self-center cursor-pointer object-cover mt-2"
            src={formData.profilePicture || currentUser.profilePicture}
            alt="profile"
            onClick={() => document.getElementById("profileImgInput").click()}
          />
          <p className="text-center">
            {imageError ? (
              <span className="text-red-700 text-sm">
                Error Uploading (file size must be less than 2 MB)
              </span>
            ) : imagePercentage > 0 && imagePercentage < 100 ? (
              <span className="text-green-700 text-sm">{`Uploading: ${imagePercentage}%`}</span>
            ) : imagePercentage == 100 ? (
              <span className="text-green-700 text-sm">
                {" "}
                Profile Uploaded Successfully!
              </span>
            ) : null}
          </p>

          <input
            type="text"
            defaultValue={currentUser.username}
            id="username"
            placeholder="Username"
            className="bg-slate-100 rounded-lg p-3"
            onChange={handleChange}
          />
          <input
            defaultValue={currentUser.email}
            type="email"
            id="email"
            placeholder="Email"
            className="bg-slate-100 rounded-lg p-3"
            onChange={handleChange}
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            className="bg-slate-100 rounded-lg p-3"
            onChange={handleChange}
          />
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-85">
            Update
          </button>
        </form>
        <div className="flex justify-between mt-5">
          <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span className="text-red-700 cursor-pointer">Sign Out</span>
        </div>
      </div>
    </>
  );
};

export default Profile;
