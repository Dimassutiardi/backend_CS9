const bcrypt = require("bcryptjs");
const userRepository = require("../repository/user.repository");
const baseResponse = require("../utils/baseResponse.util");

// Regex untuk validasi email dan password
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimal 8 karakter, huruf & angka

const registerUser = async (req, res) => {
  try {
      console.log("Received request:", req.query); // Debugging

      // Ambil data dari query parameters
      const { email, password, name } = req.query;

      // Validasi input
      if (!email || !password || !name) {
          return baseResponse(res, false, 400, "Email, password, and name are required");
      }

      if (!emailRegex.test(email)) {
          return baseResponse(res, false, 400, "Invalid email format");
      }

      if (!passwordRegex.test(password)) {
          return baseResponse(res, false, 400, "Password must be at least 8 characters and contain letters and numbers");
      }

      // Cek apakah email sudah digunakan
      const existingUser = await userRepository.findUserByEmail(email);
      if (existingUser) {
          return baseResponse(res, false, 409, "Email already registered");
      }

      // Hash password sebelum disimpan
      const hashedPassword = await bcrypt.hash(password, 10);

      // Simpan user ke database
      const newUser = await userRepository.createUser({
          email,
          password: hashedPassword,
          name,
          balance: 0, // Default balance jika ada
      });

      return baseResponse(res, true, 201, "User registered successfully", newUser);
  } catch (error) {
      console.error("Error registering user:", error);
      return baseResponse(res, false, 500, "Error registering user", error.message);
  }
};

module.exports = { registerUser };


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return baseResponse(res, false, 400, "Email and password are required");
        }
        
        // Gunakan loginUser yang sudah diperbaiki
        const user = await userRepository.loginUser(email, password);

        if (!user) {
            return baseResponse(res, false, 401, "Invalid email or password");
        }
        
        return baseResponse(res, true, 200, "Login successful", { userId: user.id });
    } catch (error) {
        return baseResponse(res, false, 500, "Error logging in", error.message);
    }
};


const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await userRepository.findUserByEmail(email);
        if (!user) {
            return baseResponse(res, false, 404, "User not found");
        }
        return baseResponse(res, true, 200, "User found", user);
    } catch (error) {
        return baseResponse(res, false, 500, "Error fetching user", error.message);
    }
};

const updateUser = async (req, res) => {
    try {
      let { id, name, email, password } = req.body;
  
      if (!id) {
        return baseResponse(res, false, 400, "User ID is required");
      }
  
      // Cek apakah user ada sebelum update
      const existingUser = await userRepository.findUserByEmail(email);
      if (!existingUser) {
        return baseResponse(res, false, 404, "User not found");
      }
  
      // Jika password ada di request, hash terlebih dahulu
      if (password) {
        password = await bcrypt.hash(password, 10);
      }
  
      const updatedUser = await userRepository.updateUser({ id, name, email, password });
  
      if (!updatedUser) {
        return baseResponse(res, false, 404, "User not found or no changes made");
      }
  
      return baseResponse(res, true, 200, "User updated", updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      return baseResponse(res, false, 500, "Internal Server Error", error.message);
    }
  };
  
  module.exports = { updateUser };
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await userRepository.deleteUser(id);
        return baseResponse(res, true, 200, "User deleted");
    } catch (error) {
        return baseResponse(res, false, 500, "Error deleting user", error.message);
    }
};

module.exports = { registerUser, loginUser, getUserByEmail, updateUser, deleteUser };

const topUpUser = async (req, res) => {
    try {
      console.log("Received query:", req.query); // Debugging
  
      const { id, amount } = req.query; // Ambil dari query, bukan body
  
      if (!id || !amount) {
        return baseResponse(res, false, 400, "ID and amount are required");
      }
  
      const user = await userRepository.findUserById(id);
      if (!user) {
        return baseResponse(res, false, 404, "User not found");
      }
  
      // Konversi amount ke number
      const topUpAmount = Number(amount);
      if (isNaN(topUpAmount) || topUpAmount <= 0) {
        return baseResponse(res, false, 400, "Invalid amount");
      }
  
      // Update balance
      const newBalance = user.balance + topUpAmount;
      await userRepository.updateUserBalance(id, newBalance);
  
      return baseResponse(res, true, 200, "Top-up successful", { newBalance });
    } catch (error) {
      console.error("Error in top-up:", error);
      return baseResponse(res, false, 500, "Internal Server Error", error.message);
    }
  };
  
  
  // Tambahkan ke module.exports
  module.exports = { ...module.exports, topUpUser };
