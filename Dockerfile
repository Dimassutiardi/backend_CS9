# Gunakan image Node.js sebagai base image
FROM node:16

# Set working directory di dalam container
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file aplikasi ke dalam container
COPY . .

# Expose port aplikasi
EXPOSE 3000

# Jalankan aplikasi Express
CMD ["npm", "start"]
