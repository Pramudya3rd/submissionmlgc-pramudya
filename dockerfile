# Gunakan image dasar
FROM node:18

# Set direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# Instal dependensi
RUN npm install

# Salin seluruh kode aplikasi, termasuk .env
COPY . .

# Jalankan aplikasi
CMD ["npm", "start"]

# Expose port yang digunakan aplikasi
EXPOSE 3000