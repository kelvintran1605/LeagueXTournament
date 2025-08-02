import axios from 'axios';

// Login user
export const apiLogin = async (email, password) => {
    try {
        const res = await axios.post(
            'http://localhost:8000/users/login',
            { email, password },
            { withCredentials: true }
        );
        return res.data.user;
    } catch (err) {
        console.error("Login failed", err);
    }
}

// Register user
export const apiRegister = async (registerForm) => {
    try {
        const response = await axios.post("http://localhost:8000/users/create", registerForm);
        console.log("User registered successfully");
        if (response.status === 201) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        console.log(error.response.data);
        return false;
    }
}

// Update profile
export const updateProfile = async (name, email, gender, position, location, image) => {
    try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("gender", gender);
        formData.append("position", position);
        formData.append("location", location);
        formData.append("image", image);

        const response = await axios.put("http://localhost:8000/users/update", formData, { withCredentials: true });
        const updatedProfile = response.data;
        return updatedProfile;
    }
    catch (err) {
        console.log(err);
    }
}

export const updatePassword = async (oldPassword, newPassword) => {
    try {
        const response = await axios.put("http://localhost:8000/users/update-password", { oldPassword, newPassword }, { withCredentials: true });
        return response.status;
    }
    catch (err) {
        console.log(err);
        return err.response.status;
    }
}

export const getAllUsers = async () => {
    try {
        const response = await axios.get("http://localhost:8000/users");
        return response.data;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`http://localhost:8000/users/${userId}`);
        return response.data;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

export const createAdmin = async (adminName, email, password) => {
    try {
        const response = await axios.post("http://localhost:8000/users/create-admin", { name: adminName, email, password }, { withCredentials: true });
        return response.data;
    }
    catch (err) {
        console.log(err);
    }
}