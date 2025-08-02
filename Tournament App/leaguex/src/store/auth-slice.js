import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice(
    {
        name: "auth",
        initialState: {
            isLoggedIn: false,
            _id: "",
            name: "",
            email: "",
            position: "",
            gender: "",
            location: "",
            isAuthChecked: false,
            teamId: "",
            profileImageUrl: "",
            role: "",
            skipAuthCheck: false
        },
        reducers: {
            login(state, action) {
                console.log("Login payload:", action.payload);
                state.isLoggedIn = true;
                const { name, email, position, gender, location, _id, teamId, profileImageUrl, role, skipAuthCheck } = action.payload;
                state._id = _id;
                state.name = name;
                state.email = email;
                state.position = position;
                state.gender = gender;
                state.location = location;
                state.teamId = teamId || "";
                state.isAuthChecked = true;
                state.profileImageUrl = profileImageUrl || "";
                state.role = role;
                state.skipAuthCheck = skipAuthCheck ?? true;
            },
            logout(state) {
                state.isLoggedIn = false;
                state._id = "";
                state.name = "";
                state.email = "";
                state.position = "";
                state.gender = "";
                state.location = "";
                state.teamId = "";
                state.isAuthChecked = true;
                state.profileImageUrl = "";
                state.role = "";
                state.skipAuthCheck = false;
            },
            createTeam(state, action) {
                state.teamId = action.payload;
            },
            updateAuth(state, action) {
                const { name, email, position, gender, location, profileImageUrl } = action.payload;
                state.name = name;
                state.email = email;
                state.position = position;
                state.gender = gender;
                state.location = location;
                state.isAuthChecked = true;
                state.profileImageUrl = profileImageUrl;
            }
        }
    }
)

export const { login, logout, createTeam, updateAuth } = authSlice.actions;

export default authSlice.reducer;